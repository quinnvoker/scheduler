import { useState } from 'react';

export function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode) => {
    setMode(newMode);
    setHistory([newMode,...history])
  }

  const back = () => {
    if (history.length > 1) {
      setHistory(history.slice(1));
      setMode(history[1]);
    }
  };

  return { mode, transition, back }
};
