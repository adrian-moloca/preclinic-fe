import { IPayroll } from "../../../../../providers/payroll";

interface PayrollPDFData {
    payroll: IPayroll;
    name: string;
    role: string;
    calculations: {
        totalEarnings: number;
        totalDeductions: number;
        netSalary: number;
    };
    formatCurrency: (amount: number | undefined | null) => string;
    formatDate: (dateString: string | undefined) => string;
}

export class PayrollPDFGenerator {
    static generateHTML(data: PayrollPDFData): string {
        const { payroll, name, role, calculations, formatCurrency, formatDate } = data;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payroll Slip - ${name}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        color: #333;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px;
                        border-bottom: 2px solid #1976d2;
                        padding-bottom: 20px;
                    }
                    .company-name { 
                        font-size: 24px; 
                        font-weight: bold; 
                        color: #1976d2;
                        margin-bottom: 5px;
                    }
                    .document-title { 
                        font-size: 20px; 
                        color: #666;
                        margin-top: 10px;
                    }
                    .employee-info { 
                        background-color: #f5f5f5;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .section { 
                        margin-bottom: 25px; 
                    }
                    .section-title { 
                        font-size: 18px; 
                        font-weight: bold; 
                        margin-bottom: 15px;
                        color: #1976d2;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 5px;
                    }
                    .earnings-title { color: #2e7d32; }
                    .deductions-title { color: #d32f2f; }
                    .net-salary-title { color: #1976d2; }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 15px;
                    }
                    th, td { 
                        border: 1px solid #ddd; 
                        padding: 12px; 
                        text-align: left;
                    }
                    th { 
                        background-color: #f5f5f5; 
                        font-weight: bold;
                    }
                    .amount { text-align: right; }
                    .total-row { 
                        background-color: #e3f2fd;
                        font-weight: bold;
                    }
                    .earnings-total { background-color: #e8f5e8; }
                    .deductions-total { background-color: #ffebee; }
                    .net-salary { 
                        background-color: #e3f2fd;
                        font-size: 18px;
                        font-weight: bold;
                        text-align: center;
                        padding: 20px;
                        border-radius: 8px;
                        margin-top: 20px;
                    }
                    .footer { 
                        margin-top: 40px; 
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                        border-top: 1px solid #ddd;
                        padding-top: 20px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    .info-item {
                        margin-bottom: 10px;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #666;
                    }
                    .info-value {
                        margin-top: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-name">Preclinic Healthcare</div>
                    <div class="document-title">Payroll Slip</div>
                </div>

                <div class="employee-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Employee Name:</div>
                            <div class="info-value">${name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Position:</div>
                            <div class="info-value">${role}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Payroll Date:</div>
                            <div class="info-value">${formatDate(payroll.date)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Payroll ID:</div>
                            <div class="info-value">${payroll.id}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title earnings-title">Earnings Breakdown</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th class="amount">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Basic Salary</td>
                                <td class="amount">${formatCurrency(payroll.basicSalary)}</td>
                            </tr>
                            <tr>
                                <td>Dearness Allowance</td>
                                <td class="amount">${formatCurrency(payroll.da)}</td>
                            </tr>
                            <tr>
                                <td>House Rent Allowance</td>
                                <td class="amount">${formatCurrency(payroll.hra)}</td>
                            </tr>
                            <tr>
                                <td>Conveyance</td>
                                <td class="amount">${formatCurrency(payroll.conveyance)}</td>
                            </tr>
                            <tr>
                                <td>Medical Allowance</td>
                                <td class="amount">${formatCurrency(payroll.medicalAllowance)}</td>
                            </tr>
                            <tr>
                                <td>Other Earnings</td>
                                <td class="amount">${formatCurrency(payroll.otherEarnings)}</td>
                            </tr>
                            <tr class="total-row earnings-total">
                                <td><strong>Total Earnings</strong></td>
                                <td class="amount"><strong>${formatCurrency(calculations.totalEarnings)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="section">
                    <div class="section-title deductions-title">Deductions Breakdown</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th class="amount">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Tax Deducted at Source (TDS)</td>
                                <td class="amount">${formatCurrency(payroll.tds)}</td>
                            </tr>
                            <tr>
                                <td>Provident Fund (PF)</td>
                                <td class="amount">${formatCurrency(payroll.pf)}</td>
                            </tr>
                            <tr>
                                <td>Employee State Insurance (ESI)</td>
                                <td class="amount">${formatCurrency(payroll.esi)}</td>
                            </tr>
                            <tr>
                                <td>Professional Tax</td>
                                <td class="amount">${formatCurrency(payroll.profTax)}</td>
                            </tr>
                            <tr>
                                <td>Labour Welfare Fund</td>
                                <td class="amount">${formatCurrency(payroll.labourWelfareFund)}</td>
                            </tr>
                            <tr>
                                <td>Other Deductions</td>
                                <td class="amount">${formatCurrency(payroll.otherDeductions)}</td>
                            </tr>
                            <tr class="total-row deductions-total">
                                <td><strong>Total Deductions</strong></td>
                                <td class="amount"><strong>${formatCurrency(calculations.totalDeductions)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="net-salary">
                    <div class="section-title net-salary-title">NET SALARY: ${formatCurrency(calculations.netSalary)}</div>
                    <div style="margin-top: 10px; font-size: 14px; color: #666;">
                        Total Earnings (${formatCurrency(calculations.totalEarnings)}) - Total Deductions (${formatCurrency(calculations.totalDeductions)})
                    </div>
                </div>

                <div class="footer">
                    <p>This is a computer-generated payroll slip and does not require a signature.</p>
                    <p>Generated on: ${new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}</p>
                </div>
            </body>
            </html>
        `;
    }

    static downloadAndPrint(htmlContent: string, fileName: string): void {
        try {
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                }, 100);
            }
        } catch (error) {
            console.error('Error in PDF generation:', error);
            throw new Error('Failed to generate PDF. Please try again.');
        }
    }
}