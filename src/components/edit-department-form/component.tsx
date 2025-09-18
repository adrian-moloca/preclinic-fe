import React, { useState, useMemo, useEffect } from 'react';
import { Box, Paper, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useDepartmentsContext } from '../../providers/departments/context';
import { useDoctorsContext } from '../../providers/doctor/context';
import { useAssistentsContext } from '../../providers/assistent/context';
import DepartmentBasicInfo from '../add-department-form/components/basic-informations';
import DepartmentStaffAssignment from '../add-department-form/components/staff-assigment';
import LoadingState from './components/loading-state';
import DepartmentNotFound from './components/not-found';
import EditDepartmentFormActions from './components/edit-form-actions';

const initialFormData = {
  name: '',
  description: '',
  status: 'active',
  doctors: [] as string[],
  assistants: [] as string[],
};

export const EditDepartmentForm: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { departments, updateDepartment } = useDepartmentsContext();
  const { doctors } = useDoctorsContext();
  const { assistents } = useAssistentsContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const departmentToEdit = useMemo(() => {
    return departments.find(department => department.id === id);
  }, [departments, id]);

  useEffect(() => {
    if (departmentToEdit) {
      // Only extract editable fields
      setFormData({
        name: departmentToEdit.name,
        description: departmentToEdit.description,
        status: departmentToEdit.status,
        doctors: departmentToEdit.doctors || [],
        assistants: departmentToEdit.assistants || [],
      });
      setIsLoading(false);
    } else if (departments.length > 0) {
      setIsLoading(false);
    }
  }, [departmentToEdit, departments]);

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

  const resetForm = () => {
    if (departmentToEdit) {
      setFormData({
        name: departmentToEdit.name,
        description: departmentToEdit.description,
        status: departmentToEdit.status,
        doctors: departmentToEdit.doctors || [],
        assistants: departmentToEdit.assistants || [],
      });
    }
    setErrors({});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm() && departmentToEdit) {
      // Only send the editable fields, not id, createdAt, or updatedAt
      const updatePayload = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        doctors: formData.doctors,
        assistants: formData.assistants,
      };
      
      updateDepartment(departmentToEdit.id!, updatePayload);
      navigate(`/departments/${departmentToEdit.id}`); 
    }
  };

  const handleCancel = () => {
    if (departmentToEdit) {
      navigate(`/departments/${departmentToEdit.id}`);
    } else {
      navigate('/departments/all');
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!departmentToEdit) {
    return <DepartmentNotFound id={id} onBackClick={() => navigate('/departments/all')} />;
  }

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
          Edit Department: {departmentToEdit.name}
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

          <EditDepartmentFormActions
            isFormValid={isFormValid}
            onCancel={handleCancel}
            onReset={resetForm}
          />
        </form>
      </Paper>
    </Box>
  );
};