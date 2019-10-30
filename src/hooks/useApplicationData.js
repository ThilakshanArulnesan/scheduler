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
      .catch(console.errror);
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

  const cancelInterview = function(id) {
    return axios.delete(`/api/appointments/${id}`).then(
      () => {
        const appointment = { //Set the appoint corresponding to the id with an interview of null
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        dispatch({ type: "SET_INTERVIEW", value: appointments });

      });
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export { useApplicationData };
