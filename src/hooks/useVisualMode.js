import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);
    if (replace) {
      setHistory([newMode, ...history.slice(1)]);
    } else {
      setHistory([newMode, ...history]);
    }
  };

  const back = () => {
    if (history.length > 1) {
      setHistory(history.slice(1));
      setMode(history[1]);
    }
  };

  return { mode, transition, back };
}
