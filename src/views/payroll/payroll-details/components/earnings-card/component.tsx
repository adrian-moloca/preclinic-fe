import { FC } from 'react';
import { Card, CardContent, Box, Typography, Grid, Divider } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { IPayroll } from '../../../../../providers/payroll';

interface EarningsCardProps {
    payroll: IPayroll;
    totalEarnings: number;
    formatCurrency: (amount: number | undefined | null) => string;
}

export const EarningsCard: FC<EarningsCardProps> = ({
    payroll,
    totalEarnings,
    formatCurrency
}) => {
    return (
        <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                    <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="h6" fontWeight={600} color="success.main">
                        Earnings Breakdown
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Basic Salary
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.basicSalary)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Dearness Allowance
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.da)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                House Rent Allowance
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.hra)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Conveyance
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.conveyance)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Medical Allowance
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.medicalAllowance)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Other Earnings
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                                {formatCurrency(payroll.otherEarnings)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600} color="success.main">
                        Total Earnings:
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="success.main">
                        {formatCurrency(totalEarnings)}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};