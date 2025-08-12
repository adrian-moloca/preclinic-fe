import { Box, BoxProps, styled } from "@mui/material";

export const AvailabilityCardWrapper = styled(Box)<BoxProps>({
    width: 400,
    height: "100%",
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 16,
    display: "flex",
    flexDirection: "column",
});

export const HeaderWrapper = styled(Box)<BoxProps>({
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
});

export const ScheduleWrapper = styled(Box)<BoxProps>({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16
});

export const FormWrapper = styled(Box)<BoxProps>({
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 8
});