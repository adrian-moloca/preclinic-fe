import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { usePatientsContext } from "../../../providers/patients";
import { useNavigate, useParams } from "react-router-dom";
import { PatientDetailsWrapper } from "./style";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteModal from "../../../components/delete-modal";
import { useCasesContext } from "../../../providers/cases/context";
import ReusableTable from "../../../components/table";
import { useRecentItems } from "../../../hooks/recent-items";
import FavoriteButton from "../../../components/favorite-buttons";
import { MedicalServices } from "@mui/icons-material";
import { useMedicalAlerts } from "../../../hooks/medical-alerts";
import AlertPanel from "../../../components/medical-alert-system/alert-panel";

export const PatientDetails: FC = () => {
  const { id } = useParams();
  const { patients, deletePatient } = usePatientsContext();
  const { getCasesByPatientId, deleteCase } = useCasesContext();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const { addRecentItem } = useRecentItems();
  const { getAlertsForPatient } = useMedicalAlerts();

  const allPatients = Object.values(patients).flat();
  const patient = allPatients.find((p) => p._id === id);
  
  // Extract the actual patient data from the user object
  const patientData = (patient as any)?.user || patient;

  const patientCases = patient ? getCasesByPatientId(patient._id) : [];
  const patientAlerts = patient ? getAlertsForPatient(patient._id) : [];

  useEffect(() => {
    if (patient && patientData && id) {
      addRecentItem({
        id: patient._id,
        type: 'patient',
        title: `${patientData.firstName} ${patientData.lastName}`,
        subtitle: patientData.email || patientData.phoneNumber || '',
        url: `/patients/${patient._id}`,
        metadata: {
          gender: patientData.gender,
          email: patientData.email,
          phone: patientData.phoneNumber,
        },
      });
    }
  }, [patient, patientData, id, addRecentItem]);

  const caseColumns = [
    { id: "id", label: "Case ID" },
    { id: "appointmentId", label: "Appointment ID" },
    { id: "diagnosis", label: "Diagnosis" },
    { id: "status", label: "Status" },
    { id: "createdAt", label: "Created At" },
    { id: "totalAmount", label: "Total (€)" },
    { id: "actions", label: "Actions" }
  ];

  const caseRows = patientCases.map(c => ({
    id: c.id,
    appointmentId: c.appointmentId,
    diagnosis: c.diagnosis,
    status: c.status,
    createdAt: new Date(c.createdAt).toLocaleDateString(),
    totalAmount: c.totalAmount,
    actions: (
      <Box display="flex" alignItems="center">
        <Tooltip title="View Details">
          <IconButton
            color="primary"
            onClick={() => navigate(`/cases/details/${c.id}`)}
            size="small"
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
        <IconButton
          color="inherit"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setSelectedCaseId(c.id);
          }}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
    )
  }));

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCaseId(null);
  };

  const handleEditCase = () => {
    if (selectedCaseId) {
      navigate(`/cases/edit/${selectedCaseId}`);
      handleMenuClose();
    }
  };

  const handleDeleteCase = async () => {
    if (selectedCaseId) {
      await deleteCase(selectedCaseId);
      handleMenuClose();
    }
  };

  const handleDeleteClick = () => {
    if (patient) {
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!patient) return;

    setIsDeleting(true);
    try {
      await deletePatient(patient._id);
      setDeleteModalOpen(false);
      navigate('/patients/all-patients');
    } catch (error) {
      console.error('Error deleting patient:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
    }
  };

  const handleEditPatient = () => {
    if (patient) {
      navigate(`/patients/edit/${patient._id}`);
    }
  };

  if (!patient || !patientData) {
    return (
      <Box p={3}>
        <Typography variant="h6">Patient not found</Typography>
      </Box>
    );
  }

  const favoriteItem = {
    id: patient._id,
    type: 'patient' as const,
    title: `${patientData.firstName} ${patientData.lastName}`,
    subtitle: patientData.email || patientData.phoneNumber || '',
    url: `/patients/${patient._id}`,
    metadata: {
      gender: patientData.gender,
      email: patientData.email,
      phone: patientData.phoneNumber,
    },
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Patient Details
      </Typography>

      <Card elevation={3} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent={"space-between"} gap={3} mb={3}>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <Avatar
              src={patientData.profileImg}
              alt={`${patientData.firstName} ${patientData.lastName}`}
              sx={{ width: 100, height: 100 }}
            >
              {patientData.firstName?.[0]}{patientData.lastName?.[0]}
            </Avatar>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h5">
                  {patientData.firstName} {patientData.lastName}
                </Typography>
                <FavoriteButton item={favoriteItem} />
                {patientAlerts.length > 0 && (
                  <Tooltip title={`${patientAlerts.length} active medical alert${patientAlerts.length > 1 ? 's' : ''}`}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: patientAlerts.some(a => a.severity === 'critical') ? 'error.main' : 'warning.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem'
                      }}
                    >
                      <MedicalServices sx={{ fontSize: 16, mr: 0.5 }} />
                      {patientAlerts.length}
                    </Box>
                  </Tooltip>
                )}
              </Box>
              <Typography variant="body1" color="text.secondary">
                {patientData.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {patientData.gender}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Button variant="outlined" color="primary" sx={{ width: 100 }} onClick={handleEditPatient}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EditIcon sx={{ mr: 1 }} />
                Edit
              </Box>
            </Button>
            <Button variant="outlined" color="error" sx={{ width: 100 }} onClick={handleDeleteClick}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DeleteIcon sx={{ mr: 1 }} />
                Delete
              </Box>
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <CardContent>
          <PatientDetailsWrapper>
            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Birth Date</Typography>
              <Typography>{patientData.birthDate || 'N/A'}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Phone</Typography>
              <Typography>{patientData.phoneNumber || 'N/A'}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Address</Typography>
              <Typography>{patientData.address || 'N/A'}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">City</Typography>
              <Typography>{patientData.city || 'N/A'}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">State</Typography>
              <Typography>{patientData.state || 'N/A'}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Country</Typography>
              <Typography>{patientData.country || 'N/A'}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Blood Group</Typography>
              <Typography>{patientData.bloodGroup || 'N/A'}</Typography>
            </Box>

            <Box width={{ xs: "100%", sm: "45%" }}>
              <Typography variant="subtitle2">Zip Code</Typography>
              <Typography>{patientData.zipCode || 'N/A'}</Typography>
            </Box>

            {(patientData.allergies || patientData.medicalHistory || patientData.currentMedications) && (
              <>
                <Divider sx={{ width: '100%', my: 2 }} />
                <Typography variant="h6" sx={{ width: '100%', mb: 2, color: 'primary.main' }}>
                  Medical Information
                </Typography>
                
                {patientData.allergies && (
                  <Box width={{ xs: "100%", sm: "45%" }}>
                    <Typography variant="subtitle2" color="error.main">Known Allergies</Typography>
                    <Typography>{patientData.allergies}</Typography>
                  </Box>
                )}

                {patientData.medicalHistory && (
                  <Box width={{ xs: "100%", sm: "45%" }}>
                    <Typography variant="subtitle2">Medical History</Typography>
                    <Typography>{patientData.medicalHistory}</Typography>
                  </Box>
                )}

                {patientData.currentMedications && (
                  <Box width={{ xs: "100%", sm: "45%" }}>
                    <Typography variant="subtitle2">Current Medications</Typography>
                    <Typography>{patientData.currentMedications}</Typography>
                  </Box>
                )}
              </>
            )}
          </PatientDetailsWrapper>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <MedicalServices color="primary" />
          <Typography variant="h5">
            Medical Alerts for This Patient
          </Typography>
          {patientAlerts.length > 0 && (
            <Box
              sx={{
                backgroundColor: patientAlerts.some(a => a.severity === 'critical') ? 'error.main' : 'warning.main',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              {patientAlerts.length} Active Alert{patientAlerts.length > 1 ? 's' : ''}
            </Box>
          )}
        </Box>
        
        <Card elevation={2}>
          <AlertPanel 
            patientId={patient._id}
            showOnlyPatient={true}
            maxHeight={400}
          />
        </Card>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Medical Cases
        </Typography>
        {caseRows.length > 0 ? (
          <>
            <ReusableTable columns={caseColumns} data={caseRows} />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleEditCase}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
              </MenuItem>
              <MenuItem onClick={handleDeleteCase}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Typography color="text.secondary" mt={2}>
            No cases found for this patient.
          </Typography>
        )}
      </Box>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        itemName={patientData ? `${patientData.firstName} ${patientData.lastName}` : undefined}
        message={patientData ? `Are you sure you want to delete ${patientData.firstName} ${patientData.lastName}? This action cannot be undone.` : undefined}
        isDeleting={isDeleting}
      />
    </Box>
  );
};