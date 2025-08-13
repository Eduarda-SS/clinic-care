import React, { useState, useMemo } from 'react';
import { Search, Filter, UserPlus, MoreVertical, Eye, Edit, Trash2, Calendar, Crown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Patient, PatientFilters } from '@/types/patient';
import { mockPatients } from '@/data/mockPatients';
import { AdvancedFiltersModal } from './AdvancedFiltersModal';

interface PatientListProps {
  onEditPatient: (patient: Patient) => void;
  onViewPatient: (patient: Patient) => void;
  onAddPatient: () => void;
  onDeletePatient: (patientId: string) => void;
  onScheduleAppointment: (patient: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  onEditPatient,
  onViewPatient,
  onAddPatient,
  onDeletePatient,
  onScheduleAppointment,
}) => {
  const [filters, setFilters] = useState<PatientFilters>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredPatients = useMemo(() => {
    return mockPatients.filter((patient) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = patient.name.toLowerCase().includes(searchLower);
        const matchesCpf = patient.cpf.includes(filters.search);
        if (!matchesName && !matchesCpf) return false;
      }
      
      if (filters.insurance && patient.insurance !== filters.insurance) return false;
      if (filters.isVip !== undefined && patient.isVip !== filters.isVip) return false;
      
      if (filters.isBirthday) {
        const today = new Date();
        const birthDate = new Date(patient.birthDate);
        const isBirthdayToday = 
          birthDate.getDate() === today.getDate() && 
          birthDate.getMonth() === today.getMonth();
        if (!isBirthdayToday) return false;
      }

      // Advanced filters
      if (filters.city && patient.address?.city?.toLowerCase() !== filters.city.toLowerCase()) return false;
      if (filters.state && patient.address?.state !== filters.state) return false;

      if (filters.ageRange) {
        const today = new Date();
        const birthDate = new Date(patient.birthDate);
        const age = today.getFullYear() - birthDate.getFullYear() - 
                   (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);
        
        if (filters.ageRange.min !== undefined && age < filters.ageRange.min) return false;
        if (filters.ageRange.max !== undefined && age > filters.ageRange.max) return false;
      }

      if (filters.lastAppointmentRange && patient.lastAppointment) {
        const appointmentDate = new Date(patient.lastAppointment).toISOString().split('T')[0];
        if (filters.lastAppointmentRange.start && appointmentDate < filters.lastAppointmentRange.start) return false;
        if (filters.lastAppointmentRange.end && appointmentDate > filters.lastAppointmentRange.end) return false;
      }
      
      return true;
    });
  }, [filters]);

  const uniqueInsurances = useMemo(() => {
    const insurances = mockPatients
      .map(patient => patient.insurance)
      .filter(Boolean) as string[];
    return [...new Set(insurances)].sort();
  }, []);

  const formatPhone = (phone: string) => {
    if (!phone) return '-';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
          <p className="text-muted-foreground">Gerencie as informações de seus pacientes</p>
        </div>
        <Button onClick={onAddPatient} className="bg-gradient-to-r from-primary to-primary-glow shadow-medical">
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Paciente
        </Button>
      </div>

      {/* Filtros */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou CPF..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="min-w-[200px]">
              <Select
                value={filters.insurance || 'all'}
                onValueChange={(value) => setFilters({ ...filters, insurance: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Convênio" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-medical">
                  <SelectItem value="all">Todos os convênios</SelectItem>
                  {uniqueInsurances.map((insurance) => (
                    <SelectItem key={insurance} value={insurance}>
                      {insurance}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant={filters.isVip ? "default" : "outline"}
              onClick={() => setFilters({ ...filters, isVip: filters.isVip ? undefined : true })}
              className={filters.isVip ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
            >
              <Crown className="mr-2 h-4 w-4" />
              VIP
            </Button>
            
            <Button
              variant={filters.isBirthday ? "default" : "outline"}
              onClick={() => setFilters({ ...filters, isBirthday: !filters.isBirthday })}
              className={filters.isBirthday ? "bg-medical-warning text-white" : ""}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Aniversariantes
            </Button>

            <AdvancedFiltersModal filters={filters} onFiltersChange={setFilters}>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Filtros Avançados
              </Button>
            </AdvancedFiltersModal>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredPatients.length} de {mockPatients.length} pacientes
          </div>
        </CardContent>
      </Card>

      {/* Lista de pacientes */}
      <Card className="shadow-soft">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-medical-light border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-accent-foreground">Nome</th>
                  <th className="text-left p-4 font-semibold text-accent-foreground">Telefone</th>
                  <th className="text-left p-4 font-semibold text-accent-foreground">Cidade</th>
                  <th className="text-left p-4 font-semibold text-accent-foreground">Estado</th>
                  <th className="text-left p-4 font-semibold text-accent-foreground">Último Atendimento</th>
                  <th className="text-left p-4 font-semibold text-accent-foreground">Próximo Atendimento</th>
                  <th className="text-right p-4 font-semibold text-accent-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr 
                    key={patient.id} 
                    className={`border-b hover:bg-medical-light/50 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white font-semibold">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <button
                            onClick={() => onViewPatient(patient)}
                            className="font-semibold text-primary hover:text-primary-glow transition-colors cursor-pointer"
                          >
                            {patient.name}
                          </button>
                          <div className="flex items-center gap-2 mt-1">
                            {patient.isVip && (
                              <Badge variant="secondary" className="text-xs bg-medical-warning text-white">
                                <Crown className="w-3 h-3 mr-1" />
                                VIP
                              </Badge>
                            )}
                            {patient.insurance && (
                              <Badge variant="outline" className="text-xs">
                                {patient.insurance}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{formatPhone(patient.cellphone || '')}</td>
                    <td className="p-4 text-muted-foreground">{patient.address?.city || '-'}</td>
                    <td className="p-4 text-muted-foreground">{patient.address?.state || '-'}</td>
                    <td className="p-4 text-muted-foreground">{formatDate(patient.lastAppointment || '')}</td>
                    <td className="p-4">
                      {patient.nextAppointment ? (
                        <span className="text-medical-success font-medium">{formatDate(patient.nextAppointment)}</span>
                      ) : (
                        <span className="text-muted-foreground">Nenhum atendimento agendado</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border shadow-medical">
                          <DropdownMenuItem onClick={() => onViewPatient(patient)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditPatient(patient)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onScheduleAppointment(patient)}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Marcar Consulta
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDeletePatient(patient.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Search className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Nenhum paciente encontrado</p>
                  <p className="text-sm">Tente ajustar os filtros ou adicionar um novo paciente</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};