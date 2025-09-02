import React, { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WaitingRoom from '../../components/telemedicine/virtual-waiting-room';

export const WaitingRoomView: FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  
  if (!appointmentId) {
    return <div>Appointment ID required</div>;
  }

  const handleJoinCall = () => {
    navigate(`/telemedicine/call/${appointmentId}`);
  };

  return (
    <WaitingRoom 
      appointmentId={appointmentId}
      onJoinCall={handleJoinCall}
    />
  );
};