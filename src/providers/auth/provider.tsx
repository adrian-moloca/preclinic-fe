import { FC, ReactNode, useState, useCallback, useEffect, useRef } from 'react';
import { AuthContext } from './context';
import { User, UserRole, PermissionConfig, RegisterData } from './types';
import { DEFAULT_ROLE_PERMISSIONS } from '../../mock/default-role-permissions';
import { MOCK_USERS } from '../../mock/users';
import axios, { AxiosResponse } from 'axios';

axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

interface AuthProviderProps {
  children: ReactNode;
}

interface ApiResponse<T = any> {
  user?: T;
  data?: T;
  success?: boolean;
  message?: string;
}

const USER_STORAGE_KEY = 'preclinic_user';

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const userRef = useRef<User | null>(null);

  const [permissionConfig, setPermissionConfig] = useState<PermissionConfig>({
    rolePermissions: DEFAULT_ROLE_PERMISSIONS,
    userPermissions: {}
  });

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const saveUserToStorage = useCallback((userData: User) => {
    try {
      const userToSave = {
        ...userData,
        id: userData.id || `user-${Date.now()}`,
      };
      
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToSave));
    } catch (error) {
    }
  }, []);

  const loadUserFromStorage = useCallback((): User | null => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      
      if (!storedUser) {
        return null;
      }

      const userData = JSON.parse(storedUser) as User;
      
      if (!userData.id) {
        userData.id = `user-${Date.now()}`;
      }
      
      if (!userData.role) {
        userData.role = 'doctor_owner';
      }
      
      return userData;
      
    } catch (error) {
      return null;
    }
  }, []);

  const clearUserFromStorage = useCallback(() => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
    }
  }, []);

  const extractUserFromResponse = useCallback((response: AxiosResponse<User | ApiResponse<User>>): User | null => {
    try {
      const data = response.data;
      if (data && typeof data === 'object' && 'id' in data && 'email' in data) {
        return data as User;
      }
      const apiResponse = data as ApiResponse<User>;
      if (apiResponse.user && typeof apiResponse.user === 'object') {
        return apiResponse.user;
      }
      if (apiResponse.data && typeof apiResponse.data === 'object') {
        return apiResponse.data;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const getMe = useCallback(async (): Promise<User | null> => {
    try {
      const response = await axios.get<User | ApiResponse<User>>('/api/auth/me');
      const userData = extractUserFromResponse(response);
      if (!userData) return userRef.current;
      
      const completeUserData: User = {
        ...userData,
        id: userData.id || `user-${Date.now()}`,
        role: userData.role || 'doctor_owner' as UserRole
      };
      
      setUser(completeUserData);
      saveUserToStorage(completeUserData);
      return completeUserData;
    } catch {
      return userRef.current;
    }
  }, [saveUserToStorage, extractUserFromResponse]);

  useEffect(() => {
    if (isInitialized) return;
    
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        const storedUser = loadUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
          
          try {
            await getMe();
          } catch {
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };
    
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await axios.post<User | ApiResponse<User>>('/api/auth/signup', data);
      const newUser = extractUserFromResponse(response);
      if (!newUser) return false;
      
      const completeUserData: User = {
        ...newUser,
        id: newUser.id || `user-${Date.now()}`,
        role: newUser.role || 'doctor_owner' as UserRole
      };
      
      setUser(completeUserData);
      saveUserToStorage(completeUserData);
      return true;
    } catch {
      return false;
    }
  }, [saveUserToStorage, extractUserFromResponse]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      let response: AxiosResponse<User | ApiResponse<User>> | null = null;
      
      try {
        response = await axios.post<User | ApiResponse<User>>('/api/auth/signin', { email, password });
      } catch {
        try {
          response = await axios.post<User | ApiResponse<User>>('/api/auth/login', { email, password });
        } catch {
          response = null;
        }
      }
      
      let userData: User | null = null;
      
      if (response) {
        userData = extractUserFromResponse(response);
      }
      
      if (!userData) {
        const mockUser = MOCK_USERS.find(u => u.email === email);
        if (mockUser) {
          userData = {
            ...mockUser,
            id: mockUser.id || `mock-${email.replace('@', '-').replace('.', '-')}`,
            email: mockUser.email || email,
            firstName: mockUser.firstName || 'User',
            lastName: mockUser.lastName || '',
            role: mockUser.role || 'doctor_owner' as UserRole
          };
        }
      }
      
      if (userData) {
        const completeUserData: User = {
          ...userData,
          id: userData.id || `user-${Date.now()}`,
          role: userData.role || 'doctor_owner' as UserRole
        };
        
        setUser(completeUserData);
        saveUserToStorage(completeUserData);
        
        return true;
      }
      
      return false;
    } catch (error) {
      const mockUser = MOCK_USERS.find(u => u.email === email);
      if (mockUser) {
        const completeUserData: User = {
          ...mockUser,
          id: mockUser.id || `mock-${email.replace('@', '-').replace('.', '-')}`,
          email: mockUser.email || email,
          firstName: mockUser.firstName || 'User',
          lastName: mockUser.lastName || '',
          role: mockUser.role || 'doctor_owner' as UserRole
        };
        
        setUser(completeUserData);
        saveUserToStorage(completeUserData);
        return true;
      }
      
      return false;
    }
  }, [saveUserToStorage, extractUserFromResponse]);

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch {}
    
    setUser(null);
    clearUserFromStorage();
  }, [clearUserFromStorage]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    const rolePermissions = permissionConfig.rolePermissions[user.role] || [];
    const userSpecific = permissionConfig.userPermissions[user.id] || { granted: [], denied: [] };
    
    if (userSpecific.denied.includes(permission)) return false;
    if (userSpecific.granted.includes(permission)) return true;
    return rolePermissions.includes(permission);
  }, [user, permissionConfig]);

  const canAccess = useCallback((resource: string): boolean => {
    if (!user) return false;
    
    const resourcePermissionMap: Record<string, string[]> = {
      'patients': ['view_patients', 'manage_patients'],
      'appointments': ['view_appointments', 'manage_appointments'],
      'prescriptions': ['view_prescriptions', 'manage_prescriptions'],
      'leaves': ['view_leaves', 'manage_leaves', 'request_leaves'],
      'products': ['view_products', 'manage_products'],
      'files': ['view_files', 'manage_files'],
      'cases': ['view_cases', 'manage_cases'],
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
  }, [hasPermission, user]);

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
    return [...MOCK_USERS];
  }, []);

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