import { createContext, useContext } from 'react';
import { IUsersContext } from './types';

export const UsersContext = createContext<IUsersContext>({
  users: [],
  setUsers: () => {},
  addUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
  resetUsers: () => {},
});

export const useUsersContext = () => useContext(UsersContext);
