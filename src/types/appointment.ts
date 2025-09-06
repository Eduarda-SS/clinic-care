export type AppointmentStatus = 'confirmed' | 'pending' | 'absent' | 'cancelled' | 'completed';
export type AppointmentType = 'consultation' | 'exam' | 'follow-up' | 'emergency';
export type ViewMode = 'day' | 'week' | 'month';

export interface Unit {
  id: string;
  name: string;
  address: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  email: string;
  phone: string;
  unitIds: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  unitId: string;
  unitName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: AppointmentType;
  status: AppointmentStatus;
  observations?: string;
  confirmationSent: boolean;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: Appointment;
}

export interface CalendarDay {
  date: string;
  dayOfWeek: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  timeSlots: TimeSlot[];
}

export interface AppointmentFilters {
  unitId?: string;
  professionalId?: string;
  status?: AppointmentStatus[];
  type?: AppointmentType[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface WaitingListEntry {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  professionalId: string;
  preferredDates: string[];
  preferredTimes: string[];
  type: AppointmentType;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}