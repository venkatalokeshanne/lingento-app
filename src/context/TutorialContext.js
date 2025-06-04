'use client';

import { createContext, useContext, useState } from 'react';

// Create a tutorial context
const TutorialContext = createContext();

export const useTutorial = () => {
  return useContext(TutorialContext);
};

export function TutorialProvider({ children, showTutorialCallback }) {
  // Track if a word was added to show tutorial
  const [wordAdded, setWordAdded] = useState(false);
    // Function to mark that a word was added
  const markWordAdded = () => {
    setWordAdded(true);
    // If a callback was provided, call it
    if (showTutorialCallback && typeof showTutorialCallback === 'function') {
      console.log('Calling showTutorialCallback from TutorialContext');
      showTutorialCallback();
    } else {
      console.log('No showTutorialCallback provided to TutorialContext');
    }
  };
  
  // Function to reset the word added state
  const resetWordAdded = () => {
    setWordAdded(false);
  };
  
  return (
    <TutorialContext.Provider value={{ 
      wordAdded,
      markWordAdded,
      resetWordAdded
    }}>
      {children}
    </TutorialContext.Provider>
  );
}
