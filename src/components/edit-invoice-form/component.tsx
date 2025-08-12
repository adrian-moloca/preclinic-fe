import React, { FC, useState, useEffect, useMemo } from "react";
import { Box, Paper, Divider, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { usePatientsContext } from "../../providers/patients";
import { useAppointmentsContext } from "../../providers/appointments";
import { useProductsContext } from "../../providers/products";
import { useInvoicesContext } from "../../providers/invoices";
import { useDepartmentsContext } from "../../providers/departments";
import { IInvoice } from "../../providers/invoices/types";
import { PatientsEntry } from "../../providers/patients/types";
import { AppointmentsEntry } from "../../providers/appointments/types";
import { MedicalProduct } from "../../providers/products/types";
import InvoiceHeader from "../add-invoice-form/components/invoice-header";
import InvoiceBasicInfo from "../add-invoice-form/components/basic-info";
import PatientInformation from "../add-invoice-form/patient-information";
import DepartmentPaymentInfo from "../add-invoice-form/components/department-payment";
import ProductsSection from "../add-invoice-form/components/products-section";

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

export const EditInvoiceForm: FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { patients } = usePatientsContext();
    const { appointments } = useAppointmentsContext();
    const { products } = useProductsContext();
    const { departments } = useDepartmentsContext();
    const { invoices, updateInvoice } = useInvoicesContext();

    const currentInvoice = useMemo(() => {
        return invoices.find(invoice => invoice.id === id);
    }, [invoices, id]);

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

    const [formData, setFormData] = useState<Partial<IInvoice>>({});
    const [selectedPatient, setSelectedPatient] = useState<PatientsEntry | null>(null);
    const [, setPatientAppointments] = useState<AppointmentsEntry[]>([]);
    const [appointmentFilter, setAppointmentFilter] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<InvoiceProduct[]>([]);
    const [currentProduct, setCurrentProduct] = useState({
        productId: "",
        quantity: 1
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (currentInvoice) {
            setFormData({
                id: currentInvoice.id,
                invoiceNumber: currentInvoice.invoiceNumber,
                patientId: currentInvoice.patientId || "",
                patientName: currentInvoice.patientName || "",
                email: currentInvoice.email || "",
                department: currentInvoice.department || "",
                tax: currentInvoice.tax || "0",
                invoiceDate: currentInvoice.invoiceDate || "",
                dueDate: currentInvoice.dueDate || "",
                patientAddress: currentInvoice.patientAddress || "",
                appointment: currentInvoice.appointment || "",
                billingAddress: currentInvoice.billingAddress || "",
                paymentMethod: currentInvoice.paymentMethod || "",
                paymentStatus: currentInvoice.paymentStatus || "Pending",
                productName: currentInvoice.productName || "",
                description: currentInvoice.description || "",
                unitCost: currentInvoice.unitCost || "0",
                quantity: currentInvoice.quantity || "1",
                amount: currentInvoice.amount || "0"
            });

            const patient = patientsArray.find(p => p.id === currentInvoice.patientId);
            if (patient) {
                setSelectedPatient(patient);
            }

            if (currentInvoice.description && currentInvoice.productName) {
                const mainProductAmount = parseFloat(currentInvoice.amount || "0");
                const tax = parseFloat(currentInvoice.tax || "0");
                const subtotal = mainProductAmount / (1 + tax / 100);
                
                const initialProduct: InvoiceProduct = {
                    productId: "", 
                    productName: currentInvoice.productName,
                    unitCost: subtotal,
                    quantity: 1,
                    amount: subtotal
                };
                setSelectedProducts([initialProduct]);
            }

            setIsLoading(false);
        } else if (id && invoices.length > 0) {
            navigate("/invoices/all-invoices");
        }
    }, [currentInvoice, patientsArray, id, invoices.length, navigate]);

    useEffect(() => {
        if (!id) {
            navigate("/invoices/all-invoices");
        }
    }, [id, navigate]);

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

    const handleUpdate = async () => {
        if (!validateForm() || !currentInvoice) return;

        const mainProduct = selectedProducts[0];
        const productsDescription = selectedProducts.map(p => 
            `${p.productName} (Qty: ${p.quantity})`
        ).join(", ");

        const updatedInvoice: IInvoice = {
            ...formData,
            id: currentInvoice.id,
            productName: mainProduct?.productName || "Multiple Products",
            description: productsDescription,
            unitCost: totalAmount.toString(),
            quantity: "1",
            amount: totalAmount.toString()
        } as IInvoice;

        try {
            updateInvoice(currentInvoice.id, updatedInvoice);
            navigate("/invoices/all");
        } catch (error) {
            console.error("Failed to update invoice:", error);
        }
    };

    if (isLoading || !currentInvoice) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center"
                minHeight="50vh"
                p={3}
            >
                <Typography variant="h6" color="text.secondary">
                    {!currentInvoice && invoices.length > 0 ? "Invoice not found" : "Loading invoice..."}
                </Typography>
            </Box>
        );
    }

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
                <InvoiceHeader title="Edit Invoice" />

                <Divider sx={{ mb: 4, borderColor: "#e0e0e0" }} />

                <InvoiceBasicInfo
                    formData={formData}
                    errors={errors}
                    onInputChange={handleInputChange}
                    isEdit={true}
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
                        onClick={() => navigate("/invoices/all-invoices")}
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
                        onClick={handleUpdate}
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
                        Update Invoice
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export type { InvoiceProduct, DepartmentEntry };