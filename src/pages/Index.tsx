import React, { useState } from 'react';
import { PatientList } from '@/components/PatientList';
import { PatientForm } from '@/components/PatientForm';
import { PatientDetails } from '@/components/PatientDetails';
import { LaudoList } from '@/components/LaudoList';
import { LaudoForm } from '@/components/LaudoForm';
import { LaudoDetails } from '@/components/LaudoDetails';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { Patient } from '@/types/patient';
import { Laudo } from '@/types/laudo';
import { mockPatients } from '@/data/mockPatients';
import { mockLaudos } from '@/data/mockLaudos';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'home' | 'patients' | 'laudos' | 'form' | 'details';
type Section = 'home' | 'patients' | 'laudos' | 'about' | 'services' | 'contact';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [laudos, setLaudos] = useState<Laudo[]>(mockLaudos);
  const [selectedLaudo, setSelectedLaudo] = useState<Laudo | null>(null);
  const { toast } = useToast();

  const handleNavigate = (section: string) => {
    setCurrentSection(section as Section);
    if (section === 'patients') {
      setViewMode('patients');
    } else if (section === 'laudos') {
      setViewMode('laudos');
    } else {
      setViewMode('home');
    }
  };

  const handleGetStarted = () => {
    setViewMode('patients');
    setCurrentSection('patients');
  };

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
    
    setViewMode('patients');
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
    if (currentSection === 'patients') {
      setViewMode('patients');
      setSelectedPatient(null);
    } else if (currentSection === 'laudos') {
      setViewMode('laudos');
      setSelectedLaudo(null);
    }
  };

  const handleBackToList = () => {
    if (currentSection === 'patients') {
      setViewMode('patients');
      setSelectedPatient(null);
    } else if (currentSection === 'laudos') {
      setViewMode('laudos');
      setSelectedLaudo(null);
    }
  };

  // Laudo handlers
  const handleAddLaudo = () => {
    setSelectedLaudo(null);
    setViewMode('form');
  };

  const handleEditLaudo = (laudo: Laudo) => {
    setSelectedLaudo(laudo);
    setViewMode('form');
  };

  const handleViewLaudo = (laudo: Laudo) => {
    setSelectedLaudo(laudo);
    setViewMode('details');
  };

  const handleSaveLaudo = (laudoData: Omit<Laudo, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedLaudo) {
      // Update existing laudo
      const updatedLaudo: Laudo = {
        ...selectedLaudo,
        ...laudoData,
        updatedAt: new Date().toISOString()
      };
      
      setLaudos(prev => prev.map(l => l.id === selectedLaudo.id ? updatedLaudo : l));
      toast({
        title: "Laudo atualizado",
        description: `O laudo de ${laudoData.patientName} foi atualizado com sucesso.`
      });
    } else {
      // Create new laudo
      const newLaudo: Laudo = {
        ...laudoData,
        id: (laudos.length + 1).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setLaudos(prev => [newLaudo, ...prev]);
      toast({
        title: "Laudo criado",
        description: `Novo laudo para ${laudoData.patientName} foi criado com sucesso.`
      });
    }
    
    setSelectedLaudo(null);
    setViewMode('laudos');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigate} currentSection={currentSection} />
      
      {viewMode === 'home' && (
        <>
          <Hero onGetStarted={handleGetStarted} />
          <Footer />
        </>
      )}
      
      {viewMode === 'patients' && (
        <PatientList
          onAddPatient={handleAddPatient}
          onEditPatient={handleEditPatient}
          onViewPatient={handleViewPatient}
          onDeletePatient={handleDeletePatient}
          onScheduleAppointment={handleScheduleAppointment}
        />
      )}

      {viewMode === 'laudos' && (
        <LaudoList 
          laudos={laudos}
          onAddLaudo={handleAddLaudo}
          onEditLaudo={handleEditLaudo}
          onViewLaudo={handleViewLaudo}
        />
      )}
      
      {viewMode === 'form' && currentSection === 'patients' && (
        <PatientForm
          patient={selectedPatient || undefined}
          onSave={handleSavePatient}
          onCancel={handleCancel}
        />
      )}

      {viewMode === 'form' && currentSection === 'laudos' && (
        <LaudoForm 
          laudo={selectedLaudo || undefined}
          patients={patients}
          onSave={handleSaveLaudo}
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

      {viewMode === 'details' && selectedLaudo && (
        <LaudoDetails 
          laudo={selectedLaudo}
          onBack={handleBackToList}
          onEdit={() => handleEditLaudo(selectedLaudo)}
        />
      )}
    </div>
  );
};

export default Index;
