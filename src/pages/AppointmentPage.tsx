import React, { useState, useEffect } from 'react';
import { AppointmentCalendar } from '@/components/appointments/AppointmentCalendar';
import { AppointmentForm } from '@/components/appointments/AppointmentForm';
import { WaitingList } from '@/components/appointments/WaitingList';
import { Appointment, ViewMode, WaitingListEntry } from '@/types/appointment';
import { Patient } from '@/types/patient';
import { mockAppointments, mockUnits, mockProfessionals, mockWaitingList } from '@/data/mockAppointments';
import { mockPatients } from '@/data/mockPatients';
import { useToast } from '@/hooks/use-toast';

type PageMode = 'calendar' | 'form' | 'waiting-list';

export default function AppointmentPage() {
  const [pageMode, setPageMode] = useState<PageMode>('calendar');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>(mockWaitingList);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>();
  const [preselectedDate, setPreselectedDate] = useState<Date | undefined>();
  const [preselectedTime, setPreselectedTime] = useState<string | undefined>();
  
  const { toast } = useToast();

  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAppointment) {
      // Update existing appointment
      const updatedAppointment: Appointment = {
        ...appointmentData,
        id: editingAppointment.id,
        createdAt: editingAppointment.createdAt,
        updatedAt: new Date().toISOString(),
      };
      
      setAppointments(prev => prev.map(apt => 
        apt.id === editingAppointment.id ? updatedAppointment : apt
      ));
      
      toast({
        title: "Agendamento atualizado",
        description: `Consulta de ${appointmentData.patientName} foi atualizada.`,
      });
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      
      toast({
        title: "Agendamento criado",
        description: `Consulta de ${appointmentData.patientName} foi agendada para ${appointmentData.date} às ${appointmentData.startTime}.`,
      });
    }
    
    setPageMode('calendar');
    setEditingAppointment(undefined);
    setPreselectedDate(undefined);
    setPreselectedTime(undefined);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setPageMode('form');
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    setPreselectedDate(date);
    setPreselectedTime(time);
    setEditingAppointment(undefined);
    setPageMode('form');
  };

  const handleCallPatient = (entry: WaitingListEntry) => {
    toast({
      title: "Chamando paciente",
      description: `Ligando para ${entry.patientName} - ${entry.patientPhone}`,
    });
    
    // In a real app, this would integrate with a calling system
    setTimeout(() => {
      toast({
        title: "Paciente contactado",
        description: `${entry.patientName} foi contactado e confirmou presença.`,
      });
    }, 2000);
  };

  const handleRemoveFromWaitingList = (entryId: string) => {
    setWaitingList(prev => prev.filter(entry => entry.id !== entryId));
    toast({
      title: "Paciente removido",
      description: "Paciente foi removido da fila de espera.",
    });
  };

  const handleAddToWaitingList = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Adicionar paciente à fila de espera será implementado em breve.",
    });
  };

  const handleCancel = () => {
    setPageMode('calendar');
    setEditingAppointment(undefined);
    setPreselectedDate(undefined);
    setPreselectedTime(undefined);
  };

  if (pageMode === 'form') {
    return (
      <AppointmentForm
        appointment={editingAppointment}
        patients={mockPatients}
        units={mockUnits}
        professionals={mockProfessionals}
        preselectedDate={preselectedDate}
        preselectedTime={preselectedTime}
        onSave={handleSaveAppointment}
        onCancel={handleCancel}
      />
    );
  }

  if (pageMode === 'waiting-list') {
    return (
      <WaitingList
        waitingList={waitingList}
        professionals={mockProfessionals}
        onCallPatient={handleCallPatient}
        onRemoveFromList={handleRemoveFromWaitingList}
        onAddToList={handleAddToWaitingList}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <AppointmentCalendar
        appointments={appointments}
        units={mockUnits}
        professionals={mockProfessionals}
        selectedDate={selectedDate}
        viewMode={viewMode}
        selectedUnitId={selectedUnitId}
        selectedProfessionalId={selectedProfessionalId}
        onDateSelect={setSelectedDate}
        onViewModeChange={setViewMode}
        onUnitChange={setSelectedUnitId}
        onProfessionalChange={setSelectedProfessionalId}
        onAppointmentClick={handleAppointmentClick}
        onTimeSlotClick={handleTimeSlotClick}
      />
    </div>
  );
}