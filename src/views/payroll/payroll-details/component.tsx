import { FC, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography, Grid } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { usePayrollsContext } from "../../../providers/payroll/context";
import DeleteModal from "../../../components/delete-modal";
import PayrollDetailsHeader from "./components/payroll-details-header";
import EmployeeInfoCard from "./components/employee-info-card";
import EarningsCard from "./components/earnings-card";
import DeductionsCard from "./components/deductions-card";
import PayrollPDFGenerator from "./components/pdf-generator";

export const PayrollDetails: FC = () => {
    const { id } = useParams<{ id: string }>();
    const { payrolls, deletePayroll } = usePayrollsContext();
    const navigate = useNavigate();
    
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const payroll = useMemo(() => {
        if (!payrolls || !id) return null;
        
        if (Array.isArray(payrolls)) {
            return payrolls.find(p => p.id === id);
        }
        
        return payrolls[id] || null;
    }, [payrolls, id]);

    const calculations = useMemo(() => {
        if (!payroll) return { totalEarnings: 0, totalDeductions: 0, netSalary: 0 };

        const totalEarnings = (payroll.basicSalary || 0) +
            (payroll.da || 0) +
            (payroll.hra || 0) +
            (payroll.conveyance || 0) +
            (payroll.medicalAllowance || 0) +
            (payroll.otherEarnings || 0);

        const totalDeductions = (payroll.tds || 0) +
            (payroll.pf || 0) +
            (payroll.esi || 0) +
            (payroll.profTax || 0) +
            (payroll.labourWelfareFund || 0) +
            (payroll.otherDeductions || 0);

        return {
            totalEarnings,
            totalDeductions,
            netSalary: totalEarnings - totalDeductions
        };
    }, [payroll]);

    const formatCurrency = (amount: number | undefined | null) => {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return '$0.00';
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const handleEdit = () => {
        navigate(`/payroll/edit/${id}`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!payroll || !id) return;

        setIsDeleting(true);
        try {
            await deletePayroll(id);
            setDeleteModalOpen(false);
            navigate('/payroll/all-payrolls');
        } catch (error) {
            console.error('Error deleting payroll:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        if (!isDeleting) {
            setDeleteModalOpen(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        if (!payroll) return;

        try {
            const employeeName = payroll.employee || 'Unknown Employee';
            const nameParts = employeeName.split('(');
            const name = nameParts[0]?.trim() || 'Unknown';
            const role = nameParts.length > 1 ? nameParts[1]?.replace(')', '').trim() : 'Employee';

            const htmlContent = PayrollPDFGenerator.generateHTML({
                payroll,
                name,
                role,
                calculations,
                formatCurrency,
                formatDate
            });

            const fileName = `payroll-slip-${name.replace(/\s+/g, '-').toLowerCase()}-${formatDate(payroll.date).replace(/\s+/g, '-').toLowerCase()}.html`;

            PayrollPDFGenerator.downloadAndPrint(htmlContent, fileName);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    const handleBack = () => {
        navigate('/payroll/all-payrolls');
    };

    if (!payroll) {
        return (
            <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={600} mb={2} color="error">
                        Payroll Record Not Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={4}>
                        The requested payroll record could not be found or may have been deleted.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                    >
                        Back to Payrolls
                    </Button>
                </Paper>
            </Box>
        );
    }

    const employeeName = payroll.employee || 'Unknown Employee';
    const nameParts = employeeName.split('(');
    const name = nameParts[0]?.trim() || 'Unknown';
    const role = nameParts.length > 1 ? nameParts[1]?.replace(')', '').trim() : 'Employee';

    return (
         <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <PayrollDetailsHeader
                name={name}
                date={formatDate(payroll.date)}
                onBack={handleBack}
                onPrint={handlePrint}
                onDownload={handleDownload}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <Grid container spacing={4} justifyContent="center">
                <Grid>
                    <EmployeeInfoCard
                        name={name}
                        role={role}
                        date={formatDate(payroll.date)}
                        payrollId={payroll.id}
                    />
                </Grid>

                <Grid>
                    <EarningsCard
                        payroll={payroll}
                        totalEarnings={calculations.totalEarnings}
                        formatCurrency={formatCurrency}
                    />

                    <DeductionsCard
                        payroll={payroll}
                        totalDeductions={calculations.totalDeductions}
                        formatCurrency={formatCurrency}
                    />
                </Grid>
            </Grid>

            <DeleteModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Payroll"
                itemName={payroll ? `${name}'s payroll` : 'this payroll'}
                message={payroll
                    ? `Are you sure you want to delete the payroll record for ${name} dated ${formatDate(payroll.date)}? This action cannot be undone.`
                    : 'Are you sure you want to delete this payroll? This action cannot be undone.'
                }
                isDeleting={isDeleting}
            />
        </Box>
    );
};