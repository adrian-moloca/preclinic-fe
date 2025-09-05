import React from 'react';
import './App.css';
import './styles/print.css';
import { BrowserRouter } from 'react-router-dom';
import Routing from './routes';
import { ScheduleProvider } from './providers/schedule';
import { PatientsProvider } from './providers/patients';
import { AppointmentsProvider } from './providers/appointments';
import { ProfileProvider } from './providers/profile';
import { PrescriptionProvider } from './providers/prescriptions';
import { LeavesProvider } from './providers/leaves';
import { ProductsProvider } from './providers/products';
import { AuthProvider } from './providers/auth';
import { UsersProvider } from './providers/users';
import { DoctorsProvider } from './providers/doctor/provider';
import { AssistentsProvider } from './providers/assistent';
import { ServicesProvider } from './providers/services';
import { DepartmentsProvider } from './providers/departments';
import { PayrollProvider } from './providers/payroll';
import { InvoicesProvider } from './providers/invoices';
import { CasesProvider } from './providers/cases';
import { ThemeProvider } from './providers/theme';
import { ToastProvider } from './components/toast-notification-system/context';
import { ToastContainer } from './components/toast-notification-system/component';
import { MedicalDecisionSupportProvider } from './providers/medical-decision-support/provider';
import WorkflowAutomationProvider from './providers/workflow-automation/provider';
import { TelemedicineProvider } from './providers/telemedicine';
import { RegisterProvider } from './providers/register';
import { SignInProvider } from './providers/sign-in';
import { ClinicProvider } from './providers/clinic';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <RegisterProvider>
              <SignInProvider>
                <WorkflowAutomationProvider>
                  <MedicalDecisionSupportProvider>
                    <ClinicProvider>
                      <ScheduleProvider>
                        <PatientsProvider>
                          <AppointmentsProvider>
                            <ProfileProvider>
                              <PrescriptionProvider>
                                <LeavesProvider>
                                  <ProductsProvider>
                                    <UsersProvider>
                                      <DoctorsProvider>
                                        <AssistentsProvider>
                                          <ServicesProvider>
                                            <DepartmentsProvider>
                                              <PayrollProvider>
                                                <InvoicesProvider>
                                                  <TelemedicineProvider>
                                                    <CasesProvider>
                                                      <Routing />
                                                      <ToastContainer />
                                                    </CasesProvider>
                                                  </TelemedicineProvider>
                                                </InvoicesProvider>
                                              </PayrollProvider>
                                            </DepartmentsProvider>
                                          </ServicesProvider>
                                        </AssistentsProvider>
                                      </DoctorsProvider>
                                    </UsersProvider>
                                  </ProductsProvider>
                                </LeavesProvider>
                              </PrescriptionProvider>
                            </ProfileProvider>
                          </AppointmentsProvider>
                        </PatientsProvider>
                      </ScheduleProvider>
                    </ClinicProvider>
                  </MedicalDecisionSupportProvider>
                </WorkflowAutomationProvider>
              </SignInProvider>
            </RegisterProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;