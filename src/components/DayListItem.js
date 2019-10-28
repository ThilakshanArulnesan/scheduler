import React from 'react';
import classNames from 'classnames/bind';

import "components/DayListItem.scss";

export default function DayListItem(props) {
  const dayClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0,
  });

  const format = (spots) => {
    if (spots === 0) return `no spots remaining`;
    if (spots === 1) return `1 spot remaining`;
    return `${spots} spots remaining`;
  }

  return (
    <li className={dayClass} onClick={(event) => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{format(props.spots)}</h3>
    </li>
  );
}
