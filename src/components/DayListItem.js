import React from 'react';
import classNames from 'classnames/bind';

import "components/DayListItem.scss";

export default function DayListItem(props) {
  /*
  The <li> represents the entire day item
  The <h2> should display the day name
  The <h3> should display the spots remaining for a day
  */
  const dayClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spot === 0,
  });

  return (
    <li className={dayClass} onClick={(event) => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{props.spots}</h3>
    </li>
  );
}
