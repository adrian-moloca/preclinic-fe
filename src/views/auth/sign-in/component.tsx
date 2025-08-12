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
import { UserRole } from "../../../providers/auth/types";

export const SignIn: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cabinet, setCabinet] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [cabinetList] = useState<string[]>([
    "Cabinet A",
    "Cabinet B", 
    "Cabinet C",
  ]);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cabinetError, setCabinetError] = useState("");
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

    if (!cabinet) {
      setCabinetError("Please select a cabinet");
      hasError = true;
    } else {
      setCabinetError("");
    }

    if (!hasError) {
      setIsLoading(true);
      try {
        const success = await login(email, password, cabinet, selectedRole);
        if (success) {
          navigate("/");
        } else {
          setError("Invalid credentials. Try: owner@preclinic.com, doctor@preclinic.com, or assistant@preclinic.com with password: password123");
        }
      } catch (err) {
        setError("Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Quick login buttons for demo
  const handleQuickLogin = (role: UserRole) => {
    const emails = {
      'owner-doctor': 'owner@preclinic.com',
      'doctor': 'doctor@preclinic.com', 
      'assistant': 'assistant@preclinic.com'
    };
    
    setEmail(emails[role]);
    setPassword('password123');
    setCabinet('Cabinet A');
    setSelectedRole(role);
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

        {/* Quick Login Demo Buttons */}
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
            >
              Owner-Doctor
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => handleQuickLogin('doctor')}
              sx={{ textTransform: 'none' }}
            >
              Doctor
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => handleQuickLogin('assistant')}
              sx={{ textTransform: 'none' }}
            >
              Assistant
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
        />

        {validateEmail(email) && (
          <>
            <FormControl fullWidth margin="normal" error={!!cabinetError}>
              <InputLabel>Select Cabinet</InputLabel>
              <Select
                value={cabinet}
                label="Select Cabinet"
                onChange={(e) => setCabinet(e.target.value)}
              >
                {cabinetList.map((cabin) => (
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
              >
                <MenuItem value="owner-doctor">Owner-Doctor</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="assistant">Assistant</MenuItem>
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
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
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
            <Checkbox size="small" />
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
