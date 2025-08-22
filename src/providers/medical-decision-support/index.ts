import { DrugInteraction, DrugInfo, VitalSignsRange } from './types';

export const DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    id: '1',
    drug1: 'Warfarin',
    drug2: 'Aspirin',
    severity: 'major',
    description: 'Increased risk of bleeding',
    clinicalEffect: 'Enhanced anticoagulant effect leading to increased bleeding risk',
    recommendation: 'Monitor INR closely and consider alternative therapy'
  },
  {
    id: '2',
    drug1: 'Metformin',
    drug2: 'Contrast dye',
    severity: 'major',
    description: 'Risk of lactic acidosis',
    clinicalEffect: 'Increased risk of metformin-associated lactic acidosis',
    recommendation: 'Discontinue metformin 48 hours before contrast procedures'
  },
  {
    id: '3',
    drug1: 'Digoxin',
    drug2: 'Furosemide',
    severity: 'moderate',
    description: 'Increased digoxin toxicity risk',
    clinicalEffect: 'Furosemide-induced hypokalemia increases digoxin toxicity risk',
    recommendation: 'Monitor potassium levels and digoxin concentration'
  },
  {
    id: '4',
    drug1: 'Simvastatin',
    drug2: 'Amlodipine',
    severity: 'moderate',
    description: 'Increased statin levels',
    clinicalEffect: 'Amlodipine increases simvastatin exposure',
    recommendation: 'Limit simvastatin dose to 20mg daily when used with amlodipine'
  },
  {
    id: '5',
    drug1: 'Warfarin',
    drug2: 'Amiodarone',
    severity: 'major',
    description: 'Significantly increased INR',
    clinicalEffect: 'Amiodarone inhibits warfarin metabolism',
    recommendation: 'Reduce warfarin dose by 33-50% and monitor INR closely'
  },
  {
    id: '6',
    drug1: 'Lithium',
    drug2: 'Hydrochlorothiazide',
    severity: 'major',
    description: 'Lithium toxicity risk',
    clinicalEffect: 'Thiazide diuretics reduce lithium clearance',
    recommendation: 'Monitor lithium levels closely, consider alternative diuretic'
  }
];

export const DRUG_DATABASE: DrugInfo[] = [
  {
    id: '1',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Analgesic/Antipyretic',
    commonAllergies: ['acetaminophen allergy'],
    contraindications: ['severe liver disease', 'acute hepatitis'],
    ageRestrictions: {
      minAge: 0,
      pediatricDosing: '10-15 mg/kg every 4-6 hours',
      geriatricConsiderations: 'Reduced maximum daily dose in elderly'
    },
    normalDosage: {
      adult: '500-1000mg every 4-6 hours, max 4g/day',
      pediatric: '10-15 mg/kg every 4-6 hours',
      elderly: 'Max 3g/day in elderly patients'
    },
    interactions: ['warfarin', 'alcohol']
  },
  {
    id: '2',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    category: 'Antibiotic (Penicillin)',
    commonAllergies: ['penicillin allergy', 'beta-lactam allergy'],
    contraindications: ['known penicillin allergy', 'mononucleosis'],
    ageRestrictions: {
      minAge: 0,
      pediatricDosing: '20-40 mg/kg/day divided',
      geriatricConsiderations: 'Dose adjustment in renal impairment'
    },
    normalDosage: {
      adult: '250-500mg every 8 hours',
      pediatric: '20-40 mg/kg/day divided every 8 hours',
      elderly: 'Adjust for renal function'
    },
    interactions: ['methotrexate', 'oral contraceptives']
  },
  {
    id: '3',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'NSAID',
    commonAllergies: ['NSAID allergy', 'aspirin allergy'],
    contraindications: ['active GI bleeding', 'severe heart failure', 'severe renal impairment'],
    ageRestrictions: {
      minAge: 6, 
      pediatricDosing: '5-10 mg/kg every 6-8 hours',
      geriatricConsiderations: 'Increased GI and cardiovascular risk'
    },
    normalDosage: {
      adult: '200-400mg every 6-8 hours, max 1.2g/day',
      pediatric: '5-10 mg/kg every 6-8 hours',
      elderly: 'Use lowest effective dose'
    },
    interactions: ['warfarin', 'ACE inhibitors', 'lithium', 'methotrexate']
  },
  {
    id: '4',
    name: 'Metformin',
    genericName: 'Metformin',
    category: 'Antidiabetic (Biguanide)',
    commonAllergies: ['metformin allergy'],
    contraindications: ['severe renal impairment', 'acute heart failure', 'severe liver disease'],
    ageRestrictions: {
      minAge: 10,
      geriatricConsiderations: 'Contraindicated if eGFR < 30'
    },
    normalDosage: {
      adult: '500mg twice daily, titrate up to max 2g/day',
      elderly: 'Start low, monitor renal function'
    },
    interactions: ['contrast dye', 'alcohol', 'furosemide']
  },
  {
    id: '5',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    category: 'ACE Inhibitor',
    commonAllergies: ['ACE inhibitor allergy', 'angioedema history'],
    contraindications: ['pregnancy', 'bilateral renal artery stenosis', 'angioedema history'],
    ageRestrictions: {
      minAge: 6,
      pediatricDosing: '0.07 mg/kg once daily',
      geriatricConsiderations: 'Start with lower doses'
    },
    normalDosage: {
      adult: '2.5-5mg once daily, titrate up to 40mg/day',
      pediatric: '0.07 mg/kg once daily',
      elderly: 'Start with 2.5mg daily'
    },
    interactions: ['potassium supplements', 'NSAIDs', 'lithium']
  }
];

export const VITAL_SIGNS_RANGES: VitalSignsRange[] = [
  {
    parameter: 'systolic_bp',
    ageGroup: 'adult',
    normal: { min: 90, max: 130 },
    warning: { min: 80, max: 150 },
    critical: { min: 70, max: 180 },
    unit: 'mmHg'
  },
  {
    parameter: 'diastolic_bp',
    ageGroup: 'adult',
    normal: { min: 60, max: 85 },
    warning: { min: 50, max: 95 },
    critical: { min: 40, max: 110 },
    unit: 'mmHg'
  },
  {
    parameter: 'heart_rate',
    ageGroup: 'adult',
    normal: { min: 60, max: 100 },
    warning: { min: 50, max: 110 },
    critical: { min: 40, max: 150 },
    unit: 'bpm'
  },
  {
    parameter: 'heart_rate',
    ageGroup: 'child',
    normal: { min: 80, max: 120 },
    warning: { min: 70, max: 140 },
    critical: { min: 60, max: 160 },
    unit: 'bpm'
  },
  {
    parameter: 'heart_rate',
    ageGroup: 'elderly',
    normal: { min: 60, max: 100 },
    warning: { min: 50, max: 110 },
    critical: { min: 40, max: 130 },
    unit: 'bpm'
  },
  {
    parameter: 'temperature',
    ageGroup: 'adult',
    normal: { min: 36.0, max: 37.2 },
    warning: { min: 35.0, max: 38.5 },
    critical: { min: 32.0, max: 40.0 },
    unit: '°C'
  },
  {
    parameter: 'respiratory_rate',
    ageGroup: 'adult',
    normal: { min: 12, max: 20 },
    warning: { min: 10, max: 25 },
    critical: { min: 8, max: 35 },
    unit: '/min'
  },
  {
    parameter: 'oxygen_saturation',
    ageGroup: 'adult',
    normal: { min: 95, max: 100 },
    warning: { min: 90, max: 94 },
    critical: { min: 85, max: 89 },
    unit: '%'
  }
];

export const findDrugInteractions = (medications: string[]): DrugInteraction[] => {
  const interactions: DrugInteraction[] = [];
  
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const med1 = medications[i].toLowerCase();
      const med2 = medications[j].toLowerCase();
      
      const interaction = DRUG_INTERACTIONS.find(
        (int) => 
          (int.drug1.toLowerCase() === med1 && int.drug2.toLowerCase() === med2) ||
          (int.drug1.toLowerCase() === med2 && int.drug2.toLowerCase() === med1)
      );
      
      if (interaction) {
        interactions.push(interaction);
      }
    }
  }
  
  return interactions;
};

export const getDrugInfo = (medicationName: string): DrugInfo | undefined => {
  return DRUG_DATABASE.find(
    (drug) => 
      drug.name.toLowerCase() === medicationName.toLowerCase() ||
      drug.genericName?.toLowerCase() === medicationName.toLowerCase()
  );
};

export const checkMedicationAllergies = (medications: string[], patientAllergies: string[]): Array<{medication: string, allergy: string}> => {
  const conflicts: Array<{medication: string, allergy: string}> = [];
  
  medications.forEach(med => {
    const drugInfo = getDrugInfo(med);
    if (drugInfo) {
      drugInfo.commonAllergies.forEach(drugAllergy => {
        patientAllergies.forEach(patientAllergy => {
          if (drugAllergy.toLowerCase().includes(patientAllergy.toLowerCase()) ||
              patientAllergy.toLowerCase().includes(drugAllergy.toLowerCase())) {
            conflicts.push({ medication: med, allergy: patientAllergy });
          }
        });
      });
    }
  });
  
  return conflicts;
};