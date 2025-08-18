import React, { FC, useState, useEffect, useMemo } from "react";
import { Box, Paper, Divider, Button, Typography } from "@mui/material";
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
import { Service } from "../../providers/cases/types";
import ProductsSection from "./components/products-section";
import DepartmentPaymentInfo from "./components/department-payment";
import PatientInformation from "./patient-information";
import InvoiceBasicInfo from "./components/basic-info";
import InvoiceHeader from "./components/invoice-header";
import ServicesSection from "../edit-case-form/components/service-table";

export interface InvoiceProduct {
    productId: string;
    productName: string;
    unitCost: number;
    quantity: number;
    amount: number;
}

interface InvoiceService {
    serviceId: string;
    serviceName: string;
    description: string;
    unitCost: number;
    quantity: number;
    amount: number;
    department: string;
}

export interface DepartmentEntry {
    id: string;
    name: string;
    description?: string;
}

interface AddInvoiceFormProps {
    initialData?: {
        patientId?: string;
        patientName?: string;
        email?: string;
        appointmentId?: string;
        services?: Service[];
        prescriptions?: any[];
        checkInData?: any;
        medicalCaseData?: any;
        patientAddress?: string;
        phoneNumber?: string;
        appointment?: {
            id: string;
            department?: string;
            doctorId?: string;
            [key: string]: any;
        };
    };
    onInvoiceCreated?: (invoice: IInvoice) => void;
}

export const AddInvoiceForm: FC<AddInvoiceFormProps> = ({ 
    initialData, 
    onInvoiceCreated 
}) => {
    const navigate = useNavigate();
    const { patients } = usePatientsContext();
    const { appointments } = useAppointmentsContext();
    const { products } = useProductsContext();
    const { departments } = useDepartmentsContext();
    const { addInvoice } = useInvoicesContext();

    console.log("AddInvoiceForm received initialData:", initialData);

    // Helper functions for price calculation
    const calculateServicesTotal = (services: Service[]): number => {
        return services.reduce((total, service) => total + (service.price || 0), 0);
    };

    const generateServiceDescription = (services: Service[]): string => {
        if (!services || services.length === 0) return "";
        return services.map(service => 
            `${service.name}${service.description ? ` - ${service.description}` : ''}`
        ).join(", ");
    };

    const getDepartmentFromData = (): string => {
        if (initialData?.appointment?.department) {
            return initialData.appointment.department;
        }
        
        if (initialData?.services && initialData.services.length > 0) {
            const firstServiceWithDept = initialData.services.find(s => s.category);
            if (firstServiceWithDept) {
                return firstServiceWithDept.category || '';
            }
        }
        
        return '';
    };

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

    const [formData, setFormData] = useState<Partial<IInvoice>>(() => {
        const baseFormData = {
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
        };

        if (initialData) {
            const servicesTotal = calculateServicesTotal(initialData.services || []);
            const serviceDescription = generateServiceDescription(initialData.services || []);
            const departmentName = getDepartmentFromData();
            
            console.log("Pre-filling form with:", {
                patientName: initialData.patientName,
                email: initialData.email,
                department: departmentName,
                servicesTotal,
                serviceDescription
            });

            return {
                ...baseFormData,
                patientId: initialData.patientId || baseFormData.patientId,
                patientName: initialData.patientName || baseFormData.patientName,
                email: initialData.email || baseFormData.email,
                department: departmentName || baseFormData.department,
                appointment: initialData.appointmentId || baseFormData.appointment,
                patientAddress: initialData.patientAddress || baseFormData.patientAddress,
                description: serviceDescription || baseFormData.description,
                unitCost: servicesTotal.toString(),
                amount: servicesTotal.toString(),
            };
        }

        return baseFormData;
    });

    const [selectedPatient, setSelectedPatient] = useState<PatientsEntry | null>(() => {
        if (initialData?.patientId) {
            const patient = patientsArray.find(p => p.id === initialData.patientId);
            console.log("Found patient for pre-selection:", patient);
            return patient || null;
        }
        return null;
    });

    const [patientAppointments, setPatientAppointments] = useState<AppointmentsEntry[]>([]);
    const [appointmentFilter, setAppointmentFilter] = useState("");

    const [selectedServices, setSelectedServices] = useState<InvoiceService[]>(() => {
        if (initialData?.services && initialData.services.length > 0) {
            const services = initialData.services.map(service => ({
                serviceId: service.id,
                serviceName: service.name,
                description: service.description || '',
                unitCost: service.price || 0,
                quantity: 1,
                amount: service.price || 0,
                department: service.category || getDepartmentFromData() || 'General'
            }));
            console.log("Pre-filled services:", services);
            return services;
        }
        return [];
    });

    const [selectedProducts, setSelectedProducts] = useState<InvoiceProduct[]>([]);
    const [currentProduct, setCurrentProduct] = useState({ productId: "", quantity: 1 });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const filteredAppointments = useMemo(() => {
        if (!appointmentFilter.trim()) return patientAppointments;
        return patientAppointments.filter(app => 
            app.id.toLowerCase().includes(appointmentFilter.toLowerCase()) ||
            app.reason?.toLowerCase().includes(appointmentFilter.toLowerCase())
        );
    }, [patientAppointments, appointmentFilter]);

    const servicesTotal = useMemo(() => {
        return selectedServices.reduce((sum, service) => sum + service.amount, 0);
    }, [selectedServices]);

    const productsTotal = useMemo(() => {
        return selectedProducts.reduce((sum, product) => sum + product.amount, 0);
    }, [selectedProducts]);

    const totalAmount = useMemo(() => {
        return servicesTotal + productsTotal;
    }, [servicesTotal, productsTotal]);

    useEffect(() => {
        if (selectedPatient) {
            const appointments = appointmentsArray.filter(app => app.patientId === selectedPatient.id);
            setPatientAppointments(appointments);
            setFormData(prev => ({
                ...prev,
                patientId: selectedPatient.id,
                patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
                email: selectedPatient.email,
                patientAddress: selectedPatient.address || ""
            }));
        }
    }, [selectedPatient, appointmentsArray]);

    useEffect(() => {
        if (initialData && !selectedPatient) {
            const patient = patientsArray.find(p => p.id === initialData.patientId);
            if (patient) {
                setSelectedPatient(patient);
            }
        }
    }, [initialData, patientsArray, selectedPatient]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handlePatientChange = (patient: PatientsEntry | null) => {
        setSelectedPatient(patient);
        if (patient) {
            const appointments = appointmentsArray.filter(app => app.patientId === patient.id);
            setPatientAppointments(appointments);
        } else {
            setPatientAppointments([]);
            setFormData(prev => ({
                ...prev,
                patientId: "",
                patientName: "",
                email: "",
                patientAddress: ""
            }));
        }
    };

    const addProduct = () => {
        if (!currentProduct.productId) {
            setErrors(prev => ({ ...prev, products: "Please select a product" }));
            return;
        }

        const selectedProductData = productsArray.find(p => p.id === currentProduct.productId);
        if (!selectedProductData) return;

        const existingProductIndex = selectedProducts.findIndex(p => p.productId === currentProduct.productId);
        
        if (existingProductIndex !== -1) {
            const updatedProducts = [...selectedProducts];
            updatedProducts[existingProductIndex].quantity += currentProduct.quantity;
            updatedProducts[existingProductIndex].amount = 
                updatedProducts[existingProductIndex].quantity * updatedProducts[existingProductIndex].unitCost;
            setSelectedProducts(updatedProducts);
        } else {
            const newProduct: InvoiceProduct = {
                productId: selectedProductData.id,
                productName: selectedProductData.name,
                unitCost: selectedProductData.unitPrice,
                quantity: currentProduct.quantity,
                amount: selectedProductData.unitPrice * currentProduct.quantity
            };
            setSelectedProducts(prev => [...prev, newProduct]);
        }

        setCurrentProduct({ productId: "", quantity: 1 });
        setErrors(prev => ({ ...prev, products: "" }));
    };

    const removeProduct = (index: number) => {
        setSelectedProducts(prev => prev.filter((_, i) => i !== index));
    };

    const removeService = (index: number) => {
        setSelectedServices(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.patientName) newErrors.patientName = "Patient name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.department) newErrors.department = "Department is required";
        if (!formData.invoiceDate) newErrors.invoiceDate = "Invoice date is required";
        if (!formData.dueDate) newErrors.dueDate = "Due date is required";
        if (!formData.paymentMethod) newErrors.paymentMethod = "Payment method is required";
        if (selectedProducts.length === 0 && selectedServices.length === 0) {
            newErrors.items = "At least one product or service is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const servicesDescription = selectedServices.map(s => 
            `${s.serviceName} (Medical Service)`
        ).join(", ");
        
        const productsDescription = selectedProducts.map(p => 
            `${p.productName} (Qty: ${p.quantity})`
        ).join(", ");

        const combinedDescription = [servicesDescription, productsDescription]
            .filter(Boolean)
            .join(", ");

        const mainItemName = selectedServices[0] ? 
            selectedServices[0].serviceName : 
            selectedProducts[0]?.productName || "Medical Services";

        const invoice: IInvoice = {
            ...formData,
            productName: mainItemName,
            description: combinedDescription,
            unitCost: totalAmount.toString(),
            quantity: "1",
            amount: totalAmount.toString()
        } as IInvoice;

        console.log("Creating invoice:", invoice);
        addInvoice(invoice);
        
        if (onInvoiceCreated) {
            onInvoiceCreated(invoice);
        } else {
            navigate("/invoices/all");
        }
    };

    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            p={3}
            sx={{
                minHeight: onInvoiceCreated ? "auto" : "100vh",
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
                <InvoiceHeader title={onInvoiceCreated ? "Generate Invoice" : "Create Invoice"} />

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

                <ServicesSection
                    services={selectedServices}
                    servicesList={[]} 
                    openServiceDialog={false} 
                    setOpenServiceDialog={() => {}} 
                    selectedService={null} 
                    setSelectedService={() => {}}
                    handleAddService={() => {}} 
                    handleRemoveService={(id: string) => removeService(selectedServices.findIndex(s => s.serviceId === id))}
                    calculateTotal={() => servicesTotal}
                />

                <ProductsSection
                    currentProduct={currentProduct}
                    selectedProducts={selectedProducts}
                    productsArray={productsArray}
                    errors={errors}
                    onCurrentProductChange={setCurrentProduct}
                    onAddProduct={addProduct}
                    onRemoveProduct={removeProduct}
                />

                {errors.items && (
                    <Box sx={{ mb: 2 }}>
                        <Typography color="error" variant="body2">
                            {errors.items}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "flex-end", 
                    mt: 4,
                    p: 3,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    border: '1px solid #e9ecef'
                }}>
                    <Box>
                        {servicesTotal > 0 && (
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Services Total: ${servicesTotal.toFixed(2)}
                            </Typography>
                        )}
                        {productsTotal > 0 && (
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Products Total: ${productsTotal.toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Grand Total: ${totalAmount.toFixed(2)}
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={handleSubmit}
                            sx={{ px: 4, mt: 2 }}
                        >
                            {onInvoiceCreated ? "Generate Invoice" : "Create Invoice"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};
