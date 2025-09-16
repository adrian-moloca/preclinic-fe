import React, { useState, useRef, useEffect, FC } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export const OtpTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 600,
    padding: theme.spacing(2),
    width: '3rem',
    height: '3rem',
  },
}));

interface OtpInputProps {
  length: number;
  onComplete: (otp: string) => void;
  onResend?: () => void;
  isLoading?: boolean;
  error?: string;
  helperText?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  resendTimer?: number; // in seconds
}

export const OtpInput: FC<OtpInputProps> = ({
  length = 6,
  onComplete,
  onResend,
  isLoading = false,
  error,
  helperText,
  autoFocus = true,
  disabled = false,
  resendTimer = 60,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [timer, setTimer] = useState<number>(resendTimer);
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Handle paste
    if (value.length > 1) {
      const pastedValues = value.slice(0, length).split('');
      const newOtp = [...otp];
      
      pastedValues.forEach((digit, i) => {
        if (index + i < length && /^\d$/.test(digit)) {
          newOtp[index + i] = digit;
        }
      });
      
      setOtp(newOtp);
      
      const lastFilledIndex = Math.min(index + pastedValues.length - 1, length - 1);
      inputsRef.current[lastFilledIndex]?.focus();
      
      if (newOtp.every(digit => digit !== '')) {
        onComplete(newOtp.join(''));
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputsRef.current[index - 1]?.focus();
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    
    if (digits.length > 0) {
      const newOtp = [...otp];
      digits.split('').forEach((digit, i) => {
        if (i < length) {
          newOtp[i] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus the last filled input or the next empty one
      const lastIndex = Math.min(digits.length - 1, length - 1);
      inputsRef.current[lastIndex]?.focus();
      
      // Check if OTP is complete
      if (newOtp.every(digit => digit !== '')) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleResend = () => {
    if (canResend && onResend) {
      onResend();
      setTimer(resendTimer);
      setCanResend(false);
      setOtp(Array(length).fill(''));
      inputsRef.current[0]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
        {otp.map((digit, index) => (
          <OtpTextField
            key={index}
            inputRef={(el) => (inputsRef.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            error={!!error}
            disabled={disabled || isLoading}
            inputProps={{
              maxLength: 1,
              'aria-label': `OTP digit ${index + 1}`,
            }}
            variant="outlined"
          />
        ))}
      </Stack>

      {error && (
        <Typography color="error" variant="body2" align="center" mb={2}>
          {error}
        </Typography>
      )}

      {helperText && !error && (
        <Typography color="text.secondary" variant="body2" align="center" mb={2}>
          {helperText}
        </Typography>
      )}

      {onResend && (
        <Box textAlign="center" mt={3}>
          {!canResend ? (
            <Typography variant="body2" color="text.secondary">
              Resend code in {formatTime(timer)}
            </Typography>
          ) : (
            <Button
              variant="text"
              color="primary"
              onClick={handleResend}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : 'Resend Code'}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};