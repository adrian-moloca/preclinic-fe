import { Box, Typography } from "@mui/material";
import { FC } from "react";
import StatisticsCards from "../../components/statistics-cards";
import UpcomingAppointmentsCard from "../../components/upcoming-appointments-card";
import AppointmentsChart from "../../components/appointment-chart";
import StatsOverviewCards from "../../components/status-cards";
import RecentAppointmentsCard from "../../components/recent-appointments-card";
import AvailabilityCard from "../../components/availability-card";
import ScheduleCalendar from "../../components/calendar-schedule";

export const Dashboard: FC = () => {
    return (
        <Box>
            <Box margin={2}>
                <Typography variant="h4" >Doctor dashboard</Typography>
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
    )
}