import { Box, BoxProps, styled } from "@mui/material";

export const BesicInformationCardWrapper = styled(Box)<BoxProps>({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    padding: "16px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    // backgroundColor: "#f9f9f9",
    flexWrap: "wrap",
    gap: "16px",
});

export const FirstSectionWrapper = styled(Box)<BoxProps>({
    display: "flex",
    alignItems: "center",
    minWidth: "200px",
});

export const SecondSectionWrapper = styled(Box)<BoxProps>({
    minWidth: "120px"
});

export const ThirdSectionWrapper = styled(Box)<BoxProps>({
    minWidth: "150px"
});

export const FourthSectionWrapper = styled(Box)<BoxProps>({
    minWidth: "130px"
});