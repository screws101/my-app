"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface ModeContextType {
  mode: string;
  changeMode: () => void;
}

export const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState('light');

  const changeMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <ModeContext.Provider value={{ mode, changeMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};


