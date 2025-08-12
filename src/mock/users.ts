import { User } from "../providers/auth/types";

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'owner@preclinic.com',
    firstName: 'Dr. John',
    lastName: 'Smith',
    role: 'owner-doctor',
  },
  {
    id: '2',
    email: 'doctor@preclinic.com',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    role: 'doctor',
  },
  {
    id: '3',
    email: 'assistant@preclinic.com',
    firstName: 'Mary',
    lastName: 'Williams',
    role: 'assistant',
  },
  {
    id: '4',
    email: 'assistant2@preclinic.com',
    firstName: 'Jane',
    lastName: 'Davis',
    role: 'assistant',
  },
];