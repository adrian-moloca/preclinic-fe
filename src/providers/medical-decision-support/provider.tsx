import React, { useState, useCallback, ReactNode, useEffect } from 'react';
import { MedicalDecisionSupportContext } from './context';
import { MedicalAlert, VitalSignsReading } from './types';
import { checkMedicationAllergies, findDrugInteractions, getDrugInfo, VITAL_SIGNS_RANGES } from '.';

interface MedicalDecisionSupportProviderProps {
  children: ReactNode;
}

export const MedicalDecisionSupportProvider: React.FC<MedicalDecisionSupportProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<MedicalAlert[]>(() => {
    const stored = localStorage.getItem('medical_alerts');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('medical_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const generateAlertId = () => `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const checkDrugInteractions = useCallback((medications: string[], patientId: string): MedicalAlert[] => {
    const interactions = findDrugInteractions(medications);
    
    return interactions.map(interaction => ({
      id: generateAlertId(),
      type: 'drug_interaction' as const,
      severity: interaction.severity === 'contraindicated' ? 'critical' as const :
                interaction.severity === 'major' ? 'high' as const :
                interaction.severity === 'moderate' ? 'medium' as const : 'low' as const,
      message: `Drug Interaction: ${interaction.drug1} + ${interaction.drug2}`,
      patientId,
      recommendedAction: interaction.recommendation,
      relatedData: {
        medications: [interaction.drug1, interaction.drug2]
      },
      timestamp: new Date()
    }));
  }, []);

  const checkAllergies = useCallback((medications: string[], allergies: string[], patientId: string): MedicalAlert[] => {
    const allergyConflicts = checkMedicationAllergies(medications, allergies);
    
    return allergyConflicts.map(conflict => ({
      id: generateAlertId(),
      type: 'allergy_warning' as const,
      severity: 'critical' as const,
      message: `Allergy Alert: ${conflict.medication} may trigger ${conflict.allergy}`,
      patientId,
      recommendedAction: `Consider alternative medication. Patient has documented allergy to ${conflict.allergy}`,
      relatedData: {
        medications: [conflict.medication],
        allergies: [conflict.allergy]
      },
      timestamp: new Date()
    }));
  }, []);

  const validateVitalSigns = useCallback((vitalSigns: VitalSignsReading, age: number, patientId: string): MedicalAlert[] => {
    const alerts: MedicalAlert[] = [];
    const ageGroup = age < 18 ? 'child' : age > 65 ? 'elderly' : 'adult';

    // Check blood pressure
    if (vitalSigns.bloodPressure) {
      const systolicRange = VITAL_SIGNS_RANGES.find(r => r.parameter === 'systolic_bp' && r.ageGroup === ageGroup);
      
      if (systolicRange) {
        const systolic = vitalSigns.bloodPressure.systolic;
        let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
        let message = '';
        
        if (systolic < systolicRange.critical.min || systolic > systolicRange.critical.max) {
          severity = 'critical';
          message = `Critical Blood Pressure: ${systolic}/${vitalSigns.bloodPressure.diastolic} mmHg`;
        } else if (systolic < systolicRange.warning.min || systolic > systolicRange.warning.max) {
          severity = 'medium';
          message = `Abnormal Blood Pressure: ${systolic}/${vitalSigns.bloodPressure.diastolic} mmHg`;
        }
        
        if (message) {
          alerts.push({
            id: generateAlertId(),
            type: 'vital_signs_alert',
            severity,
            message,
            patientId,
            recommendedAction: severity === 'critical' ? 'Immediate intervention required' : 'Monitor closely and consider intervention',
            relatedData: { vitalSigns },
            timestamp: new Date()
          });
        }
      }
    }

    if (vitalSigns.heartRate) {
      const heartRateRange = VITAL_SIGNS_RANGES.find(r => r.parameter === 'heart_rate' && r.ageGroup === ageGroup);
      
      if (heartRateRange) {
        const hr = vitalSigns.heartRate;
        let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
        let message = '';
        
        if (hr < heartRateRange.critical.min || hr > heartRateRange.critical.max) {
          severity = 'critical';
          message = `Critical Heart Rate: ${hr} bpm`;
        } else if (hr < heartRateRange.warning.min || hr > heartRateRange.warning.max) {
          severity = 'medium';
          message = `Abnormal Heart Rate: ${hr} bpm`;
        }
        
        if (message) {
          alerts.push({
            id: generateAlertId(),
            type: 'vital_signs_alert',
            severity,
            message,
            patientId,
            recommendedAction: severity === 'critical' ? 'Immediate cardiac assessment required' : 'Monitor cardiac status',
            relatedData: { vitalSigns },
            timestamp: new Date()
          });
        }
      }
    }

    if (vitalSigns.temperature) {
      const tempRange = VITAL_SIGNS_RANGES.find(r => r.parameter === 'temperature' && r.ageGroup === ageGroup);
      
      if (tempRange) {
        const temp = vitalSigns.temperature;
        let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
        let message = '';
        
        if (temp < tempRange.critical.min || temp > tempRange.critical.max) {
          severity = 'critical';
          message = `Critical Temperature: ${temp}°C`;
        } else if (temp < tempRange.warning.min || temp > tempRange.warning.max) {
          severity = 'medium';
          message = `Abnormal Temperature: ${temp}°C`;
        }
        
        if (message) {
          alerts.push({
            id: generateAlertId(),
            type: 'vital_signs_alert',
            severity,
            message,
            patientId,
            recommendedAction: severity === 'critical' ? 'Immediate intervention for temperature control' : 'Monitor temperature and consider intervention',
            relatedData: { vitalSigns },
            timestamp: new Date()
          });
        }
      }
    }

    if (vitalSigns.oxygenSaturation) {
      const o2Range = VITAL_SIGNS_RANGES.find(r => r.parameter === 'oxygen_saturation' && r.ageGroup === ageGroup);
      
      if (o2Range) {
        const o2 = vitalSigns.oxygenSaturation;
        let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
        let message = '';
        
        if (o2 < o2Range.critical.min || o2 > o2Range.critical.max) {
          severity = 'critical';
          message = `Critical Oxygen Saturation: ${o2}%`;
        } else if (o2 < o2Range.warning.min || o2 > o2Range.warning.max) {
          severity = 'medium';
          message = `Low Oxygen Saturation: ${o2}%`;
        }
        
        if (message) {
          alerts.push({
            id: generateAlertId(),
            type: 'vital_signs_alert',
            severity,
            message,
            patientId,
            recommendedAction: severity === 'critical' ? 'Immediate oxygen therapy required' : 'Monitor respiratory status',
            relatedData: { vitalSigns },
            timestamp: new Date()
          });
        }
      }
    }

    return alerts;
  }, []);

  const checkDosageAppropriate = useCallback((medication: string, dosage: string, age: number, weight?: number, patientId?: string): MedicalAlert[] => {
    const drugInfo = getDrugInfo(medication);
    if (!drugInfo || !patientId) return [];

    const alerts: MedicalAlert[] = [];

    if (drugInfo.ageRestrictions) {
      if (drugInfo.ageRestrictions.minAge && age < drugInfo.ageRestrictions.minAge) {
        alerts.push({
          id: generateAlertId(),
          type: 'dosage_warning',
          severity: 'high',
          message: `Age Restriction: ${medication} not recommended for patients under ${drugInfo.ageRestrictions.minAge} years`,
          patientId,
          recommendedAction: 'Consider alternative medication or specialist consultation',
          relatedData: { medications: [medication], age },
          timestamp: new Date()
        });
      }

      if (drugInfo.ageRestrictions.maxAge && age > drugInfo.ageRestrictions.maxAge) {
        alerts.push({
          id: generateAlertId(),
          type: 'dosage_warning',
          severity: 'medium',
          message: `Age Consideration: ${medication} requires caution in patients over ${drugInfo.ageRestrictions.maxAge} years`,
          patientId,
          recommendedAction: drugInfo.ageRestrictions.geriatricConsiderations || 'Consider dose adjustment',
          relatedData: { medications: [medication], age },
          timestamp: new Date()
        });
      }
    }

    if (drugInfo.contraindications.length > 0) {
      alerts.push({
        id: generateAlertId(),
        type: 'contraindication',
        severity: 'medium',
        message: `Review Contraindications: ${medication} has the following contraindications: ${drugInfo.contraindications.join(', ')}`,
        patientId,
        recommendedAction: 'Verify patient does not have any contraindicated conditions',
        relatedData: { medications: [medication] },
        timestamp: new Date()
      });
    }

    return alerts;
  }, []);

  const checkFollowUpDue = useCallback((patientId: string, lastVisit: Date, diagnosis?: string): MedicalAlert[] => {
    const alerts: MedicalAlert[] = [];
    const daysSinceLastVisit = Math.floor((new Date().getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));

    let followUpDays = 30;

    if (diagnosis) {
      const diagnosisLower = diagnosis.toLowerCase();
      if (diagnosisLower.includes('diabetes')) followUpDays = 90;
      if (diagnosisLower.includes('hypertension')) followUpDays = 60;
      if (diagnosisLower.includes('asthma')) followUpDays = 90;
      if (diagnosisLower.includes('depression')) followUpDays = 30;
      if (diagnosisLower.includes('heart')) followUpDays = 30;
      if (diagnosisLower.includes('cancer')) followUpDays = 14;
    }

    if (daysSinceLastVisit > followUpDays) {
      alerts.push({
        id: generateAlertId(),
        type: 'follow_up_due',
        severity: daysSinceLastVisit > followUpDays * 1.5 ? 'high' : 'medium',
        message: `Follow-up Overdue: Patient last seen ${daysSinceLastVisit} days ago`,
        patientId,
        recommendedAction: `Schedule follow-up appointment. Recommended interval for ${diagnosis || 'general care'} is ${followUpDays} days`,
        relatedData: {},
        timestamp: new Date()
      });
    }

    return alerts;
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  }, []);

  const acknowledgeAlert = useCallback((alertId: string, userId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledgedBy: userId } : alert
    ));
  }, []);

  const clearAlertsForPatient = useCallback((patientId: string) => {
    setAlerts(prev => prev.filter(alert => alert.patientId !== patientId));
  }, []);

  const getAlertsForPatient = useCallback((patientId: string) => {
    return alerts.filter(alert => alert.patientId === patientId && !alert.dismissed);
  }, [alerts]);

  const getCriticalAlerts = useCallback(() => {
    return alerts.filter(alert => alert.severity === 'critical' && !alert.dismissed);
  }, [alerts]);

  const addAlerts = useCallback((newAlerts: MedicalAlert[]) => {
    setAlerts(prev => [...prev, ...newAlerts]);
  }, []);

  const checkDrugInteractionsAndAdd = useCallback((medications: string[], patientId: string): MedicalAlert[] => {
    const newAlerts = checkDrugInteractions(medications, patientId);
    addAlerts(newAlerts);
    return newAlerts;
  }, [checkDrugInteractions, addAlerts]);

  const checkAllergiesAndAdd = useCallback((medications: string[], allergies: string[], patientId: string): MedicalAlert[] => {
    const newAlerts = checkAllergies(medications, allergies, patientId);
    addAlerts(newAlerts);
    return newAlerts;
  }, [checkAllergies, addAlerts]);

  const validateVitalSignsAndAdd = useCallback((vitalSigns: VitalSignsReading, age: number, patientId: string): MedicalAlert[] => {
    const newAlerts = validateVitalSigns(vitalSigns, age, patientId);
    addAlerts(newAlerts);
    return newAlerts;
  }, [validateVitalSigns, addAlerts]);

  const value = {
    alerts,
    checkDrugInteractions: checkDrugInteractionsAndAdd,
    checkAllergies: checkAllergiesAndAdd,
    validateVitalSigns: validateVitalSignsAndAdd,
    checkDosageAppropriate,
    checkFollowUpDue,
    dismissAlert,
    acknowledgeAlert,
    clearAlertsForPatient,
    getAlertsForPatient,
    getCriticalAlerts
  };

  return (
    <MedicalDecisionSupportContext.Provider value={value}>
      {children}
    </MedicalDecisionSupportContext.Provider>
  );
};