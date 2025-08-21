import React, { FC, useState, useCallback } from "react";
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Divider,
    useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface InvoiceService {
    serviceId: string;
    serviceName: string;
    description: string;
    unitCost: number;
    quantity: number;
    amount: number;
    department: string;
}

interface ServicesSectionProps {
    selectedServices: InvoiceService[];
    onRemoveService: (index: number) => void;
    availableServices?: any[];
    onAddService?: (service: InvoiceService) => void;
    isReadOnly?: boolean;
}

export const ServicesSection: FC<ServicesSectionProps> = ({
    selectedServices,
    onRemoveService,
    availableServices = [],
    onAddService,
    isReadOnly = false
}) => {
    const theme = useTheme();
    const services = Array.isArray(selectedServices) ? selectedServices : [];

    // BULLETPROOF: Force re-render with key
    const [modalKey, setModalKey] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const totalServicesAmount = services.reduce((sum, service) => sum + service.amount, 0);

    // BULLETPROOF: Use useCallback to prevent re-creation
    const openModal = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log("🚀 Opening modal - current state:", modalOpen);
        setModalOpen(true);
        setModalKey(prev => prev + 1); // Force re-render
        console.log("✅ Modal state set to true");
    }, [modalOpen]);

    const closeModal = useCallback(() => {
        console.log("🔒 Closing modal");
        setModalOpen(false);
        setSearchQuery("");
    }, []);

    const handleSelectService = useCallback((service: any) => {
        console.log("📋 Selecting service:", service);
        
        const newService: InvoiceService = {
            serviceId: service.id || `service-${Date.now()}`,
            serviceName: service.name || service.serviceName || 'Unknown Service',
            description: service.description || '',
            unitCost: service.price || service.unitCost || 0,
            quantity: 1,
            amount: service.price || service.unitCost || 0,
            department: service.department || 'General'
        };

        if (onAddService) {
            onAddService(newService);
        }
        
        closeModal();
    }, [onAddService, closeModal]);

    // Filter available services
    const filteredServices = availableServices.filter(service =>
        (service.name || service.serviceName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // BULLETPROOF: Debug component render
    console.log("🔧 ServicesSection render:", {
        modalOpen,
        modalKey,
        availableServicesCount: availableServices.length,
        isReadOnly
    });

    return (
        <>
            <Card variant="outlined" sx={{ 
                mb: 4, 
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
            }}>
                <CardContent>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 3,
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Typography variant="h6" fontWeight={600}>
                            Medical Services
                        </Typography>
                        
                        {/* BULLETPROOF: Multiple ways to open modal */}
                        {!isReadOnly && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={openModal}
                                    sx={{ 
                                        minWidth: '140px',
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        }
                                    }}
                                >
                                    Add Service
                                </Button>
                                
                                {/* DEBUG: Extra button to test */}
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => {
                                        console.log("🐛 Debug button clicked!");
                                        setModalOpen(!modalOpen);
                                    }}
                                    sx={{ 
                                        minWidth: 'auto',
                                        color: 'text.secondary',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    Debug
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {services.length === 0 ? (
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 4, 
                            bgcolor: theme.palette.action.hover,
                            borderRadius: 2,
                            border: `1px dashed ${theme.palette.divider}`
                        }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                No services added yet
                            </Typography>
                            {!isReadOnly && (
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={openModal}
                                    size="large"
                                >
                                    Add Your First Service
                                </Button>
                            )}
                        </Box>
                    ) : (
                        <>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                                        <TableCell sx={{ fontWeight: 600 }}>Service Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600 }}>Unit Cost</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                                        {!isReadOnly && (
                                            <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {services.map((service, index) => (
                                        <TableRow key={service.serviceId || index} hover>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {service.serviceName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {service.description || 'Medical service'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={service.department || 'General'} 
                                                    size="small" 
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {service.quantity}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2">
                                                    ${service.unitCost.toFixed(2)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    ${service.amount.toFixed(2)}
                                                </Typography>
                                            </TableCell>
                                            {!isReadOnly && (
                                                <TableCell align="center">
                                                    <IconButton
                                                        onClick={() => onRemoveService(index)}
                                                        size="small"
                                                        color="error"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end', 
                                mt: 2, 
                                pt: 2, 
                                borderTop: `2px solid ${theme.palette.divider}`
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                    Services Total: ${totalServicesAmount.toFixed(2)}
                                </Typography>
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* BULLETPROOF: Modal with forced re-render */}
            <Dialog 
                key={modalKey}
                open={modalOpen}
                onClose={closeModal}
                maxWidth="md"
                fullWidth
                disableRestoreFocus
                keepMounted={false}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        maxHeight: '80vh'
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h6" component="div">
                        Select Medical Service
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Choose from {availableServices.length} available services
                    </Typography>
                </DialogTitle>
                
                <DialogContent dividers sx={{ minHeight: '400px' }}>
                    {/* Search Field */}
                    <TextField
                        fullWidth
                        placeholder="Search services by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ mb: 2 }}
                        autoFocus
                    />

                    {/* Debug Info */}
                    <Box sx={{ mb: 2, p: 1, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            Debug: Modal is open. Available services: {availableServices.length}, 
                            Filtered: {filteredServices.length}
                        </Typography>
                    </Box>

                    {/* Services List */}
                    {availableServices.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No Services Available
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Please add some services to your system first, or check the availableServices prop.
                            </Typography>
                        </Box>
                    ) : filteredServices.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                No services match "{searchQuery}"
                            </Typography>
                            <Button onClick={() => setSearchQuery("")} variant="outlined" size="small">
                                Clear Search
                            </Button>
                        </Box>
                    ) : (
                        <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
                            {filteredServices.map((service, index) => (
                                <React.Fragment key={service.id || index}>
                                    <ListItem disablePadding>
                                        <ListItemButton 
                                            onClick={() => handleSelectService(service)}
                                            sx={{
                                                borderRadius: 1,
                                                p: 2,
                                                border: `1px solid transparent`,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.action.hover,
                                                    border: `1px solid ${theme.palette.primary.main}`,
                                                }
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                            {service.name || service.serviceName || 'Unnamed Service'}
                                                        </Typography>
                                                        <Box sx={{ textAlign: 'right' }}>
                                                            <Chip 
                                                                label={`$${(service.price || service.unitCost || 0).toFixed(2)}`} 
                                                                size="small" 
                                                                color="primary"
                                                                variant="filled"
                                                                sx={{ fontWeight: 600 }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                            {service.description || 'No description available'}
                                                        </Typography>
                                                        {(service.department || service.category) && (
                                                            <Chip 
                                                                label={service.department || service.category} 
                                                                size="small" 
                                                                variant="outlined"
                                                                sx={{ mr: 1 }}
                                                            />
                                                        )}
                                                        <Chip 
                                                            label="Click to add" 
                                                            size="small" 
                                                            color="success"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    {index < filteredServices.length - 1 && <Divider sx={{ my: 1 }} />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </DialogContent>
                
                <DialogActions sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                        Modal State: {modalOpen ? 'Open' : 'Closed'}
                    </Typography>
                    <Button onClick={closeModal} variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};