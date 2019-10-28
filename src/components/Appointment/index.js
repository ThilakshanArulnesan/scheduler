import 'components/Appointment/styles.scss'
import React, { Fragment } from 'react';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
/*

All Appointment components will render a Header that takes in a time prop.
If props.interview is truthy (an interview object) the Appointment will render the <Show /> component, else it should render the <Empty /> component.
Using ternary operator version of conditional rendering makes the most sense in this case where we want to render Show or Empty based on props.interview.

When we're done this step our Appointment component should match the screenshot below.

*/
export default function Appointment(props) {
  const { time, interview } = props;
  return (
    <article className="appointment">
      <Header time={time} />
      {interview ? <Show student={interview.student} interviewer={interview.interviewer.name} /> : <Empty />}
    </article>
  );

}
