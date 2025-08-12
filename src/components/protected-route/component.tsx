import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../providers/auth/context';
import { Alert, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredResource?: string;
  role?: string | string[];
  fallback?: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredResource,
  role,
  fallback
}) => {
  const { isAuthenticated, hasPermission, canAccess, user } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!user || !allowedRoles.includes(user.role)) {
      return (
        <>
          {fallback || (
            <Box p={3}>
              <Alert severity="error">
                Access denied. Required role: {Array.isArray(role) ? role.join(', ') : role}
                <br />
                Current role: {user?.role}
              </Alert>
            </Box>
          )}
        </>
      );
    }
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <>
        {fallback || (
          <Box p={3}>
            <Alert severity="error">
              Access denied. You don't have permission to {requiredPermission.replace('_', ' ')}.
              <br />
              Current role: {user?.role}
            </Alert>
          </Box>
        )}
      </>
    );
  }

  if (requiredResource && !canAccess(requiredResource)) {
    return (
      <>
        {fallback || (
          <Box p={3}>
            <Alert severity="error">
              Access denied. You cannot access {requiredResource}.
              <br />
              Current role: {user?.role}
            </Alert>
          </Box>
        )}
      </>
    );
  }

  return <>{children}</>;
};