import {
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import TwoStepAutentificatorImg from "../../../assets/twostep-verification-illustration-img.png";
import Logo from "../../../assets/preclinic-logo.svg";
import { LogoWrapper } from "../sign-in/style";
import { Link, useNavigate } from "react-router-dom";
import { CardTitleWrapper, ImageSectionWrapper, InputsSectionWrapper, OtpPageWrapper, ResendOtpWrapper } from "./style";

export const OtpPage: FC = () => {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [otpError, setOtpError] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const navigate = useNavigate();

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return; 

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
            inputsRef.current[index - 1]?.focus();
        }
    };

    const validateOtp = useCallback(() => otp.every((digit) => /^\d$/.test(digit)), [otp]);

    useEffect(() => {
        setIsButtonDisabled(!validateOtp());
    }, [otp, validateOtp]);

    const handleSubmit = () => {
        if (!validateOtp()) {
            setOtpError("Enter a valid 6-digit OTP");
            return;
        }

        setOtpError("");
        const joinedOtp = otp.join("");
        console.log("Submit OTP:", joinedOtp);

        navigate("/reset-password"); 
    };

    return (
        <OtpPageWrapper>
            <ImageSectionWrapper>
                <img
                    src={TwoStepAutentificatorImg}
                    alt="Two Step Authentication"
                    style={{ width: "80%", maxWidth: 400 }}
                />
            </ImageSectionWrapper>

            <InputsSectionWrapper>
                <LogoWrapper>
                    <img src={Logo} alt="Preclinic Logo" style={{ width: 120 }} />
                </LogoWrapper>

                <Card sx={{ maxWidth: 600 }}>
                    <CardTitleWrapper>
                        <Typography variant="h4">2-Step Verification</Typography>
                    </CardTitleWrapper>
                    <CardContent>
                        <Typography gutterBottom>
                            Please enter the OTP received to confirm your account ownership. A code has been sent to ******doe@example.com
                        </Typography>

                        <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                            {otp.map((digit, index) => (
                                <Grid key={index}>
                                    <TextField
                                        inputRef={(el) => (inputsRef.current[index] = el)}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, index)}
                                        inputProps={{
                                            maxLength: 1,
                                            style: {
                                                textAlign: "center",
                                                fontSize: "1.5rem",
                                                width: "3rem",
                                            },
                                        }}
                                        error={!!otpError}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {otpError && (
                            <Typography color="error" variant="body2" mb={2}>
                                {otpError}
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={isButtonDisabled}
                        >
                            Verify OTP
                        </Button>
                        <ResendOtpWrapper>
                            <Typography>Don't receive the code? <Link to="#">Resend</Link></Typography>
                        </ResendOtpWrapper>
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
            </InputsSectionWrapper>
        </OtpPageWrapper>
    );
};
