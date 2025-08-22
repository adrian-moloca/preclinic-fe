import React, { FC, useState } from "react";
import { Box, TextField, Button, Grid, MenuItem } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { usePatientsContext } from "../../providers/patients";
import { useNavigate } from "react-router-dom";
import AutoSaveFormWrapper from "../auto-save-form";

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  bloodGroup: string;
  allergies: string;
  currentMedications: string;
}

export const CreatePatientForm: FC = () => {
  const { addPatient } = usePatientsContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    bloodGroup: "",
    allergies: "",
    currentMedications: "",
  });

  const handleInputChange = (field: keyof PatientFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleRestoreDraft = (draftData: Record<string, any>) => {
    setFormData(draftData as PatientFormData);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const newPatient = {
      id: uuidv4(),
      ...formData,
      profileImg: "",
      createdAt: new Date().toISOString(),
    };

    addPatient(newPatient);
    navigate("/patients/all-patients");
  };

  return (
    <AutoSaveFormWrapper
      formType="create-patient"
      formData={formData}
      onRestoreDraft={handleRestoreDraft}
      autoSaveInterval={15000} 
    >
      <Box component="form" onSubmit={handleSubmit} p={3}>
        <Grid container spacing={3}>
          <Grid>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange("firstName")}
              required
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange("lastName")}
              required
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              required
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange("phoneNumber")}
              required
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Birth Date"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange("birthDate")}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              select
              label="Gender"
              value={formData.gender}
              onChange={handleInputChange("gender")}
              required
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={handleInputChange("address")}
              multiline
              rows={2}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={handleInputChange("city")}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="State"
              value={formData.state}
              onChange={handleInputChange("state")}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={handleInputChange("country")}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Zip Code"
              value={formData.zipCode}
              onChange={handleInputChange("zipCode")}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              select
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={handleInputChange("bloodGroup")}
            >
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
            </TextField>
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Allergies"
              value={formData.allergies}
              onChange={handleInputChange("allergies")}
              multiline
              rows={2}
              placeholder="List any known allergies..."
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Current Medications"
              value={formData.currentMedications}
              onChange={handleInputChange("currentMedications")}
              multiline
              rows={2}
              placeholder="List current medications..."
            />
          </Grid>
          <Grid>
            <Box display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Create Patient
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/patients/all-patients")}
                size="large"
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AutoSaveFormWrapper>
  );
};