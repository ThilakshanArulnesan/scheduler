import { useState } from 'react';
//custom hook
const useVisualMode = function(initial) {

  const [history, setHistory] = useState([initial]); //Don't need to work with state directly
  let [mode, setMode] = useState(initial);

  console.log(`history is: `, history);
  const transition = function(newMode, replace = false) {
    setHistory((prev) => {
      if (replace) {
        prev.pop();
      }
      return [...prev, newMode];
    });
    setMode(newMode);
  };
  const back = function() {
    console.log(`CALLING BACK`);
    setHistory((prev) => {
      console.log(`this is prev`, prev);
      if (prev.length === 1) return prev; //No change should be implemented if this is the first view
      console.log(`before pop`, prev);
      prev.pop(); //Removes the last element
      console.log(`after pop`, prev)
      console.log(`set mode to`, prev[prev.length - 1]);

      setMode(prev[prev.length - 1]); //Set the current view to the last element
      console.log(`returning this`, prev);
      return prev; //returns the updated history
    }
    )
  };

  return { mode, transition, back };
};

export { useVisualMode };
