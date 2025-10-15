export interface Doctor {
  id: string;
  // Dados pessoais
  name: string;
  cpf: string;
  rg?: string;
  gender: 'masculine' | 'feminine' | 'other';
  birthDate: string;
  
  // Dados profissionais
  crm: string;
  crmState: string;
  specialty: string;
  subspecialty?: string;
  
  // Contato
  email?: string;
  cellphone?: string;
  phone?: string;
  
  // Endereço
  address?: {
    zipCode?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  
  // Informações administrativas
  status: 'active' | 'inactive';
  workSchedule?: string;
  observations?: string;
  
  // Metadados
  createdAt: string;
  updatedAt: string;
}

export interface DoctorFilters {
  search?: string;
  specialty?: string;
  status?: 'active' | 'inactive';
  crmState?: string;
  city?: string;
  state?: string;
}
