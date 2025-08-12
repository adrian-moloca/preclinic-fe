import { FC } from 'react';
import { Card, CardContent, Box, Typography, Grid, Divider } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { IPayroll } from '../../../../../providers/payroll';

interface DeductionsCardProps {
    payroll: IPayroll;
    totalDeductions: number;
    formatCurrency: (amount: number | undefined | null) => string;
}

export const DeductionsCard: FC<DeductionsCardProps> = ({
    payroll,
    totalDeductions,
    formatCurrency
}) => {
    return (
        <Card sx={{ border: '1px solid #e0e0e0' }}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                    <TrendingDownIcon sx={{ color: 'error.main', mr: 1 }} />
                    <Typography variant="h6" fontWeight={600} color="error.main">
                        Deductions Breakdown
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Tax Deducted at Source
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.tds)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Provident Fund
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.pf)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Employee State Insurance
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.esi)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Professional Tax
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.profTax)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Labour Welfare Fund
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.labourWelfareFund)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Other Deductions
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.otherDeductions)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600} color="error.main">
                        Total Deductions:
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="error.main">
                        {formatCurrency(totalDeductions)}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};