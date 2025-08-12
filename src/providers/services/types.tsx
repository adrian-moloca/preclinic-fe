export interface IServices {
id: string;
name: string;
description: string;
price: number;
duration: number; 
status: string;
department: string;
products: string[];
};

export interface IServicesContextType {
  services: IServices[];
  setServices: React.Dispatch<React.SetStateAction<IServices[]>>;
  addService: (entry: IServices) => void;
  updateService: (entry: IServices) => void;
  deleteService: (id: string) => void;
  resetServices: () => void;

};