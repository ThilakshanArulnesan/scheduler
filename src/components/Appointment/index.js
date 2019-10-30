import 'components/Appointment/styles.scss'
import React from 'react';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import FORM from './Form';
import Status from './Status';
import Confirm from './Confirm';
import { useVisualMode } from "../../hooks/useVisualMode";


export default function Appointment(props) {
  const { time, interview, onAdd, interviewers, bookInterview, id, cancelInterview } = props;

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
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

  const deleteInterview = function(id) {
    transition("DELETING");

    cancelInterview(id).then(() => {
      transition("EMPTY");
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
          onDelete={(event) => transition("CONFIRM")}
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
        <Status message="Saving" />
      )}
      {mode === DELETING && (
        <Status message="Deleting" />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onConfirm={(event) => deleteInterview(id)}
          onCancel={(event) => back()}
        />
      )}
    </article>
  );


}
