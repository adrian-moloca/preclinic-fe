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
  Alert,
  Fade,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import ProfileImageUploader from "../../../components/profile-image";
import { City, Country, State } from "country-state-city";
import { DividerFormWrapper } from "../../../components/create-leaves-form/style";
import { useNavigate } from "react-router-dom";
import { Profile } from "../../../providers/profile/types";
import { useProfileContext } from "../../../providers/profile";
import { useAuthContext } from "../../../providers/auth/context";
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
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const navigate = useNavigate();
  const { user } = useAuthContext();
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
    console.log('ProfileSettings mounting...');
    console.log('Current profiles:', profiles);
    console.log('Current user:', user);
    
    const registrationData = localStorage.getItem('registrationData');
    console.log('Registration data:', registrationData);
    
    if (registrationData) {
      const data = JSON.parse(registrationData);
      console.log('Setting onboarding mode with data:', data);
      setIsOnboarding(true);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setEmail(data.email || '');
      setIsEditing(false);
    } else if (currentProfile) {
      console.log('Loading existing profile:', currentProfile);
      setImage(currentProfile.image || null);
      setFirstName(currentProfile.firstName || "");
      setLastName(currentProfile.lastName || "");
      setPhoneNumber(currentProfile.phoneNumber || "");
      setEmail(currentProfile.email || "");
      setCountry(currentProfile.country || "");
      setState(currentProfile.state || "");
      setCity(currentProfile.city || "");
      setAddress(currentProfile.address || "");
      setIsEditing(true);
      setIsOnboarding(false);
    } else if (user) {
      console.log('No profile found, using user data:', user);
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setIsEditing(false);
      setIsOnboarding(false);
    }
    
    setIsLoading(false);
  }, [currentProfile, user, profiles]);

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
    city &&
    address.trim();

  const handleSubmit = async () => {
    if (!isFormValid) {
      setSaveMessage("Please fill in all required fields correctly.");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const profileData: Profile = {
        id: currentProfileId || crypto.randomUUID(),
        image: image ?? "",
        firstName,
        lastName,
        phoneNumber,
        email,
        country,
        state,
        city,
        address,
      };

      console.log('Saving profile data:', profileData);

      if (isEditing && currentProfileId) {
        console.log('Updating existing profile...');
        await updateProfile(currentProfileId, profileData);
        setSaveMessage("Profile updated successfully!");
      } else {
        console.log('Creating new profile...');
        await addProfile(profileData);
        setSaveMessage("Profile created successfully!");
      }

      setTimeout(() => setSaveMessage(""), 3000);

      setTimeout(() => {
        if (isOnboarding) {
          const registrationData = localStorage.getItem('registrationData');
          const userData = registrationData ? JSON.parse(registrationData) : user;
          localStorage.removeItem('registrationData');
          
          if (userData?.role === 'doctor_owner') {
            console.log('Navigating to clinic creation...');
            navigate('/create-clinic');
          } else {
            console.log('Navigating to dashboard...');
            navigate('/');
          }
        } else {
          console.log('Navigating to dashboard...');
          navigate("/");
        }
      }, 1500);

    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage("Failed to save profile. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
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
          {isOnboarding ? "Complete Your Profile" : (isEditing ? "Edit Profile" : "Create Profile")}
        </Typography>
        {isOnboarding && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please complete your profile information to continue setting up your account
          </Typography>
        )}

        {/* Success/Error Message */}
        <Fade in={!!saveMessage}>
          <Box>
            <Alert severity={saveMessage.includes('success') ? 'success' : 'error'}>
              {saveMessage}
            </Alert>
          </Box>
        </Fade>

        <DividerFormWrapper />
        <ProfileImageUploader image={image} setImage={setImage} />

        <FormFieldWrapper>
          <SectionsWrapper>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ flex: 1, marginY: 1 }}
              required
              disabled={isOnboarding}
              helperText={isOnboarding ? "From registration" : ""}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{ flex: 1, marginY: 1 }}
              required
              disabled={isOnboarding}
              helperText={isOnboarding ? "From registration" : ""}
            />
          </SectionsWrapper>

          <SectionsWrapper>
            <TextField
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{ flex: 1, marginY: 1 }}
              error={!!phoneError}
              helperText={phoneError}
              required
              placeholder="+40 123 456 789"
            />
            <TextField
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ flex: 1, marginY: 1 }}
              error={!!emailError}
              helperText={emailError || (isOnboarding ? "From registration" : "")}
              required
              disabled={isOnboarding}
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
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              sx={{ flex: 1, marginY: 1 }}
              required
              placeholder="Street address"
            />
          </SectionsWrapper>
        </FormFieldWrapper>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!isFormValid || isSaving}
          sx={{ marginTop: 2 }}
        >
          {isSaving 
            ? "Saving..." 
            : isOnboarding 
              ? "Continue to Next Step" 
              : (isEditing ? "Update Profile" : "Create Profile")
          }
        </Button>
      </StyledPaper>
    </Box>
  );
};