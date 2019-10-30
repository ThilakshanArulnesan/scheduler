import React, { useState, useEffect } from "react";

import "components/Application.scss";
import Appointment from "components/Appointment";
import DayList from "components/DayList";
import axios from "axios";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from '../helpers/selectors';


export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const bookInterview = function(id, interview) {
    console.log(id, interview);
    console.log({ ...interview });

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    /*
Within bookInterview, make a PUT request to the /api/appointments/:id endpoint to update the database with the interview data.

There are three stages to this sequence.

Make the request with the correct endpoint using the appointment id, with the interview data in the body, we should receive a 204 No Content response.
When the response comes back we update the state using the existing setState.
Transition to SHOW when the promise returned by props.bookInterview resolves. This means that the PUT request is complete.
When we execute the full sequence of events, the result looks the same as before. The difference is that when the browser refreshes, the data is persistent.
    */


    return axios.put(`/api/appointments/${id}`,
      appointment
    ).then(() => {
      setState(
        {
          ...state,
          appointments
        }
      );

    })
      .catch(console.errror);


  };

  const setDay = day => setState({ ...state, day });


  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`),

    ]).then(all => {
      console.log(all[2]);
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, [])

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {getAppointmentsForDay(state, state.day).map((appointment) => {
          const interview = getInterview(state, appointment.interview);
          return (<Appointment
            key={appointment.id}
            {...appointment}
            interview={interview}
            interviewers={getInterviewersForDay(state, state.day)}
            bookInterview={bookInterview}
          />);
        })}
        <Appointment
          key="last" time="5pm" />
      </section>
    </main>
  );
}
