import { FC, ReactNode, useState, useCallback, useEffect } from 'react';
import { AuthContext } from './context';
import { User, UserRole, PermissionConfig, RegisterData } from './types';
import { DEFAULT_ROLE_PERMISSIONS } from '../../mock/default-role-permissions';
import { MOCK_USERS } from '../../mock/users';

interface AuthProviderProps {
  children: ReactNode;
}

const USERS_STORAGE_KEY = 'registeredUsers';

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const [permissionConfig, setPermissionConfig] = useState<PermissionConfig>(() => {
    const stored = localStorage.getItem('permissionConfig');
    return stored ? JSON.parse(stored) : {
      rolePermissions: DEFAULT_ROLE_PERMISSIONS,
      userPermissions: {}
    };
  });

  // Get all users (mock + registered)
  const getAllUsersIncludingRegistered = useCallback((): User[] => {
    const registeredUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const registered = registeredUsers ? JSON.parse(registeredUsers) : [];
    return [...MOCK_USERS, ...registered];
  }, []);

  useEffect(() => {
    localStorage.setItem('permissionConfig', JSON.stringify(permissionConfig));
  }, [permissionConfig]);

  const register = useCallback(async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const allUsers = getAllUsersIncludingRegistered();
      if (allUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error('Email already exists');
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        ...userData,
        profileImg: '',
      };

      // Save to registered users
      const registeredUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const registered = registeredUsers ? JSON.parse(registeredUsers) : [];
      registered.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registered));

      // Auto-login the new user
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      return true;
    } catch (err) {
      console.error('Registration error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getAllUsersIncludingRegistered]);

  const login = useCallback(async (email: string, password: string, clinicId?: string, role?: UserRole): Promise<boolean> => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const allUsers = getAllUsersIncludingRegistered();
      const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && password === 'password123') {
        const userWithRole = role ? { ...foundUser, role } : foundUser;
        const userWithClinic = clinicId ? { ...userWithRole, clinicId } : userWithRole;
        
        setUser(userWithClinic);
        localStorage.setItem('currentUser', JSON.stringify(userWithClinic));
        
        if (clinicId) {
          localStorage.setItem('selectedClinicId', clinicId);
        }
        
        return true;
      }

      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getAllUsersIncludingRegistered]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedClinicId');
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
    return getAllUsersIncludingRegistered();
  }, [getAllUsersIncludingRegistered]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      hasPermission,
      canAccess,
      updateRolePermissions,
      updateUserPermissions,
      getRolePermissions,
      getUserPermissions,
      getAllUsers,
      permissionConfig,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};