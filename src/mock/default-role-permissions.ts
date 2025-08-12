import { RolePermissions } from "../providers/auth/types";
import { ALL_PERMISSIONS } from "./all-permissions";

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  'owner-doctor': ALL_PERMISSIONS,
  'doctor': [
    'view_dashboard', 'view_patients', 'manage_patients',
    'view_appointments', 'manage_appointments',
    'view_prescriptions', 'manage_prescriptions',
    'view_products', 'request_leaves', 'view_leaves',
    'view_reviews', 'access_schedule', 'access_ai_assistant'
  ],
  'assistant': [
    'view_dashboard', 'view_patients',
    'view_appointments', 'manage_appointments',
    'view_prescriptions', 'view_products',
    'request_leaves', 'view_leaves', 'view_reviews', 'access_schedule'
  ],
};