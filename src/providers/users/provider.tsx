import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { IUsers } from './types';
import { UsersContext } from './context';

const LOCAL_STORAGE_KEY = 'users';

export const UsersProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<IUsers[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setUsers(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse users from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const addUser = useCallback((entry: IUsers) => {
    setUsers(prev => [...prev, entry]);
  }, []);

  const updateUser = useCallback((updatedEntry: IUsers) => {
    setUsers(prev =>
      prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => {
      const filtered = prev.filter(entry => entry.id !== id);
      if (filtered.length !== prev.length) {
        console.log("✅ Deleted user with ID:", id);
      } else {
        console.warn("❌ User not found:", id);
      }
      return filtered;
    });
  }, []);

  const resetUsers = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUsers([]);
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users,
        setUsers,
        addUser,
        updateUser,
        deleteUser,
        resetUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
