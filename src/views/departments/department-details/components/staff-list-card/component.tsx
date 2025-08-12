import React from 'react';
import { Card, CardContent, Box, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface StaffListCardProps {
  title: string;
  staff: any[];
  onStaffClick: (staffId: string) => void;
  color?: 'primary' | 'secondary';
  staffType: 'doctor' | 'assistant';
}

export const StaffListCard: React.FC<StaffListCardProps> = ({
  title,
  staff,
  onStaffClick,
  color = 'primary',
  staffType
}) => {
  return (
    <Card elevation={1} sx={{ width: "300px", height: "500px" }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <PersonIcon color={color} />
          <Typography variant="h6" fontWeight={600}>
            {title} ({staff.length})
          </Typography>
        </Box>
        {staff.length > 0 ? (
          <List dense sx={{ maxHeight: 320, overflow: 'auto' }}>
            {staff.map((person) => (
              <ListItem 
                key={person!.id} 
                sx={{ 
                  px: 0, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'grey.50', borderRadius: 1 }
                }}
                onClick={() => onStaffClick(person!.id)}
              >
                <Avatar
                  src={person!.profileImg}
                  sx={{ width: 40, height: 40, mr: 2 }}
                >
                  {`${person!.firstName[0]}${person!.lastName[0]}`}
                </Avatar>
                <ListItemText
                  primary={staffType === 'doctor' ? `Dr. ${person!.firstName} ${person!.lastName}` : `${person!.firstName} ${person!.lastName}`}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {staffType === 'doctor' ? (person!.designation || 'Doctor') : 'Assistant'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {person!.email}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="body2" color="text.secondary">
              No {staffType === 'doctor' ? 'doctors' : 'assistants'} assigned to this department
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};