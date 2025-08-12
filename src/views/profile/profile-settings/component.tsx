import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import ProfileImageUploader from "../../../components/profile-image";
import { City, Country, State } from "country-state-city";
import { DividerFormWrapper } from "../../../components/create-leaves-form/style";
import { useNavigate } from "react-router-dom";
import { Profile } from "../../../providers/profile/types";
import { useProfileContext } from "../../../providers/profile";
import { SectionsWrapper, StyledPaper } from "./style";
import { FormFieldWrapper } from "../../../components/create-patient-form/style";

export const ProfileSettings: FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const { profiles, addProfile, updateProfile } = useProfileContext();
  
  const currentProfile = Object.values(profiles)[0];
  const currentProfileId = Object.keys(profiles)[0];

  const countries = Country.getAllCountries();
  const selectedCountry = countries.find((c) => c.name === country);
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];
  const selectedState = states.find((s) => s.name === state);
  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
      : [];

  useEffect(() => {
    if (currentProfile) {
      setImage(currentProfile.image || null);
      setFirstName(currentProfile.firstName || "");
      setLastName(currentProfile.lastName || "");
      setPhoneNumber(currentProfile.phoneNumber || "");
      setEmail(currentProfile.email || "");
      setCountry(currentProfile.country || "");
      setState(currentProfile.state || "");
      setCity(currentProfile.city || "");
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
    setIsLoading(false);
  }, [currentProfile]);

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
    country &&
    state &&
    city;

  const handleSubmit = () => {
    const profileData: Omit<Profile, 'id'> = {
      image: image ?? "",
      firstName,
      lastName,
      phoneNumber,
      email,
      country,
      state,
      city,
    };

    if (isEditing && currentProfileId) {
      const updatedProfile: Profile = {
        ...profileData,
        id: currentProfileId,
      };
      updateProfile(currentProfileId, updatedProfile);
      console.log("Profile updated:", updatedProfile);
    } else {
      const newProfile: Profile = {
        ...profileData,
        id: crypto.randomUUID(),
      };
      addProfile(newProfile);
      console.log("Profile created:", newProfile);
    }

    navigate("/");
  };

  useEffect(() => {
    setEmailError(
      email && !validateEmail(email) ? "Invalid email format" : ""
    );
    setPhoneError(
      phoneNumber && !validatePhone(phoneNumber)
        ? "Invalid phone number"
        : ""
    );
  }, [email, phoneNumber]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box width={"100%"} display={"flex"} justifyContent={"center"}>
      <StyledPaper>
        <Typography variant="h4">
          {isEditing ? "Edit Profile" : "Create Profile"}
        </Typography>
        <DividerFormWrapper />
        <ProfileImageUploader image={image} setImage={setImage} />

        <FormFieldWrapper>
          <SectionsWrapper>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              sx={{ flex: 1, marginY: 1 }}
              required
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              sx={{ flex: 1, marginY: 1 }}
              required
            />
          </SectionsWrapper>

          <SectionsWrapper>
            <TextField
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
              sx={{ flex: 1, marginY: 1 }}
              error={!!phoneError}
              helperText={phoneError}
              required
            />
            <TextField
              label="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              sx={{ flex: 1, marginY: 1 }}
              error={!!emailError}
              helperText={emailError}
              required
            />
          </SectionsWrapper>

          <SectionsWrapper>
            <FormControl sx={{ flex: 1, marginY: 1 }} required>
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

            <FormControl sx={{ flex: 1, marginY: 1 }} disabled={!country} required>
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
          </SectionsWrapper>

          <SectionsWrapper>
            <FormControl sx={{ flex: 1, marginY: 1 }} disabled={!state} required>
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                value={city}
                label="City"
                onChange={(e) => {
                  setCity(e.target.value);
                }}
              >
                {cities.map((c) => (
                  <MenuItem key={c.name} value={c.name}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              sx={{ flex: 1, marginY: 1 }}
              required
            />
          </SectionsWrapper>
        </FormFieldWrapper>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!isFormValid}
          sx={{ marginTop: 2 }}
        >
          {isEditing ? "Update Profile" : "Create Profile"}
        </Button>
      </StyledPaper>
    </Box>
  );
};