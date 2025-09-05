import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Eye, Edit3, Calendar, User, FileText, Filter } from 'lucide-react';
import { Laudo, LaudoFilters } from '@/types/laudo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LaudoListProps {
  laudos: Laudo[];
  onAddLaudo: () => void;
  onEditLaudo: (laudo: Laudo) => void;
  onViewLaudo: (laudo: Laudo) => void;
}

const getStatusBadge = (status: Laudo['status']) => {
  const variants = {
    draft: { variant: 'secondary' as const, label: 'Rascunho' },
    completed: { variant: 'default' as const, label: 'Concluído' },
    reviewed: { variant: 'outline' as const, label: 'Revisado' },
    delivered: { variant: 'destructive' as const, label: 'Entregue' }
  };
  return variants[status];
};

const getPriorityBadge = (priority: Laudo['priority']) => {
  const variants = {
    low: { variant: 'secondary' as const, label: 'Baixa', className: 'bg-green-100 text-green-800' },
    normal: { variant: 'outline' as const, label: 'Normal', className: '' },
    high: { variant: 'default' as const, label: 'Alta', className: 'bg-yellow-100 text-yellow-800' },
    urgent: { variant: 'destructive' as const, label: 'Urgente', className: '' }
  };
  return variants[priority];
};

export const LaudoList: React.FC<LaudoListProps> = ({
  laudos,
  onAddLaudo,
  onEditLaudo,
  onViewLaudo
}) => {
  const [filters, setFilters] = useState<LaudoFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filteredLaudos = useMemo(() => {
    return laudos.filter(laudo => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!laudo.patientName.toLowerCase().includes(searchLower) &&
            !laudo.doctorName.toLowerCase().includes(searchLower) &&
            !laudo.examType.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      if (filters.status && laudo.status !== filters.status) return false;
      if (filters.priority && laudo.priority !== filters.priority) return false;
      if (filters.examType && laudo.examType !== filters.examType) return false;
      if (filters.doctorName && laudo.doctorName !== filters.doctorName) return false;
      
      return true;
    });
  }, [laudos, filters]);

  const uniqueExamTypes = [...new Set(laudos.map(l => l.examType))];
  const uniqueDoctors = [...new Set(laudos.map(l => l.doctorName))];

  const handleFilterChange = (key: keyof LaudoFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Laudos</h1>
          <p className="text-muted-foreground mt-1">
            {filteredLaudos.length} {filteredLaudos.length === 1 ? 'laudo encontrado' : 'laudos encontrados'}
          </p>
        </div>
        <Button onClick={onAddLaudo} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Laudo
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por paciente, médico ou tipo de exame..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="reviewed">Revisado</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priority || ''} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.examType || ''} onValueChange={(value) => handleFilterChange('examType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Exame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {uniqueExamTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Laudos List */}
      <div className="grid gap-4">
        {filteredLaudos.map((laudo) => (
          <Card key={laudo.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-lg">{laudo.patientName}</h3>
                    <Badge {...getStatusBadge(laudo.status)}>
                      {getStatusBadge(laudo.status).label}
                    </Badge>
                    <Badge 
                      variant={getPriorityBadge(laudo.priority).variant}
                      className={getPriorityBadge(laudo.priority).className}
                    >
                      {getPriorityBadge(laudo.priority).label}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{laudo.examType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{laudo.doctorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(laudo.examDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                  </div>
                  
                  {laudo.conclusion && (
                    <p className="text-sm text-foreground line-clamp-2">
                      <strong>Conclusão:</strong> {laudo.conclusion}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewLaudo(laudo)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onEditLaudo(laudo)}
                    className="gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredLaudos.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum laudo encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.status || filters.priority ? 
                  'Tente ajustar os filtros para encontrar laudos.' :
                  'Comece criando seu primeiro laudo médico.'
                }
              </p>
              {(!filters.search && !filters.status && !filters.priority) && (
                <Button onClick={onAddLaudo} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Laudo
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};