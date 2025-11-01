import { useState } from 'react';
import { DoctorList } from '@/components/DoctorList';
import { DoctorForm } from '@/components/DoctorForm';
import { DoctorDetails } from '@/components/DoctorDetails';
import { Doctor } from '@/types/doctor';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function ProfessionalsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setIsFormOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setIsFormOpen(true);
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailsOpen(true);
  };

  const handleDeleteDoctor = (doctorId: string) => {
    const doctor = selectedDoctor;
    if (window.confirm(`Tem certeza que deseja excluir este profissional?`)) {
      console.log('Deletando profissional:', doctorId);
      // Implementar lógica de exclusão
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDoctor(null);
  };

  const handleDetailsClose = () => {
    setIsDetailsOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="container mx-auto p-6">
      <DoctorList
        onAddDoctor={handleAddDoctor}
        onEditDoctor={handleEditDoctor}
        onViewDoctor={handleViewDoctor}
        onDeleteDoctor={handleDeleteDoctor}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DoctorForm
            doctor={editingDoctor}
            onClose={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDoctor && (
            <DoctorDetails
              doctor={selectedDoctor}
              onClose={handleDetailsClose}
              onEdit={() => {
                setIsDetailsOpen(false);
                handleEditDoctor(selectedDoctor);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
