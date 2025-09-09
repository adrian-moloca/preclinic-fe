import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    Alert,
    Select,
    MenuItem,
    Grid,
    FormHelperText,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LogoWrapper, RemindMeWrapper } from "../sign-in/style";
import Logo from "../../../assets/preclinic-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import SocialButtons from "../../../components/social-buttons";
import { RegisterWrapper, SignInSectionWrapper, TitleWrapper } from "./style";
import { useAuthContext } from "../../../providers/auth/context";
import { UserRole } from "../../../providers/auth/types";
import { CustomPaper } from "../../settings/components/general-settings/components/clinic-information/style";
import { City, Country, State } from "country-state-city";

export const Register: FC = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuthContext();

    // Form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [profileImg,] = useState("");
    // role defaults to "doctor_owner"
    const [role] = useState<UserRole>("doctor_owner");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [termsChecked, setTermsChecked] = useState(false);
    const [error, setError] = useState("");

    // Validation errors
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [birthDateError, setBirthDateError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [bloodGroupError, setBloodGroupError] = useState("");
    const [countryError, setCountryError] = useState("");
    const [stateError, setStateError] = useState("");
    const [cityError, setCityError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    // Country/State/City logic
    const countries = Country.getAllCountries();
    const selectedCountry = countries.find((c) => c.name === country);
    const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
    const selectedState = states.find((s) => s.name === state);
    const cities = selectedState && selectedCountry
        ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
        : [];

    const handleCountryChange = (countryName: string) => {
        setCountry(countryName);
        setState("");
        setCity("");
        setCountryError("");
    };

    const handleStateChange = (stateName: string) => {
        setState(stateName);
        setCity("");
        setStateError("");
    };

    const handleCityChange = (cityName: string) => {
        setCity(cityName);
        setCityError("");
    };

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePassword = (pwd: string) => {
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        return hasUpperCase && hasSpecialChar && pwd.length >= 8;
    };

    useEffect(() => {
        const isFormValid =
            firstName && lastName && email && phoneNumber && birthDate &&
            gender && bloodGroup && country && state && city && address &&
            password && confirmPassword &&
            validateEmail(email) && validatePassword(password) &&
            password === confirmPassword && termsChecked;
        setIsButtonDisabled(!isFormValid);
    }, [
        firstName, lastName, email, phoneNumber, birthDate, gender, bloodGroup,
        country, state, city, address, password, confirmPassword, termsChecked
    ]);

    const handleSubmit = async () => {
        let hasError = false;
        setError("");

        if (!firstName) { setFirstNameError("First name is required"); hasError = true; } else { setFirstNameError(""); }
        if (!lastName) { setLastNameError("Last name is required"); hasError = true; } else { setLastNameError(""); }
        if (!email) { setEmailError("Email is required"); hasError = true; }
        else if (!validateEmail(email)) { setEmailError("Enter a valid email"); hasError = true; } else { setEmailError(""); }
        if (!phoneNumber) { setPhoneNumberError("Phone number is required"); hasError = true; } else { setPhoneNumberError(""); }
        if (!birthDate) { setBirthDateError("Birth date is required"); hasError = true; } else { setBirthDateError(""); }
        if (!gender) { setGenderError("Gender is required"); hasError = true; } else { setGenderError(""); }
        if (!bloodGroup) { setBloodGroupError("Blood group is required"); hasError = true; } else { setBloodGroupError(""); }
        if (!country) { setCountryError("Country is required"); hasError = true; } else { setCountryError(""); }
        if (!state) { setStateError("State is required"); hasError = true; } else { setStateError(""); }
        if (!city) { setCityError("City is required"); hasError = true; } else { setCityError(""); }
        if (!address) { setAddressError("Address is required"); hasError = true; } else { setAddressError(""); }
        if (!password) { setPasswordError("Password is required"); hasError = true; }
        else if (!validatePassword(password)) { setPasswordError("Password must contain uppercase, special character and be 8+ chars"); hasError = true; } else { setPasswordError(""); }
        if (!confirmPassword) { setConfirmPasswordError("Confirm password is required"); hasError = true; }
        else if (password !== confirmPassword) { setConfirmPasswordError("Passwords do not match"); hasError = true; } else { setConfirmPasswordError(""); }

        if (!hasError) {
            try {
                // Build payload, profileImg only if present
                const payload: any = {
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    birthDate,
                    gender,
                    bloodGroup,
                    country,
                    state,
                    city,
                    address,
                    zipCode,
                    role,
                    password,
                };
                if (profileImg) payload.profileImg = profileImg;

                console.log('🚀 Registering with payload:', payload);
                const success = await register(payload);

                if (success) {
                    console.log('✅ Registration successful, navigating to dashboard');
                    navigate('/dashboard');
                } else {
                    setError("Registration failed. Email or phone may already be in use.");
                }
            } catch (err) {
                console.error('❌ Registration error:', err);
                setError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <RegisterWrapper>
            <LogoWrapper>
                <img src={Logo} alt="Preclinic Logo" style={{ width: 120 }} />
            </LogoWrapper>

            <CustomPaper>
                <TitleWrapper>
                    <Typography variant="h5" fontWeight={600}>
                        Create Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Join Preclinic and start managing your healthcare practice
                    </Typography>
                </TitleWrapper>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: "100%" }}>
                    <Box display="flex" gap={2} width="100%">
                        <Grid>
                            <TextField
                                fullWidth
                                label="First Name"
                                placeholder="Enter Your First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                error={!!firstNameError}
                                helperText={firstNameError}
                                sx={{ width: "300px" }}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                fullWidth
                                label="Last Name"
                                placeholder="Enter Your Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                error={!!lastNameError}
                                helperText={lastNameError}
                                sx={{ width: '300px' }}
                            />
                        </Grid>
                    </Box>
                    <Box display="flex" gap={2} width="100%">
                        <Grid>
                            <TextField
                                fullWidth
                                label="Email Address"
                                placeholder="Enter Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!emailError}
                                helperText={emailError}
                                sx={{ width: '300px' }}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                placeholder="Enter Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                error={!!phoneNumberError}
                                helperText={phoneNumberError}
                                sx={{ width: '300px' }}
                            />
                        </Grid>
                    </Box>
                    <Box display="flex" gap={2} width="100%">
                        <Grid>
                            <TextField
                                fullWidth
                                label="Birth Date"
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                error={!!birthDateError}
                                helperText={birthDateError}
                                InputLabelProps={{ shrink: true }}
                                sx={{ width: '300px' }}
                            />
                        </Grid>
                        <Grid>
                            <FormControl error={!!genderError} sx={{ width: "300px" }}>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    value={gender}
                                    label="Gender"
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                                {genderError && (
                                    <FormHelperText error>
                                        {genderError}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Box>
                    <Box display="flex" gap={2} width="100%">
                        <Grid>
                            <FormControl error={!!bloodGroupError} sx={{ width: "300px" }}>
                                <InputLabel>Blood Group</InputLabel>
                                <Select
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
                                {bloodGroupError && (
                                    <FormHelperText error>
                                        {bloodGroupError}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid>
                            <FormControl sx={{ width: "300px" }} required error={!!countryError}>
                                <InputLabel id="country-label">Country</InputLabel>
                                <Select
                                    labelId="country-label"
                                    value={country}
                                    label="Country"
                                    onChange={(e) => handleCountryChange(e.target.value as string)}
                                >
                                    {countries.map((c) => (
                                        <MenuItem key={c.isoCode} value={c.name}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {countryError && (
                                    <FormHelperText error>
                                        {countryError}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Box>
                    <Box display="flex" gap={2} width="100%">
                        <Grid>
                            <FormControl sx={{ width: "300px" }} disabled={!country} required error={!!stateError}>
                                <InputLabel id="state-label">State/Province</InputLabel>
                                <Select
                                    labelId="state-label"
                                    value={state}
                                    label="State/Province"
                                    onChange={(e) => handleStateChange(e.target.value as string)}
                                >
                                    {states.map((s) => (
                                        <MenuItem key={s.isoCode} value={s.name}>
                                            {s.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {stateError && (
                                    <FormHelperText error>
                                        {stateError}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid>
                            <FormControl sx={{ width: "300px" }} disabled={!state} required error={!!cityError}>
                                <InputLabel id="city-label">City</InputLabel>
                                <Select
                                    labelId="city-label"
                                    value={city}
                                    label="City"
                                    onChange={(e) => handleCityChange(e.target.value as string)}
                                >
                                    {cities.map((c) => (
                                        <MenuItem key={c.name} value={c.name}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {cityError && (
                                    <FormHelperText error>
                                        {cityError}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Box>
                    <Box display="flex" gap={2} width="100%">
                        <Grid>
                            <TextField
                                fullWidth
                                label="Address"
                                placeholder="Enter Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                error={!!addressError}
                                helperText={addressError}
                                sx={{ width: '300px' }}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                fullWidth
                                label="Zip Code"
                                placeholder="Enter Zip Code"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                sx={{ width: '300px' }}
                            />
                        </Grid>
                    </Box>
                </Grid>

                <Box display="flex" gap={2} mt={2}>
                    <Box sx={{ width: "300px" }}>
                        <FormControl variant="outlined" fullWidth error={!!passwordError}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            {passwordError && (
                                <FormHelperText error>
                                    {passwordError}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {password && (
                            <Box mt={1}>
                                <Typography variant="caption" color={/[A-Z]/.test(password) ? "success.main" : "error"}>
                                    • Contains uppercase letter
                                </Typography>
                                <br />
                                <Typography variant="caption" color={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "success.main" : "error"}>
                                    • Contains special character
                                </Typography>
                                <br />
                                <Typography variant="caption" color={password.length >= 8 ? "success.main" : "error"}>
                                    • At least 8 characters
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ width: "300px" }}>
                        <FormControl variant="outlined" fullWidth error={!!confirmPasswordError}>
                            <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                            <OutlinedInput
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Confirm Password"
                            />
                            {confirmPasswordError && (
                                <FormHelperText error>
                                    {confirmPasswordError}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Box>
                </Box>

                <RemindMeWrapper>
                    <Checkbox
                        size="small"
                        checked={termsChecked}
                        onChange={(e) => setTermsChecked(e.target.checked)}
                    />
                    <Typography variant="body2">
                        I agree to the{" "}
                        <Link to="/terms-and-conditions" style={{ color: "#2C2C9E" }}>
                            Terms of Service
                        </Link>{" "}
                        &{" "}
                        <Link to="/privacy-policy" style={{ color: "#2C2C9E" }}>
                            Privacy Policy
                        </Link>
                    </Typography>
                </RemindMeWrapper>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, bgcolor: "#2C2C9E", textTransform: "none" }}
                    disabled={isButtonDisabled || loading}
                    onClick={handleSubmit}
                >
                    {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <Divider sx={{ my: 2 }}>OR</Divider>

                <SocialButtons />

                <SignInSectionWrapper>
                    <Typography>
                        Already have an account?{" "}
                        <Link to="/sign-in" style={{ color: "#2C2C9E" }}>
                            Login
                        </Link>
                    </Typography>
                </SignInSectionWrapper>
            </CustomPaper>

            <Box>
                <Typography variant="caption" color="text.secondary" mt={4}>
                    Copyright © 2025 – Preclinic. All rights reserved.
                </Typography>
            </Box>
        </RegisterWrapper>
    );
};