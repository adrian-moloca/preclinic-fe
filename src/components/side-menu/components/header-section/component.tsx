import { FC } from "react";
import { HeaderTitle, SectionHeaderWrapper } from "./style";

interface SectionHeaderProps {
  title: string;
  open: boolean;
}

export const SectionHeader: FC<SectionHeaderProps> = ({ title, open }) => {
  if (!open) return null;
  
  return (
    <SectionHeaderWrapper>
      <HeaderTitle>
        {title}
      </HeaderTitle>
    </SectionHeaderWrapper>
  );
};