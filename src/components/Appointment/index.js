import 'components/Appointment/styles.scss'
import React from 'react';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import FORM from './Form';
import Status from './Status';
import { useVisualMode } from "../../hooks/useVisualMode";


export default function Appointment(props) {
  const { time, interview, onAdd, interviewers, bookInterview, id } = props;

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition("SAVING");
    bookInterview(id, interview).then(() => {
      transition("SHOW"); //Show the booked interview

    }).catch(console.error);
  };

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer.name}
        />
      )}
      {mode === CREATE && (
        <FORM

          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && (
        <Status />
      )}
    </article>
  );


}
