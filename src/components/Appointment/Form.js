import React, { useState } from 'react';
import Button from 'components/Button';
import InterviewerList from 'components/InterviewerList'

export default function Form(props) {
  // const { name, interviewer, interviewers, onSave, onCancel } = props;
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const reset = () => {
    setName("");
    setInterviewer(null);
  };
  const cancel = () => {
    reset();
    props.onCancel();
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            value={name}
            onChange={(event) => setName(event.target.value)}
            name='name'
            type="text"
            placeholder="Enter Student Name"
          /*
            This must be a controlled component
          */
          />
        </form>
        <InterviewerList interviewers={props.interviewers} interviewer={interviewer} setInterviewer={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={(event) => {
            cancel();
            props.onCancel();
          }}>Cancel</Button>
          <Button confirm onClick={(event) => {
            props.onSave(name, interviewer);
          }} >Save</Button>
        </section>
      </section>
    </main>
  )
};

