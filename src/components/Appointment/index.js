import 'components/Appointment/styles.scss'
import React, { useEffect } from 'react';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import FORM from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import { useVisualMode } from "../../hooks/useVisualMode";


export default function Appointment(props) {
  const { time, interview, onAdd, interviewers, bookInterview, id, cancelInterview } = props;

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  useEffect(() => {
    props.interview ? transition("SHOW") : transition("EMPTY");
  }, [props.interview]);

  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition("SAVING");
    bookInterview(id, interview).then(() => {
      transition("SHOW"); //Show the booked interview

    }).catch(() =>
      transition("ERROR_SAVE", true)
    );
  };

  const deleteInterview = function(id) {
    transition("DELETING", true);

    cancelInterview(id).then(() => {
      transition("EMPTY");
    }).catch(() =>
      transition("ERROR_DELETE", true)
    );
  };

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && interview && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer.name}
          onEdit={(event) => transition("CREATE")}
          onDelete={(event) => transition("CONFIRM")}
        />
      )}
      {mode === CREATE && (
        <FORM
          name={interview ? interview.student : ""}
          interviewer={interview ? interview.interviewer.id : null}
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
      {mode === ERROR_SAVE && (
        <Error
          message="Server error while saving appointment. Please try again."
          onClose={(event) => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Server error while deleting appointment. Please try again."
          onClose={(event) => back()}
        />
      )}
    </article>
  );


}
