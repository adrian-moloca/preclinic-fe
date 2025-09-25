import React, { useState, useMemo, useEffect } from 'react';
import { Box, Paper, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from 'react-router-dom';
import { useDepartmentsContext } from '../../providers/departments/context';
import { useDoctorsContext } from '../../providers/doctor/context';
import { useAssistentsContext } from '../../providers/assistent/context';
import DepartmentBasicInfo from './components/basic-informations';
import DepartmentStaffAssignment from './components/staff-assigment';
import DepartmentFormActions from './components/form-actions';

const initialFormData = {
  name: '',
  description: '',
  status: 'active',
  doctors: [] as string[],
  assistants: [] as string[],
};

export const AddDepartmentForm: FC = () => {
  const { addDepartment } = useDepartmentsContext();
  const { doctors, fetchDoctors, hasLoaded: doctorsLoaded } = useDoctorsContext();
  const { assistents, fetchAssistents, hasLoaded: assistentsLoaded } = useAssistentsContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!doctorsLoaded) {
      fetchDoctors();
    }
    if (!assistentsLoaded) {
      fetchAssistents();
    }
  }, [doctorsLoaded, assistentsLoaded, fetchDoctors, fetchAssistents]);

  const isFormValid = useMemo(() => {
    const requiredFields = [
      formData.name.trim(),
      formData.description.trim(),
      formData.status.trim()
    ];

    return requiredFields.every(field => field.length > 0);
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Department description is required';
    }

    if (!formData.status) {
      newErrors.status = 'Department status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value as string;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDoctorsChange = (_: any, newValue: any[]) => {
    setFormData(prev => ({ ...prev, doctors: newValue.map(doctor => doctor.id) }));
  };

  const handleAssistentsChange = (_: any, newValue: any[]) => {
    setFormData(prev => ({ ...prev, assistants: newValue.map(assistant => assistant.id) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      const newDepartment = {
        ...formData,
      };
      
       addDepartment(newDepartment);
      
      setFormData(initialFormData);
      setErrors({});
      
      navigate('/departments/all');
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    navigate('/departments/all');
  };

  const doctorOptions = doctors.map(doctor => ({
    id: doctor.id ?? '',
    label: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    department: doctor.department,
    specialty: doctor.designation || 'General'
  }));

  const assistentOptions = assistents.map(assistant => ({
    id: assistant.id ?? '',
    label: `${assistant.firstName} ${assistant.lastName}`,
    department: assistant.department,
    experience: `${assistant.yearsOfExperience} years`
  }));

  const selectedDoctors = doctorOptions.filter(doctor => formData.doctors.includes(doctor.id));
  const selectedAssistents = assistentOptions.filter(assistant => formData.assistants.includes(assistant.id));

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">
          Add New Department
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <DepartmentBasicInfo
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <DepartmentStaffAssignment
            doctorOptions={doctorOptions}
            assistentOptions={assistentOptions}
            selectedDoctors={selectedDoctors}
            selectedAssistents={selectedAssistents}
            onDoctorsChange={handleDoctorsChange}
            onAssistentsChange={handleAssistentsChange}
          />

          <DepartmentFormActions
            isFormValid={isFormValid}
            onCancel={handleCancel}
          />
        </form>
      </Paper>
    </Box>
  );
};