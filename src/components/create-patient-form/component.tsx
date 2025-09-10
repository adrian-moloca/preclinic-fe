import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import ProfileImageUploader from "../profile-image";
import { Country, State, City } from "country-state-city";
import { PatientsEntry } from "../../providers/patients/types";
import { usePatientsContext } from "../../providers/patients";
import { useNavigate } from "react-router-dom";
import { PatentDetailsWrapper, CreatePatientFormWrapper } from "./style";
import { DividerFormWrapper, PaperFormWrapper } from "../create-leaves-form/style";

export const CreatePatientForm: FC = () => {
  const { addPatient } = usePatientsContext();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [profileImg, setProfileImg] = useState("");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const countries = Country.getAllCountries();
  const selectedCountry = countries.find((c) => c.name === country);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const selectedState = states.find((s) => s.name === state);
  const cities = selectedState && selectedCountry
    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
    : [];

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^[0-9+\-()\s]{10,15}$/;
    return phoneRegex.test(value);
  };

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    phoneNumber.trim() &&
    email.trim() &&
    validatePhone(phoneNumber) &&
    validateEmail(email) &&
    birthDate &&
    gender &&
    bloodGroup &&
    address &&
    zipCode &&
    country &&
    state &&
    city;

  const handleSubmit = () => {
    if (!isFormValid) return;

    // FIXED: Removed id generation - backend will handle it
    const patient: Omit<PatientsEntry, 'id'> = {
      profileImg,
      firstName,
      lastName,
      phoneNumber,
      email,
      birthDate,
      gender,
      bloodGroup,
      address,
      zipCode,
      country,
      state,
      city,
      _id: ""
    };

    addPatient(patient as PatientsEntry); // Cast since addPatient expects full PatientsEntry
    navigate("/patients/all-patients");
  };

  useEffect(() => {
    setEmailError(email && !validateEmail(email) ? "Invalid email format" : "");
    setPhoneError(phoneNumber && !validatePhone(phoneNumber) ? "Invalid phone number" : "");
  }, [email, phoneNumber]);

  return (
    <CreatePatientFormWrapper>
      <PaperFormWrapper>
        <Typography variant="h5" gutterBottom>
          Create Patient
        </Typography>
        <DividerFormWrapper />
        
        <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
          <ProfileImageUploader image={profileImg} setImage={setProfileImg} />
        </Box>

        <PatentDetailsWrapper>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            sx={{ width: 500, marginY: 1 }}
            required
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            sx={{ width: 500, marginY: 1 }}
            required
          />
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={!!phoneError}
            helperText={phoneError}
            fullWidth
            sx={{ width: 500, marginY: 1 }}
            required
          />
          <TextField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            fullWidth
            sx={{ width: 500, marginY: 1 }}
            required
          />
          <TextField
            label="Birth Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            fullWidth
            sx={{ width: 500, marginY: 1 }}
            required
          />
          <FormControl fullWidth sx={{ width: 500, marginY: 1 }} required>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select 
              labelId="gender-label" 
              value={gender} 
              label="Gender" 
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="prefer-not">Prefer not to say</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ width: 500, marginY: 1 }} required>
            <InputLabel id="blood-group-label">Blood Group</InputLabel>
            <Select 
              labelId="blood-group-label" 
              value={bloodGroup} 
              label="Blood Group" 
              onChange={(e) => setBloodGroup(e.target.value)}
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            sx={{ width: 500, marginY: 1 }}
            required
            rows={2}
          />
          <FormControl fullWidth sx={{ width: 500, marginY: 1 }} required>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              value={country}
              label="Country"
              onChange={(e) => {
                setCountry(e.target.value);
                setState("");
                setCity("");
              }}
            >
              {countries.map((c) => (
                <MenuItem key={c.isoCode} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ width: 500, marginY: 1 }} disabled={!country} required>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              value={state}
              label="State"
              onChange={(e) => {
                setState(e.target.value);
                setCity("");
              }}
            >
              {states.map((s) => (
                <MenuItem key={s.isoCode} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ width: 500, marginY: 1 }} disabled={!state} required>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              value={city}
              label="City"
              onChange={(e) => setCity(e.target.value)}
            >
              {cities.map((c) => (
                <MenuItem key={c.name} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            fullWidth
            sx={{ width: 500, marginY: 1 }}
            required
          />
        </PatentDetailsWrapper>

        <Box display="flex" gap={2} justifyContent={"center"}>
          <Button 
            variant="outlined" 
            onClick={() => navigate("/patients/all-patients")}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Create Patient
          </Button>
        </Box>
      </PaperFormWrapper>
    </CreatePatientFormWrapper>
  );
};