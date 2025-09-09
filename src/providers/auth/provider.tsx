import { FC, ReactNode, useState, useCallback, useEffect } from 'react';
import { AuthContext } from './context';
import { User, UserRole, PermissionConfig, RegisterData } from './types';
import { DEFAULT_ROLE_PERMISSIONS } from '../../mock/default-role-permissions';
import { MOCK_USERS } from '../../mock/users';
import axios from 'axios';

interface AuthProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = 'preclinic_user';

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const [permissionConfig, setPermissionConfig] = useState<PermissionConfig>({
    rolePermissions: DEFAULT_ROLE_PERMISSIONS,
    userPermissions: {}
  });

  const saveUserToStorage = useCallback((userData: User) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      console.log('✅ User saved to localStorage:', userData);
    } catch (error) {
      console.error('❌ Failed to save user to localStorage:', error);
    }
  }, []);

  const loadUserFromStorage = useCallback((): User | null => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const userData = JSON.parse(storedUser);

        if (!userData.role) {
          console.log('⚠️ User loaded from storage without role, setting to doctor_owner');
          userData.role = 'doctor_owner';
        }

        console.log('✅ User loaded from localStorage:', userData);
        return userData;
      }
    } catch (error) {
      console.error('❌ Failed to load user from localStorage:', error);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    return null;
  }, []);

  const clearUserFromStorage = useCallback(() => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('❌ Failed to clear user from localStorage:', error);
    }
  }, []);

  const getAllUsersIncludingRegistered = useCallback((): User[] => {
    return [...MOCK_USERS];
  }, []);

  const getMe = useCallback(async (): Promise<User | null> => {
    try {
      const response = await axios.get<User>('http://localhost:3001/api/auth/me', { withCredentials: true });
      const userData = response.data;

      // Ensure role exists
      const finalUser = { ...userData, role: userData.role || 'doctor_owner' as UserRole };
      setUser(finalUser);
      saveUserToStorage(finalUser);
      return finalUser;
    } catch (error: any) {
      console.log('❌ No authenticated user found:', error.response?.data || error.message);
      return null;
    }
  }, [saveUserToStorage]);

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await axios.post<User>('http://localhost:3001/api/auth/signup', data, { withCredentials: true });
      const newUser = { ...response.data, role: response.data.role || 'doctor_owner' as UserRole };
      setUser(newUser);
      saveUserToStorage(newUser);
      return true;
    } catch (error: any) {
      console.error("❌ Registration failed:", error.response?.data || error.message);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🚀 Sending login request', { email, password });
      const response = await axios.post<User>(
        'http://localhost:3001/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      const loggedInUser = { ...response.data, role: response.data.role || 'doctor_owner' as UserRole };
      console.log('✅ Login successful with role:', loggedInUser.role);

      setUser(loggedInUser);
      saveUserToStorage(loggedInUser);

      return true;
    } catch (error: any) {
      if (error.response) {
        console.error("❌ Login failed:", {
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error("❌ No response received:", error.request);
      } else {
        console.error("❌ Error setting up login request:", error.message);
      }
      return false;
    }
  };

  const logout = useCallback(async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.log('⚠️ Server logout failed, continuing with local logout');
    }

    setUser(null);
    clearUserFromStorage();
  }, [clearUserFromStorage]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user || !user.role) return false;
    if (user.role === 'doctor_owner') return true;

    const rolePerms = permissionConfig.rolePermissions[user.role] || [];
    if (rolePerms.includes(permission)) return true;

    const userPerms = permissionConfig.userPermissions[user.id] || { granted: [], denied: [] };
    if (userPerms.denied.includes(permission)) return false;
    if (userPerms.granted.includes(permission)) return true;

    return false;
  }, [user, permissionConfig]);

  const canAccess = useCallback((resource: string): boolean => {
    if (!user || !user.role) return false;
    if (user.role === 'doctor_owner') return true;

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
      'dashboard': ['view_dashboard'],
      'doctors': ['view_doctors', 'manage_doctors'],
      'assistents': ['view_assistents', 'manage_assistents'],
      'services': ['view_services', 'manage_services'],
      'departments': ['view_departments', 'manage_departments'],
      'payroll': ['view_payroll', 'manage_payroll'],
      'invoices': ['view_invoices', 'manage_invoices'],
      'chat': ['view_chat'],
    };

    const requiredPermissions = resourcePermissionMap[resource] || [];
    return requiredPermissions.some(permission => hasPermission(permission));
  }, [user, hasPermission]);

  const updateRolePermissions = useCallback((role: UserRole, permissions: string[]) => {
    setPermissionConfig(prev => ({
      ...prev,
      rolePermissions: { ...prev.rolePermissions, [role]: permissions }
    }));
  }, []);

  const updateUserPermissions = useCallback((userId: string, granted: string[], denied: string[]) => {
    setPermissionConfig(prev => ({
      ...prev,
      userPermissions: { ...prev.userPermissions, [userId]: { granted, denied } }
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

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = loadUserFromStorage();
      if (storedUser) setUser(storedUser);

      await getMe(); // refresh user from server if session exists
      setLoading(false);
      setIsInitialized(true);
    };

    initializeAuth();
  }, [loadUserFromStorage, getMe]);

  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

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
      getMe,
      getAllUsers,
      permissionConfig,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
