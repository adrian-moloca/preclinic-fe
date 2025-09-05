export type UserRole = 'owner-doctor' | 'doctor' | 'assistant';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImg?: string;
  customPermissions?: string[]; 
  disabledPermissions?: string[]; 
  clinicId?: string; // Add clinic association
}

export interface RolePermissions {
  [role: string]: string[];
}

export interface UserPermissions {
  [userId: string]: {
    granted: string[];
    denied: string[];
  };
}

export interface PermissionConfig {
  rolePermissions: RolePermissions;
  userPermissions: UserPermissions;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, clinicId?: string, role?: UserRole) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canAccess: (resource: string) => boolean;
  updateRolePermissions: (role: UserRole, permissions: string[]) => void;
  updateUserPermissions: (userId: string, granted: string[], denied: string[]) => void;
  getRolePermissions: (role: UserRole) => string[];
  getUserPermissions: (userId: string) => { granted: string[]; denied: string[] };
  getAllUsers: () => User[];
  permissionConfig: PermissionConfig;
  loading: boolean;
}