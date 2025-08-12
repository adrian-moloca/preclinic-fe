import {
  Box,
  Typography,
  Button,
  Tooltip,
  Divider,
} from "@mui/material";
import { FC } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

interface ServiceHeaderProps {
  serviceName: string;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export const ServiceHeader: FC<ServiceHeaderProps> = ({
  serviceName,
  onEdit,
  onDelete,
  onBack
}) => {
  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <Box display="flex" alignItems="center">
            <MedicalServicesIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
            <Typography variant="h4" fontWeight={600}>
              {serviceName}
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" gap={2}>
          <Tooltip title="Edit Service">
            <Button
              variant="outlined"
              onClick={onEdit}
              startIcon={<EditIcon />}
              sx={{ minWidth: 120 }}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Service">
            <Button
              variant="outlined"
              color="error"
              onClick={onDelete}
              startIcon={<DeleteIcon />}
              sx={{ minWidth: 120 }}
            >
              Delete
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <Divider sx={{ mb: 4 }} />
    </>
  );
};