//Finds the appoints for a given date as an array without modifying the original state.
const getAppointmentsForDay = function(st, day) {
  let matchedDay = st.days.filter(obj => obj.name === day);
  if (!matchedDay[0]) return [];

  return matchedDay[0].appointments.map(val => st.appointments[`${val}`]);

  // return [];
};

const getInterview = function(st, interview) {
  if (!interview) return null;

  //Take the previous interview properties, but replace interviewer # with an object
  return ({ ...interview, interviewer: st.interviewers[`${interview.interviewer}`] });
};

export { getAppointmentsForDay, getInterview };
