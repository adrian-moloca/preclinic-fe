import { Typography } from "@mui/material";
import { FC } from "react";
import ScheduleForm from "../../components/schedule-form";
import { SchedduleWrapper, TitleWrapper } from "./style";

export const Schedule: FC = () => {
    return (
        <SchedduleWrapper>
            <TitleWrapper>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Schedules
                </Typography>
            </TitleWrapper>
            <ScheduleForm />
        </SchedduleWrapper>
    );
};