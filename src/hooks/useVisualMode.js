import { useState } from 'react';

export function useVisualMode(initial) {
  const [mode, setMode] = useState(initial)

  return { 
    mode,
    transition(newMode) {
      setMode(newMode);
    }
  };
}