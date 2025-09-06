import React, { useState } from 'react';
import { Clock, Phone, User, AlertCircle, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WaitingListEntry, Professional } from '@/types/appointment';
import { cn } from '@/lib/utils';

interface WaitingListProps {
  waitingList: WaitingListEntry[];
  professionals: Professional[];
  onCallPatient: (entry: WaitingListEntry) => void;
  onRemoveFromList: (entryId: string) => void;
  onAddToList: () => void;
}

const priorityColors = {
  high: 'bg-medical-error text-white',
  medium: 'bg-medical-warning text-white',
  low: 'bg-medical-success text-white',
};

const priorityLabels = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
};

const typeLabels = {
  consultation: 'Consulta',
  exam: 'Exame',
  'follow-up': 'Retorno',
  emergency: 'Emergência',
};

export function WaitingList({
  waitingList,
  professionals,
  onCallPatient,
  onRemoveFromList,
  onAddToList
}: WaitingListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfessional, setFilterProfessional] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const filteredList = waitingList.filter(entry => {
    const matchesSearch = entry.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.patientPhone.includes(searchTerm);
    const matchesProfessional = !filterProfessional || entry.professionalId === filterProfessional;
    const matchesPriority = !filterPriority || entry.priority === filterPriority;

    return matchesSearch && matchesProfessional && matchesPriority;
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'f' || e.key === 'F') {
      // Announce waiting list
      const announcement = `Fila de espera: ${filteredList.length} pacientes aguardando`;
      // You could implement text-to-speech here or show a modal
      console.log(announcement);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Fila de Espera
          </h1>
          <p className="text-muted-foreground">
            {filteredList.length} pacientes aguardando • Pressione 'F' para anúncio
          </p>
        </div>
        <Button onClick={onAddToList} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar à Fila
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Buscar por nome ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        
        <Select value={filterProfessional} onValueChange={setFilterProfessional}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos os profissionais" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os profissionais</SelectItem>
            {professionals.map((professional) => (
              <SelectItem key={professional.id} value={professional.id}>
                {professional.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Waiting List */}
      <div className="grid gap-4">
        {filteredList.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum paciente na fila</h3>
              <p className="text-muted-foreground">
                Adicione pacientes à fila de espera para chamá-los quando houver disponibilidade.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredList.map((entry) => {
            const professional = professionals.find(p => p.id === entry.professionalId);
            
            return (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Badge className={cn(priorityColors[entry.priority])}>
                          {priorityLabels[entry.priority]}
                        </Badge>
                        <Badge variant="outline">
                          {typeLabels[entry.type]}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {entry.patientName}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {entry.patientPhone}
                        </p>
                      </div>

                      <div className="text-sm">
                        <p className="font-medium">{professional?.name}</p>
                        <p className="text-muted-foreground">{professional?.specialty}</p>
                      </div>

                      <div className="text-sm">
                        <p className="text-muted-foreground">Horários preferidos:</p>
                        <p>{entry.preferredTimes.join(', ')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onCallPatient(entry)}
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Chamar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveFromList(entry.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}