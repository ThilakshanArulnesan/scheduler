import { useEffect, useReducer } from 'react';
import axios from 'axios'
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";


const useApplicationData = function() {


  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  function haveClientCancelAppointment(id) {
    dispatch({ type: SET_INTERVIEW, value: id, app: null });
  }


  const setDay = day => dispatch({ type: SET_DAY, value: day });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    return axios.put(`/api/appointments/${id}`,
      appointment
    ).then(() => {
      dispatch({ type: SET_INTERVIEW, value: id, app: interview });

    });
  };

  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`),

    ]).then(all => {
      dispatch({
        type: SET_APPLICATION_DATA,
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

        if (msg.type === SET_INTERVIEW) {
          //Server is informing us of a change to the interviews
          //Check if we should delete the interview
          if (msg.interview) {
            const id = msg.id;
            const interview = msg.interview;

            dispatch({ type: SET_INTERVIEW, value: id, app: interview });
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



