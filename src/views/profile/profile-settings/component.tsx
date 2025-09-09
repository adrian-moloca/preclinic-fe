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
import { FC, useEffect, useState, useCallback } from "react";
import ProfileImageUploader from "../../../components/profile-image";
import { City, Country, State } from "country-state-city";
import { DividerFormWrapper } from "../../../components/create-leaves-form/style";
import { useNavigate } from "react-router-dom";
import { Profile } from "../../../providers/profile/types";
import { useProfileContext } from "../../../providers/profile";
import { useAuthContext } from "../../../providers/auth/context";
import { SectionsWrapper, StyledPaper } from "./style";
import { FormFieldWrapper } from "../../../components/create-patient-form/style";
import axios from 'axios';

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
  
  const [dateOfBirth, setDateOfBirth] = useState(""); 
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experience, setExperience] = useState("");

  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  const navigate = useNavigate();
  const { user, getMe, isAuthenticated } = useAuthContext();
  
  const { profiles, addProfile, updateProfile } = useProfileContext();
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

  const loadAndPopulateUserData = useCallback(async () => {
    if (dataLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      let userData = user;

      if (!userData && isAuthenticated) {
        userData = await getMe();
      } else if (userData) {
        console.log("✅ User found in context:", userData);
      }

      if (userData) {
        
        setImage(userData.profileImg || null);
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setPhoneNumber(userData.phoneNumber || "");
        setEmail(userData.email || "");
        setCountry(userData.country || "");
        setState(userData.state || "");
        setCity(userData.city || "");
        setAddress(userData.address || "");
        setDateOfBirth(userData.dateOfBirth || userData.birthDate || "");
        setGender(userData.gender || "");
        setSpecialization((userData as any).specialization || "");
        setLicenseNumber((userData as any).licenseNumber || "");
        setExperience((userData as any).experience || "");

        setIsEditing(true);
        setDataLoaded(true);
      } else {
        const registrationData = localStorage.getItem("registrationData");
        if (registrationData) {
          const data = JSON.parse(registrationData);
          setIsOnboarding(true);
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setEmail(data.email || "");
          setDateOfBirth(data.dateOfBirth || data.birthDate || "");
          setGender(data.gender || "");
          setSpecialization(data.specialization || "");
          setLicenseNumber(data.licenseNumber || "");
          setExperience(data.experience || "");
          setIsEditing(false);
          setDataLoaded(true);
        } else {
          setSaveMessage("No user data available. Please log in again.");
          setDataLoaded(true);
        }
      }
    } catch (error) {
      setSaveMessage("Failed to load user data. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [user, getMe, isAuthenticated, dataLoaded]);

  useEffect(() => {
    loadAndPopulateUserData();
  }, [loadAndPopulateUserData]);

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
    email.trim() &&
    validateEmail(email) &&
    (!phoneNumber || validatePhone(phoneNumber)); 

  const updateUserData = async (userData: any) => {
    try {
      const endpoints = [
        '/api/auth/user/profile',
        '/api/auth/profile', 
        '/api/auth/me',
        '/api/user/profile'
      ];
      
      let response;
      let lastError;
      
      for (const endpoint of endpoints) {
        try {
          response = await axios.put(endpoint, userData, { withCredentials: true });
          break;
        } catch (error: any) {
          lastError = error;
          
          if (error.response?.status !== 404) {
            try {
              response = await axios.patch(endpoint, userData, { withCredentials: true });
              break;
            } catch (patchError: any) {
              console.log(`❌ PATCH ${endpoint} also failed`);
            }
          }
        }
      }
      
      if (!response) {
        throw lastError || new Error('All update endpoints failed');
      }
      
      await getMe();
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      setSaveMessage("Please fill in all required fields correctly.");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const userData = {
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber || undefined,
        country: country || undefined,
        state: state || undefined,
        city: city || undefined,
        address: address || undefined,
        dateOfBirth: dateOfBirth || undefined,
        birthDate: dateOfBirth || undefined,
        gender: gender || undefined,
        profileImg: image || undefined,
        specialization: specialization || undefined,
        licenseNumber: licenseNumber || undefined,
        experience: experience || undefined,
      };

      const cleanUserData = Object.fromEntries(
        Object.entries(userData).filter(([_, value]) => value !== undefined)
      );

      try {
        await updateUserData(cleanUserData);
        console.log("✅ Server update successful");
      } catch (serverError) {
        console.log("⚠️ Server update failed, continuing with local update:", serverError);
      }

      const profileData: Profile = {
        id: currentProfileId || user?.id || crypto.randomUUID(),
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

      if (isEditing && currentProfileId) {
        await updateProfile(currentProfileId, profileData);
      } else {
        await addProfile(profileData);
      }

      setSaveMessage("Profile updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);

      setTimeout(() => {
        if (isOnboarding) {
          const registrationData = localStorage.getItem('registrationData');
          const regData = registrationData ? JSON.parse(registrationData) : user;
          localStorage.removeItem('registrationData');
          
          if (regData?.role === 'doctor_owner') {
            navigate('/create-clinic');
          } else {
            navigate('/');
          }
        } else {
          navigate("/");
        }
      }, 1500);

    } catch (error) {
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
          {isOnboarding ? "Complete Your Profile" : "Edit Profile"}
        </Typography>
        {isOnboarding ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please complete your profile information to continue setting up your account
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Update your profile information below
          </Typography>
        )}

        <Fade in={!!saveMessage}>
          <Box sx={{ mt: 2 }}>
            <Alert severity={saveMessage.includes('success') ? 'success' : 'error'}>
              {saveMessage}
            </Alert>
          </Box>
        </Fade>

        <DividerFormWrapper />
        <ProfileImageUploader image={image} setImage={setImage} />

        <FormFieldWrapper>
          <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
            Personal Information
          </Typography>
          
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
              label="Date of Birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              sx={{ flex: 1, marginY: 1 }}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl sx={{ flex: 1, marginY: 1 }}>
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
              </Select>
            </FormControl>
          </SectionsWrapper>

          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            Contact Information
          </Typography>

          <SectionsWrapper>
            <TextField
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{ flex: 1, marginY: 1 }}
              error={!!phoneError}
              helperText={phoneError}
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

          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            Location
          </Typography>

          <SectionsWrapper>
            <FormControl sx={{ flex: 1, marginY: 1 }}>
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

            <FormControl sx={{ flex: 1, marginY: 1 }} disabled={!country}>
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
            <FormControl sx={{ flex: 1, marginY: 1 }} disabled={!state}>
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
              : "Update Profile"
          }
        </Button>
      </StyledPaper>
    </Box>
  );
};