import { Box, Typography, Button, Grid } from "@mui/material";
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
import { DraftManager } from "../../components/draft-manager/component";
import RecentItemsWidget from "../../components/recent-items-widgets";
import FavoritesWidget from "../../components/favorite-widget";

export const Dashboard: FC = () => {
    const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);

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
                <Button 
                    variant="contained" 
                    startIcon={<Analytics />}
                    onClick={() => setShowAdvancedAnalytics(true)}
                >
                    Advanced Analytics
                </Button>
            </Box>
            
            <StatisticsCards />
            
            <Box mt={4} mb={4}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Quick Access
                </Typography>
                <Grid container spacing={3}>
                    <Grid>
                        <RecentItemsWidget />
                    </Grid>
                    <Grid>
                        <FavoritesWidget maxItems={6} showTabs={false} />
                    </Grid>
                    <Grid>
                        <DraftManager />
                    </Grid>
                </Grid>
            </Box>
            
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