/* eslint-disable react-hooks/rules-of-hooks */
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileImageUploader from "../profile-image";
import { Country, State, City } from "country-state-city";
import { usePatientsContext } from "../../providers/patients";
import {
  FormFieldWrapper,
} from "../create-patient-form/style";
import { DividerFormWrapper, PaperFormWrapper } from "../create-leaves-form/style";

export const EditPatientForm: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatient } = usePatientsContext();

  const [formData, setFormData] = useState<any>(null);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Get all patients from the context
    const allPatients = Object.values(patients).flat();
    const patient = allPatients.find((p: any) => p._id === id);
    
    if (patient) {
      // Extract the actual patient data from the user object
      const patientData = (patient as any).user || patient;
      
      // Set form data with the extracted patient data
      setFormData({
        _id: patient._id, // Keep the patient ID
        firstName: patientData.firstName || '',
        lastName: patientData.lastName || '',
        email: patientData.email || '',
        phoneNumber: patientData.phoneNumber || '',
        birthDate: patientData.birthDate || '',
        gender: patientData.gender || '',
        bloodGroup: patientData.bloodGroup || '',
        address: patientData.address || '',
        city: patientData.city || '',
        state: patientData.state || '',
        country: patientData.country || '',
        zipCode: patientData.zipCode || '',
        profileImg: patientData.profileImg || '',
        allergies: patientData.allergies || '',
        medicalHistory: patientData.medicalHistory || '',
        currentMedications: patientData.currentMedications || '',
      });
    }
    setLoading(false);
  }, [id, patients]);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validatePhone = (value: string) =>
    /^[0-9+\-()\s]{10,}$/.test(value);

  useEffect(() => {
    if (formData) {
      setEmailError(
        formData.email && !validateEmail(formData.email) ? "Invalid email format" : ""
      );
      setPhoneError(
        formData.phoneNumber && !validatePhone(formData.phoneNumber) ? "Invalid phone number" : ""
      );
    }
  }, [formData?.email, formData?.phoneNumber, formData]);

  const updateField = (field: string, value: string) => {
    setFormData((prev: any) => (prev ? { ...prev, [field]: value } : prev));
  };

  const countries = Country.getAllCountries();
  const selectedCountry = countries.find(
    (c) => c.name === formData?.country
  );
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];
  const selectedState = states.find((s) => s.name === formData?.state);
  const cities =
    selectedState && selectedCountry
      ? City.getCitiesOfState(
        selectedCountry.isoCode,
        selectedState.isoCode
      )
      : [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!formData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Patient not found</Typography>
      </Box>
    );
  }

  const isFormValid =
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    formData.phoneNumber?.trim() &&
    formData.email?.trim() &&
    validatePhone(formData.phoneNumber) &&
    validateEmail(formData.email) &&
    formData.birthDate &&
    formData.gender &&
    formData.bloodGroup &&
    formData.address &&
    formData.zipCode &&
    formData.country &&
    formData.state &&
    formData.city;

  const handleSubmit = async () => {
    if (!isFormValid || !formData) return;

    try {
      // Prepare the data in the correct format for the API
      const updateData = {
        _id: formData._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        birthDate: formData.birthDate,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
        profileImg: formData.profileImg,
        allergies: formData.allergies,
        medicalHistory: formData.medicalHistory,
        currentMedications: formData.currentMedications,
      };

      updatePatient(updateData);
      navigate("/patients/all-patients");
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <PaperFormWrapper>
        <Typography variant="h4">Edit Patient</Typography>
        <DividerFormWrapper />

        <ProfileImageUploader
          image={formData.profileImg}
          setImage={(img) => updateField("profileImg", img)}
        />

        <FormFieldWrapper>
          <TextField
            label="First Name"
            value={formData.firstName || ''}
            onChange={(e) => updateField("firstName", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            required
          />
          <TextField
            label="Last Name"
            value={formData.lastName || ''}
            onChange={(e) => updateField("lastName", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            required
          />
          <TextField
            label="Phone Number"
            value={formData.phoneNumber || ''}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            error={!!phoneError}
            helperText={phoneError}
            required
          />
          <TextField
            label="Email Address"
            value={formData.email || ''}
            onChange={(e) => updateField("email", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            error={!!emailError}
            helperText={emailError}
            required
          />
          <TextField
            label="Birth Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.birthDate || ''}
            onChange={(e) => updateField("birthDate", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            required
          />

          <FormControl sx={{ width: 500, marginY: 1 }} required>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              value={formData.gender || ''}
              label="Gender"
              onChange={(e) => updateField("gender", e.target.value)}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="prefer-not">Prefer not to say</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: 500, marginY: 1 }} required>
            <InputLabel id="blood-group-label">Blood Group</InputLabel>
            <Select
              labelId="blood-group-label"
              value={formData.bloodGroup || ''}
              label="Blood Group"
              onChange={(e) => updateField("bloodGroup", e.target.value)}
            >
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Address"
            value={formData.address || ''}
            onChange={(e) => updateField("address", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            required
          />
          <TextField
            label="Zip Code"
            value={formData.zipCode || ''}
            onChange={(e) => updateField("zipCode", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            required
          />

          <FormControl sx={{ width: 500, marginY: 1 }} required>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              value={formData.country || ''}
              label="Country"
              onChange={(e) => {
                updateField("country", e.target.value);
                updateField("state", "");
                updateField("city", "");
              }}
            >
              {countries.map((c) => (
                <MenuItem key={c.isoCode} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            sx={{ width: 500, marginY: 1 }}
            disabled={!formData.country}
            required
          >
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              value={formData.state || ''}
              label="State"
              onChange={(e) => {
                updateField("state", e.target.value);
                updateField("city", "");
              }}
            >
              {states.map((s) => (
                <MenuItem key={s.isoCode} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            sx={{ width: 500, marginY: 1 }}
            disabled={!formData.state}
            required
          >
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              value={formData.city || ''}
              label="City"
              onChange={(e) => updateField("city", e.target.value)}
            >
              {cities.map((c) => (
                <MenuItem key={c.name} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Optional Medical Information */}
          <TextField
            label="Allergies"
            value={formData.allergies || ''}
            onChange={(e) => updateField("allergies", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            multiline
            rows={2}
          />
          <TextField
            label="Medical History"
            value={formData.medicalHistory || ''}
            onChange={(e) => updateField("medicalHistory", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            multiline
            rows={2}
          />
          <TextField
            label="Current Medications"
            value={formData.currentMedications || ''}
            onChange={(e) => updateField("currentMedications", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            multiline
            rows={2}
          />
        </FormFieldWrapper>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Save Changes
        </Button>
      </PaperFormWrapper>
    </Box>
  );
};