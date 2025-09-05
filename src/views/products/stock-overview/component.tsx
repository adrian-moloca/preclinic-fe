import React, { FC, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Tabs,
  Tab
} from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useProductsContext } from "../../../providers/products";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const StockOverview: FC = () => {
  const { 
    getAllProductsWithStock, 
    getExpiringBatches, 
    getLowStockProducts 
  } = useProductsContext();

  const [activeTab, setActiveTab] = useState(0);

  const allProducts = useMemo(() => getAllProductsWithStock(), [getAllProductsWithStock]);
  const expiringBatches = useMemo(() => getExpiringBatches(30), [getExpiringBatches]);
  const lowStockProducts = useMemo(() => getLowStockProducts(10), [getLowStockProducts]);

  const totalProducts = allProducts.length;
  const totalStock = allProducts.reduce((sum, p) => sum + p.totalQuantity, 0);
  const totalValue = allProducts.reduce((sum, p) => sum + (p.totalQuantity * p.averagePrice), 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3} fontWeight={600}>
        Stock Overview & Analytics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid>
          <Card sx={{ boxShadow: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600}>
                {totalProducts}
              </Typography>
              <Typography variant="body2">
                Total Products
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card sx={{ boxShadow: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600}>
                {totalStock.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Total Stock Units
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card sx={{ boxShadow: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600}>
                {lowStockProducts.length}
              </Typography>
              <Typography variant="body2">
                Low Stock Alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card sx={{ boxShadow: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600}>
                {expiringBatches.length}
              </Typography>
              <Typography variant="body2">
                Expiring Batches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Inventory Value
          </Typography>
          <Typography variant="h3" color="primary.main" fontWeight={600}>
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total estimated inventory value based on average batch prices
          </Typography>
        </CardContent>
      </Card>

      {(lowStockProducts.length > 0 || expiringBatches.length > 0) && (
        <Box sx={{ mb: 4 }}>
          {lowStockProducts.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
              <strong>{lowStockProducts.length} products</strong> are running low on stock (≤ 10 units)
            </Alert>
          )}
          {expiringBatches.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }} icon={<ErrorIcon />}>
              <strong>{expiringBatches.length} batches</strong> are expiring within 30 days
            </Alert>
          )}
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Products" />
          <Tab label={`Low Stock (${lowStockProducts.length})`} />
          <Tab label={`Expiring Batches (${expiringBatches.length})`} />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Total Stock</strong></TableCell>
                <TableCell><strong>Batches</strong></TableCell>
                <TableCell><strong>Avg. Price</strong></TableCell>
                <TableCell><strong>Total Value</strong></TableCell>
                <TableCell><strong>Next Expiry</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.manufacturer}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      color={product.totalQuantity <= 10 ? "error" : "inherit"}
                      fontWeight={product.totalQuantity <= 10 ? 600 : 400}
                    >
                      {product.totalQuantity} {product.unit}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.batchCount}</TableCell>
                  <TableCell>${product.averagePrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      ${(product.totalQuantity * product.averagePrice).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {product.nearestExpiry ? (
                      <Typography 
                        variant="body2"
                        color={isExpired(product.nearestExpiry) ? "error" : "inherit"}
                      >
                        {formatDate(product.nearestExpiry)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.status.toUpperCase()}
                      size="small"
                      color={product.status === 'active' ? 'success' : 'warning'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {lowStockProducts.length === 0 ? (
          <Alert severity="success">
            No products are currently low in stock!
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
                  <TableCell><strong>Product Name</strong></TableCell>
                  <TableCell><strong>Current Stock</strong></TableCell>
                  <TableCell><strong>Batches</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.manufacturer}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error" fontWeight={600}>
                        {product.totalQuantity} {product.unit}
                      </Typography>
                    </TableCell>
                    <TableCell>{product.batchCount}</TableCell>
                    <TableCell>
                      <Chip
                        label="LOW STOCK"
                        size="small"
                        color="warning"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {expiringBatches.length === 0 ? (
          <Alert severity="success">
            No batches are expiring within 30 days!
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(244, 67, 54, 0.1)' }}>
                  <TableCell><strong>Product Name</strong></TableCell>
                  <TableCell><strong>Batch Number</strong></TableCell>
                  <TableCell><strong>Expiry Date</strong></TableCell>
                  <TableCell><strong>Quantity</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expiringBatches
                  .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
                  .map((batch) => {
                    const product = allProducts.find(p => p.id === batch.productId);
                    return (
                      <TableRow key={batch.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              {product?.name || 'Unknown Product'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {product?.manufacturer}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {batch.batchNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            color={isExpired(batch.expiryDate) ? "error" : "warning.main"}
                            fontWeight={600}
                          >
                            {formatDate(batch.expiryDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {batch.quantity} {product?.unit}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={isExpired(batch.expiryDate) ? "EXPIRED" : "EXPIRING SOON"}
                            size="small"
                            color={isExpired(batch.expiryDate) ? "error" : "warning"}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>
    </Box>
  );
};