import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Divider, Button } from "@mui/material";
import { FC } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useDepartmentsContext } from '../../../providers/departments/context';
import { useDoctorsContext } from '../../../providers/doctor/context';
import { useAssistentsContext } from '../../../providers/assistent/context';
import DeleteModal from '../../../components/delete-modal';
import PageHeader from './components/page-header';
import DepartmentHeader from './components/department-header';
import DepartmentInfoCard from './components/department-info-card';
import StaffListCard from './components/staff-list-card';

export const DepartmentDetails: FC = () => {
    const { id } = useParams<{ id: string }>();
    const { departments, deleteDepartment } = useDepartmentsContext();
    const { doctors } = useDoctorsContext();
    const { assistents } = useAssistentsContext();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const department = departments.find(dept => dept.id === id);

    const handleDeleteClick = () => {
        if (department) {
            setDeleteModalOpen(true);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!department || typeof department.id !== 'string') return;

        setIsDeleting(true);
        try {
            await deleteDepartment(department.id);
            setDeleteModalOpen(false);
            navigate('/departments/all');
        } catch (error) {
            console.error('Error deleting department:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        if (!isDeleting) {
            setDeleteModalOpen(false);
        }
    };

    const handleEdit = () => {
        navigate(`/departments/edit/${id}`);
    };

    const handleDoctorClick = (doctorId: string) => {
        navigate(`/doctors/${doctorId}`);
    };

    const handleAssistantClick = (assistantId: string) => {
        navigate(`/assistents/${assistantId}`);
    };

    const getDepartmentDoctors = () => {
        if (!department?.doctors || department.doctors.length === 0) return [];
        return department.doctors
            .map(doctorId => doctors.find(doctor => doctor.id === doctorId))
            .filter(Boolean);
    };

    const getDepartmentAssistants = () => {
        if (!department?.assistants || department.assistants.length === 0) return [];
        return department.assistants
            .map(assistantId => assistents.find(assistant => assistant.id === assistantId))
            .filter(Boolean);
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'error';
            case 'maintenance':
                return 'warning';
            default:
                return 'default';
        }
    };

    if (!department) {
        return (
            <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="h5" color="error" mb={2}>
                        Department Not Found
                    </Typography>
                    <Typography color="text.secondary" mb={3}>
                        The department with ID "{id}" could not be found.
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/departments/all')}>
                        Back to All Departments
                    </Button>
                </Paper>
            </Box>
        );
    }

    const departmentDoctors = getDepartmentDoctors();
    const departmentAssistants = getDepartmentAssistants();
    const totalStaff = departmentDoctors.length + departmentAssistants.length;

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <PageHeader
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                <DepartmentHeader
                    department={department}
                    totalStaff={totalStaff}
                    getStatusColor={getStatusColor}
                />

                <Divider sx={{ my: 4 }} />

                <Grid container spacing={4} sx={{ display: "flex", justifyContent: "center" }}>
                    <Grid>
                        <DepartmentInfoCard
                            department={department}
                            totalStaff={totalStaff}
                            departmentDoctors={departmentDoctors}
                            departmentAssistants={departmentAssistants}
                            getStatusColor={getStatusColor}
                        />
                    </Grid>

                    <Grid>
                        <StaffListCard
                            title="Assigned Doctors"
                            staff={departmentDoctors}
                            onStaffClick={handleDoctorClick}
                            color="primary"
                            staffType="doctor"
                        />
                    </Grid>

                    <Grid>
                        <StaffListCard
                            title="Assigned Assistants"
                            staff={departmentAssistants}
                            onStaffClick={handleAssistantClick}
                            color="secondary"
                            staffType="assistant"
                        />
                    </Grid>
                </Grid>
            </Paper>

            <DeleteModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Department"
                itemName={department ? department.name : undefined}
                message={department ? `Are you sure you want to delete the "${department.name}" department? This action cannot be undone and will affect all assigned staff members.` : undefined}
                isDeleting={isDeleting}
            />
        </Box>
    );
};