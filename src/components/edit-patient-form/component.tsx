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
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileImageUploader from "../profile-image";
import { Country, State, City } from "country-state-city";
import { usePatientsContext } from "../../providers/patients";
import { PatientsEntry } from "../../providers/patients/types";
import {
  FormFieldWrapper,
} from "../create-patient-form/style";
import { DividerFormWrapper, PaperFormWrapper } from "../create-leaves-form/style";

export const EditPatientForm: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatient } = usePatientsContext();

  const [formData, setFormData] = useState<PatientsEntry | null>(null);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (!id || !Array.isArray(patients)) return;

    const match = patients.find((patient) => String(patient.id) === String(id));

    if (match) {
      setFormData({ ...match });
    }
  }, [id, patients]);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validatePhone = (value: string) =>
    /^[0-9+\-()\s]{10}$/.test(value);

  useEffect(() => {
    if (formData) {
      setEmailError(
        !validateEmail(formData.email) ? "Invalid email format" : ""
      );
      setPhoneError(
        !validatePhone(formData.phoneNumber) ? "Invalid phone number" : ""
      );
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.email, formData?.phoneNumber]);

  const updateField = (field: keyof PatientsEntry, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
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

  if (!formData) return <p>Loading...</p>;

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.phoneNumber.trim() &&
    formData.email.trim() &&
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

  const handleSubmit = () => {
    if (!isFormValid || !formData) return;

    updatePatient(formData);
    navigate("/patients/all-patients");
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
            value={formData.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            required
          />
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            required
          />
          <TextField
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            error={!!phoneError}
            helperText={phoneError}
            required
          />
          <TextField
            label="Email Address"
            value={formData.email}
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
            value={formData.birthDate}
            onChange={(e) => updateField("birthDate", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            required
          />

          <FormControl sx={{ width: 500, marginY: 1 }} required>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              value={formData.gender}
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
              value={formData.bloodGroup}
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
            value={formData.address}
            onChange={(e) => updateField("address", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            required
          />
          <TextField
            label="Zip Code"
            value={formData.zipCode}
            onChange={(e) => updateField("zipCode", e.target.value)}
            sx={{ width: 500, marginY: 1 }}
            required
          />

          <FormControl sx={{ width: 500, marginY: 1 }} required>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              value={formData.country}
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
              value={formData.state}
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
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
            >
              {cities.map((c) => (
                <MenuItem key={c.name} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
