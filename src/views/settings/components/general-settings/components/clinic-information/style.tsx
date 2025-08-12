import { Box, BoxProps, Paper, PaperProps, styled } from "@mui/material";

export const CustomPaper = styled(Paper)<PaperProps>({
    padding: "24px",
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 12,
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
});

export const TitleWrapper = styled(Box)<BoxProps>({
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
});

export const IconWrapper = styled(Box)<BoxProps>({
    padding: "8px",
    borderRadius: "8px",
    background: "linear-gradient(145deg, #667eea 0%, #f5f5f5 100%)",
    color: "#ffffff"
});
