import { createContext, useContext } from 'react';
import { IServicesContextType } from './types';

export const ServicesContext = createContext<IServicesContextType>({
  services: [],
  setServices: () => {},
  addService: () => {},
  updateService: () => {},
  deleteService: () => {},
  resetServices: () => {},
});

export const useServicesContext = () => useContext(ServicesContext);
