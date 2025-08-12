import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Alert,
  Chip,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { FC, useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../../../../providers/auth";
import { UserRole } from "../../../../providers/auth/types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`permission-tabpanel-${index}`}
      aria-labelledby={`permission-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const PermissionManagement: FC = () => {
  const {
    getRolePermissions,
    updateRolePermissions,
    getUserPermissions,
    updateUserPermissions,
    getAllUsers,
    user: currentUser,
    permissionConfig 
  } = useAuthContext();

  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string>('');

  const users = getAllUsers().filter(u => u.role !== 'owner-doctor');

  const [, setRealTimePermissions] = useState(permissionConfig);

  useEffect(() => {
    setRealTimePermissions(permissionConfig);
  }, [permissionConfig]);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    event.stopPropagation();
    
    setTabValue(newValue);
  }, []);

  const permissionCategories = {
    'Dashboard & General': ['view_dashboard', 'access_schedule'],
    'Patients': ['view_patients', 'manage_patients'],
    'Appointments': ['view_appointments', 'manage_appointments'],
    'Prescriptions': ['view_prescriptions', 'manage_prescriptions'],
    'Products': ['view_products', 'manage_products'],
    'Leaves': ['view_leaves', 'request_leaves', 'manage_leaves'],
    'Reviews': ['view_reviews', 'manage_reviews'],
    'System': ['view_settings', 'manage_settings', 'manage_users', 'view_reports', 'delete_data'],
    'AI & Tools': ['access_ai_assistant'],
    'Chat': ['view_chat', ],
    'Doctors': ['view_doctors', 'manage_doctors'],
    'Assistents': ['view_assistents', 'manage_assistents'],
    'Services': ['view_services', 'manage_services'],
    'Departments': ['view_departments', 'manage_departments'],
    'Payroll': ['view_payroll', 'manage_payroll'],
    'Invoices': ['view_invoices', 'manage_invoices']
  };

  const getPermissionLabel = useCallback((permission: string) => {
    return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, []);

  const handleRolePermissionChange = useCallback((role: UserRole, permission: string, checked: boolean) => {
    document.body.style.scrollBehavior = 'auto';
    
    const currentPermissions = getRolePermissions(role);
    const newPermissions = checked 
      ? [...currentPermissions, permission]
      : currentPermissions.filter(p => p !== permission);
    
    updateRolePermissions(role, newPermissions);
    
    setTimeout(() => {
      document.body.style.scrollBehavior = '';
    }, 100);
  }, [getRolePermissions, updateRolePermissions]);

  const handleUserPermissionChange = useCallback((userId: string, permission: string, type: 'grant' | 'deny' | 'remove') => {
    document.body.style.scrollBehavior = 'auto';
    
    const userPerms = getUserPermissions(userId);
    let newGranted = [...userPerms.granted];
    let newDenied = [...userPerms.denied];

    newGranted = newGranted.filter(p => p !== permission);
    newDenied = newDenied.filter(p => p !== permission);

    if (type === 'grant') {
      newGranted.push(permission);
    } else if (type === 'deny') {
      newDenied.push(permission);
    }

    updateUserPermissions(userId, newGranted, newDenied);
    
    setTimeout(() => {
      document.body.style.scrollBehavior = '';
    }, 100);
  }, [getUserPermissions, updateUserPermissions]);

  const getUserPermissionStatus = useCallback((userId: string, permission: string): 'granted' | 'denied' | 'role-default' => {
    const userPerms = getUserPermissions(userId);
    if (userPerms.granted.includes(permission)) return 'granted';
    if (userPerms.denied.includes(permission)) return 'denied';
    return 'role-default';
  }, [getUserPermissions]);

  const hasRolePermission = useCallback((role: UserRole, permission: string): boolean => {
    return getRolePermissions(role).includes(permission);
  }, [getRolePermissions]);

  const handleUserSelect = useCallback((userId: string) => {
    document.body.style.scrollBehavior = 'auto';
    setSelectedUser(userId);
    
    setTimeout(() => {
      document.body.style.scrollBehavior = '';
    }, 100);
  }, []);

  if (currentUser?.role !== 'owner-doctor') {
    return (
      <Box p={3}>
        <Alert severity="error">
          Access denied. Only Owner-Doctor can manage permissions.
        </Alert>
      </Box>
    );
  }

  return (
    <Box 
      p={3}
      sx={{
        scrollBehavior: 'auto',
        '& *': {
          scrollBehavior: 'auto',
        }
      }}
    >
      <Typography variant="h4" fontWeight={600} mb={3}>
        Permission Management
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                scrollBehavior: 'auto',
              }
            }}
          >
            <Tab label="Role Permissions" />
            <Tab label="Individual User Permissions" />
          </Tabs>
        </Box>

        {/* Role Permissions Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" mb={2}>
            Configure default permissions for each role
          </Typography>
          
          <Grid container spacing={3}>
            {(['doctor', 'assistant'] as UserRole[]).map((role) => (
              <Grid key={role}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                        {role.replace('-', ' ')} Permissions
                      </Typography>
                      <Chip 
                        label={`${getRolePermissions(role).length} permissions`}
                        size="small"
                        sx={{ ml: 2 }}
                        // Update in real-time
                        key={`${role}-${getRolePermissions(role).length}`}
                      />
                    </Box>

                    {Object.entries(permissionCategories).map(([category, permissions]) => (
                      <Box key={category} mb={2}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          {category}
                        </Typography>
                        <FormGroup>
                          {permissions.map((permission) => (
                            <FormControlLabel
                              key={`${role}-${permission}-${hasRolePermission(role, permission)}`} // Force re-render on change
                              control={
                                <Checkbox
                                  checked={hasRolePermission(role, permission)}
                                  onChange={(e) => {
                                    e.stopPropagation(); // Prevent event bubbling
                                    handleRolePermissionChange(role, permission, e.target.checked);
                                  }}
                                  size="small"
                                  sx={{
                                    // Prevent checkbox from causing layout shifts
                                    '&.Mui-checked': {
                                      transform: 'none',
                                    }
                                  }}
                                />
                              }
                              label={getPermissionLabel(permission)}
                              sx={{ 
                                ml: 1,
                                // Prevent label changes from causing scroll
                                '& .MuiFormControlLabel-label': {
                                  scrollBehavior: 'auto',
                                }
                              }}
                            />
                          ))}
                        </FormGroup>
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Individual User Permissions Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" mb={2}>
            Override permissions for specific users
          </Typography>

          <FormControl fullWidth sx={{ mb: 3, maxWidth: 300 }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUser}
              label="Select User"
              onChange={(e) => {
                e.stopPropagation();
                handleUserSelect(e.target.value);
              }}
              MenuProps={{
                // Prevent menu from causing scroll adjustments
                disableScrollLock: true,
                sx: {
                  '& .MuiPaper-root': {
                    scrollBehavior: 'auto',
                  }
                }
              }}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedUser && (
            <Card variant="outlined">
              <CardContent>
                {(() => {
                  const user = users.find(u => u.id === selectedUser);
                  return (
                    <>
                      <Typography variant="h6" mb={2}>
                        {user?.firstName} {user?.lastName} - Individual Permissions
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={3}>
                        Override role-based permissions for this specific user. 
                        <strong> Green</strong> = Specifically granted, 
                        <strong> Red</strong> = Specifically denied, 
                        <strong> Default</strong> = Uses role permissions
                      </Typography>

                      {Object.entries(permissionCategories).map(([category, permissions]) => (
                        <Box key={category} mb={3}>
                          <Typography variant="subtitle2" color="primary" gutterBottom>
                            {category}
                          </Typography>
                          <Grid container spacing={1}>
                            {permissions.map((permission) => {
                              const status = getUserPermissionStatus(selectedUser, permission);
                              const roleHasPermission = hasRolePermission(user?.role as UserRole, permission);
                              
                              return (
                                <Grid key={`${selectedUser}-${permission}-${status}`}>
                                  <Box 
                                    sx={{ 
                                      p: 1, 
                                      border: 1, 
                                      borderColor: 'divider', 
                                      borderRadius: 1,
                                      backgroundColor: 
                                        status === 'granted' ? 'success.light' :
                                        status === 'denied' ? 'error.light' : 
                                        'grey.50',
                                      // Prevent layout shifts
                                      minHeight: '120px',
                                      transition: 'background-color 0.2s ease-in-out',
                                    }}
                                  >
                                    <Typography variant="body2" fontWeight={500}>
                                      {getPermissionLabel(permission)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Role default: {roleHasPermission ? 'Allowed' : 'Denied'}
                                    </Typography>
                                    <Box mt={1}>
                                      <Button
                                        size="small"
                                        variant={status === 'granted' ? 'contained' : 'outlined'}
                                        color="success"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUserPermissionChange(selectedUser, permission, 'grant');
                                        }}
                                        sx={{ mr: 1, mb: 0.5 }}
                                      >
                                        Grant
                                      </Button>
                                      <Button
                                        size="small"
                                        variant={status === 'denied' ? 'contained' : 'outlined'}
                                        color="error"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUserPermissionChange(selectedUser, permission, 'deny');
                                        }}
                                        sx={{ mr: 1, mb: 0.5 }}
                                      >
                                        Deny
                                      </Button>
                                      <Button
                                        size="small"
                                        variant={status === 'role-default' ? 'contained' : 'outlined'}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUserPermissionChange(selectedUser, permission, 'remove');
                                        }}
                                        sx={{ mb: 0.5 }}
                                      >
                                        Default
                                      </Button>
                                    </Box>
                                  </Box>
                                </Grid>
                              );
                            })}
                          </Grid>
                          <Divider sx={{ mt: 2 }} />
                        </Box>
                      ))}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </TabPanel>
      </Card>
    </Box>
  );
};