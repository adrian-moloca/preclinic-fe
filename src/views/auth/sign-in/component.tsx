import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  Divider,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/preclinic-logo.svg";
import {
  CardWrapper,
  LogoWrapper,
  RemindMeWrapper,
  SectionWrapper,
  SignInWrapper,
} from "./style";
import SocialButtons from "../../../components/social-buttons";
import { useAuthContext } from "../../../providers/auth/context";
import { useSignInContext } from "../../../providers/sign-in";
import { UserRole } from "../../../providers/auth/types";

export const SignIn: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { 
    availableCabinets, 
    availableRoles,
    getLastSignInForEmail,
    clearSignInData
  } = useSignInContext();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cabinet, setCabinet] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cabinetError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  useEffect(() => {
    if (email && password && cabinet && validateEmail(email)) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password, cabinet]);

  useEffect(() => {
    if (email && validateEmail(email)) {
      const lastSignIn = getLastSignInForEmail(email);
      if (lastSignIn && lastSignIn.rememberMe) {
        setCabinet(lastSignIn.cabinet);
        setSelectedRole(lastSignIn.role as UserRole);
        setRememberMe(true);
      }
    }
  }, [email, getLastSignInForEmail]);

  const handleSubmit = async () => {
  let hasError = false;
  setError("");

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
  } else {
    setPasswordError("");
  }

  // Remove cabinet requirement and logic
  if (!hasError) {
    setIsLoading(true);
    try {
      const success = await login(email, password, undefined, selectedRole);
      if (success) {
        navigate("/");
      } else {
        setError("Invalid credentials. Use password123 for demo accounts.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
};

  const handleQuickLogin = (role: UserRole) => {
    const emails = {
      'owner-doctor': 'owner@preclinic.com',
      'doctor': 'doctor@preclinic.com', 
      'assistant': 'assistant@preclinic.com'
    };
    
    setEmail(emails[role]);
    setPassword('password123');
    setCabinet(availableCabinets[0] || 'Cabinet A');
    setSelectedRole(role);
    setRememberMe(false);
  };

  const handleClearRememberedData = () => {
    clearSignInData();
    setEmail("");
    setPassword("");
    setCabinet("");
    setSelectedRole('doctor');
    setRememberMe(false);
  };

  return (
    <SignInWrapper>
      <LogoWrapper>
        <img src={Logo} alt="Preclinic Logo" style={{ width: 120 }} />
      </LogoWrapper>

      <CardWrapper>
        <Typography variant="h5" fontWeight={600} textAlign="center" gutterBottom>
          Sign In
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
          Please enter below details to access the dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Quick Demo Login:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => handleQuickLogin('owner-doctor')}
              sx={{ textTransform: 'none' }}
              disabled={isLoading}
            >
              Owner-Doctor
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => handleQuickLogin('doctor')}
              sx={{ textTransform: 'none' }}
              disabled={isLoading}
            >
              Doctor
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => handleQuickLogin('assistant')}
              sx={{ textTransform: 'none' }}
              disabled={isLoading}
            >
              Assistant
            </Button>
          </Box>
          
          <Box sx={{ mt: 1 }}>
            <Button 
              size="small" 
              variant="text" 
              onClick={handleClearRememberedData}
              sx={{ textTransform: 'none', fontSize: '0.75rem' }}
              disabled={isLoading}
            >
              Clear Remembered Data
            </Button>
          </Box>
        </Box>

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

        {validateEmail(email) && (
          <>
            <FormControl fullWidth margin="normal" error={!!cabinetError}>
              <InputLabel>Select Cabinet</InputLabel>
              <Select
                value={cabinet}
                label="Select Cabinet"
                onChange={(e) => setCabinet(e.target.value)}
                disabled={isLoading}
              >
                {availableCabinets.map((cabin) => (
                  <MenuItem key={cabin} value={cabin}>
                    {cabin}
                  </MenuItem>
                ))}
              </Select>
              {cabinetError && (
                <Typography variant="caption" color="error" mt={0.5}>
                  {cabinetError}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Login as</InputLabel>
              <Select
                value={selectedRole}
                label="Login as"
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                disabled={isLoading}
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role === 'owner-doctor' ? 'Owner-Doctor' : 
                     role === 'doctor' ? 'Doctor' : 
                     role === 'assistant' ? 'Assistant' : role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

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
          {passwordError && (
            <Typography variant="caption" color="error" mt={0.5}>
              {passwordError}
            </Typography>
          )}
        </FormControl>

        <SectionWrapper>
          <RemindMeWrapper>
            <Checkbox 
              size="small" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <Typography variant="body2">Remember Me</Typography>
          </RemindMeWrapper>
          <Link to="/forgot-password" style={{ textDecoration: "none" }}>
            <Typography variant="body2" color="error">
              Forgot Password?
            </Typography>
          </Link>
        </SectionWrapper>

        <Button
          fullWidth
          variant="contained"
          sx={{ bgcolor: "#2C2C9E", textTransform: "none", mb: 2 }}
          onClick={handleSubmit}
          disabled={isButtonDisabled || isLoading}
        >
          {isLoading ? "Signing In..." : "Login"}
        </Button>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <SocialButtons />

        <Typography variant="body2" textAlign="center">
          Don't have an account yet?{" "}
          <Link to="/register" style={{ color: "#2C2C9E", fontWeight: 500 }}>
            Register
          </Link>
        </Typography>
      </CardWrapper>

      <Box>
        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          color="text.secondary"
          mt={4}
        >
          Copyright © 2025 – Preclinic.
        </Typography>
      </Box>
    </SignInWrapper>
  );
};