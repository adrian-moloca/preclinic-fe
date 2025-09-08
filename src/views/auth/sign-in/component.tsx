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
  Alert,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/preclinic-logo.svg";
import {
  LogoWrapper,
  RemindMeWrapper,
  SectionWrapper,
  SignInWrapper,
} from "./style";
import SocialButtons from "../../../components/social-buttons";
import { useAuthContext } from "../../../providers/auth/context";
import { useSignInContext } from "../../../providers/sign-in";
import { CustomPaper } from "../../settings/components/general-settings/components/clinic-information/style";

export const SignIn: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { 
    getLastSignInForEmail,
  } = useSignInContext();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  useEffect(() => {
    if (email && password && validateEmail(email)) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);

  useEffect(() => {
    if (email && validateEmail(email)) {
      const lastSignIn = getLastSignInForEmail(email);
      if (lastSignIn && lastSignIn.rememberMe) {
        setRememberMe(true);
      }
    }
  }, [email, getLastSignInForEmail]);

  const handleSubmit = async () => {
  let hasError = false;
  setError("");

  // validate email
  if (!email) {
    setEmailError("Email is required");
    hasError = true;
  } else if (!validateEmail(email)) {
    setEmailError("Enter a valid email");
    hasError = true;
  } else {
    setEmailError("");
  }

  // validate password
  if (!password) {
    setPasswordError("Password is required");
    hasError = true;
  } else {
    setPasswordError("");
  }

  if (!hasError) {
    setIsLoading(true);
    try {
      const success = await login(email, password);

      if (success) {
        navigate("/");
      } else {
        setError("Invalid credentials. Please check your email and password.");
      }
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
};

;

  return (
    <SignInWrapper>
      <LogoWrapper>
        <img src={Logo} alt="Preclinic Logo" style={{ width: 120 }} />
      </LogoWrapper>

      <CustomPaper>
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
      </CustomPaper>

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