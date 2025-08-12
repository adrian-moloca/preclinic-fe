import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { FC } from "react";
import { IUsers } from "../../providers/users";
import ProfileImageUploader from "../profile-image";

interface UserFormData {
  profileImg: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  specialization: string;
}

interface UserFormDialogProps {
  open: boolean;
  editingUser: IUsers | null;
  formData: UserFormData;
  errors: Partial<UserFormData>;
  onClose: () => void;
  onSubmit: () => void;
  onFieldChange: (field: keyof UserFormData, value: string) => void;
}

const roles = [
  { value: "doctor", label: "Doctor" },
  { value: "assistant", label: "Assistant" },
];

const specializations = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Neurology",
  "Psychiatry",
  "Gynecology",
  "Radiology",
  "Anesthesiology",
  "Surgery",
  "Emergency Medicine",
];

export const UserFormDialog: FC<UserFormDialogProps> = ({
  open,
  editingUser,
  formData,
  errors,
  onClose,
  onSubmit,
  onFieldChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
      <DialogContent>
        <Box py={2} display="flex" flexDirection="column" alignItems="center">
          <ProfileImageUploader
            image={formData.profileImg}
            setImage={(img) => onFieldChange("profileImg", img || "")}
          />

          <Box width="100%" mt={2}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => onFieldChange("firstName", e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => onFieldChange("lastName", e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => onFieldChange("phoneNumber", e.target.value)}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              required
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth error={!!errors.role} required sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => onFieldChange("role", e.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.role && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
                  {errors.role}
                </Typography>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={!!errors.specialization}
              required
              sx={{ mb: 2 }}
            >
              <InputLabel>Specialization</InputLabel>
              <Select
                value={formData.specialization}
                label="Specialization"
                onChange={(e) =>
                  onFieldChange("specialization", e.target.value)
                }
              >
                {specializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </Select>
              {errors.specialization && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
                  {errors.specialization}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          {editingUser ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
