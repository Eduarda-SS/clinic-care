export interface Laudo {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  examType: string;
  examDate: string;
  reportDate: string;
  status: 'draft' | 'completed' | 'reviewed' | 'delivered';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Dados do exame
  clinicalData?: string;
  findings: string;
  conclusion: string;
  recommendations?: string;
  
  // Anexos e imagens
  images?: Array<{
    id: string;
    url: string;
    description?: string;
    uploadDate: string;
  }>;
  
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    uploadDate: string;
  }>;
  
  // Metadados
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface LaudoFilters {
  search?: string;
  status?: string;
  priority?: string;
  examType?: string;
  doctorName?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}