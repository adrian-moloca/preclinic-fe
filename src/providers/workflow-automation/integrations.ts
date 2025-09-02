import { useWorkflowAutomation } from './context';

export const useWorkflowEvents = () => {
  const { emitEvent } = useWorkflowAutomation();

  const emitAppointmentCreated = (appointment: any, patient: any) => {
    emitEvent({
      type: 'appointment_created',
      data: { appointment, patient },
      source: 'appointment_form'
    });
  };

  const emitAppointmentCompleted = (appointment: any, patient: any) => {
    emitEvent({
      type: 'appointment_completed',
      data: { appointment, patient },
      source: 'appointment_management'
    });
  };

  const emitPatientRegistered = (patient: any) => {
    emitEvent({
      type: 'patient_registered',
      data: { patient },
      source: 'patient_form'
    });
  };

  const emitPatientCheckedIn = (patient: any, appointment: any) => {
    emitEvent({
      type: 'patient_checked_in',
      data: { patient, appointment },
      source: 'check_in'
    });
  };

  const emitPrescriptionAdded = (prescription: any, patient: any) => {
    emitEvent({
      type: 'prescription_added',
      data: { prescription, patient },
      source: 'prescription_form'
    });
  };

  const emitFileUploaded = (file: any, patient?: any) => {
    emitEvent({
      type: 'file_uploaded',
      data: { file, patient },
      source: 'file_upload'
    });
  };

  const emitVitalSignsEntered = (vitals: any, patient: any) => {
    emitEvent({
      type: 'vital_signs_entered',
      data: { vitals, patient },
      source: 'vital_signs_form'
    });
  };

  const emitPaymentReceived = (payment: any, patient: any, appointment?: any) => {
    emitEvent({
      type: 'payment_received',
      data: { payment, patient, appointment },
      source: 'payment_system'
    });
  };

  return {
    emitAppointmentCreated,
    emitAppointmentCompleted,
    emitPatientRegistered,
    emitPatientCheckedIn,
    emitPrescriptionAdded,
    emitFileUploaded,
    emitVitalSignsEntered,
    emitPaymentReceived
  };
};