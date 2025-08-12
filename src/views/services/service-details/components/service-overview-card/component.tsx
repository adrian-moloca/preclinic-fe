import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import { FC } from "react";
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { IServices } from "../../../../../providers/services";
import { IDepartments } from "../../../../../providers/departments";

interface ServiceOverviewCardProps {
  service: IServices;
  departmentInfo?: IDepartments | null;
  getStatusColor: (status: string) => string;
}

export const ServiceOverviewCard: FC<ServiceOverviewCardProps> = ({
  service,
  departmentInfo,
  getStatusColor
}) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Service Overview
        </Typography>
        
        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid>
            <Box display="flex" alignItems="center" mb={2}>
              <BusinessIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Department
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight={500}>
              {service.department}
            </Typography>
            {departmentInfo && (
              <Typography variant="body2" color="text.secondary">
                {departmentInfo.description}
              </Typography>
            )}
          </Grid>

          <Grid>
            <Box display="flex" alignItems="center" mb={2}>
              <AccessTimeIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Duration
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight={500}>
              {service.duration} minutes
            </Typography>
          </Grid>

          <Grid>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              Status
            </Typography>
            <Chip 
              label={service.status.toUpperCase()}
              color={getStatusColor(service.status) as any}
              size="medium"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};