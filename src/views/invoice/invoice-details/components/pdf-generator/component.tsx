import { IInvoice } from "../../../../../providers/invoices";

interface InvoicePDFData {
    invoice: IInvoice;
    patientName: string;
    subtotal: number;
    tax: number;
    taxAmount: number;
    total: number;
    formatCurrency: (amount: string | number) => string;
    formatDate: (dateString: string) => string;
    appointmentInfo?: {
        appointmentType?: string;
        date?: string;
        reason?: string;
    } | null;
}

export class InvoicePDFGenerator {
    static generateHTML(data: InvoicePDFData): string {
        const { invoice, patientName, subtotal, tax, taxAmount, total, formatCurrency, formatDate, appointmentInfo } = data;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Medical Invoice - ${patientName}</title>
                <style>
                    @media print {
                        @page {
                            size: A4;
                            margin: 15mm;
                        }
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                    
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        color: #2c3e50;
                        line-height: 1.4;
                        font-size: 12px;
                    }
                    
                    .invoice-container {
                        max-width: 210mm;
                        margin: 0 auto;
                        background: white;
                        box-shadow: 0 0 20px rgba(0,0,0,0.1);
                        padding: 20px;
                    }
                    
                    .header { 
                        text-align: center; 
                        margin-bottom: 25px;
                        border-bottom: 3px solid #1976d2;
                        padding-bottom: 20px;
                    }
                    
                    .company-name { 
                        font-size: 28px; 
                        font-weight: bold; 
                        color: #1976d2;
                        margin-bottom: 5px;
                        letter-spacing: 2px;
                    }
                    
                    .document-title { 
                        font-size: 22px; 
                        color: #34495e;
                        margin: 10px 0 5px 0;
                        font-weight: 300;
                        letter-spacing: 1px;
                    }
                    
                    .subtitle {
                        color: #7f8c8d;
                        font-size: 11px;
                    }
                    
                    .invoice-summary {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 25px;
                        gap: 20px;
                    }
                    
                    .invoice-details {
                        flex: 2;
                        background-color: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        border: 1px solid #e9ecef;
                    }
                    
                    .total-amount {
                        flex: 1;
                        background: #1976d2;
                        color: white;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                    }
                    
                    .total-label {
                        font-size: 14px;
                        margin-bottom: 8px;
                        opacity: 0.9;
                    }
                    
                    .total-value {
                        font-size: 28px;
                        font-weight: bold;
                        margin: 0;
                    }
                    
                    .section { 
                        margin-bottom: 25px; 
                    }
                    
                    .section-title { 
                        font-size: 16px; 
                        font-weight: bold; 
                        margin-bottom: 15px;
                        color: #1976d2;
                        border-bottom: 2px solid #1976d2;
                        padding-bottom: 5px;
                        display: inline-block;
                        min-width: 150px;
                    }
                    
                    .patient-info {
                        background-color: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        border: 2px solid #e9ecef;
                    }
                    
                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 20px;
                        margin-bottom: 15px;
                    }
                    
                    .info-item {
                        margin-bottom: 12px;
                    }
                    
                    .info-label {
                        font-weight: bold;
                        color: #34495e;
                        font-size: 11px;
                    }
                    
                    .info-value {
                        margin-top: 5px;
                        font-size: 12px;
                        color: #2c3e50;
                    }
                    
                    .patient-name {
                        color: #1976d2;
                        font-weight: bold;
                        font-size: 14px;
                    }
                    
                    .invoice-number {
                        color: #1976d2;
                        font-weight: bold;
                    }
                    
                    .status-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 10px;
                        font-weight: bold;
                        color: white;
                    }
                    
                    .status-paid { background: #27ae60; }
                    .status-pending { background: #f39c12; }
                    .status-overdue { background: #e74c3c; }
                    
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 15px;
                        border: 2px solid #e9ecef;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    
                    thead {
                        background: #1976d2;
                        color: white;
                    }
                    
                    th, td { 
                        padding: 12px; 
                        text-align: left;
                    }
                    
                    th { 
                        font-weight: bold;
                        font-size: 12px;
                    }
                    
                    tbody tr {
                        background: #f8f9fa;
                    }
                    
                    tbody tr:nth-child(even) {
                        background: #ffffff;
                    }
                    
                    .amount { 
                        text-align: right; 
                        font-weight: bold;
                        color: #1976d2;
                    }
                    
                    .service-name {
                        font-weight: 500;
                        color: #2c3e50;
                    }
                    
                    .two-column {
                        display: flex;
                        gap: 20px;
                        margin-bottom: 25px;
                    }
                    
                    .column {
                        flex: 1;
                    }
                    
                    .info-card {
                        background: #f8f9fa;
                        border: 2px solid #e9ecef;
                        border-radius: 8px;
                        padding: 20px;
                        height: fit-content;
                    }
                    
                    .description-text {
                        line-height: 1.6;
                        color: #2c3e50;
                    }
                    
                    .payment-summary {
                        border: 3px solid #1976d2;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        margin-top: 30px;
                    }
                    
                    .summary-header {
                        background: #1976d2;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        font-size: 18px;
                        font-weight: bold;
                    }
                    
                    .summary-content {
                        background: #f8f9ff;
                        padding: 25px;
                    }
                    
                    .summary-table {
                        border: none;
                        box-shadow: none;
                        margin: 0;
                    }
                    
                    .summary-table td {
                        border: none;
                        padding: 8px 0;
                        border-bottom: 1px solid #e9ecef;
                    }
                    
                    .summary-row {
                        font-size: 14px;
                    }
                    
                    .summary-total {
                        font-size: 18px;
                        font-weight: bold;
                        color: #1976d2;
                        border-top: 2px solid #1976d2;
                        padding-top: 15px !important;
                    }
                    
                    .payment-details {
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 2px solid #1976d2;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                    }
                    
                    .payment-method {
                        color: #1976d2;
                        font-weight: bold;
                    }
                    
                    .payment-status {
                        font-weight: bold;
                    }
                    
                    .status-paid-text { color: #27ae60; }
                    .status-pending-text { color: #f39c12; }
                    
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        border-top: 2px solid #e9ecef;
                        padding-top: 25px;
                    }
                    
                    .footer-content {
                        background: #34495e;
                        color: white;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 15px;
                    }
                    
                    .footer-title {
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 8px;
                    }
                    
                    .footer-subtitle {
                        font-size: 12px;
                        opacity: 0.9;
                    }
                    
                    .generation-info {
                        font-size: 10px;
                        color: #95a5a6;
                        margin-top: 10px;
                    }
                    
                    @media print {
                        .invoice-container {
                            box-shadow: none;
                            padding: 0;
                        }
                        
                        body {
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <div class="company-name">PreClinic</div>
                        <div class="document-title">MEDICAL INVOICE</div>
                        <div class="subtitle">Professional Healthcare Services</div>
                    </div>

                    <div class="invoice-summary">
                        <div class="invoice-details">
                            <div class="section-title" style="margin-bottom: 15px;">Invoice Details</div>
                            <div class="info-grid">
                                <div class="info-item">
                                    <div class="info-label">Invoice Number:</div>
                                    <div class="info-value invoice-number">${invoice.invoiceNumber}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Invoice Date:</div>
                                    <div class="info-value">${formatDate(invoice.invoiceDate || '')}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Due Date:</div>
                                    <div class="info-value">${formatDate(invoice.dueDate || '')}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Status:</div>
                                    <div class="info-value">
                                        <span class="status-badge ${invoice.paymentStatus?.toLowerCase() === 'paid' ? 'status-paid' : 'status-pending'}">
                                            ${invoice.paymentStatus || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="total-amount">
                            <div class="total-label">Total Amount</div>
                            <div class="total-value">${formatCurrency(total)}</div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Patient Information</div>
                        <div class="patient-info">
                            <div class="info-grid">
                                <div class="info-item">
                                    <div class="info-label">Full Name:</div>
                                    <div class="info-value patient-name">${patientName}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Email Address:</div>
                                    <div class="info-value">${invoice.email || 'N/A'}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Phone Number:</div>
                                    <div class="info-value">N/A</div>
                                </div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Address:</div>
                                <div class="info-value">${invoice.patientAddress || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Service Details</div>
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 25%">Department</th>
                                    <th style="width: 40%">Service/Product</th>
                                    <th style="width: 15%; text-align: center;">Quantity</th>
                                    <th style="width: 20%; text-align: right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${invoice.department || 'N/A'}</td>
                                    <td class="service-name">${invoice.productName || 'N/A'}</td>
                                    <td style="text-align: center;">${invoice.quantity || '1'}</td>
                                    <td class="amount">${formatCurrency(subtotal)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    ${(appointmentInfo || invoice.description) ? `
                        <div class="two-column">
                            ${appointmentInfo ? `
                                <div class="column">
                                    <div class="section-title">Related Appointment</div>
                                    <div class="info-card">
                                        <div class="info-item">
                                            <div class="info-label">Appointment Type:</div>
                                            <div class="info-value">${appointmentInfo.appointmentType || 'N/A'}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Date:</div>
                                            <div class="info-value">${appointmentInfo.date || 'N/A'}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Reason:</div>
                                            <div class="info-value">${appointmentInfo.reason || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                            ${invoice.description ? `
                                <div class="column">
                                    <div class="section-title">Description</div>
                                    <div class="info-card">
                                        <div class="description-text">${invoice.description}</div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}

                    <div class="payment-summary">
                        <div class="summary-header">Payment Summary</div>
                        <div class="summary-content">
                            <table class="summary-table">
                                <tr class="summary-row">
                                    <td><strong>Subtotal:</strong></td>
                                    <td class="amount">${formatCurrency(subtotal)}</td>
                                </tr>
                                <tr class="summary-row">
                                    <td><strong>Tax (${tax}%):</strong></td>
                                    <td class="amount">${formatCurrency(taxAmount)}</td>
                                </tr>
                                <tr class="summary-total">
                                    <td><strong>Total Amount:</strong></td>
                                    <td class="amount"><strong>${formatCurrency(total)}</strong></td>
                                </tr>
                            </table>
                            
                            <div class="payment-details">
                                <div>
                                    <div class="info-label">Payment Method:</div>
                                    <div class="payment-method">${invoice.paymentMethod || 'N/A'}</div>
                                </div>
                                <div>
                                    <div class="info-label">Payment Status:</div>
                                    <div class="payment-status ${invoice.paymentStatus?.toLowerCase() === 'paid' ? 'status-paid-text' : 'status-pending-text'}">
                                        ${invoice.paymentStatus || 'Pending'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="footer">
                        <div class="footer-content">
                            <div class="footer-title">Thank you for choosing PreClinic!</div>
                            <div class="footer-subtitle">Your health is our priority. We appreciate your trust in our medical services.</div>
                        </div>
                        <div class="generation-info">
                            Generated on ${new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })} | PreClinic Medical Center
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    static downloadAndPrint(htmlContent: string, fileName: string): void {
        try {
            // Create and download HTML file
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Open print dialog
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