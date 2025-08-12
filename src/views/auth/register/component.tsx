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
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CardWrapper, LogoWrapper, RemindMeWrapper } from "../sign-in/style";
import Logo from "../../../assets/preclinic-logo.svg";
import { Link } from "react-router-dom";
import SocialButtons from "../../../components/social-buttons";
import { RegisterWrapper, SignInSectionWrapper, TitleWrapper } from "./style";

export const Register: FC = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [termsChecked, setTermsChecked] = useState(false);

    const [fullNameError, setFullNameError] = useState("");
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
}, [fullName, email, password, confirmPassword, termsChecked])

useEffect(() => {
    if (!confirmPassword) {
        setConfirmPasswordError("");
    } else if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
    } else {
        setConfirmPasswordError("");
    }
}, [password, confirmPassword]);

    const handleSubmit = () => {
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
        } else {
            setEmailError("");
        }

        if (!termsChecked) {
            alert("You must agree to the Terms of Service and Privacy Policy");
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

        if (!hasError) {
            console.log("Register with:", { fullName, email, password });
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

                <TextField
                    fullWidth
                    label="Full Name"
                    placeholder="Enter Your Full Name"
                    margin="normal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={!!fullNameError}
                    helperText={fullNameError}
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

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, bgcolor: "#2C2C9E", textTransform: "none" }}
                    disabled={isButtonDisabled}
                    onClick={handleSubmit}
                >
                    Register
                </Button>

                <RemindMeWrapper>
                    <Checkbox
                        size="small"
                        checked={termsChecked}
                        onChange={(e) => setTermsChecked(e.target.checked)}
                    />
                    <Typography variant="body2">I agree to the <Link to="#" color="#2C2C9E">Terms of Service</Link> & <Link to="#" color="#2C2C9E">Privacy Policy</Link></Typography>
                </RemindMeWrapper>

                <Divider sx={{ my: 2 }}>OR</Divider>

                <SocialButtons />

                <SignInSectionWrapper>
                    <Typography>Already have an account yet? <Link to="/sign-in" color="#2C2C9E">Login</Link></Typography>
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
