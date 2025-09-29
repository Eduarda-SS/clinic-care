export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  department?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  level: 'basic' | 'advanced' | 'admin';
}

export interface Permission {
  module: string;
  actions: ('read' | 'write' | 'delete' | 'export' | 'manage')[];
}

export const USER_ROLES: UserRole[] = [
  {
    id: 'gestao-coordenacao',
    name: 'Gestão / Coordenação',
    level: 'admin',
    permissions: [
      { module: 'pacientes', actions: ['read', 'write', 'delete', 'export', 'manage'] },
      { module: 'medicos', actions: ['read', 'write', 'delete', 'export', 'manage'] },
      { module: 'agendamentos', actions: ['read', 'write', 'delete', 'export', 'manage'] },
      { module: 'laudos', actions: ['read', 'write', 'delete', 'export', 'manage'] },
      { module: 'relatorios', actions: ['read', 'write', 'delete', 'export', 'manage'] },
      { module: 'dashboard', actions: ['read', 'write', 'delete', 'export', 'manage'] },
      { module: 'configuracoes', actions: ['read', 'write', 'delete', 'export', 'manage'] },
      { module: 'usuarios', actions: ['read', 'write', 'delete', 'export', 'manage'] },
      { module: 'metricas', actions: ['read', 'write', 'delete', 'export', 'manage'] }
    ]
  },
  {
    id: 'secretaria',
    name: 'Secretária',
    level: 'basic',
    permissions: [
      { module: 'pacientes', actions: ['read', 'write'] },
      { module: 'agendamentos', actions: ['read', 'write'] },
      { module: 'dashboard', actions: ['read'] }
    ]
  },
  {
    id: 'medico',
    name: 'Médico',
    level: 'advanced',
    permissions: [
      { module: 'pacientes', actions: ['read', 'write'] },
      { module: 'agendamentos', actions: ['read'] },
      { module: 'laudos', actions: ['read', 'write'] },
      { module: 'dashboard', actions: ['read'] }
    ]
  }
];