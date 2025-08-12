import { Box, BoxProps, IconButton, IconButtonProps, styled } from "@mui/material";

export const ButtonsWrapper = styled(Box)<BoxProps>({
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
    width: "100%",
});

export const CustomIconButton = styled(IconButton)<IconButtonProps>({
    border: "1px solid #ccc",
    borderRadius: 2,
    width: "30%",
})