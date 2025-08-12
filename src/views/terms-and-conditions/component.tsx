import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Stack,
  Link
} from "@mui/material";
import { FC } from "react";
import {
  Gavel,
  AccountCircle,
  Copyright,
  Block,
  Warning,
  Shield,
  Update,
  Email,
  Language,
  Security,
} from "@mui/icons-material";

export const TermsAndConditions: FC = () => {
  return (
    <Box sx={{ 
      transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      minHeight: '100vh',
      bgcolor: '#f5f5f5', 
      width: "100%"
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Box display="flex" alignItems="center" mb={4}>
            <Gavel sx={{ color: 'primary.main', mr: 2, fontSize: 40 }} />
            <Box>
              <Typography variant="h3" fontWeight={700} color="primary.main">
                Preclinic – Terms and Conditions
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                (Mock Version)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Last updated: August 7, 2025
              </Typography>
            </Box>
          </Box>

          <Box mb={4}>
            <Typography variant="body1" sx={{ fontSize: 18, lineHeight: 1.7, mb: 2 }}>
              Welcome to <strong>Preclinic!</strong> These Terms and Conditions ("Terms") govern your access to and use 
              of the Preclinic application (the "App") operated by Preclinic ("we", "us", or "our"). 
              By accessing or using the App, you agree to be bound by these Terms. If you do not agree 
              with any part of these Terms, you must not use the App.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={3}>
              <Security sx={{ color: 'success.main', mr: 2 }} />
              <Typography variant="h5" fontWeight={600} color="success.main">
                1. Use of the App
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: 16 }}>
              You may use Preclinic only in accordance with these Terms and all applicable laws. You agree not to:
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <Block color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Violate any laws, third-party rights, or our policies"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Block color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Attempt to interfere with or compromise the integrity or security of the App"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Block color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Use the App for any illegal, harmful, or unauthorized purpose"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={3}>
              <AccountCircle sx={{ color: 'info.main', mr: 2 }} />
              <Typography variant="h5" fontWeight={600} color="info.main">
                2. User Accounts
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.7 }}>
              You may be required to create an account to access certain features. You are responsible for 
              maintaining the confidentiality of your login credentials and for all activity under your account.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={3}>
              <Copyright sx={{ color: 'secondary.main', mr: 2 }} />
              <Typography variant="h5" fontWeight={600} color="secondary.main">
                3. Intellectual Property
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.7 }}>
              All content, features, and functionality in the App, including logos, graphics, and software, 
              are the exclusive property of Preclinic and protected by applicable intellectual property laws.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={3}>
              <Block sx={{ color: 'error.main', mr: 2 }} />
              <Typography variant="h5" fontWeight={600} color="error.main">
                4. Termination
              </Typography>
            </Box>
            
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.7 }}>
                We reserve the right to suspend or terminate your access to the App at any time, without 
                prior notice or liability, for any reason including violation of these Terms.
              </Typography>
            </Alert>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={3}>
              <Warning sx={{ color: 'warning.main', mr: 2 }} />
              <Typography variant="h5" fontWeight={600} color="warning.main">
                5. Disclaimer
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'warning.light', p: 3, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.7 }}>
                The App is provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis. 
                We make no warranties, expressed or implied, and disclaim all liability for any issues that 
                may arise from using the App.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={3}>
              <Shield sx={{ color: 'error.main', mr: 2 }} />
              <Typography variant="h5" fontWeight={600} color="error.main">
                6. Limitation of Liability
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'error.light', p: 3, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.7 }}>
                To the fullest extent permitted by law, <strong>Preclinic shall not be liable</strong> for any 
                indirect, incidental, special, consequential, or punitive damages arising out of or related to 
                your use of the App.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={3}>
              <Update sx={{ color: 'primary.main', mr: 2 }} />
              <Typography variant="h5" fontWeight={600} color="primary.main">
                7. Modifications
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.7 }}>
              We may update or change these Terms at any time. Continued use of the App after such changes 
              constitutes your acceptance of the new Terms.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box mb={4}>
            <Box display="flex" alignItems="center" mb={3}>
              <Email sx={{ color: 'info.main', mr: 2 }} />
              <Typography variant="h5" fontWeight={600} color="info.main">
                8. Contact Us
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: 16 }}>
              If you have any questions about these Terms, you can contact us at:
            </Typography>

            <Stack spacing={2}>
              <Box display="flex" alignItems="center">
                <Email sx={{ color: 'primary.main', mr: 2 }} />
                <Typography variant="body1" fontWeight={500}>
                  Email: {' '}
                  <Link 
                    href="mailto:support@preclic.app" 
                    color="primary" 
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    support@preclic.app
                  </Link>
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center">
                <Language sx={{ color: 'primary.main', mr: 2 }} />
                <Typography variant="body1" fontWeight={500}>
                  Website: {' '}
                  <Link 
                    href="https://www.preclic.app" 
                    target="_blank" 
                    color="primary"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    www.preclic.app
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box 
            sx={{ 
              mt: 6, 
              pt: 3, 
              borderTop: '2px solid', 
              borderColor: 'primary.main',
              textAlign: 'center' 
            }}
          >
            <Typography variant="body2" color="text.secondary">
              These Terms and Conditions are effective as of August 7, 2025
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 1 }}>
              Preclinic Healthcare Platform
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              This is a mock version for development purposes
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};