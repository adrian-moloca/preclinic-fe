import { FC } from "react";
import { ButtonsWrapper, CustomIconButton } from "./style";
import Facebook from "../../assets/facebook-logo.png";
import Google from "../../assets/google-logo.png";
import Apple from "../../assets/apple-logo.png";

export const SocialButtons: FC = () => {
    return (
        <ButtonsWrapper>
          <CustomIconButton>
            <img src={Facebook} alt="Facebook" style={{ width: 24, height: 24 }} />
          </CustomIconButton>
          <CustomIconButton>
            <img src={Google} alt="Google" style={{ width: 24, height: 24 }} />
          </CustomIconButton>
          <CustomIconButton>
            <img src={Apple} alt="Apple" style={{ width: 24, height: 24 }} />
          </CustomIconButton>
        </ButtonsWrapper>
    )
}