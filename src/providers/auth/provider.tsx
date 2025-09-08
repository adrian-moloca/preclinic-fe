import { FC, ReactNode, useState, useCallback, useEffect } from 'react';
import { AuthContext } from './context';
import { User, UserRole, PermissionConfig, RegisterData } from './types';
import { DEFAULT_ROLE_PERMISSIONS } from '../../mock/default-role-permissions';
import { MOCK_USERS } from '../../mock/users';
import axios from 'axios';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading,] = useState(false);

  const [permissionConfig, setPermissionConfig] = useState<PermissionConfig>({
    rolePermissions: DEFAULT_ROLE_PERMISSIONS,
    userPermissions: {}
  });

  // Get all users (mock + registered)
  const getAllUsersIncludingRegistered = useCallback((): User[] => {
    return [...MOCK_USERS];
  }, []);

  useEffect(() => {
    // No localStorage usage
  }, [permissionConfig]);

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await axios.post<User>('http://localhost:3001/api/auth/signup', data);
      const newUser = response.data;
      
      // IMPORTANT: Ensure the role is set correctly
      const userWithCorrectRole = {
        ...newUser,
        role: 'doctor_owner' as UserRole // Force the role to be doctor_owner
      };
      
      setUser(userWithCorrectRole);
      console.log('✅ User registered with role:', userWithCorrectRole.role);
      return true;
    } catch (error) {
      console.error("❌ Registration failed:", error);
      return false;
    }
  };

  const login = async (email: string, password: string, clinicId?: string, role?: UserRole): Promise<boolean> => {
    try {
      const response = await axios.post<User>('http://localhost:3001/api/auth/login', { email, password, clinicId });
      const loggedInUser = response.data;

      setUser(loggedInUser);
      console.log('✅ User logged in with role:', loggedInUser.role);
      return true;
    } catch (error) {
      console.error("❌ Login failed:", error);
      return false;
    }
  };

  // Helper to check if user has a specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;

    // doctor_owner has all permissions
    if (user.role === 'doctor_owner') return true;

    // Check role permissions
    const rolePerms = permissionConfig.rolePermissions[user.role] || [];
    if (rolePerms.includes(permission)) return true;

    // Check user-specific permissions
    const userPerms = permissionConfig.userPermissions[user.id] || { granted: [], denied: [] };
    if (userPerms.denied.includes(permission)) return false;
    if (userPerms.granted.includes(permission)) return true;

    return false;
  }, [user, permissionConfig]);

  const canAccess = useCallback((resource: string): boolean => {
    if (!user) {
      console.log('❌ No user found for resource access check');
      return false;
    }
    
    console.log('🔍 Checking access to resource:', resource, 'for user role:', user.role);
    
    // IMPORTANT: doctor_owner should have access to everything
    if (user.role === 'doctor_owner') {
      console.log('✅ doctor_owner has access to all resources');
      return true;
    }
    
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
    const hasAccess = requiredPermissions.some(permission => hasPermission(permission));
    
    console.log('🎯 Can access resource:', hasAccess);
    return hasAccess;
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

  const logout = useCallback(() => {
    setUser(null);
    console.log('✅ User logged out');
  }, []);

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