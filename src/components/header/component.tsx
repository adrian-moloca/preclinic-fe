import { FC } from "react";
import AvatarMenu from "../avatar";
import Logo from "../../assets/preclinic-logo.svg";
import EventIcon from '@mui/icons-material/Event';
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

export const Header: FC = () => {
    const navigate = useNavigate();

    const handleAiClick = () => {
        navigate("/ai-assistant")
    }

    return (
        <HeaderWrapper>
            <FirstSectionWrapper>
                <img src={Logo} alt="Preclinic Logo" />
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