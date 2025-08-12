import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { FC } from "react";

interface ServiceDescriptionCardProps {
  description: string;
}

export const ServiceDescriptionCard: FC<ServiceDescriptionCardProps> = ({
  description
}) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Service Description
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
          {description || 'No description provided'}
        </Typography>
      </CardContent>
    </Card>
  );
};