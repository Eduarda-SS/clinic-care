import React, { useState } from 'react';
import { PatientList } from '@/components/PatientList';
import { PatientForm } from '@/components/PatientForm';
import { PatientDetails } from '@/components/PatientDetails';
import { Patient } from '@/types/patient';
import { mockPatients } from '@/data/mockPatients';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'list' | 'form' | 'details';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setViewMode('form');
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode('form');
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode('details');
  };

  const handleSavePatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    if (selectedPatient) {
      // Editing existing patient
      const updatedPatient: Patient = {
        ...patientData,
        id: selectedPatient.id,
        createdAt: selectedPatient.createdAt,
        updatedAt: now,
      };
      
      setPatients(prev => 
        prev.map(p => p.id === selectedPatient.id ? updatedPatient : p)
      );
      
      toast({
        title: "Paciente atualizado",
        description: "As informações do paciente foram atualizadas com sucesso.",
        variant: "default",
      });
    } else {
      // Creating new patient
      const newPatient: Patient = {
        ...patientData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      
      setPatients(prev => [newPatient, ...prev]);
      
      toast({
        title: "Paciente cadastrado",
        description: "Novo paciente foi cadastrado com sucesso.",
        variant: "default",
      });
    }
    
    setViewMode('list');
    setSelectedPatient(null);
  };

  const handleDeletePatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    
    if (window.confirm(`Tem certeza que deseja excluir o paciente ${patient?.name}?`)) {
      setPatients(prev => prev.filter(p => p.id !== patientId));
      
      toast({
        title: "Paciente excluído",
        description: "O paciente foi removido do sistema.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleAppointment = (patient: Patient) => {
    toast({
      title: "Agendar consulta",
      description: `Funcionalidade de agendamento para ${patient.name} será implementada em breve.`,
      variant: "default",
    });
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedPatient(null);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPatient(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {viewMode === 'list' && (
        <PatientList
          onAddPatient={handleAddPatient}
          onEditPatient={handleEditPatient}
          onViewPatient={handleViewPatient}
          onDeletePatient={handleDeletePatient}
          onScheduleAppointment={handleScheduleAppointment}
        />
      )}
      
      {viewMode === 'form' && (
        <PatientForm
          patient={selectedPatient || undefined}
          onSave={handleSavePatient}
          onCancel={handleCancel}
        />
      )}
      
      {viewMode === 'details' && selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          onEdit={() => handleEditPatient(selectedPatient)}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default Index;
