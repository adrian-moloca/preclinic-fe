import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Description } from '@mui/icons-material';

interface DescriptionCardProps {
    description: string;
}

export const DescriptionCard: React.FC<DescriptionCardProps> = ({ description }) => {
    return (
        <Card sx={{ boxShadow: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Description color="primary" />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        Description
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'grey.700', lineHeight: 1.6 }}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};