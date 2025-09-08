import { User } from '../providers/auth/types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'owner@preclinic.com',
    firstName: 'Dr. John',
    lastName: 'Smith',
    role: 'doctor_owner',
    profileImg: '',
  },
  {
    id: 'user-2',
    email: 'doctor@preclinic.com',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    role: 'doctor',
    profileImg: '',
  },
  {
    id: 'user-3',
    email: 'assistant@preclinic.com',
    firstName: 'Emma',
    lastName: 'Wilson',
    role: 'assistant',
    profileImg: '',
  },
];