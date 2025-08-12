import { FC } from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface EmployeeInfoCardProps {
    name: string;
    role: string;
    date: string;
    payrollId: string;
}

export const EmployeeInfoCard: FC<EmployeeInfoCardProps> = ({
    name,
    role,
    date,
    payrollId
}) => {
    return (
        <Card sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                    <PersonIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                        Employee Information
                    </Typography>
                </Box>
                
                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                        Employee Name
                    </Typography>
                    <Typography variant="h6" fontWeight={500}>
                        {name}
                    </Typography>
                </Box>

                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                        Position
                    </Typography>
                    <Chip 
                        label={role} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                    />
                </Box>

                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                        Payroll Date
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Typography variant="body1">
                            {date}
                        </Typography>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Payroll ID
                    </Typography>
                    <Typography variant="body1" fontFamily="monospace">
                        {payrollId}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};