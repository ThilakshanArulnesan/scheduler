
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default (state, action) => {
  switch (action.type) {
    // case SET_DAY:
    //   return { ...state, day: action.payload }
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.payload.days,
        appointments: action.payload.appointments,
        interviewers: action.payload.interviewers
      }
    case SET_INTERVIEW: {

      // let appointId = state.appointments[action.payload].id;
      let appointId = action.payload.id;
      let app = action.payload.app;

      const appointment = {
        ...state.appointments[appointId],
        interview: app && { ...app }
      };

      const appointments = {
        ...state.appointments,
        [appointId]: appointment
      };
      const tempState = { ...state, appointments: appointments };

      //Get the day of the week:
      const dayToModify = tempState.days.filter((day) => {
        return day.appointments.includes(appointId);
      })[0];

      const numSpots = dayToModify.appointments.reduce((acc, cur) => tempState.appointments[cur].interview ? acc : acc += 1, 0);

      const modifiedDay = { ...dayToModify, spots: numSpots };
      let modifiedDays = [...tempState.days];
      modifiedDays[dayToModify.id - 1] = modifiedDay;

      return { ...tempState, days: modifiedDays }
    }

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export {
  SET_APPLICATION_DATA, SET_DAY, SET_INTERVIEW
}
