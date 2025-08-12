import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import { FC } from "react";
import { IDepartments } from "../../../../../providers/departments";

interface DepartmentInformationCardProps {
  departmentInfo: IDepartments;
}

export const DepartmentInformationCard: FC<DepartmentInformationCardProps> = ({
  departmentInfo
}) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Department Information
        </Typography>
        
        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid>
            <Typography variant="subtitle2" color="text.secondary">
              Department Name
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {departmentInfo.name}
            </Typography>
          </Grid>

          <Grid>
            <Typography variant="subtitle2" color="text.secondary">
              Head of Department
            </Typography>
            <Typography variant="body1">
              {departmentInfo.description || 'Not assigned'}
            </Typography>
          </Grid>

          <Grid>
            <Typography variant="subtitle2" color="text.secondary">
              Department Status
            </Typography>
            <Chip 
              label={departmentInfo.status.toUpperCase()}
              color={departmentInfo.status === 'active' ? 'success' : 'warning'}
              size="small"
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" color="text.secondary">
              Total Staff
            </Typography>
            <Typography variant="body1">
              {(departmentInfo.doctors?.length || 0) + (departmentInfo.assistants?.length || 0)} members
            </Typography>
          </Grid>
        </Grid>

        {departmentInfo.description && (
          <Box mt={3}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Department Description
            </Typography>
            <Typography variant="body2">
              {departmentInfo.description}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};