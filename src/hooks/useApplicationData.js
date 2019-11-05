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

  const setDay = day => dispatch({ type: SET_DAY, payload: day });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    return axios.put(`/api/appointments/${id}`,
      appointment
    ).then(() => {
      dispatch({ type: SET_INTERVIEW, payload: { id, app: interview } });
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
        payload: {
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
      webSocket.onmessage = (event) => {
        let msg = JSON.parse(event.data);

        if (msg.type === SET_INTERVIEW) {
          //Server is informing us of a change to the interviews
          //Check if we should delete the interview
          const id = msg.id;
          const interview = msg.interview;
          dispatch({ type: SET_INTERVIEW, payload: { id, app: interview } });
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
        dispatch({ type: SET_INTERVIEW, payload: { id, app: null } });
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export { useApplicationData };



