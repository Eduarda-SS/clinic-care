import { Doctor } from '@/types/doctor';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Cardiologista',
    cpf: '123.456.789-00',
    gender: 'masculine',
    birthDate: '1975-03-15',
    crm: '12345',
    crmState: 'SP',
    specialty: 'Cardiologia',
    email: 'joao.cardio@hospital.com',
    cellphone: '(11) 98765-4321',
    address: {
      city: 'São Paulo',
      state: 'SP',
      street: 'Av. Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      zipCode: '01310-100'
    },
    status: 'active',
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-01-15T10:00:00'
  },
  {
    id: '2',
    name: 'Dra. Ana Radiologista',
    cpf: '987.654.321-00',
    gender: 'feminine',
    birthDate: '1980-07-22',
    crm: '54321',
    crmState: 'RJ',
    specialty: 'Radiologia',
    email: 'ana.radio@hospital.com',
    cellphone: '(21) 99876-5432',
    address: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      street: 'Av. Atlântica',
      number: '500',
      neighborhood: 'Copacabana',
      zipCode: '22010-000'
    },
    status: 'active',
    createdAt: '2024-02-10T14:30:00',
    updatedAt: '2024-02-10T14:30:00'
  },
  {
    id: '3',
    name: 'Dr. Pedro Ortopedista',
    cpf: '456.789.123-00',
    gender: 'masculine',
    birthDate: '1978-11-05',
    crm: '67890',
    crmState: 'MG',
    specialty: 'Ortopedia',
    subspecialty: 'Cirurgia de Coluna',
    email: 'pedro.ortopedia@hospital.com',
    cellphone: '(31) 97654-3210',
    address: {
      city: 'Belo Horizonte',
      state: 'MG',
      street: 'Av. Afonso Pena',
      number: '1500',
      neighborhood: 'Centro',
      zipCode: '30130-000'
    },
    status: 'active',
    createdAt: '2024-01-20T09:15:00',
    updatedAt: '2024-01-20T09:15:00'
  },
  {
    id: '4',
    name: 'Dra. Lucia Neurologista',
    cpf: '321.654.987-00',
    gender: 'feminine',
    birthDate: '1982-05-18',
    crm: '11223',
    crmState: 'SP',
    specialty: 'Neurologia',
    email: 'lucia.neuro@hospital.com',
    cellphone: '(11) 96543-2109',
    address: {
      city: 'Campinas',
      state: 'SP',
      street: 'Av. Norte Sul',
      number: '800',
      neighborhood: 'Cambuí',
      zipCode: '13025-000'
    },
    status: 'active',
    createdAt: '2024-03-05T11:20:00',
    updatedAt: '2024-03-05T11:20:00'
  },
  {
    id: '5',
    name: 'Dr. Marcos Gastroenterologista',
    cpf: '789.123.456-00',
    gender: 'masculine',
    birthDate: '1976-09-30',
    crm: '33445',
    crmState: 'RS',
    specialty: 'Gastroenterologia',
    email: 'marcos.gastro@hospital.com',
    cellphone: '(51) 98765-1234',
    address: {
      city: 'Porto Alegre',
      state: 'RS',
      street: 'Av. Independência',
      number: '1200',
      neighborhood: 'Independência',
      zipCode: '90035-000'
    },
    status: 'inactive',
    createdAt: '2024-02-28T16:45:00',
    updatedAt: '2024-02-28T16:45:00'
  }
];
