import {
  Box,
  Typography,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OtpInput } from "../../../components/otp-input/component";
import axios from 'axios';
import { CheckCircle } from "@mui/icons-material";
import { CustomPaper } from "../../settings/components/general-settings/components/clinic-information/style";

export const AccountVerification: FC = () => {
  const navigate = useNavigate();
  const [isActivated, setIsActivated] = useState(false);

  const { token: paramToken } = useParams<{ token?: string }>();
  
  const [, setActualOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);


  const verifyAccountFn = async (hashCode: string, otpCode: string) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/auth/verify/${hashCode}`, { otp: otpCode });
      
      if (response.status === 200) {
        setIsActivated(true);
        setVerificationSuccess(true);
        
        localStorage.clear();
        
        return { success: true, message: "Verification successful!" };
      }
      
      return { success: false, message: "Verification failed" };
      
    } catch (error: any) {
      console.error('Verification error:', error);
      
      if (error.response?.status === 410 || 
          error.response?.data?.message?.toLowerCase().includes('expired')) {
        setTimeout(() => navigate('/register'), 100);
        return { success: false, message: "OTP expired" };
      }
      
      return { success: false, message: "Verification failed. Please try again." };
    }
  };

  useEffect(() => {
    if (isActivated) {
      setTimeout(() => {
        navigate('/sign-in');
      }, 2000);
    }
  }, [isActivated, navigate]);

  const handleOtpComplete = async (otp: string) => {
    if (!paramToken) {
      console.error('No verification token in URL');
      return;
    }
    
    setIsLoading(true);
    setError("");
    setActualOtp(otp);
    
    try {
      const result = await verifyAccountFn(paramToken, otp);
      
      if (!result.success) {
        setActualOtp('');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setActualOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    console.log("Resend OTP clicked");
  };

  return (
    <>
      {verificationSuccess ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CustomPaper>
            <Box textAlign="center" p={3}>
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Account Verified Successfully!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Redirecting to sign in...
              </Typography>
            </Box>
          </CustomPaper>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
          <CustomPaper>
            <Box display="flex" justifyContent="center">
              <Typography variant="h6" gutterBottom>
                Enter the OTP sent to your email
              </Typography>
            </Box>
            
            <OtpInput
              length={6}
              onComplete={handleOtpComplete}
              onResend={handleResendOtp}
              isLoading={isLoading}
              error={error}
              helperText="Enter your 6-digit verification code"
              resendTimer={60}
              disabled={isLoading}
            />
            
          </CustomPaper>
        </Box>
      )}
    </>
  );
};