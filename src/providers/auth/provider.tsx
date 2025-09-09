import { FC, ReactNode, useState, useCallback, useEffect, useRef } from 'react';
import { AuthContext } from './context';
import { User, UserRole, PermissionConfig, RegisterData } from './types';
import { DEFAULT_ROLE_PERMISSIONS } from '../../mock/default-role-permissions';
import { MOCK_USERS } from '../../mock/users';
import axios, { AxiosResponse } from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

interface AuthProviderProps {
  children: ReactNode;
}

// Type for API responses that might wrap user data
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
  
  // Use ref to prevent infinite loops in useCallback dependencies
  const userRef = useRef<User | null>(null);
  
  const [permissionConfig, setPermissionConfig] = useState<PermissionConfig>({
    rolePermissions: DEFAULT_ROLE_PERMISSIONS,
    userPermissions: {}
  });

  // Update ref whenever user changes
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const saveUserToStorage = useCallback((userData: User) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      console.log('✅ User saved to localStorage:', userData.email);
    } catch (error) {
      console.error('❌ Failed to save user to localStorage:', error);
    }
  }, []);

  const loadUserFromStorage = useCallback((): User | null => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const userData = JSON.parse(storedUser) as User;
        
        // Validate user data structure
        if (!userData.id || !userData.email) {
          console.log('⚠️ Invalid user data in storage, clearing...');
          localStorage.removeItem(USER_STORAGE_KEY);
          return null;
        }
        
        if (!userData.role) {
          console.log('⚠️ User loaded from storage without role, setting to doctor_owner');
          userData.role = 'doctor_owner';
        }
        
        console.log('✅ User loaded from localStorage:', userData.email);
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
      console.log('✅ User cleared from localStorage');
    } catch (error) {
      console.error('❌ Failed to clear user from localStorage:', error);
    }
  }, []);

  // Helper function to extract user data from different response formats
  const extractUserFromResponse = useCallback((response: AxiosResponse<User | ApiResponse<User>>): User | null => {
    try {
      const data = response.data;
      
      // If data is already a User object
      if (data && typeof data === 'object' && 'id' in data && 'email' in data) {
        return data as User;
      }
      
      // If data is wrapped in an API response object
      const apiResponse = data as ApiResponse<User>;
      if (apiResponse.user && typeof apiResponse.user === 'object') {
        return apiResponse.user;
      }
      
      if (apiResponse.data && typeof apiResponse.data === 'object') {
        return apiResponse.data;
      }
      
      console.error('❌ Invalid user data format from server:', data);
      return null;
    } catch (error) {
      console.error('❌ Error extracting user from response:', error);
      return null;
    }
  }, []);

  // FIXED: Removed user dependency to prevent infinite loops
  const getMe = useCallback(async (): Promise<User | null> => {
    try {
      console.log('🔍 Fetching current user from server...');
      const response = await axios.get<User | ApiResponse<User>>('/api/auth/me');
      
      const userData = extractUserFromResponse(response);
      
      if (!userData) {
        console.log('❌ No valid user data from server');
        return userRef.current; // Return current user from ref
      }
      
      // Ensure user has required fields
      const completeUserData: User = {
        ...userData,
        role: userData.role || 'doctor_owner' as UserRole
      };
      
      console.log('✅ Fresh user data from server:', completeUserData.email);
      setUser(completeUserData);
      saveUserToStorage(completeUserData);
      return completeUserData;
    } catch (error: any) {
      console.log('❌ Failed to fetch user from server:', error.response?.status || error.message);
      // Return current user from ref instead of state to avoid dependency issues
      return userRef.current;
    }
  }, [saveUserToStorage, extractUserFromResponse]);

  // Initialize user from localStorage and attempt server sync
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing auth...');
      setLoading(true);
      
      try {
        const storedUser = loadUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
          console.log('✅ User restored from localStorage:', storedUser.email);
          
          // Try to sync with server in background
          try {
            console.log('🔄 Attempting to sync with server...');
            await getMe(); // This will update user state if successful
          } catch (error: any) {
            console.log('⚠️ Failed to sync with server, using cached user:', error.response?.status);
            // Keep the cached user if server sync fails
          }
        } else {
          console.log('ℹ️ No stored user found');
        }
      } catch (error) {
        console.error('❌ Error during auth initialization:', error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    // Only run once when component mounts
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, loadUserFromStorage, getMe]);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      console.log('🚀 Making registration request for:', data.email);
      const response = await axios.post<User | ApiResponse<User>>('/api/auth/signup', data);
      
      const newUser = extractUserFromResponse(response);
      
      if (!newUser) {
        console.error('❌ Invalid registration response');
        return false;
      }

      const completeUserData: User = {
        ...newUser,
        role: newUser.role || 'doctor_owner' as UserRole
      };

      console.log('✅ Registration successful:', completeUserData.email);

      setUser(completeUserData);
      saveUserToStorage(completeUserData);
      
      return true;
    } catch (error: any) {
      console.error("❌ Registration failed:", error.response?.data || error.message);
      return false;
    }
  }, [saveUserToStorage, extractUserFromResponse]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🚀 Making login request for:', email);
      
      // Try both signin and login endpoints
      let response: AxiosResponse<User | ApiResponse<User>>;
      
      try {
        response = await axios.post<User | ApiResponse<User>>('/api/auth/signin', { email, password });
      } catch (signinError: any) {
        console.log('⚠️ /signin failed, trying /login:', signinError.response?.status);
        response = await axios.post<User | ApiResponse<User>>('/api/auth/login', { email, password });
      }
      
      const loggedInUser = extractUserFromResponse(response);
      
      if (!loggedInUser) {
        console.error('❌ Invalid login response');
        return false;
      }

      const completeUserData: User = {
        ...loggedInUser,
        role: loggedInUser.role || 'doctor_owner' as UserRole
      };

      console.log('✅ Login successful:', completeUserData.email);

      setUser(completeUserData);
      saveUserToStorage(completeUserData);
      
      return true;
    } catch (error: any) {
      console.error("❌ Login failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return false;
    }
  }, [saveUserToStorage, extractUserFromResponse]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Attempt server logout
      await axios.post('/api/auth/logout', {});
      console.log('✅ Server logout successful');
    } catch (error: any) {
      console.log('⚠️ Server logout failed, continuing with local logout:', error.response?.status);
    }
    
    // Always clear local state and storage
    setUser(null);
    clearUserFromStorage();
    console.log('✅ User logged out locally');
  }, [clearUserFromStorage]);

  const hasPermission = useCallback((permission: string): boolean => {
    const currentUser = userRef.current;
    if (!currentUser || !currentUser.role) {
      return false;
    }

    // doctor_owner has all permissions
    if (currentUser.role === 'doctor_owner') {
      return true;
    }

    const rolePerms = permissionConfig.rolePermissions[currentUser.role] || [];
    if (rolePerms.includes(permission)) {
      return true;
    }

    const userPerms = permissionConfig.userPermissions[currentUser.id] || { granted: [], denied: [] };
    if (userPerms.denied.includes(permission)) {
      return false;
    }
    if (userPerms.granted.includes(permission)) {
      return true;
    }

    return false;
  }, [permissionConfig]);

  const canAccess = useCallback((resource: string): boolean => {
    const currentUser = userRef.current;
    if (!currentUser || !currentUser.role) {
      return false;
    }

    // doctor_owner has access to everything
    if (currentUser.role === 'doctor_owner') {
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
  }, [hasPermission]);

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