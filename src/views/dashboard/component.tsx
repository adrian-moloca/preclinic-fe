import { Box, Typography, Button } from "@mui/material";
import { FC, useState } from "react";
import StatisticsCards from "../../components/statistics-cards";
import UpcomingAppointmentsCard from "../../components/upcoming-appointments-card";
import AppointmentsChart from "../../components/appointment-chart";
import StatsOverviewCards from "../../components/status-cards";
import RecentAppointmentsCard from "../../components/recent-appointments-card";
import AvailabilityCard from "../../components/availability-card";
import ScheduleCalendar from "../../components/calendar-schedule";
import { Analytics } from "@mui/icons-material";
import EnhancedAnalyticsDashboard from "../../components/interactive-chart/components/enhanced-analystics-dashboard";
import { useClinicContext } from "../../providers/clinic/context";
import ClinicHeader from "../../components/clinic-header";

export const Dashboard: FC = () => {
    const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
    const { selectedClinic } = useClinicContext();

    if (showAdvancedAnalytics) {
        return (
            <Box>
                <ClinicHeader />
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
            {selectedClinic && <ClinicHeader />}
            <Box margin={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">
                    {selectedClinic ? `${selectedClinic.name} Dashboard` : 'Doctor Dashboard'}
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<Analytics />}
                    onClick={() => setShowAdvancedAnalytics(true)}
                >
                    Advanced Analytics
                </Button>
            </Box>
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