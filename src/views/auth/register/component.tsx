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
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CardWrapper, LogoWrapper, RemindMeWrapper } from "../sign-in/style";
import Logo from "../../../assets/preclinic-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import SocialButtons from "../../../components/social-buttons";
import { RegisterWrapper, SignInSectionWrapper, TitleWrapper } from "./style";
import { useAuthContext } from "../../../providers/auth/context";
import { UserRole } from "../../../providers/auth/types";

export const Register: FC = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuthContext();
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<UserRole>('owner-doctor');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [termsChecked, setTermsChecked] = useState(false);
    const [error, setError] = useState("");

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

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
        const isFormValid = firstName && lastName && email && password && confirmPassword && 
                           validateEmail(email) && validatePassword(password) && 
                           password === confirmPassword && termsChecked;
        setIsButtonDisabled(!isFormValid);
    }, [firstName, lastName, email, password, confirmPassword, termsChecked]);

    const handleSubmit = async () => {
        let hasError = false;
        setError("");

        if (!firstName) {
            setFirstNameError("First name is required");
            hasError = true;
        } else {
            setFirstNameError("");
        }

        if (!lastName) {
            setLastNameError("Last name is required");
            hasError = true;
        } else {
            setLastNameError("");
        }

        if (!email) {
            setEmailError("Email is required");
            hasError = true;
        } else if (!validateEmail(email)) {
            setEmailError("Enter a valid email");
            hasError = true;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("Password is required");
            hasError = true;
        } else if (!validatePassword(password)) {
            setPasswordError("Password must contain uppercase, special character and be 8+ chars");
            hasError = true;
        } else {
            setPasswordError("");
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Confirm password is required");
            hasError = true;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            hasError = true;
        } else {
            setConfirmPasswordError("");
        }

        if (!hasError) {
            try {
                const success = await register({
                    firstName,
                    lastName,
                    email,
                    password,
                    role,
                });

                if (success) {
                    // Store registration data for profile prefill
                    const registrationData = {
                        firstName,
                        lastName,
                        email,
                        role,
                        isNewRegistration: true,
                    };
                    localStorage.setItem('registrationData', JSON.stringify(registrationData));
                    
                    // Always redirect to profile settings first
                    navigate('/profile/settings');
                } else {
                    setError("Registration failed. Email may already be in use.");
                }
            } catch (err) {
                setError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <RegisterWrapper>
            <LogoWrapper>
                <img src={Logo} alt="Preclinic Logo" style={{ width: 120 }} />
            </LogoWrapper>

            <CardWrapper>
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

                <TextField
                    fullWidth
                    label="First Name"
                    placeholder="Enter Your First Name"
                    margin="normal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={!!firstNameError}
                    helperText={firstNameError}
                />

                <TextField
                    fullWidth
                    label="Last Name"
                    placeholder="Enter Your Last Name"
                    margin="normal"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={!!lastNameError}
                    helperText={lastNameError}
                />

                <TextField
                    fullWidth
                    label="Email Address"
                    placeholder="Enter Email Address"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Account Type</InputLabel>
                    <Select
                        value={role}
                        label="Account Type"
                        onChange={(e) => setRole(e.target.value as UserRole)}
                    >
                        <MenuItem value="owner-doctor">Owner-Doctor (Create New Clinic)</MenuItem>
                        <MenuItem value="doctor">Doctor</MenuItem>
                        <MenuItem value="assistant">Assistant</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" margin="normal" error={!!passwordError}>
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
                </FormControl>
                {passwordError && (
                    <Typography variant="caption" color="error" mt={0.5}>
                        {passwordError}
                    </Typography>
                )}
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

                <FormControl fullWidth variant="outlined" margin="normal" error={!!confirmPasswordError}>
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
                </FormControl>
                {confirmPasswordError && (
                    <Typography variant="caption" color="error" mt={0.5}>
                        {confirmPasswordError}
                    </Typography>
                )}

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
            </CardWrapper>
            
            <Box>
                <Typography variant="caption" color="text.secondary" mt={4}>
                    Copyright © 2025 – Preclinic.
                </Typography>
            </Box>
        </RegisterWrapper>
    );
};