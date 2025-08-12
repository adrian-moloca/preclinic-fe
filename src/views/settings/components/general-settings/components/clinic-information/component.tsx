import {
  Box,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { FC } from "react";
import {  CustomPaper, IconWrapper, TitleWrapper } from "./style";

interface ClinicInfo {
  clinicName: string;
  clinicDescription: string;
  clinicLogo: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
}

interface ClinicInformationProps {
  settings: ClinicInfo;
  onChange: (field: keyof ClinicInfo, value: string) => void;
}

export const ClinicInformation: FC<ClinicInformationProps> = ({
  settings,
  onChange,
}) => {
  return (
    <CustomPaper elevation={0}>
      <TitleWrapper>
        <IconWrapper>
          <BusinessIcon />
        </IconWrapper>
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary">
            Clinic Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your clinic's basic information and contact details
          </Typography>
        </Box>
      </TitleWrapper>

      <Grid container spacing={4} sx={{ display: "flex", justifyContent: "center" }}>
        <Grid>
          <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
            <Grid>
              <TextField
                fullWidth
                label="Clinic Name"
                value={settings.clinicName}
                onChange={(e) => onChange('clinicName', e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  width: 300
                }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Description"
                value={settings.clinicDescription}
                onChange={(e) => onChange('clinicDescription', e.target.value)}
                rows={3}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                  width: 300
                }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Address"
                value={settings.address}
                onChange={(e) => onChange('address', e.target.value)}
                InputProps={{
                  startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                  width: 300
                }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="City"
                value={settings.city}
                onChange={(e) => onChange('city', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                  width: 300
                }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="State"
                value={settings.state}
                onChange={(e) => onChange('state', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                  width: 300
                }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="ZIP Code"
                value={settings.zipCode}
                onChange={(e) => onChange('zipCode', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                  width: 300
                }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Phone"
                value={settings.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                  width: 300
                }}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Email"
                value={settings.email}
                onChange={(e) => onChange('email', e.target.value)}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                  width: 300
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CustomPaper>
  );
};