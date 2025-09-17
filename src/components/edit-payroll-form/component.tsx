import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Paper,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { usePayrollsContext } from '../../providers/payroll/context';
import { IPayroll } from '../../providers/payroll/types';
import { useDoctorsContext } from '../../providers/doctor/context';
import { useAssistentsContext } from '../../providers/assistent/context';
import { EarningsCard } from '../add-payroll-form/components/earnings-card/component';
import { DeductionsCard } from '../add-payroll-form/components/deductions-card/component';
import EmployeeInformationCard from '../add-payroll-form/components/employee-information';

const initialFormData = {
  employee: '',
  basicSalary: '',
  da: '', 
  hra: '', 
  conveyance: '',
  medicalAllowance: '',
  otherEarnings: '',
  tds: '',
  pf: '',
  esi: '',
  profTax: '',
  labourWelfareFund: '',
  otherDeductions: '',
  date: new Date().toISOString().split('T')[0],
};

export const EditPayrollForm: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { payrolls, updatePayroll } = usePayrollsContext();
  const { doctors } = useDoctorsContext();
  const { assistents } = useAssistentsContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const payrollToEdit = useMemo(() => {
    if (!payrolls || !id) return null;
    
    if (Array.isArray(payrolls)) {
      return payrolls.find(payroll => payroll.id === id);
    }
    
    return payrolls[id] || null;
  }, [payrolls, id]);

  const employeeOptions = useMemo(() => {
    const doctorOptions = doctors.map(doctor => ({
      id: doctor.id ?? '',
      name: `${doctor.firstName} ${doctor.lastName}`,
      type: 'Doctor',
      department: doctor.department
    }));

    const assistentOptions = assistents.map(assistant => ({
      id: assistant.id ?? '',
      name: `${assistant.firstName} ${assistant.lastName}`,
      type: 'Assistant',
      department: assistant.department
    }));

    return [...doctorOptions, ...assistentOptions];
  }, [doctors, assistents]);

  useEffect(() => {
    if (payrollToEdit) {
      const extractEmployeeId = (employeeString: string) => {
        const matchingEmployee = employeeOptions.find(emp => {
          const formattedName = `${emp.name} (${emp.type})`;
          return formattedName === employeeString;
        });
        return matchingEmployee?.id || '';
      };

      setFormData({
        employee: extractEmployeeId(payrollToEdit.employee),
        basicSalary: payrollToEdit.basicSalary.toString(),
        da: payrollToEdit.da.toString(),
        hra: payrollToEdit.hra.toString(),
        conveyance: payrollToEdit.conveyance.toString(),
        medicalAllowance: payrollToEdit.medicalAllowance.toString(),
        otherEarnings: payrollToEdit.otherEarnings.toString(),
        tds: payrollToEdit.tds.toString(),
        pf: payrollToEdit.pf.toString(),
        esi: payrollToEdit.esi.toString(),
        profTax: payrollToEdit.profTax.toString(),
        labourWelfareFund: payrollToEdit.labourWelfareFund.toString(),
        otherDeductions: payrollToEdit.otherDeductions.toString(),
        date: payrollToEdit.date,
      });
      setIsLoading(false);
    } else if (Object.keys(payrolls || {}).length > 0) {
      setIsLoading(false);
    }
  }, [payrollToEdit, employeeOptions, payrolls]);

  const totalEarnings = useMemo(() => {
    const basicSalary = parseFloat(formData.basicSalary as string) || 0;
    const da = parseFloat(formData.da as string) || 0;
    const hra = parseFloat(formData.hra as string) || 0;
    const conveyance = parseFloat(formData.conveyance as string) || 0;
    const medicalAllowance = parseFloat(formData.medicalAllowance as string) || 0;
    const otherEarnings = parseFloat(formData.otherEarnings as string) || 0;
    
    return basicSalary + da + hra + conveyance + medicalAllowance + otherEarnings;
  }, [formData.basicSalary, formData.da, formData.hra, formData.conveyance, formData.medicalAllowance, formData.otherEarnings]);

  const totalDeductions = useMemo(() => {
    const tds = parseFloat(formData.tds as string) || 0;
    const pf = parseFloat(formData.pf as string) || 0;
    const esi = parseFloat(formData.esi as string) || 0;
    const profTax = parseFloat(formData.profTax as string) || 0;
    const labourWelfareFund = parseFloat(formData.labourWelfareFund as string) || 0;
    const otherDeductions = parseFloat(formData.otherDeductions as string) || 0;
    
    return tds + pf + esi + profTax + labourWelfareFund + otherDeductions;
  }, [formData.tds, formData.pf, formData.esi, formData.profTax, formData.labourWelfareFund, formData.otherDeductions]);

  const netSalary = useMemo(() => {
    return totalEarnings - totalDeductions;
  }, [totalEarnings, totalDeductions]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employee.trim()) {
      newErrors.employee = 'Employee selection is required';
    }

    const basicSalary = parseFloat(formData.basicSalary as string) || 0;
    if (basicSalary <= 0) {
      newErrors.basicSalary = 'Basic salary must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Payroll date is required';
    }

    if (netSalary < 0) {
      newErrors.netSalary = 'Net salary cannot be negative. Please check deductions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value as string }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetForm = () => {
    if (payrollToEdit) {
      const extractEmployeeId = (employeeString: string) => {
        const matchingEmployee = employeeOptions.find(emp => {
          const formattedName = `${emp.name} (${emp.type})`;
          return formattedName === employeeString;
        });
        return matchingEmployee?.id || '';
      };

      setFormData({
        employee: extractEmployeeId(payrollToEdit.employee),
        basicSalary: payrollToEdit.basicSalary.toString(),
        da: payrollToEdit.da.toString(),
        hra: payrollToEdit.hra.toString(),
        conveyance: payrollToEdit.conveyance.toString(),
        medicalAllowance: payrollToEdit.medicalAllowance.toString(),
        otherEarnings: payrollToEdit.otherEarnings.toString(),
        tds: payrollToEdit.tds.toString(),
        pf: payrollToEdit.pf.toString(),
        esi: payrollToEdit.esi.toString(),
        profTax: payrollToEdit.profTax.toString(),
        labourWelfareFund: payrollToEdit.labourWelfareFund.toString(),
        otherDeductions: payrollToEdit.otherDeductions.toString(),
        date: payrollToEdit.date,
      });
    }
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm() && payrollToEdit && id) {
      const selectedEmployee = employeeOptions.find(emp => emp.id === formData.employee);
      
      const updatedPayroll: Partial<IPayroll> = {
        employee: selectedEmployee ? `${selectedEmployee.name} (${selectedEmployee.type})` : formData.employee,
        netSalary: netSalary,
        basicSalary: parseFloat(formData.basicSalary as string) || 0,
        da: parseFloat(formData.da as string) || 0,
        hra: parseFloat(formData.hra as string) || 0,
        conveyance: parseFloat(formData.conveyance as string) || 0,
        medicalAllowance: parseFloat(formData.medicalAllowance as string) || 0,
        tds: parseFloat(formData.tds as string) || 0,
        pf: parseFloat(formData.pf as string) || 0,
        esi: parseFloat(formData.esi as string) || 0,
        profTax: parseFloat(formData.profTax as string) || 0,
        labourWelfareFund: parseFloat(formData.labourWelfareFund as string) || 0,
        otherDeductions: parseFloat(formData.otherDeductions as string) || 0,
        otherEarnings: parseFloat(formData.otherEarnings as string) || 0,
        date: formData.date,
      };
      
      updatePayroll(id, updatedPayroll);
      
      navigate('/payroll/all');
    }
  };

  const handleCancel = () => {
    navigate('/payroll/all');
  };

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">
            Loading...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!payrollToEdit) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={600} mb={4} textAlign="center" color="error">
            Payroll Not Found
          </Typography>
          <Typography variant="body1" textAlign="center" mb={4}>
            The requested payroll record could not be found.
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              onClick={() => navigate('/payroll/all-payrolls')}
            >
              Back to Payrolls
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">
          Edit Payroll - {payrollToEdit.employee}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <EmployeeInformationCard
            formData={{
              employee: formData.employee,
              date: formData.date
            }}
            errors={errors}
            employeeOptions={employeeOptions}
            onInputChange={handleInputChange}
          />

          <EarningsCard
            formData={{
              basicSalary: formData.basicSalary,
              da: formData.da,
              hra: formData.hra,
              conveyance: formData.conveyance,
              medicalAllowance: formData.medicalAllowance,
              otherEarnings: formData.otherEarnings
            }}
            errors={errors}
            totalEarnings={totalEarnings}
            onInputChange={handleInputChange}
          />

          <DeductionsCard
            formData={{
              tds: formData.tds,
              pf: formData.pf,
              esi: formData.esi,
              profTax: formData.profTax,
              labourWelfareFund: formData.labourWelfareFund,
              otherDeductions: formData.otherDeductions
            }}
            totalDeductions={totalDeductions}
            onInputChange={handleInputChange}
          />

              <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              size="large"
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={resetForm}
                size="large"
                sx={{ minWidth: 120 }}
              >
                Reset
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ minWidth: 120 }}
                disabled={netSalary < 0}
              >
                Update Payroll
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};