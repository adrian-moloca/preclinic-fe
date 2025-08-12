import { FC } from 'react';
import { Box, Typography, IconButton, Tooltip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';

interface PayrollDetailsHeaderProps {
    name: string;
    date: string;
    onBack: () => void;
    onPrint: () => void;
    onDownload: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const PayrollDetailsHeader: FC<PayrollDetailsHeaderProps> = ({
    name,
    date,
    onBack,
    onPrint,
    onDownload,
    onEdit,
    onDelete
}) => {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box display="flex" alignItems="center" gap={2}>
                <IconButton onClick={onBack} sx={{ bgcolor: 'grey.100' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight={600}>
                        Payroll Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {name} • {date}
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" gap={1}>
                <Tooltip title="Print Payroll">
                    <IconButton onClick={onPrint} color="primary">
                        <PrintIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Download PDF">
                    <IconButton onClick={onDownload} color="primary">
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
                <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={onEdit}
                    sx={{ ml: 1 }}
                >
                    Edit
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={onDelete}
                >
                    Delete
                </Button>
            </Box>
        </Box>
    );
};