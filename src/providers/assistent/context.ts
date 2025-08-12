import { createContext, useContext } from 'react';
import { IAssistentsContext } from './types';

export const AssistentsContext = createContext<IAssistentsContext>({
  assistents: [],
  setAssistents: () => {},
  addAssistent: () => {},
  updateAssistent: () => {},
  deleteAssistent: () => {},
  resetAssistents: () => {},
});

export const useAssistentsContext = () => useContext(AssistentsContext);
