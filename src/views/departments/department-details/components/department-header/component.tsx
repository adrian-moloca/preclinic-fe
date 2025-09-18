import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { IDepartments } from '../../../../../providers/departments';

interface DepartmentHeaderProps {
  department: IDepartments;
  totalStaff: number;
  getStatusColor: (status: string) => string;
}

export const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({
  department,
  totalStaff,
  getStatusColor
}) => {
  return (
    <Box display="flex" alignItems="center" gap={3} mb={4}>
      <Box>
        <Typography variant="h4" fontWeight={600} mb={1}>
          {department.name}
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={2}>
          Department
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
          <Chip 
            label={department.status} 
            color={getStatusColor(department.status) as any}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
          <Chip 
            label={`${totalStaff} Staff Members`} 
            variant="outlined" 
            size="small" 
            icon={<GroupIcon />}
          />
          <Chip 
            label={`Created ${department.createdAt ? new Date(department.createdAt).toLocaleDateString() : 'N/A'}`} 
            variant="outlined" 
            size="small" 
            icon={<CalendarTodayIcon />}
          />
        </Box>
      </Box>
    </Box>
  );
};