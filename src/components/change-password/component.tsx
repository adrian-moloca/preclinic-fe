import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { FC, useState } from "react";
import { FormFieldWrapper } from "../create-patient-form/style";
import { DividerFormWrapper } from "../create-leaves-form/style";
import { StyledPaper } from "../../views/profile/profile-settings/style";
import { ChangePasswordWrapper, InputsWrapper } from "./style";

export const ChangePassword: FC = () => {
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
        <ChangePasswordWrapper>
            <StyledPaper>
                <Typography variant="h4" mb={2}>Change Password</Typography>
                <DividerFormWrapper />
                <FormFieldWrapper>
                    <InputsWrapper>
                        <Box sx={{ flex: 1 }}>
                            <FormControl 
                                fullWidth 
                                sx={{ marginY: 1 }} 
                                variant="outlined" 
                                error={!!passwordError}
                            >
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
                                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                                    {passwordError}
                                </Typography>
                            )}
                            
                            {password && (
                                <Box mt={1}>
                                    <Typography
                                        variant="caption"
                                        color={/[A-Z]/.test(password) ? "success.main" : "error"}
                                        sx={{ display: 'block' }}
                                    >
                                        • Contains uppercase letter
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "success.main" : "error"}
                                        sx={{ display: 'block' }}
                                    >
                                        • Contains special character
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color={password.length >= 6 ? "success.main" : "error"}
                                        sx={{ display: 'block' }}
                                    >
                                        • At least 6 characters
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <FormControl 
                                fullWidth 
                                sx={{ marginY: 1 }} 
                                variant="outlined" 
                                error={!!confirmPasswordError}
                            >
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
                                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                                    {confirmPasswordError}
                                </Typography>
                            )}

                            {confirmPassword && (
                                <Box mt={1}>
                                    <Typography
                                        variant="caption"
                                        color={password === confirmPassword ? "success.main" : "error"}
                                        sx={{ display: 'block' }}
                                    >
                                        • Passwords {password === confirmPassword ? 'match' : 'do not match'}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </InputsWrapper>
                </FormFieldWrapper>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    sx={{ mt: 2, width: 200 }}
                >
                    Reset Password
                </Button>
            </StyledPaper>
        </ChangePasswordWrapper>
    );
};