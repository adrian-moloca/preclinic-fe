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
  verificationLink?: string;
  confirmationUrl?: string;
}

const USER_STORAGE_KEY = 'preclinic_user';
const SESSION_USER_KEY = 'preclinic_session_user';
const USER_CHANGE_EVENT = 'preclinic_user_changed';
const USER_LOGOUT_EVENT = 'preclinic_user_logout';

// Session Manager for tracking user changes
class SessionManager {
  private static currentSessionUser: string | null = null;

  static initSession(userId: string) {
    this.currentSessionUser = userId;
    sessionStorage.setItem(SESSION_USER_KEY, userId);
  }

  static getCurrentSessionUser(): string | null {
    if (!this.currentSessionUser) {
      this.currentSessionUser = sessionStorage.getItem(SESSION_USER_KEY);
    }
    return this.currentSessionUser;
  }

  static hasUserChanged(newUserId: string): boolean {
    const currentUser = this.getCurrentSessionUser();
    return currentUser !== null && currentUser !== newUserId;
  }

  static clearSession() {
    this.currentSessionUser = null;
    sessionStorage.removeItem(SESSION_USER_KEY);
  }
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [previousUserId, setPreviousUserId] = useState<string | null>(null);

  const userRef = useRef<User | null>(null);
  const clinicResetCallbackRef = useRef<(() => void) | null>(null);

  const [permissionConfig, setPermissionConfig] = useState<PermissionConfig>({
    rolePermissions: DEFAULT_ROLE_PERMISSIONS,
    userPermissions: {}
  });

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Emit user change event for other components to listen
  const emitUserChangeEvent = useCallback((eventType: string, userId?: string) => {
    const event = new CustomEvent(eventType, { 
      detail: { 
        userId,
        timestamp: Date.now() 
      } 
    });
    window.dispatchEvent(event);
  }, []);

  // Clear all user-specific data from localStorage
  const clearUserSpecificData = useCallback(() => {
    try {
      // Clear clinic-related data
      localStorage.removeItem('selectedClinic');
      
      // Clear any cached user-specific data
      const keysToCheck = Object.keys(localStorage);
      keysToCheck.forEach(key => {
        // Remove any keys that might contain user-specific data
        if (key.includes('clinic_') || key.includes('user_') || key.includes('cache_')) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              // Check if this data has a userId field
              if (parsed.userId || parsed.ownerId) {
                localStorage.removeItem(key);
              }
            } catch {
              // Not JSON, skip
            }
          }
        }
      });
    } catch (error) {
      console.error('Error clearing user-specific data:', error);
    }
  }, []);

  const saveUserToStorage = useCallback((userData: User) => {
    try {
      const userToSave = {
        ...userData,
        id: userData.id || `user-${Date.now()}`,
      };
      
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToSave));
      
      // Track this user in session
      SessionManager.initSession(userToSave.id);
      
    } catch (error) {
      console.error('Error saving user to storage:', error);
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
      
      // Check if this is a different user than the session user
      if (SessionManager.hasUserChanged(userData.id)) {
        console.warn('Detected user change in storage, clearing user-specific data');
        clearUserSpecificData();
        emitUserChangeEvent(USER_CHANGE_EVENT, userData.id);
      }
      
      return userData;
      
    } catch (error) {
      console.error('Error loading user from storage:', error);
      return null;
    }
  }, [clearUserSpecificData, emitUserChangeEvent]);

  const clearUserFromStorage = useCallback(() => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      
      // Clear all user-specific data
      clearUserSpecificData();
      
      // Clear session
      SessionManager.clearSession();
      
      // Emit logout event
      emitUserChangeEvent(USER_LOGOUT_EVENT);
    } catch (error) {
      console.error('Error clearing user from storage:', error);
    }
  }, [clearUserSpecificData, emitUserChangeEvent]);

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
      if (!userData) {
        clearUserFromStorage();
        setUser(null);
        return null;
      }
      
      const completeUserData: User = {
        ...userData,
        role: userData.role || 'doctor_owner' as UserRole
      };
      
      // Check for user change
      if (previousUserId && previousUserId !== completeUserData.id) {
        clearUserSpecificData();
        emitUserChangeEvent(USER_CHANGE_EVENT, completeUserData.id);
      }
      
      setUser(completeUserData);
      saveUserToStorage(completeUserData);
      setPreviousUserId(completeUserData.id);
      
      return completeUserData;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearUserFromStorage();
        setUser(null);
        return null;
      }
      return userRef.current;
    }
  }, [saveUserToStorage, extractUserFromResponse, clearUserFromStorage, previousUserId, clearUserSpecificData, emitUserChangeEvent]);

  useEffect(() => {
    if (isInitialized) return;
    
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        const storedUser = loadUserFromStorage();
        if (storedUser) {
          if (storedUser.emailVerified === false) {
            clearUserFromStorage();
            setUser(null);
          } else {
            // Check for user change before setting
            if (previousUserId && previousUserId !== storedUser.id) {
              clearUserSpecificData();
              emitUserChangeEvent(USER_CHANGE_EVENT, storedUser.id);
            }
            
            setUser(storedUser);
            setPreviousUserId(storedUser.id);
            SessionManager.initSession(storedUser.id);
            
            try {
              const validatedUser = await getMe();
              if (!validatedUser) {
                clearUserFromStorage();
                setUser(null);
                setPreviousUserId(null);
              }
            } catch (error) {
              console.error('Failed to validate user session:', error);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };
    
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; verificationLink?: string }> => {
    try {
      const response = await axios.post<User | ApiResponse<User>>('/api/auth/signup', data);
      const newUser = extractUserFromResponse(response);
      
      let verificationLink: string | undefined = undefined;
      if (response.data && typeof response.data === 'object' && 'verificationLink' in response.data) {
        verificationLink = (response.data as ApiResponse<User>).verificationLink;
      } else if (response.data && typeof response.data === 'object' && 'confirmationUrl' in response.data) {
        verificationLink = (response.data as ApiResponse<User>).confirmationUrl;
      }
      
      if (!newUser) return { success: false };
      
      return { 
        success: true, 
        verificationLink 
      };
    } catch {
      return { success: false };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if switching users
      const currentSessionUser = SessionManager.getCurrentSessionUser();
      
      // Clear any existing user data before login
      if (currentSessionUser) {
        clearUserSpecificData();
      }
      
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
        const mockUser = MOCK_USERS.find((u: User) => u.email === email);
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
        
        // Check for user change and emit event
        if (currentSessionUser && currentSessionUser !== completeUserData.id) {
          emitUserChangeEvent(USER_CHANGE_EVENT, completeUserData.id);
        }
        
        // Initialize new session
        SessionManager.initSession(completeUserData.id);
        
        setUser(completeUserData);
        saveUserToStorage(completeUserData);
        setPreviousUserId(completeUserData.id);
        
        return true;
      }
      
      return false;
    } catch (error) {
      const mockUser = MOCK_USERS.find((u: User) => u.email === email);
      if (mockUser) {
        const completeUserData: User = {
          ...mockUser,
          id: mockUser.id || `mock-${email.replace('@', '-').replace('.', '-')}`,
          email: mockUser.email || email,
          firstName: mockUser.firstName || 'User',
          lastName: mockUser.lastName || '',
          role: mockUser.role || 'doctor_owner' as UserRole
        };
        
        // Initialize session for mock user
        SessionManager.initSession(completeUserData.id);
        
        setUser(completeUserData);
        saveUserToStorage(completeUserData);
        setPreviousUserId(completeUserData.id);
        return true;
      }
      
      return false;
    }
  }, [saveUserToStorage, extractUserFromResponse, clearUserSpecificData, emitUserChangeEvent]);

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch {
      // Continue with logout even if API call fails
    }
    
    // Emit logout event before clearing data
    emitUserChangeEvent(USER_LOGOUT_EVENT);
    
    setUser(null);
    setPreviousUserId(null);
    clearUserFromStorage();
    SessionManager.clearSession();
  }, [clearUserFromStorage, emitUserChangeEvent]);

  // Method to register clinic reset callback
  const registerClinicReset = useCallback((callback: () => void) => {
    clinicResetCallbackRef.current = callback;
  }, []);

  // Watch for user changes and call clinic reset if registered
  useEffect(() => {
    if (user && previousUserId && user.id !== previousUserId) {
      if (clinicResetCallbackRef.current) {
        clinicResetCallbackRef.current();
      }
    }
  }, [user, previousUserId]);

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
      registerClinicReset, // Add this to the context type
    }}>
      {children}
    </AuthContext.Provider>
  );
};