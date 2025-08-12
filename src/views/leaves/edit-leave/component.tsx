import { FC } from "react";
import EditLeaveForm from "../../../components/edit-leave-form";
import { EditLeaveWrapper } from "./style";

export const EditLeave: FC = () => {
    return (
        <EditLeaveWrapper>
            <EditLeaveForm />
        </EditLeaveWrapper>
    );
};