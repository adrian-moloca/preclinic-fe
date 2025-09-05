import React, { FC } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { StockBatch } from '../../providers/products/types';

interface StockBatchesListProps {
  batches: StockBatch[];
  onEditBatch?: (batch: StockBatch) => void;
  onDeleteBatch?: (batchId: string) => void;
}

export const StockBatchesList: FC<StockBatchesListProps> = ({
  batches,
  onEditBatch,
  onDeleteBatch
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'recalled':
        return 'warning';
      case 'depleted':
        return 'default';
      default:
        return 'default';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  if (batches.length === 0) {
    return (
      <Card sx={{ boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Stock Batches
          </Typography>
          <Typography color="text.secondary">
            No stock batches found for this product.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Stock Batches ({batches.length})
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                <TableCell><strong>Batch Number</strong></TableCell>
                <TableCell><strong>Expiry Date</strong></TableCell>
                <TableCell align="right"><strong>Quantity</strong></TableCell>
                <TableCell align="right"><strong>Unit Price</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Received</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {batches
                .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
                .map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {batch.batchNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      color={
                        isExpired(batch.expiryDate) ? "error" :
                        isExpiringSoon(batch.expiryDate) ? "warning.main" : "inherit"
                      }
                      sx={{
                        fontWeight:
                          isExpired(batch.expiryDate) || isExpiringSoon(batch.expiryDate)
                            ? 600 : 400
                      }}
                    >
                      {formatDate(batch.expiryDate)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {batch.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      ${batch.unitPrice.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={batch.status.toUpperCase()}
                      size="small"
                      color={getStatusColor(batch.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(batch.receivedDate)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      {onEditBatch && (
                        <Tooltip title="Edit Batch">
                          <IconButton
                            size="small"
                            onClick={() => onEditBatch(batch)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDeleteBatch && (
                        <Tooltip title="Delete Batch">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDeleteBatch(batch.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};