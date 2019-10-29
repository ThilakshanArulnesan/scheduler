import { useState } from 'react';
const useVisualMode = function(initial) {
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode, replace = false) {
    setHistory((prev) => {
      if (replace) {
        prev.pop();
      }
      prev.push(newMode);
      return prev;
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
