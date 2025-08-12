import { FC, ReactNode, useState, useCallback, useEffect } from 'react';
import { AuthContext } from './context';
import { User, UserRole, PermissionConfig } from './types';
import { DEFAULT_ROLE_PERMISSIONS } from '../../mock/default-role-permissions';
import { MOCK_USERS } from '../../mock/users';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [permissionConfig, setPermissionConfig] = useState<PermissionConfig>(() => {
    const stored = localStorage.getItem('permissionConfig');
    return stored ? JSON.parse(stored) : {
      rolePermissions: DEFAULT_ROLE_PERMISSIONS,
      userPermissions: {}
    };
  });

  useEffect(() => {
    localStorage.setItem('permissionConfig', JSON.stringify(permissionConfig));
  }, [permissionConfig]);

  const login = useCallback(async (email: string, password: string, cabinet: string, role?: UserRole): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (mockUser && password === 'password123') {
      const userWithRole = role ? { ...mockUser, role } : mockUser;
      setUser(userWithRole);
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
      localStorage.setItem('selectedCabinet', cabinet);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedCabinet');
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    
    if (user.role === 'owner-doctor') return true;

    const userPerms = permissionConfig.userPermissions[user.id];
    if (userPerms?.denied.includes(permission)) return false;

    if (userPerms?.granted.includes(permission)) return true;

    const rolePerms = permissionConfig.rolePermissions[user.role] || [];
    return rolePerms.includes(permission);
  }, [user, permissionConfig]);

  const canAccess = useCallback((resource: string): boolean => {
    if (!user) return false;
    
    if (user.role === 'owner-doctor') return true;

    const resourcePermissionMap: { [key: string]: string[] } = {
      'patients': ['view_patients', 'manage_patients'],
      'appointments': ['view_appointments', 'manage_appointments'],
      'prescriptions': ['view_prescriptions', 'manage_prescriptions'],
      'products': ['view_products', 'manage_products'],
      'leaves': ['view_leaves', 'request_leaves', 'manage_leaves'],
      'reviews': ['view_reviews', 'manage_reviews'],
      'settings': ['view_settings', 'manage_settings'],
      'ai-assistant': ['access_ai_assistant'],
      'schedule': ['access_schedule'],
    };

    const requiredPermissions = resourcePermissionMap[resource] || [];
    return requiredPermissions.some(permission => hasPermission(permission));
  }, [user, hasPermission]);

  const updateRolePermissions = useCallback((role: UserRole, permissions: string[]) => {
    setPermissionConfig(prev => ({
      ...prev,
      rolePermissions: {
        ...prev.rolePermissions,
        [role]: permissions
      }
    }));
  }, []);

  const updateUserPermissions = useCallback((userId: string, granted: string[], denied: string[]) => {
    setPermissionConfig(prev => ({
      ...prev,
      userPermissions: {
        ...prev.userPermissions,
        [userId]: { granted, denied }
      }
    }));
  }, []);

  const getRolePermissions = useCallback((role: UserRole): string[] => {
    return permissionConfig.rolePermissions[role] || [];
  }, [permissionConfig]);

  const getUserPermissions = useCallback((userId: string) => {
    return permissionConfig.userPermissions[userId] || { granted: [], denied: [] };
  }, [permissionConfig]);

  const getAllUsers = useCallback((): User[] => {
    return MOCK_USERS;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      hasPermission,
      canAccess,
      updateRolePermissions,
      updateUserPermissions,
      getRolePermissions,
      getUserPermissions,
      getAllUsers,
      permissionConfig,
    }}>
      {children}
    </AuthContext.Provider>
  );
};