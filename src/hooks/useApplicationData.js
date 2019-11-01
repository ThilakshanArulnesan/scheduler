import { useEffect, useReducer } from 'react';
import axios from 'axios'

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const reducer = function(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value }
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.value.days,
        appointments: action.value.appointments,
        interviewers: action.value.interviewers
      }
    case SET_INTERVIEW: {

      console.log("og state", state);
      console.log("This is the id", action.value);
      console.log("removing this appointment ", state.appointments[action.value]);
      let appointId = state.appointments[action.value].id;
      console.log("adding this appointment ", action.app);
      const appointment = {
        ...state.appointments[action.value],
        interview: action.app && { ...action.app }
      };

      console.log("removing this appointment, after ", state.appointments[action.value]);

      const appointments = {
        ...state.appointments,
        [action.value]: appointment
      };
      const tempState = { ...state, appointments: appointments };

      console.log("Here are the appointments ", tempState.appointments);
      console.log(`The temp. state is `, tempState);
      //Now increment/decrement the number of spots for that day of the week.
      console.log(`appointId is `, appointId);
      //Get the day of the week:
      console.log('my output', tempState.days.filter((day) => {
        return day.appointments.includes(appointId);
      })[0]);
      const dayToModify = tempState.days.filter((day) => {
        return day.appointments.includes(appointId);
      })[0];
      console.log(`day to modify is`, dayToModify);

      const numSpots = dayToModify.appointments.reduce((acc, cur) => tempState.appointments[cur].interview ? acc : acc += 1, 0);
      console.log(`my count ` + numSpots);

      const modifiedDay = { ...dayToModify, spots: numSpots };
      let modifiedDays = [...tempState.days];
      modifiedDays[dayToModify.id - 1] = modifiedDay;
      //const modifiedDays = [...tempState.days, [dayToModify.id - 1]: modifiedDay ];
      console.log(modifiedDay);
      console.log(`New state`, { ...tempState, days: modifiedDays });
      return { ...tempState, days: modifiedDays }
    }

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

const useApplicationData = function() {


  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  function haveClientCancelAppointment(id) {
    dispatch({ type: "SET_INTERVIEW", value: id, app: null });
  }


  const setDay = day => dispatch({ type: "SET_DAY", value: day });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    return axios.put(`/api/appointments/${id}`,
      appointment
    ).then(() => {
      dispatch({ type: "SET_INTERVIEW", value: id, app: interview });

    });
  };

  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`),

    ]).then(all => {
      dispatch({
        type: "SET_APPLICATION_DATA",
        value: {
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }
      })
    });
  }, []); //Only want this to execute once on load

  useEffect(() => {
    //Establish a ws connection
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onopen = () => {
      webSocket.send("ping");
      webSocket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        console.log(msg);

        if (msg.type === "SET_INTERVIEW") {
          //Server is informing us of a change to the interviews
          //Check if we should delete the interview
          if (msg.interview) {
            const id = msg.id;
            const interview = msg.interview;

            dispatch({ type: "SET_INTERVIEW", value: id, app: interview });
          } else {
            haveClientCancelAppointment(msg.id);
          }
        }
      }
    }
    //Cleanup socket
    return (() => {
      webSocket.close();
    });
  }, []);

  const cancelInterview = function(id) {
    return axios.delete(`/api/appointments/${id}`).then(
      () => {
        haveClientCancelAppointment(id);
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export { useApplicationData };



