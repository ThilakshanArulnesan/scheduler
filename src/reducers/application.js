
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default (state, action) => {
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

      let appointId = state.appointments[action.value].id;

      const appointment = {
        ...state.appointments[action.value],
        interview: action.app && { ...action.app }
      };

      const appointments = {
        ...state.appointments,
        [action.value]: appointment
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
