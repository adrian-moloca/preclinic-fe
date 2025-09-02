import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import VideoCall from '../../components/telemedicine/video-call';

export const VideoCallView: FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  
  if (!appointmentId) {
    return <div>Appointment ID required</div>;
  }

  return <VideoCall appointmentId={appointmentId} />;
};