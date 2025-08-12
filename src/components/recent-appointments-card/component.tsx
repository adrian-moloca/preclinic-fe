import { FC } from "react";
import { RecentAppointmentsWrapper } from "./style";
import AllAppointments from "../../views/appointments/all-appointments";

export const RecentAppointmentsCard: FC = () => {

    return (
        <RecentAppointmentsWrapper>
            <AllAppointments />
        </RecentAppointmentsWrapper>
    );
};
