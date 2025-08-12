import { createContext, useContext } from 'react';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  hasPermission: () => false,
  canAccess: () => false,
  updateRolePermissions: () => {},
  updateUserPermissions: () => {},
  getRolePermissions: () => [],
  getUserPermissions: () => ({ granted: [], denied: [] }),
  getAllUsers: () => [],
  permissionConfig: { rolePermissions: {}, userPermissions: {} },
});

export const useAuthContext = () => useContext(AuthContext);