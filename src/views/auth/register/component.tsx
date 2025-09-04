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
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CardWrapper, LogoWrapper, RemindMeWrapper } from "../sign-in/style";
import Logo from "../../../assets/preclinic-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import SocialButtons from "../../../components/social-buttons";
import { RegisterWrapper, SignInSectionWrapper, TitleWrapper } from "./style";
import { useRegisterContext } from "../../../providers/register";

export const Register: FC = () => {
    const navigate = useNavigate();
    const { addRegister, isEmailTaken, validateRegistration } = useRegisterContext();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [termsChecked, setTermsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [fullNameError, setFullNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [registerError, setRegisterError] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState("");

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePassword = (pwd: string) => {
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        return {
            isValid: pwd.length >= 6 && hasUpperCase && hasSpecialChar,
            hasUpperCase,
            hasSpecialChar
        };
    };

    useEffect(() => {
        const { isValid } = validatePassword(password);
        const valid =
            fullName.trim().length > 0 &&
            validateEmail(email) &&
            isValid &&
            confirmPassword === password &&
            termsChecked;  

        setIsButtonDisabled(!valid);
    }, [fullName, email, password, confirmPassword, termsChecked]);

    useEffect(() => {
        if (!confirmPassword) {
            setConfirmPasswordError("");
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError("");
        }
    }, [password, confirmPassword]);

    useEffect(() => {
        if (email && validateEmail(email) && isEmailTaken(email)) {
            setEmailError("This email is already registered");
        } else if (email && !validateEmail(email)) {
            setEmailError("Enter a valid email");
        } else {
            setEmailError("");
        }
    }, [email, isEmailTaken]);

    const handleSubmit = async () => {
        setIsLoading(true);
        setRegisterError("");
        setRegisterSuccess("");

        let hasError = false;

        if (!fullName.trim()) {
            setFullNameError("Full name is required");
            hasError = true;
        } else {
            setFullNameError("");
        }

        if (!email.trim()) {
            setEmailError("Email is required");
            hasError = true;
        } else if (!validateEmail(email)) {
            setEmailError("Enter a valid email");
            hasError = true;
        } else if (isEmailTaken(email)) {
            setEmailError("This email is already registered");
            hasError = true;
        } else {
            setEmailError("");
        }

        if (!termsChecked) {
            setRegisterError("You must agree to the Terms of Service and Privacy Policy");
            hasError = true;
        }

        const { hasUpperCase, hasSpecialChar } = validatePassword(password);

        if (!password) {
            setPasswordError("Password is required");
            hasError = true;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            hasError = true;
        } else if (!hasUpperCase || !hasSpecialChar) {
            let msg = "Password must contain ";
            if (!hasUpperCase) msg += "an uppercase letter";
            if (!hasUpperCase && !hasSpecialChar) msg += " and ";
            if (!hasSpecialChar) msg += "a special character";
            setPasswordError(msg);
            hasError = true;
        } else {
            setPasswordError("");
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Confirm your password");
            hasError = true;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            hasError = true;
        } else {
            setConfirmPasswordError("");
        }

        if (hasError) {
            setIsLoading(false);
            return;
        }

        try {
            const validation = validateRegistration({
                fullName,
                email,
                password,
                confirmPassword
            });

            if (!validation.isValid) {
                setRegisterError(validation.errors.join(", "));
                setIsLoading(false);
                return;
            }

            const success = await addRegister({
                fullName,
                email,
                password,
                confirmPassword
            });

            if (success) {
                setRegisterSuccess("Registration successful! Please check your email for verification.");
                
                setFullName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setTermsChecked(false);
                
                setTimeout(() => {
                    navigate("/sign-in");
                }, 2000);
            } else {
                setRegisterError("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setRegisterError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
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
                        Register
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Please enter your details to create account
                    </Typography>
                </TitleWrapper>

                {registerError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {registerError}
                    </Alert>
                )}

                {registerSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {registerSuccess}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Full Name"
                    placeholder="Enter Your Full Name"
                    margin="normal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={!!fullNameError}
                    helperText={fullNameError}
                    disabled={isLoading}
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
                    disabled={isLoading}
                />

                <FormControl fullWidth variant="outlined" margin="normal" error={!!passwordError}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton 
                                    onClick={handleClickShowPassword} 
                                    edge="end"
                                    disabled={isLoading}
                                >
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
                    </Box>
                )}

                <FormControl fullWidth variant="outlined" margin="normal" error={!!confirmPasswordError}>
                    <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                    <OutlinedInput
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton 
                                    onClick={handleClickShowConfirmPassword} 
                                    edge="end"
                                    disabled={isLoading}
                                >
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

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, bgcolor: "#2C2C9E", textTransform: "none" }}
                    disabled={isButtonDisabled || isLoading}
                    onClick={handleSubmit}
                >
                    {isLoading ? "Creating Account..." : "Register"}
                </Button>

                <RemindMeWrapper>
                    <Checkbox
                        size="small"
                        checked={termsChecked}
                        onChange={(e) => setTermsChecked(e.target.checked)}
                        disabled={isLoading}
                    />
                    <Typography variant="body2">
                        I agree to the <Link to="#" style={{ color: "#2C2C9E" }}>Terms of Service</Link> & <Link to="#" style={{ color: "#2C2C9E" }}>Privacy Policy</Link>
                    </Typography>
                </RemindMeWrapper>

                <Divider sx={{ my: 2 }}>OR</Divider>

                <SocialButtons />

                <SignInSectionWrapper>
                    <Typography>
                        Already have an account yet? <Link to="/sign-in" style={{ color: "#2C2C9E" }}>Login</Link>
                    </Typography>
                </SignInSectionWrapper>
            </CardWrapper>
            <Box>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    mt={4}
                >
                    Copyright © 2025 – Preclinic.
                </Typography>
            </Box>
        </RegisterWrapper>
    );
};