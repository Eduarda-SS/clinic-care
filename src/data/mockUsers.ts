import { User, USER_ROLES } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@mediconnect.com',
    role: USER_ROLES[0], // Gestão / Coordenação
    status: 'active',
    department: 'Administração',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-12-20T08:30:00')
  },
  {
    id: '2',
    name: 'Dr. Carlos Santos',
    email: 'carlos.santos@mediconnect.com',
    role: USER_ROLES[2], // Médico
    status: 'active',
    department: 'Cardiologia',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date('2024-12-19T14:20:00')
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@mediconnect.com',
    role: USER_ROLES[1], // Secretária
    status: 'active',
    department: 'Recepção',
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date('2024-12-20T07:45:00')
  },
  {
    id: '4',
    name: 'Dr. João Pereira',
    email: 'joao.pereira@mediconnect.com',
    role: USER_ROLES[2], // Médico
    status: 'inactive',
    department: 'Ortopedia',
    createdAt: new Date('2024-01-20'),
    lastLogin: new Date('2024-12-15T16:30:00')
  }
];

export const mockMetrics = {
  totalUsers: 15,
  activeUsers: 12,
  newUsersThisMonth: 3,
  usersByRole: {
    'Gestão / Coordenação': 2,
    'Médico': 8,
    'Secretária': 5
  },
  performanceMetrics: {
    averageSessionTime: '2h 30min',
    dailyActiveUsers: 10,
    weeklyActiveUsers: 14,
    monthlyActiveUsers: 15
  },
  departmentMetrics: {
    'Cardiologia': { users: 3, active: 3 },
    'Ortopedia': { users: 2, active: 1 },
    'Neurologia': { users: 2, active: 2 },
    'Administração': { users: 2, active: 2 },
    'Recepção': { users: 6, active: 5 }
  }
};