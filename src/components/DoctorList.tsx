import React, { useState, useMemo } from 'react';
import { Doctor, DoctorFilters } from '@/types/doctor';
import { mockDoctors } from '@/data/mockDoctors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';

interface DoctorListProps {
  onAddDoctor: () => void;
  onEditDoctor: (doctor: Doctor) => void;
  onViewDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (doctorId: string) => void;
}

export const DoctorList: React.FC<DoctorListProps> = ({
  onAddDoctor,
  onEditDoctor,
  onViewDoctor,
  onDeleteDoctor,
}) => {
  const [filters, setFilters] = useState<DoctorFilters>({});

  const filteredDoctors = useMemo(() => {
    return mockDoctors.filter((doctor) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          doctor.name.toLowerCase().includes(searchLower) ||
          doctor.cpf.includes(filters.search) ||
          doctor.crm.includes(filters.search) ||
          (doctor.specialty && doctor.specialty.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Specialty filter
      if (filters.specialty && doctor.specialty !== filters.specialty) {
        return false;
      }

      // Status filter
      if (filters.status && doctor.status !== filters.status) {
        return false;
      }

      // CRM State filter
      if (filters.crmState && doctor.crmState !== filters.crmState) {
        return false;
      }

      // City filter
      if (filters.city && doctor.address?.city !== filters.city) {
        return false;
      }

      // State filter
      if (filters.state && doctor.address?.state !== filters.state) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const uniqueSpecialties = useMemo(() => {
    return [...new Set(mockDoctors.map(d => d.specialty))];
  }, []);

  const uniqueStates = useMemo(() => {
    return [...new Set(mockDoctors.map(d => d.crmState))];
  }, []);

  const formatPhone = (phone?: string) => {
    if (!phone) return 'N/A';
    return phone;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Médicos</h1>
          <p className="text-muted-foreground">Gerencie os médicos cadastrados no sistema</p>
        </div>
        <Button onClick={onAddDoctor}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Médico
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border p-4 mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CPF ou CRM..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.specialty || 'all'}
            onValueChange={(value) => 
              setFilters({ ...filters, specialty: value === 'all' ? undefined : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Especialidade" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Todas especialidades</SelectItem>
              {uniqueSpecialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => 
              setFilters({ ...filters, status: value === 'all' ? undefined : value as 'active' | 'inactive' })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.crmState || 'all'}
            onValueChange={(value) => 
              setFilters({ ...filters, crmState: value === 'all' ? undefined : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="CRM Estado" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Todos estados</SelectItem>
              {uniqueStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(filters.search || filters.specialty || filters.status || filters.crmState) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({})}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CRM</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDoctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum médico encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.crm}/{doctor.crmState}</TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{formatPhone(doctor.cellphone)}</TableCell>
                  <TableCell>{doctor.address?.city || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={doctor.status === 'active' ? 'default' : 'secondary'}>
                      {doctor.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => onViewDoctor(doctor)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditDoctor(doctor)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteDoctor(doctor.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Exibindo {filteredDoctors.length} de {mockDoctors.length} médicos
      </div>
    </div>
  );
};
