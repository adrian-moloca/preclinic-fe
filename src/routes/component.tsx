import { FC, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../views/layout";
import { Dashboard } from "../views/dashboard/component";
import { ProtectedRoute } from "../components/protected-route/component";
import PermissionManagement from "../views/settings/components/permission-management";

const SignIn = lazy(() => import("../views/auth/sign-in"));
const Register = lazy(() => import("../views/auth/register"));
const Schedule = lazy(() => import("../views/schedule/index"));
const CreatePatient = lazy(() => import("../views/patients/create-patient/index"));
const AllPatients = lazy(() => import("../views/patients/all-patients/index"));
const PatientDetails = lazy(() => import("../views/patients/patient-detail/index"));
const EditPatient = lazy(() => import("../views/patients/edit-patient/index"));
const AllAppointments = lazy(() => import("../views/appointments/all-appointments/index"));
const CreateAppointment = lazy(() => import("../views/appointments/create-appointments/index"));
const EditAppointment = lazy(() => import("../views/appointments/edit-appointments/index"));
const ProfileSettings = lazy(() => import("../views/profile/profile-settings/index"));
const ForgotPassword = lazy(() => import("../views/auth/forgot-password/index"));
const OtpPage = lazy(() => import("../views/auth/otp-page/index"));
const ResetPassword = lazy(() => import("../views/auth/reset-password/index"));
const Settings = lazy(() => import("../views/settings/index"));
const AddPrescription = lazy(() => import("../views/prescriptions/add-prescription/index"));
const AllPrescriptions = lazy(() => import("../views/prescriptions/all-prescriptions/index"));
const EditPrescription = lazy(() => import("../views/prescriptions/edit-prescription/index"));
const PrescriptionDetails = lazy(() => import("../views/prescriptions/prescription-details/index"));
const CreateLeave = lazy(() => import("../views/leaves/create-leave/index"));
const AllLeaves = lazy(() => import("../views/leaves/all-leaves/index"));
const EditLeave = lazy(() => import("../views/leaves/edit-leave/index"));
const ChatAssistant = lazy(() => import("../views/ai-chat/index"));
const AllOnlineAppointments = lazy(() => import("../views/appointments/online-appointments/all-online-appointments/index"));
const ManageOnlineAppointment = lazy(() => import("../views/appointments/online-appointments/manage-online-appointment/index"));
const CreateProduct = lazy(() => import("../views/products/create-product/index"));
const AllProducts = lazy(() => import("../views/products/all-products/index"));
const EditProduct = lazy(() => import("../views/products/edit-product/index"));
const ProductDetails = lazy(() => import("../views/products/product-details/index"));
const AllReviews = lazy(() => import("../views/reviews/all-reviews/index"));
const UsersManagement = lazy(() => import("../views/settings/components/users-management/index"));
const GeneralSettings = lazy(() => import("../views/settings/components/general-settings/index"));
const Chat = lazy(() => import("../views/chat/index"));
const CreateDoctor = lazy(() => import("../views/doctors/create-doctor/index"));
const AllDoctors = lazy(() => import("../views/doctors/all-doctors/index"));
const DoctorDetails = lazy(() => import("../views/doctors/doctor-details/index"));
const EditDoctor = lazy(() => import("../views/doctors/edit-doctor/index"));
const CreateAssistent = lazy(() => import("../views/assistents/create-assistent/index"));
const AllAssistents = lazy(() => import("../views/assistents/all-assistents/index"));
const AssistentDetails = lazy(() => import("../views/assistents/assistent-details/index"));
const EditAssistent = lazy(() => import("../views/assistents/edit-assistent/index"));
const CreateService = lazy(() => import("../views/services/create-services/index"));
const CreateDepartment = lazy(() => import("../views/departments/create-department/index"));
const AllServices = lazy(() => import("../views/services/all-services/index"));
const AllDepartments = lazy(() => import("../views/departments/all-departments/index"));
const EditDepartment = lazy(() => import("../views/departments/edit-department/index"));
const DepartmentDetails = lazy(() => import("../views/departments/department-details/index"));
const ServiceDetails = lazy(() => import("../views/services/service-details/index"));
const EditService = lazy(() => import("../views/services/edit-service/index"));
const PrivacyAndPolicy = lazy(() => import("../views/privacy-and-policy/index"));
const TermsAndConditions = lazy(() => import("../views/terms-and-conditions/index"));
const AddPayroll = lazy(() => import("../views/payroll/create-payroll/index"));
const AllPayrolls = lazy(() => import("../views/payroll/all-payrolls/index"));
const EditPayroll = lazy(() => import("../views/payroll/edit-payroll/index"));
const PayrollDetails = lazy(() => import("../views/payroll/payroll-details/index"));
const AddInvoice = lazy(() => import("../views/invoice/create-invoice/index"));
const AllInvoices = lazy(() => import("../views/invoice/all-invoices/index"));
const EditInvoice = lazy(() => import("../views/invoice/edit-invoice/index"));
const InvoiceDetails = lazy(() => import("../views/invoice/invoice-details/index"));
const LocalFileManager = lazy(() => import("../views/file-manager/index"));
const AppointmentDetails = lazy(() => import("../views/appointments/appointment-details/index"));
const CaseDetails = lazy(() => import("../views/cases/case-details/index"));
const EditCase = lazy(() => import("../views/cases/edit-case/index"));
const MedicalAlertsDashboard = lazy(() => import("../components/medical-alerts-dashboard/index"));
const WorkflowDashboard = lazy(() => import("../components/workflow-automation/workflow-dashboard/index"));
const TelemedicineDashboard = lazy(() => import("../components/telemedicine/dashboard/index"));
const VideoCallView = lazy(() => import("../views/video-call/index"));
const WaitingRoomView = lazy(() => import("../views/waiting-room/index"));
const StockOverview = lazy(() => import("../views/products/stock-overview/index"));
const CreateClinic = lazy(() => import("../views/clinic/create-clinic/index"));
const ClinicInformationSettings = lazy(() => import("../views/settings/components/clinic-information/index"));

export const Routing: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

         <Route path="/settings/clinic-information" element={
          <ProtectedRoute requiredPermission="view_settings">
            <ClinicInformationSettings />
          </ProtectedRoute>
        } />

        <Route path="/create-clinic" element={
          <ProtectedRoute>
            <CreateClinic />
          </ProtectedRoute>
        } />

         {/* Product routes */}

        <Route path="/stock-overview" element={
          <ProtectedRoute requiredResource="products">
            <StockOverview />
          </ProtectedRoute>
        } />

        <Route path="/telemedicine" element={
          <ProtectedRoute requiredPermission="access_telemedicine">
            <TelemedicineDashboard />
          </ProtectedRoute>
        } />
        <Route path="/telemedicine/call/:appointmentId" element={
          <ProtectedRoute requiredPermission="access_telemedicine">
            <VideoCallView />
          </ProtectedRoute>
        } />
        <Route path="/telemedicine/waiting/:appointmentId" element={
          <ProtectedRoute requiredPermission="access_telemedicine">
            <WaitingRoomView />
          </ProtectedRoute>
        } />

        <Route path="/schedule" element={
          <ProtectedRoute requiredResource="schedule">
            <Schedule />
          </ProtectedRoute>
        } />

        {/* Patient routes */}
        <Route path="/patients/create" element={
          <ProtectedRoute requiredPermission="manage_patients">
            <CreatePatient />
          </ProtectedRoute>
        } />
        <Route path="/patients/all-patients" element={
          <ProtectedRoute requiredResource="patients">
            <AllPatients />
          </ProtectedRoute>
        } />
        <Route path="/patients/:id" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientDetails />
          </ProtectedRoute>
        } />
        <Route path="/patients/edit/:id" element={
          <ProtectedRoute requiredPermission="manage_patients">
            <EditPatient />
          </ProtectedRoute>
        } />

        <Route path="/medical-alerts" element={
          <ProtectedRoute requiredPermission="view_dashboard">
            <MedicalAlertsDashboard />
          </ProtectedRoute>
        } />

        <Route path="/workflow-automation" element={
          <ProtectedRoute requiredPermission="view_workflow_automation">
            <WorkflowDashboard />
          </ProtectedRoute>
        } />

        {/* File Manager routes */}
        <Route path="/files" element={
          <ProtectedRoute requiredResource="files">
            <LocalFileManager />
          </ProtectedRoute>
        } />

        {/* Case routes */}
        <Route path="/cases/details/:id" element={
          <ProtectedRoute requiredPermission="view_cases">
            <CaseDetails />
          </ProtectedRoute>
        } />
        <Route path="/cases/edit/:id" element={
          <ProtectedRoute requiredPermission="manage_cases">
            <EditCase />
          </ProtectedRoute>
        } />

        {/* Doctor routes */}
        <Route path="/doctors/create" element={
          <ProtectedRoute requiredPermission="manage_doctors">
            <CreateDoctor />
          </ProtectedRoute>
        } />
        <Route path="/doctors/all" element={
          <ProtectedRoute requiredResource="doctors">
            <AllDoctors />
          </ProtectedRoute>
        } />
        <Route path="/doctors/:id" element={
          <ProtectedRoute requiredPermission="view_doctors">
            <DoctorDetails />
          </ProtectedRoute>
        } />
        <Route path="/doctors/edit/:id" element={
          <ProtectedRoute requiredPermission="manage_doctors">
            <EditDoctor />
          </ProtectedRoute>
        } />

        {/* Assistant routes */}
        <Route path="/assistents/create" element={
          <ProtectedRoute requiredPermission="manage_assistents">
            <CreateAssistent />
          </ProtectedRoute>
        } />
        <Route path="/assistents/all" element={
          <ProtectedRoute requiredResource="assistents">
            <AllAssistents />
          </ProtectedRoute>
        } />
        <Route path="/assistents/:id" element={
          <ProtectedRoute requiredPermission="view_assistents">
            <AssistentDetails />
          </ProtectedRoute>
        } />
        <Route path="/assistents/edit/:id" element={
          <ProtectedRoute requiredPermission="manage_assistents">
            <EditAssistent />
          </ProtectedRoute>
        } />

        {/* Appointment routes */}
        <Route path="/appointments/all" element={
          <ProtectedRoute requiredResource="appointments">
            <AllAppointments />
          </ProtectedRoute>
        } />
        <Route path="/appointments/create" element={
          <ProtectedRoute requiredPermission="manage_appointments">
            <CreateAppointment />
          </ProtectedRoute>
        } />
        <Route path="/appointments/edit/:id" element={
          <ProtectedRoute requiredPermission="manage_appointments">
            <EditAppointment />
          </ProtectedRoute>
        } />
        <Route path="/appointments/:id" element={
          <ProtectedRoute requiredPermission="view_appointments">
            <AppointmentDetails />
          </ProtectedRoute>
        } />
        <Route path="/appointments/online-appointments" element={
          <ProtectedRoute requiredPermission="view_appointments">
            <AllOnlineAppointments />
          </ProtectedRoute>
        } />
        <Route path="/appointments/online-appointments/manage/:id" element={
          <ProtectedRoute requiredPermission="manage_appointments">
            <ManageOnlineAppointment />
          </ProtectedRoute>
        } />

        {/* Invoice routes */}
        <Route path="/invoices/create" element={
          <ProtectedRoute requiredPermission="manage_invoices">
            <AddInvoice />
          </ProtectedRoute>
        } />
        <Route path="/invoices/edit/:id" element={
          <ProtectedRoute requiredPermission="manage_invoices">
            <EditInvoice />
          </ProtectedRoute>
        } />
        <Route path="/invoices/all" element={
          <ProtectedRoute requiredResource="invoices">
            <AllInvoices />
          </ProtectedRoute>
        } />
        <Route path="/invoices/:id" element={
          <ProtectedRoute requiredPermission="view_invoices">
            <InvoiceDetails />
          </ProtectedRoute>
        } />

        {/* Service routes */}
        <Route path="/services/create" element={
          <ProtectedRoute requiredPermission="manage_services">
            <CreateService />
          </ProtectedRoute>
        } />
        <Route path="/services/all" element={
          <ProtectedRoute requiredResource="services">
            <AllServices />
          </ProtectedRoute>
        } />
        <Route path="/services/:id" element={
          <ProtectedRoute requiredPermission="view_services">
            <ServiceDetails />
          </ProtectedRoute>
        } />
        <Route path="/services/edit/:id" element={
          <ProtectedRoute requiredPermission="manage_services">
            <EditService />
          </ProtectedRoute>
        } />

        {/* Department routes */}
        <Route path="/departments/create" element={
          <ProtectedRoute requiredPermission="manage_departments">
            <CreateDepartment />
          </ProtectedRoute>
        } />

        <Route path="/departments/all" element={
          <ProtectedRoute requiredResource="departments">
            <AllDepartments />
          </ProtectedRoute>
        } />
        <Route path="/departments/edit/:id" element={
          <ProtectedRoute requiredPermission="manage_departments">
            <EditDepartment />
          </ProtectedRoute>
        } />
        <Route path="/departments/:id" element={
          <ProtectedRoute requiredPermission="view_departments">
            <DepartmentDetails />
          </ProtectedRoute>
        } />

        <Route path="/chat" element={
          <ProtectedRoute requiredResource="chat">
            <Chat />
          </ProtectedRoute>
        } />

        {/* Profile routes */}
        <Route path="/profile/settings" element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        } />

        {/* Settings routes */}
        <Route path="settings" element={
          <ProtectedRoute requiredPermission="manage_settings">
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="settings/permissions" element={
          <ProtectedRoute role="owner-doctor">
            <PermissionManagement />
          </ProtectedRoute>
        } />
        <Route path="settings/users" element={
          <ProtectedRoute role="owner-doctor">
            <UsersManagement />
          </ProtectedRoute>
        } />
        <Route path="settings/general" element={
          <ProtectedRoute>
            <GeneralSettings />
          </ProtectedRoute>
        } />

        {/* Payroll routes */}
        <Route path="/payroll/add" element={
          <ProtectedRoute requiredPermission="manage_payroll">
            <AddPayroll />
          </ProtectedRoute>
        } />
        <Route path="/payroll/all" element={
          <ProtectedRoute requiredResource="payroll">
            <AllPayrolls />
          </ProtectedRoute>
        } />
        <Route path="/payroll/edit/:id" element={
          <ProtectedRoute requiredPermission="manage_payroll">
            <EditPayroll />
          </ProtectedRoute>
        } />
        <Route path="/payroll/:id" element={
          <ProtectedRoute requiredPermission="view_payroll">
            <PayrollDetails />
          </ProtectedRoute>
        } />

        {/* Doctor and Assistant routes */}

        {/* Chat routes */}

        {/* Prescription routes */}
        <Route path="/prescriptions/all" element={
          <ProtectedRoute requiredResource="prescriptions">
            <AllPrescriptions />
          </ProtectedRoute>
        } />
        <Route path="/prescriptions/create" element={
          <ProtectedRoute requiredPermission="manage_prescriptions">
            <AddPrescription />
          </ProtectedRoute>
        } />
        <Route path="/prescriptions/edit/:id" element={
          <ProtectedRoute requiredPermission="manage_prescriptions">
            <EditPrescription />
          </ProtectedRoute>
        } />
        <Route path="/prescriptions/:id" element={
          <ProtectedRoute requiredPermission="view_prescriptions">
            <PrescriptionDetails />
          </ProtectedRoute>
        } />

        {/* Leave routes */}
        <Route path="/leaves/create" element={
          <ProtectedRoute requiredPermission="request_leaves">
            <CreateLeave />
          </ProtectedRoute>
        } />
        <Route path="/leaves/all-leaves" element={
          <ProtectedRoute requiredResource="leaves">
            <AllLeaves />
          </ProtectedRoute>
        } />
        <Route path="/leaves/edit/:id" element={
          <ProtectedRoute requiredPermission="request_leaves">
            <EditLeave />
          </ProtectedRoute>
        } />

        {/* AI Assistant route */}
        <Route path="/ai-assistant" element={
          <ProtectedRoute requiredResource="ai-assistant">
            <ChatAssistant />
          </ProtectedRoute>
        } />

        {/* Product routes */}
        <Route path="/products/create" element={
          <ProtectedRoute requiredPermission="manage_products">
            <CreateProduct />
          </ProtectedRoute>
        } />
        <Route path="/products/all" element={
          <ProtectedRoute requiredResource="products">
            <AllProducts />
          </ProtectedRoute>
        } />
        <Route path="/products/edit/:id" element={
          <ProtectedRoute requiredPermission="manage_products">
            <EditProduct />
          </ProtectedRoute>
        } />
        <Route path="/products/:id" element={
          <ProtectedRoute requiredPermission="view_products">
            <ProductDetails />
          </ProtectedRoute>
        } />

        {/* Reviews route */}
        <Route path="/reviews/all" element={
          <ProtectedRoute requiredResource="reviews">
            <AllReviews />
          </ProtectedRoute>
        } />

        <Route path="/privacy-policy" element={
          <PrivacyAndPolicy />
        } />
        <Route path="/terms-and-conditions" element={
          <TermsAndConditions />
        } />
      </Route>

      {/* Public routes (no layout - no sidebar/header) */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};