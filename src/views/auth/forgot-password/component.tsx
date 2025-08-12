import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { LogoWrapper } from "../sign-in/style";
import Logo from "../../../assets/preclinic-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { ForgotPasswordWrapper } from "./style";

export const ForgotPassword: FC = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const navigate = useNavigate();

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    useEffect(() => {
        if (!email.trim()) {
            setIsButtonDisabled(true);
        } else {
            setIsButtonDisabled(!validateEmail(email));
        }
    }, [email]);

    const handleSubmit = () => {
        if (!email.trim()) {
            setEmailError("Email is required");
        } else if (!validateEmail(email)) {
            setEmailError("Enter a valid email");
        } else {
            setEmailError("");
            console.log("Submit email:", email);
        }
        navigate("/otp");
    };

    return (
        <ForgotPasswordWrapper>
            <Card sx={{ minWidth: 400, padding: 3 }}>
                <LogoWrapper>
                    <img src={Logo} alt="Preclinic Logo" style={{ width: 120 }} />
                </LogoWrapper>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Forgot Password
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Enter your email address to receive a password reset link.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Email Address"
                        placeholder="Enter Email Address"
                        margin="normal"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                        }}
                        error={!!emailError}
                        helperText={emailError}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isButtonDisabled}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Submit
                    </Button>
                </CardContent>
                <Box display={"flex"} justifyContent={"center"}>
                    <Typography>Return to <Link style={{ textDecoration: "none", color: "#000" }} to="/sign-in">Sign In</Link></Typography>
                </Box>
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
        </ForgotPasswordWrapper>
    );
};
