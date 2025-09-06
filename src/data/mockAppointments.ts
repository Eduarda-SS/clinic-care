import { Appointment, Professional, Unit, WaitingListEntry } from '@/types/appointment';

export const mockUnits: Unit[] = [
  {
    id: '1',
    name: 'Unidade Central',
    address: 'Rua das Flores, 123 - Centro'
  },
  {
    id: '2',
    name: 'Unidade Zona Norte',
    address: 'Av. dos Palmares, 456 - Zona Norte'
  },
  {
    id: '3',
    name: 'Unidade Shopping',
    address: 'Shopping Center, Loja 789 - Zona Sul'
  }
];

export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Dr. Carlos Silva',
    specialty: 'Cardiologia',
    crm: 'CRM-SP 123456',
    email: 'carlos.silva@clinica.com',
    phone: '(11) 99999-1111',
    unitIds: ['1', '2']
  },
  {
    id: '2',
    name: 'Dra. Ana Santos',
    specialty: 'Pediatria',
    crm: 'CRM-SP 234567',
    email: 'ana.santos@clinica.com',
    phone: '(11) 99999-2222',
    unitIds: ['1', '3']
  },
  {
    id: '3',
    name: 'Dr. Paulo Oliveira',
    specialty: 'Ortopedia',
    crm: 'CRM-SP 345678',
    email: 'paulo.oliveira@clinica.com',
    phone: '(11) 99999-3333',
    unitIds: ['2', '3']
  },
  {
    id: '4',
    name: 'Dra. Maria Costa',
    specialty: 'Ginecologia',
    crm: 'CRM-SP 456789',
    email: 'maria.costa@clinica.com',
    phone: '(11) 99999-4444',
    unitIds: ['1']
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'João Silva',
    professionalId: '1',
    professionalName: 'Dr. Carlos Silva',
    unitId: '1',
    unitName: 'Unidade Central',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '09:30',
    duration: 30,
    type: 'consultation',
    status: 'confirmed',
    observations: 'Consulta de rotina',
    confirmationSent: true,
    reminderSent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Maria Santos',
    professionalId: '2',
    professionalName: 'Dra. Ana Santos',
    unitId: '1',
    unitName: 'Unidade Central',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:30',
    endTime: '11:00',
    duration: 30,
    type: 'follow-up',
    status: 'pending',
    observations: 'Retorno pediatria',
    confirmationSent: false,
    reminderSent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Pedro Costa',
    professionalId: '3',
    professionalName: 'Dr. Paulo Oliveira',
    unitId: '2',
    unitName: 'Unidade Zona Norte',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    startTime: '14:00',
    endTime: '14:30',
    duration: 30,
    type: 'exam',
    status: 'confirmed',
    observations: 'Raio-X joelho',
    confirmationSent: true,
    reminderSent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockWaitingList: WaitingListEntry[] = [
  {
    id: '1',
    patientId: '4',
    patientName: 'Ana Ferreira',
    patientPhone: '(11) 98888-1111',
    professionalId: '1',
    preferredDates: [new Date().toISOString().split('T')[0]],
    preferredTimes: ['09:00', '10:00', '11:00'],
    type: 'consultation',
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    patientId: '5',
    patientName: 'Carlos Souza',
    patientPhone: '(11) 98888-2222',
    professionalId: '2',
    preferredDates: [
      new Date().toISOString().split('T')[0],
      new Date(Date.now() + 86400000).toISOString().split('T')[0]
    ],
    preferredTimes: ['14:00', '15:00', '16:00'],
    type: 'follow-up',
    priority: 'medium',
    createdAt: new Date().toISOString()
  }
];