import React from 'react';

import InterviewerListItem from './InterviewerListItem'
import "components/InterviewerList.scss";
import PropTypes from 'prop-types';

export default function InterviewerList(props) {
  const { interviewers, setInterviewer } = props;

  InterviewerList.propTypes = { //verifies proptypes
    interviewers: PropTypes.array,
    setInterviewer: PropTypes.func.isRequired
  };

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map((interviewer) => {
          return (
            <InterviewerListItem
              key={interviewer.id}
              name={interviewer.name}
              avatar={interviewer.avatar}
              selected={Number(props.interviewer) === Number(interviewer.id)}
              setInterviewer={() => setInterviewer(interviewer.id)}
            />
          );
        })}
      </ul>
    </section>
  );

}
