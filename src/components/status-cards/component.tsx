import { Box, Typography, Paper, Avatar } from "@mui/material";
import {
  PersonOutline,
  Videocam,
  Replay,
  EventNote,
  MeetingRoom,
  AssignmentTurnedIn,
} from "@mui/icons-material";

const stats = [
  {
    title: "Total Patient",
    value: 658,
    change: "+31%",
    color: "#4F46E5",
    icon: <PersonOutline />,
    positive: true,
  },
  {
    title: "Video Consultation",
    value: 256,
    change: "-21%",
    color: "#06B6D4",
    icon: <Videocam />,
    positive: false,
  },
  {
    title: "Rescheduled",
    value: 141,
    change: "+64%",
    color: "#22C55E",
    icon: <Replay />,
    positive: true,
  },
  {
    title: "Pre Visit Bookings",
    value: 524,
    change: "+38%",
    color: "#EF4444",
    icon: <EventNote />,
    positive: true,
  },
  {
    title: "Walkin Bookings",
    value: 21,
    change: "+95%",
    color: "#3B82F6",
    icon: <MeetingRoom />,
    positive: true,
  },
  {
    title: "Follow Ups",
    value: 451,
    change: "+76%",
    color: "#A7F3D0",
    icon: <AssignmentTurnedIn />,
    positive: true,
  },
];

export const StatsOverviewCards = () => {
  return (
    <Box display="flex" width="100%" gap={2} marginTop={4}>
      {stats.map((stat, index) => (
        <Paper
          key={index}
          elevation={1}
          sx={{
            flex: "1 1 230px",
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            minWidth: 100,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: stat.color, width: 32, height: 32 }}>
              {stat.icon}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {stat.title}
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={700}>
            {stat.value}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={500}
            color={stat.positive ? "green" : "red"}
          >
            {stat.change} Last Week
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};