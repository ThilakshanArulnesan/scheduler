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
  });

  const cancelInterview = function(id) {
    console.log(id);
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
        setState({
          ...state,
          appointments
        });
      });
  };


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
            cancelInterview={cancelInterview}
          />);
        })}
        <Appointment
          key="last" time="5pm" />
      </section>
    </main>
  );
}
