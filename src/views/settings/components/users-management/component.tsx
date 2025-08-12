import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { FC, useState, useEffect, useMemo, useCallback } from "react";
import { useUsersContext } from "../../../../providers/users";
import { IUsers } from "../../../../providers/users/types";
import SearchBar from "../../../../components/search-bar";
import DeleteModal from "../../../../components/delete-modal";
import { ReusableTable } from "../../../../components/table/component";
import CreateUserTableColumns from "../../../../components/user-table-columns";
import UserFormDialog from "../../../../components/user-form-dialog";
import UserContextMenu from "../../../../components/user-context-menu";

interface UserFormData {
  profileImg: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  specialization: string;
}

export const UsersManagement: FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUsersContext();
  
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUsers | null>(null);
  
  const [formData, setFormData] = useState<UserFormData>({
    profileImg: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    specialization: '',
  });
  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<IUsers | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUsers | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users;
    }

    const queryLower = searchQuery.toLowerCase().trim();
    return users.filter((user) => {
      return (
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(queryLower) ||
        user.email.toLowerCase().includes(queryLower) ||
        user.phoneNumber.toLowerCase().includes(queryLower) ||
        user.role.toLowerCase().includes(queryLower) ||
        user.specialization.toLowerCase().includes(queryLower)
      );
    });
  }, [users, searchQuery]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRowClick = useCallback((user: IUsers) => {
    console.log('User clicked:', user);
  }, []);

  const handleFieldChange = useCallback((field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const resetForm = useCallback(() => {
    setFormData({
      profileImg: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: '',
      specialization: '',
    });
    setErrors({});
    setEditingUser(null);
  }, []);

  const loadUserData = useCallback((user: IUsers) => {
    setEditingUser(user);
    setFormData({
      profileImg: user.profileImg,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      specialization: user.specialization,
    });
    setErrors({});
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else {
      const existingUser = users.find(
        user => user.email.toLowerCase() === formData.email.toLowerCase() && 
        user.id !== editingUser?.id
      );
      if (existingUser) {
        newErrors.email = 'Email already exists';
      }
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9+\-()\s]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, users, editingUser]);

  const handleOpenDialog = useCallback((user?: IUsers) => {
    if (user) {
      loadUserData(user);
    } else {
      resetForm();
    }
    setOpen(true);
  }, [loadUserData, resetForm]);

  const handleCloseDialog = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm]);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>, user: IUsers) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    if (!deleteDialogOpen) {
      setSelectedUser(null);
    }
  }, [deleteDialogOpen]);

  const handleEditUser = useCallback(() => {
    if (selectedUser) {
      handleOpenDialog(selectedUser);
      handleMenuClose();
    }
  }, [selectedUser, handleOpenDialog, handleMenuClose]);

  const handleDeleteClick = useCallback(() => {
    if (selectedUser) {
      setUserToDelete(selectedUser);
      setDeleteDialogOpen(true);
      handleMenuClose();
    }
  }, [selectedUser, handleMenuClose]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
    setSelectedUser(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (userToDelete) {
      setIsDeleting(true);
      try {
        await deleteUser(userToDelete.id);
        setAlert({ type: 'success', message: 'User deleted successfully!' });
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to delete user.' });
      } finally {
        setIsDeleting(false);
      }
    }
    handleDeleteCancel();
  }, [userToDelete, deleteUser, handleDeleteCancel]);

  const handleDeleteMultiple = useCallback(async (selectedIds: string[]) => {
    setIsDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => deleteUser(id)));
      setAlert({ type: 'success', message: `${selectedIds.length} user(s) deleted successfully!` });
    } catch (error) {
      console.error('Error deleting users:', error);
      setAlert({ type: 'error', message: 'Failed to delete users.' });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteUser]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;

    try {
      if (editingUser) {
        const updatedUser: IUsers = {
          ...editingUser,
          ...formData,
        };
        updateUser(updatedUser);
        setAlert({ type: 'success', message: 'User updated successfully!' });
      } else {
        const newUser: IUsers = {
          id: crypto.randomUUID(),
          ...formData,
          createdAt: new Date().toISOString(),
        };
        addUser(newUser);
        setAlert({ type: 'success', message: 'User created successfully!' });
      }
      handleCloseDialog();
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  }, [validateForm, editingUser, formData, updateUser, addUser, handleCloseDialog]);

  const columns = useMemo(() => CreateUserTableColumns(handleMenuOpen), [handleMenuOpen]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Users Management ({filteredUsers.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-start" }}>
        <SearchBar onSearch={handleSearch} />
      </Box>

        <ReusableTable
          columns={columns}
          data={filteredUsers}
          onRowClick={handleRowClick}
          onDeleteSelected={handleDeleteMultiple}
          searchQuery={searchQuery}
          emptyMessage="No Users Found"
          emptyDescription="There are currently no users registered."
          enableSelection={true}
          enablePagination={true}
          enableSorting={true}
          rowsPerPageOptions={[5, 10, 25, 50]}
          defaultRowsPerPage={10}
          stickyHeader={false}
        />

      <UserFormDialog
        open={open}
        editingUser={editingUser}
        formData={formData}
        errors={errors}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange}
      />

      <UserContextMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onEdit={handleEditUser}
        onDelete={handleDeleteClick}
      />

      <DeleteModal
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        itemName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : undefined}
        message={userToDelete ? `Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}? This action cannot be undone.` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};