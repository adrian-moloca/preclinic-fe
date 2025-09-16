import { createContext, useContext } from 'react';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => ({ success: false }),
  logout: () => {},
  hasPermission: () => false,
  canAccess: () => false,
  updateRolePermissions: () => {},
  getMe: async () => null,
  updateUserPermissions: () => {},
  getRolePermissions: () => [],
  getUserPermissions: () => ({ granted: [], denied: [] }),
  getAllUsers: () => [],
  permissionConfig: { rolePermissions: {}, userPermissions: {} },
  loading: false,
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};