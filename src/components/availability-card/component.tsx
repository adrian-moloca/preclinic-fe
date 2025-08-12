import {
  Box,
  Divider,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FC } from "react";
import { useScheduleContext } from "../../providers/schedule";
import { ScheduleEntry } from "../../providers/schedule/types";
import {
  AvailabilityCardWrapper,
  FormWrapper,
  HeaderWrapper,
  ScheduleWrapper,
} from "./style";

const sessionOptions = ["Morning", "Afternoon", "Evening"];

export const AvailabilityCard: FC = () => {
  const { weeklySchedules, updateSchedule, deleteSchedule } = useScheduleContext();

  const handleChange = (
    day: string,
    entry: ScheduleEntry,
    field: keyof ScheduleEntry,
    value: string
  ) => {
    updateSchedule(day, { ...entry, [field]: value });
  };

  return (
    <AvailabilityCardWrapper>
      <HeaderWrapper>
        <Typography variant="h6">Availability</Typography>
      </HeaderWrapper>

      <Divider sx={{ width: "100%", mb: 2 }} />

      <ScheduleWrapper>
        {Object.entries(weeklySchedules).length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No schedule available.
          </Typography>
        ) : (
          Object.entries(weeklySchedules).map(([day, entries]) => {
            const scheduleEntries = entries as ScheduleEntry[];
            return (
              <Box key={day} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  {day}
                </Typography>

                {scheduleEntries.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" pl={1}>
                    No entries
                  </Typography>
                ) : (
                  scheduleEntries.map((entry) => (
                    <FormWrapper key={entry.id}>
                      <FormControl size="small" sx={{ width: 120 }}>
                        <Select
                          value={entry.session}
                          onChange={(e) =>
                            handleChange(day, entry, "session", e.target.value)
                          }
                        >
                          {sessionOptions.map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        size="small"
                        type="time"
                        value={entry.from}
                        onChange={(e) =>
                          handleChange(day, entry, "from", e.target.value)
                        }
                        inputProps={{ step: 300 }}
                      />

                      <TextField
                        size="small"
                        type="time"
                        value={entry.to}
                        onChange={(e) =>
                          handleChange(day, entry, "to", e.target.value)
                        }
                        inputProps={{ step: 300 }}
                      />

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteSchedule(day, entry.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </FormWrapper>
                  ))
                )}
              </Box>
            );
          })
        )}
      </ScheduleWrapper>
    </AvailabilityCardWrapper>
  );
};
