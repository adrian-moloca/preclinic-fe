import React, { FC, useState, useEffect, useMemo } from "react";
import { Box, Paper, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { usePatientsContext } from "../../providers/patients";
import { useAppointmentsContext } from "../../providers/appointments";
import { useProductsContext } from "../../providers/products";
import { useInvoicesContext } from "../../providers/invoices";
import { useDepartmentsContext } from "../../providers/departments";
import { IInvoice } from "../../providers/invoices/types";
import { PatientsEntry } from "../../providers/patients/types";
import { AppointmentsEntry } from "../../providers/appointments/types";
import { MedicalProduct } from "../../providers/products/types";
import ProductsSection from "./components/products-section";
import DepartmentPaymentInfo from "./components/department-payment";
import PatientInformation from "./patient-information";
import InvoiceBasicInfo from "./components/basic-info";
import InvoiceHeader from "./components/invoice-header";

interface InvoiceProduct {
    productId: string;
    productName: string;
    unitCost: number;
    quantity: number;
    amount: number;
}

interface DepartmentEntry {
    id: string;
    name: string;
    description?: string;
}

export const AddInvoiceForm: FC = () => {
    const navigate = useNavigate();
    const { patients } = usePatientsContext();
    const { appointments } = useAppointmentsContext();
    const { products } = useProductsContext();
    const { departments } = useDepartmentsContext();
    const { addInvoice } = useInvoicesContext();

    const patientsArray: PatientsEntry[] = useMemo(() => {
        if (Array.isArray(patients)) {
            return patients;
        }
        return Object.values(patients).flat() as PatientsEntry[];
    }, [patients]);

    const appointmentsArray: AppointmentsEntry[] = useMemo(() => {
        if (Array.isArray(appointments)) {
            return appointments;
        }
        return Object.values(appointments).flat() as AppointmentsEntry[];
    }, [appointments]);

    const productsArray: MedicalProduct[] = useMemo(() => {
        if (Array.isArray(products)) {
            return products as MedicalProduct[];
        }
        return Object.values(products).flat() as MedicalProduct[];
    }, [products]);

    const departmentsArray: DepartmentEntry[] = useMemo(() => {
        if (Array.isArray(departments)) {
            return departments as DepartmentEntry[];
        }
        return Object.values(departments).flat() as DepartmentEntry[];
    }, [departments]);

    const [formData, setFormData] = useState<Partial<IInvoice>>({
        id: uuidv4(),
        invoiceNumber: `INV-${Date.now()}`,
        patientId: "",
        patientName: "",
        email: "",
        department: "",
        tax: "0",
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: "",
        patientAddress: "",
        appointment: "",
        billingAddress: "",
        paymentMethod: "",
        paymentStatus: "Pending",
        productName: "",
        description: "",
        unitCost: "0",
        quantity: "1",
        amount: "0"
    });

    const [selectedPatient, setSelectedPatient] = useState<PatientsEntry | null>(null);
    const [, setPatientAppointments] = useState<AppointmentsEntry[]>([]);
    const [appointmentFilter, setAppointmentFilter] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<InvoiceProduct[]>([]);
    const [currentProduct, setCurrentProduct] = useState({
        productId: "",
        quantity: 1
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const subtotal = selectedProducts.reduce((sum, product) => sum + product.amount, 0);
    const taxAmount = (subtotal * parseFloat(formData.tax || "0")) / 100;
    const totalAmount = subtotal + taxAmount;

    const filteredAppointments = useMemo(() => {
        if (!selectedPatient) return [];
        
        let filtered = appointmentsArray.filter(
            appointment => appointment.patientId === selectedPatient.id
        );

        if (appointmentFilter.trim()) {
            const filterLower = appointmentFilter.toLowerCase();
            filtered = filtered.filter(appointment => 
                appointment.appointmentType?.toLowerCase().includes(filterLower) ||
                appointment.reason?.toLowerCase().includes(filterLower) ||
                appointment.date?.toLowerCase().includes(filterLower)
            );
        }

        return filtered;
    }, [selectedPatient, appointmentsArray, appointmentFilter]);

    useEffect(() => {
        if (selectedPatient) {
            const filteredAppointments = appointmentsArray.filter(
                appointment => appointment.patientId === selectedPatient.id
            );
            setPatientAppointments(filteredAppointments);
        } else {
            setPatientAppointments([]);
            setAppointmentFilter("");
        }
    }, [selectedPatient, appointmentsArray]);

    const handlePatientChange = (patientId: string) => {
        const patient = patientsArray.find(p => p.id === patientId);
        if (patient) {
            setSelectedPatient(patient);
            setFormData(prev => ({
                ...prev,
                patientId: patient.id,
                patientName: `${patient.firstName} ${patient.lastName}`,
                email: patient.email,
                patientAddress: `${patient.address}, ${patient.city}, ${patient.state}, ${patient.country}`,
                billingAddress: `${patient.address}, ${patient.city}, ${patient.state}, ${patient.country}`,
                appointment: ""
            }));
            setErrors(prev => ({
                ...prev,
                patientId: "",
                patientName: "",
                email: ""
            }));
            setAppointmentFilter("");
        }
    };

    const handleInputChange = (field: keyof IInvoice) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
    ) => {
        const value = event.target.value as string;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const handleAddProduct = () => {
        if (!currentProduct.productId || currentProduct.quantity <= 0) {
            return;
        }

        const product = productsArray.find(p => p.id === currentProduct.productId);
        if (!product) return;

        const amount = product.unitPrice * currentProduct.quantity;
        
        const invoiceProduct: InvoiceProduct = {
            productId: product.id,
            productName: product.name,
            unitCost: product.unitPrice,
            quantity: currentProduct.quantity,
            amount: amount
        };

        setSelectedProducts(prev => [...prev, invoiceProduct]);
        setCurrentProduct({ productId: "", quantity: 1 });
    };

    const handleRemoveProduct = (index: number) => {
        setSelectedProducts(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.patientId) newErrors.patientId = "Patient is required";
        if (!formData.invoiceDate) newErrors.invoiceDate = "Invoice date is required";
        if (!formData.dueDate) newErrors.dueDate = "Due date is required";
        if (!formData.department) newErrors.department = "Department is required";
        if (!formData.paymentMethod) newErrors.paymentMethod = "Payment method is required";
        if (selectedProducts.length === 0) newErrors.products = "At least one product is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const mainProduct = selectedProducts[0];
        const productsDescription = selectedProducts.map(p => 
            `${p.productName} (Qty: ${p.quantity})`
        ).join(", ");

        const invoice: IInvoice = {
            ...formData,
            productName: mainProduct?.productName || "Multiple Products",
            description: productsDescription,
            unitCost: totalAmount.toString(),
            quantity: "1",
            amount: totalAmount.toString()
        } as IInvoice;

        addInvoice(invoice);
        // navigate("/invoices/all");
    };

    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            p={3}
            sx={{
                minHeight: "100vh",
                backgroundColor: "#fafafa"
            }}
        >
            <Paper 
                elevation={2} 
                sx={{ 
                    maxWidth: 1400, 
                    width: "100%", 
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
                }}
            >
                <InvoiceHeader />

                <Divider sx={{ mb: 4, borderColor: "#e0e0e0" }} />

                <InvoiceBasicInfo
                    formData={formData}
                    errors={errors}
                    onInputChange={handleInputChange}
                />

                <PatientInformation
                    formData={formData}
                    selectedPatient={selectedPatient}
                    patientsArray={patientsArray}
                    filteredAppointments={filteredAppointments}
                    appointmentFilter={appointmentFilter}
                    errors={errors}
                    onPatientChange={handlePatientChange}
                    onInputChange={handleInputChange}
                    onAppointmentFilterChange={setAppointmentFilter}
                />

                <DepartmentPaymentInfo
                    formData={formData}
                    departmentsArray={departmentsArray}
                    errors={errors}
                    onInputChange={handleInputChange}
                />

                <ProductsSection
                    currentProduct={currentProduct}
                    selectedProducts={selectedProducts}
                    productsArray={productsArray}
                    errors={errors}
                    onCurrentProductChange={setCurrentProduct}
                    onAddProduct={handleAddProduct}
                    onRemoveProduct={handleRemoveProduct}
                />

                <Box display="flex" justifyContent="space-between" gap={3} sx={{ mt: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/invoices/all")}
                        size="large"
                        sx={{ 
                            px: 4, 
                            py: 1.5, 
                            fontWeight: 600,
                            borderWidth: 2,
                            "&:hover": {
                                borderWidth: 2
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        size="large"
                        disabled={selectedProducts.length === 0}
                        sx={{ 
                            px: 4, 
                            py: 1.5, 
                            fontWeight: 600,
                            boxShadow: "none",
                            "&:hover": {
                                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)"
                            },
                            "&:disabled": {
                                bgcolor: "#e0e0e0",
                                color: "#9e9e9e"
                            }
                        }}
                    >
                        Create Invoice
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export type { InvoiceProduct, DepartmentEntry };