import React from 'react';
import DayListItem from './DayListItem'
export default function DayList(props) {
  const { days, day, setDay } = props;


  return (
    <ul>
      {days.map((d, i) => {
        return <DayListItem
          key={i}
          name={d.name}
          spots={d.spots}
          selected={d.name === day}
          setDay={setDay}
        />
      })
      }
    </ul>
  );

}
