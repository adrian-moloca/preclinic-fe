import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Logo from "../../../assets/preclinic-logo.svg";
import { LogoWrapper } from "../sign-in/style";
import { ResetPasswordWrapper } from "./style";

export const ResetPassword: FC = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (pwd: string) => {
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        return {
            isValid: pwd.length >= 6 && hasUpperCase && hasSpecialChar,
            hasUpperCase,
            hasSpecialChar,
        };
    };

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    const isFormValid = () => {
        const pwdValidation = validatePassword(password);
        const match = password === confirmPassword;
        return pwdValidation.isValid && match;
    };

    const handleSubmit = () => {
        const pwdValidation = validatePassword(password);

        if (!pwdValidation.isValid) {
            setPasswordError("Password must contain uppercase and special character");
        } else {
            setPasswordError("");
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError("");
        }

        if (pwdValidation.isValid && password === confirmPassword) {
            console.log("Resetting password:", password);
            alert("Password successfully reset!");
        }
    };

    return (
        <ResetPasswordWrapper>
            <LogoWrapper>
                <img src={Logo} alt="Preclinic Logo" style={{ width: 120, marginBottom: 24 }} />
            </LogoWrapper>

            <Card sx={{ width: 400, p: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom textAlign="center">
                        Reset Password
                    </Typography>

                    <FormControl fullWidth variant="outlined" margin="normal" error={!!passwordError}>
                        <InputLabel htmlFor="password">New Password</InputLabel>
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
                            label="New Password"
                        />
                    </FormControl>
                    {passwordError && (
                        <Typography variant="caption" color="error">
                            {passwordError}
                        </Typography>
                    )}
                    {password && (
                        <Box mt={1}>
                            <Typography
                                variant="caption"
                                color={/[A-Z]/.test(password) ? "success.main" : "error"}
                            >
                                • Contains uppercase letter
                            </Typography>
                            <br />
                            <Typography
                                variant="caption"
                                color={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "success.main" : "error"}
                            >
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
                        <Typography variant="caption" color="error">
                            {confirmPasswordError}
                        </Typography>
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={!isFormValid()}
                        sx={{ mt: 3 }}
                    >
                        Reset Password
                    </Button>
                </CardContent>
            </Card>
            <Typography
                variant="caption"
                display="block"
                textAlign="center"
                color="text.secondary"
                mt={4}
            >
                Copyright © 2025 – Preclinic.
            </Typography>
        </ResetPasswordWrapper>
    );
};
