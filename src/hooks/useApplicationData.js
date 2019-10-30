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
      return { ...state, appointments: action.value }
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


  const setDay = day => dispatch({ type: "SET_DAY", value: day });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`,
      appointment
    ).then(() => {
      dispatch({ type: "SET_INTERVIEW", value: appointments });

    })
      .catch(console.error);
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

        if (msg.type === "SET_INTERVIEW") {
          //Server is informing us of a change to the interviews

          //Check if we should delete the interview
          if (msg.interview) {
            const id = msg.id;
            const interview = msg.interview;
            const appointment = {
              ...state.appointments[id],
              interview: { ...interview }
            };

            const appointments = {
              ...state.appointments,
              [id]: appointment
            };

            dispatch({ type: "SET_INTERVIEW", value: appointments });


          } else {
            haveClientCancelAppointment(state, msg.id, dispatch);
          }
        }
      }
    }

    //Cleanup socket
    return (() => {
      webSocket.close();
    });
  }, [state]);

  const cancelInterview = function(id) {
    return axios.delete(`/api/appointments/${id}`).then(
      () => {
        haveClientCancelAppointment(state, id, dispatch);
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export { useApplicationData };


function haveClientCancelAppointment(state, id, dispatch) {
  const appointment = {
    ...state.appointments[id],
    interview: null
  };
  const appointments = {
    ...state.appointments,
    [id]: appointment
  };
  // const increaseSpots = function() {
  //};

  dispatch({ type: "SET_INTERVIEW", value: appointments });
  state.days[Math.floor(id / 5)]--;
}

