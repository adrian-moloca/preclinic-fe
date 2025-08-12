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
  Chip,
  Stack
} from "@mui/material";
import { FC } from "react";
import {
  Shield,
  Person,
  HealthAndSafety,
  Info,
  Share,
  Security,
  Schedule,
  AccountCircle,
  Update
} from "@mui/icons-material";

export const PrivacyAndPolicy: FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <Shield sx={{ color: 'primary.main', mr: 2, fontSize: 40 }} />
          <Typography variant="h3" fontWeight={700} color="primary.main">
            Privacy and Policy
          </Typography>
        </Box>

        {/* Introduction */}
        <Box mb={4}>
          <Typography variant="body1" sx={{ fontSize: 18, lineHeight: 1.7, mb: 2 }}>
            At <strong>Preclinic</strong>, we value your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
            access and use our Preclinic Platform, including features and content related to mental wellness, 
            sleep patterns, dream journaling, and early-stage healthcare services.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Information We Collect */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={3}>
            <Info sx={{ color: 'info.main', mr: 2 }} />
            <Typography variant="h4" fontWeight={600} color="info.main">
              Information We Collect
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3, fontSize: 16 }}>
            We may collect the following types of personal information:
          </Typography>

          {/* Personal Identifiable Information */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <Person sx={{ color: 'secondary.main', mr: 1 }} />
              <Typography variant="h6" fontWeight={600} color="secondary.main">
                Personal Identifiable Information
              </Typography>
            </Box>
            <List dense sx={{ ml: 3 }}>
              <ListItem>
                <ListItemText primary="Full name" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Date of birth" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Contact details (email address, phone number)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Gender" />
              </ListItem>
            </List>
          </Box>

          {/* Health and Wellness Information */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <HealthAndSafety sx={{ color: 'error.main', mr: 1 }} />
              <Typography variant="h6" fontWeight={600} color="error.main">
                Health and Wellness Information
              </Typography>
            </Box>
            <List dense sx={{ ml: 3 }}>
              <ListItem>
                <ListItemText primary="Medical conditions (past and current)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Allergies and medications" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Diagnostic results (lab tests, imaging reports)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Treatment records and progress notes" />
              </ListItem>
            </List>
          </Box>

          {/* Optional Information */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <AccountCircle sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h6" fontWeight={600} color="warning.main">
                Optional Information
              </Typography>
            </Box>
            <List dense sx={{ ml: 3 }}>
              <ListItem>
                <ListItemText primary="Emergency contact details" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Consent forms or communication preferences" />
              </ListItem>
            </List>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* How We Use Your Information */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={3}>
            <Schedule sx={{ color: 'success.main', mr: 2 }} />
            <Typography variant="h4" fontWeight={600} color="success.main">
              How We Use Your Information
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3, fontSize: 16 }}>
            We may use the information we collect to:
          </Typography>

          <Stack spacing={2}>
            <Chip 
              label="Register and manage your patient profile" 
              variant="outlined" 
              color="success"
              sx={{ alignSelf: 'flex-start', py: 1, px: 2, fontSize: 14 }}
            />
            <Chip 
              label="Schedule and coordinate appointments" 
              variant="outlined" 
              color="success"
              sx={{ alignSelf: 'flex-start', py: 1, px: 2, fontSize: 14 }}
            />
            <Chip 
              label="Communicate with you and your healthcare providers" 
              variant="outlined" 
              color="success"
              sx={{ alignSelf: 'flex-start', py: 1, px: 2, fontSize: 14 }}
            />
            <Chip 
              label="Track and review medical history for accurate diagnosis" 
              variant="outlined" 
              color="success"
              sx={{ alignSelf: 'flex-start', py: 1, px: 2, fontSize: 14 }}
            />
            <Chip 
              label="Identify potential allergies, interactions, or risks" 
              variant="outlined" 
              color="success"
              sx={{ alignSelf: 'flex-start', py: 1, px: 2, fontSize: 14 }}
            />
          </Stack>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Sharing Your Information */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={3}>
            <Share sx={{ color: 'warning.main', mr: 2 }} />
            <Typography variant="h4" fontWeight={600} color="warning.main">
              Sharing Your Information
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3, fontSize: 16, fontWeight: 500 }}>
            We will <strong>not sell or share</strong> your personal information with third parties except:
          </Typography>

          <Box sx={{ bgcolor: 'warning.light', p: 3, borderRadius: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
              <strong>Healthcare Professionals:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Doctors, nurses, specialists, and other licensed professionals directly involved in your care
            </Typography>
            <Typography variant="body2">
              • For consultation, diagnosis, treatment planning, and care coordination
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Data Security */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={3}>
            <Security sx={{ color: 'error.main', mr: 2 }} />
            <Typography variant="h4" fontWeight={600} color="error.main">
              Data Security
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.7 }}>
            We implement appropriate technical and organizational measures to protect your personal data 
            from unauthorized access, alteration, or disclosure. However, no method of transmission over 
            the internet is 100% secure, and we cannot guarantee absolute security.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Data Retention */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={3}>
            <Schedule sx={{ color: 'info.main', mr: 2 }} />
            <Typography variant="h4" fontWeight={600} color="info.main">
              Data Retention
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.7 }}>
            We will retain your personal information for as long as necessary to fulfill the purposes 
            outlined in this policy, or as required by law.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Your Rights */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={3}>
            <AccountCircle sx={{ color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" fontWeight={600} color="primary.main">
              Your Rights
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3, fontSize: 16 }}>
            You may have the following rights concerning your personal data:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Right to Access Your Medical Records"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Ask for your information not to be shared with certain people"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="The health care provider or insurance company"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Shield color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Communication to be reached at a specific place"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Changes to This Policy */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={3}>
            <Update sx={{ color: 'secondary.main', mr: 2 }} />
            <Typography variant="h4" fontWeight={600} color="secondary.main">
              Changes to This Policy
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.7 }}>
            We may update this policy from time to time. The latest version will always be available 
            on the platform. Continued use of the Preclinic platform signifies your acceptance of any updates.
          </Typography>
        </Box>

        {/* Footer */}
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
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 1 }}>
            Preclinic Healthcare Platform
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};