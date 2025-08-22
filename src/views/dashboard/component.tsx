import { Box, Typography, Button, Grid, Card, CardContent, Alert } from "@mui/material"; // ADD Alert
import { FC, useState } from "react";
import StatisticsCards from "../../components/statistics-cards";
import UpcomingAppointmentsCard from "../../components/upcoming-appointments-card";
import AppointmentsChart from "../../components/appointment-chart";
import StatsOverviewCards from "../../components/status-cards";
import RecentAppointmentsCard from "../../components/recent-appointments-card";
import AvailabilityCard from "../../components/availability-card";
import ScheduleCalendar from "../../components/calendar-schedule";
import { Analytics, MedicalServices, Warning } from "@mui/icons-material"; // ADD MedicalServices, Warning
import EnhancedAnalyticsDashboard from "../../components/interactive-chart/components/enhanced-analystics-dashboard";
import { useMedicalDecisionSupport } from "../../providers/medical-decision-support/context"; // ADD THIS
import { useNavigate } from "react-router-dom"; // ADD THIS

export const Dashboard: FC = () => {
    const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
    // ADD THESE LINES
    const { alerts, getCriticalAlerts } = useMedicalDecisionSupport();
    const navigate = useNavigate();

    const activeAlerts = alerts.filter(alert => !alert.dismissed);
    const criticalAlerts = getCriticalAlerts();

    if (showAdvancedAnalytics) {
        return (
            <Box>
                <Box margin={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Advanced Analytics</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => setShowAdvancedAnalytics(false)}
                    >
                        Back to Dashboard
                    </Button>
                </Box>
                <EnhancedAnalyticsDashboard />
            </Box>
        );
    }

    return (
        <Box>
            <Box margin={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">Doctor dashboard</Typography>
                <Box display="flex" gap={2}>
                    <Button
                        variant="contained"
                        startIcon={<Analytics />}
                        onClick={() => setShowAdvancedAnalytics(true)}
                    >
                        Advanced Analytics
                    </Button>
                    <Button
                        variant={criticalAlerts.length > 0 ? "contained" : "outlined"}
                        color={criticalAlerts.length > 0 ? "error" : "primary"}
                        startIcon={<MedicalServices />}
                        onClick={() => navigate('/medical-alerts')}
                    >
                        Medical Alerts ({activeAlerts.length})
                    </Button>
                </Box>
            </Box>

            {criticalAlerts.length > 0 && (
                <Box margin={2}>
                    <Alert
                        severity="error"
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={() => navigate('/medical-alerts')}
                            >
                                View All
                            </Button>
                        }
                    >
                        <Typography variant="subtitle1" fontWeight={600}>
                            {criticalAlerts.length} Critical Medical Alert{criticalAlerts.length > 1 ? 's' : ''} Require Immediate Attention
                        </Typography>
                        <Typography variant="body2">
                            Please review and address these alerts as soon as possible for patient safety.
                        </Typography>
                    </Alert>
                </Box>
            )}

            {activeAlerts.length > 0 && (
                <Box margin={2} mb={3}>
                    <Typography variant="h6" gutterBottom>
                        Medical Alerts Summary
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid>
                            <Card sx={{ backgroundColor: criticalAlerts.length > 0 ? 'error.light' : 'primary.light' }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h5" color="white" fontWeight="bold">
                                                {criticalAlerts.length}
                                            </Typography>
                                            <Typography variant="body2" color="white">
                                                Critical Alerts
                                            </Typography>
                                        </Box>
                                        <Warning sx={{ color: 'white', fontSize: 32 }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h5" color="primary.main" fontWeight="bold">
                                                {activeAlerts.filter(a => a.type === 'drug_interaction').length}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Drug Interactions
                                            </Typography>
                                        </Box>
                                        <MedicalServices color="primary" sx={{ fontSize: 32 }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h5" color="warning.main" fontWeight="bold">
                                                {activeAlerts.filter(a => a.type === 'allergy_warning').length}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Allergy Warnings
                                            </Typography>
                                        </Box>
                                        <Warning color="warning" sx={{ fontSize: 32 }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h5" color="info.main" fontWeight="bold">
                                                {activeAlerts.filter(a => a.type === 'vital_signs_alert').length}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Vital Signs Alerts
                                            </Typography>
                                        </Box>
                                        <MedicalServices color="info" sx={{ fontSize: 32 }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            <StatisticsCards />
            <Box mt={6} width={"100%"} display={"flex"} gap={2}>
                <UpcomingAppointmentsCard />
                <AppointmentsChart />
            </Box>
            <StatsOverviewCards />
            <RecentAppointmentsCard />
            <AvailabilityCard />
            <ScheduleCalendar />
        </Box>
    );
};