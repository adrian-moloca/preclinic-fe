import { 
  Box, 
  Typography, 
  Paper,
  Button,
  Stack,
  Fade,
  CircularProgress,
  IconButton,
  Alert,
  Snackbar
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import {
  Email,
  CheckCircleOutline,
  Refresh,
  ArrowBack,
  Send
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export const WaitEmailVerification: FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  
  useEffect(() => {
    setShowContent(true);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    setResending(true);
    setResendDisabled(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResending(false);
    setCountdown(60); // 60 seconds cooldown
    setShowSnackbar(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 3,
      }}
    >
      <Fade in={showContent} timeout={800}>
        <Paper
          elevation={24}
          sx={{
            maxWidth: 500,
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            background: theme.palette.background.paper,
            position: 'relative',
          }}
        >
          {/* Top decorative bar */}
          <Box
            sx={{
              height: 6,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          />

          {/* Back button */}
          <IconButton
            onClick={() => navigate('/register')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              color: theme.palette.text.secondary,
            }}
          >
            <ArrowBack />
          </IconButton>

          <Box sx={{ p: 5 }}>
            <Stack spacing={3} alignItems="center">
              {/* Animated email icon */}
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
                    '50%': { transform: 'scale(1.05)', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' },
                    '100%': { transform: 'scale(1)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
                  },
                }}
              >
                <Email sx={{ fontSize: 60, color: '#ffffff' }} />
              </Box>

              {/* Check your email text */}
              <Stack spacing={1} alignItems="center">
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Check Your Email
                </Typography>
                <CheckCircleOutline 
                  sx={{ 
                    color: theme.palette.success.main,
                    fontSize: 32,
                  }} 
                />
              </Stack>

              {/* Description */}
              <Typography
                variant="body1"
                textAlign="center"
                color="text.secondary"
                sx={{ maxWidth: 400, lineHeight: 1.6 }}
              >
                We've sent an activation link to your email address. 
                Please check your inbox and click the link to activate your account.
              </Typography>

              {/* Email hint */}
              <Alert 
                severity="info" 
                sx={{ 
                  width: '100%',
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: theme.palette.info.main,
                  }
                }}
              >
                <Typography variant="body2">
                  <strong>Tip:</strong> If you don't see the email, check your spam or junk folder.
                </Typography>
              </Alert>

              {/* Resend email button */}
              <Button
                variant="contained"
                size="large"
                startIcon={resending ? <CircularProgress size={20} color="inherit" /> : <Send />}
                onClick={handleResendEmail}
                disabled={resending || resendDisabled}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  background: resendDisabled 
                    ? theme.palette.grey[400]
                    : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  },
                }}
              >
                {resending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
              </Button>

              {/* Additional help text */}
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                sx={{ mt: 2 }}
              >
                Having trouble? Contact us at{' '}
                <Typography
                  component="a"
                  href="mailto:support@preclinic.com"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  support@preclinic.com
                </Typography>
              </Typography>

              {/* Expected time */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
                  width: '100%',
                }}
              >
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  <Refresh sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  Email usually arrives within 2-3 minutes
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Fade>

      {/* Success snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%', borderRadius: 2 }}
        >
          Email sent successfully! Please check your inbox.
        </Alert>
      </Snackbar>
    </Box>
  );
};