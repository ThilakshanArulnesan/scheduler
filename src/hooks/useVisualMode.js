import { useState } from 'react';
//custom hook
const useVisualMode = function(initial) {

  const [, setHistory] = useState([initial]); //Don't need to work with state directly
  const transition = function(newMode, replace = false) {
    setHistory((prev) => { //Note: must use prev
      if (replace) {
        prev.pop();
      }
      return [...prev, newMode];
    });
    setMode(newMode);
  };
  const back = function() {
    setHistory((prev) => {
      if (prev.length === 1) return prev; //No change should be implemented if this is the first view

      prev.pop(); //Removes the last element
      setMode(prev[prev.length - 1]); //Set the current view to the last element
      return prev; //returns the updated history
    }
    )
  };
  let [mode, setMode] = useState(initial);

  return { mode, transition, back };
};

export { useVisualMode };
