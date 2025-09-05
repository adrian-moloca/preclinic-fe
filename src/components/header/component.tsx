import { FC } from "react";
import {
    Avatar,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import AvatarMenu from "../avatar";
import Logo from "../../assets/preclinic-logo.svg";
import EventIcon from '@mui/icons-material/Event';
import {
    Business as BusinessIcon,
} from '@mui/icons-material';
import {
    AiButton,
    FirstSectionWrapper,
    HeaderButtonsWrapper,
    HeaderWrapper,
    SecondSectionWrapper,
} from "./style";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SimpleThemeToggle from "../theme/simple-toggle";
import { useClinicContext } from "../../providers/clinic/context";

export const Header: FC = () => {
    const navigate = useNavigate();
    const { selectedClinic } = useClinicContext();

    const handleAiClick = () => {
        navigate("/ai-assistant")
    }

    return (
        <HeaderWrapper>
            <FirstSectionWrapper>
                {selectedClinic ? (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            src={selectedClinic.logo}
                            sx={{ 
                                width: 40, 
                                height: 40,
                                bgcolor: 'primary.light',
                            }}
                        >
                            {!selectedClinic.logo && <BusinessIcon />}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={600} color="primary.main">
                                {selectedClinic.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {selectedClinic.address}, {selectedClinic.city}
                            </Typography>
                        </Box>
                        <Chip
                            label={selectedClinic.status}
                            color={selectedClinic.status === 'active' ? 'success' : 'default'}
                            size="small"
                            sx={{ ml: 1 }}
                        />
                    </Box>
                ) : (
                    <img src={Logo} alt="Preclinic Logo" />
                )}
            </FirstSectionWrapper> 

            <SecondSectionWrapper>
                <AiButton variant="contained" color="primary" onClick={handleAiClick}>
                    AI Assistance
                </AiButton>

                <HeaderButtonsWrapper>
                    <IconButton onClick={() => navigate("/appointments/create")}>
                        <EventIcon />
                    </IconButton>
                    
                    <SimpleThemeToggle />
                </HeaderButtonsWrapper>

                <AvatarMenu />
            </SecondSectionWrapper>
        </HeaderWrapper>
    );
};