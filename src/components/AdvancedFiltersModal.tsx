import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { PatientFilters } from '@/types/patient';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AdvancedFiltersModalProps {
  filters: PatientFilters;
  onFiltersChange: (filters: PatientFilters) => void;
  children: React.ReactNode;
}

export const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
  filters,
  onFiltersChange,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<PatientFilters>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: PatientFilters = {
      search: filters.search,
      insurance: filters.insurance,
      isVip: filters.isVip,
      isBirthday: filters.isBirthday,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setOpen(false);
  };

  const handleDateSelect = (field: 'start' | 'end', date: Date | undefined) => {
    if (!date) return;
    
    setLocalFilters(prev => ({
      ...prev,
      lastAppointmentRange: {
        ...prev.lastAppointmentRange,
        [field]: date.toISOString().split('T')[0]
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background border shadow-medical">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Filter className="h-5 w-5" />
            Filtros Avançados
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Localização */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Localização</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Digite a cidade..."
                  value={localFilters.city || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">Estado</Label>
                <Select
                  value={localFilters.state || 'all'}
                  onValueChange={(value) => setLocalFilters({ ...localFilters, state: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-medical">
                    <SelectItem value="all">Todos os estados</SelectItem>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="GO">Goiás</SelectItem>
                    <SelectItem value="MT">Mato Grosso</SelectItem>
                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                    <SelectItem value="DF">Distrito Federal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Intervalo de Idade */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Intervalo de Idade</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAge" className="text-sm font-medium">Idade mínima</Label>
                <Input
                  id="minAge"
                  type="number"
                  placeholder="Ex: 18"
                  min="0"
                  max="120"
                  value={localFilters.ageRange?.min || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    ageRange: {
                      ...localFilters.ageRange,
                      min: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAge" className="text-sm font-medium">Idade máxima</Label>
                <Input
                  id="maxAge"
                  type="number"
                  placeholder="Ex: 65"
                  min="0"
                  max="120"
                  value={localFilters.ageRange?.max || ''}
                  onChange={(e) => setLocalFilters({
                    ...localFilters,
                    ageRange: {
                      ...localFilters.ageRange,
                      max: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Data do Último Atendimento */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Data do Último Atendimento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Data inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !localFilters.lastAppointmentRange?.start && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.lastAppointmentRange?.start
                        ? format(new Date(localFilters.lastAppointmentRange.start), "dd/MM/yyyy")
                        : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border shadow-medical" align="start">
                    <Calendar
                      mode="single"
                      selected={localFilters.lastAppointmentRange?.start ? new Date(localFilters.lastAppointmentRange.start) : undefined}
                      onSelect={(date) => handleDateSelect('start', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Data final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !localFilters.lastAppointmentRange?.end && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.lastAppointmentRange?.end
                        ? format(new Date(localFilters.lastAppointmentRange.end), "dd/MM/yyyy")
                        : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border shadow-medical" align="start">
                    <Calendar
                      mode="single"
                      selected={localFilters.lastAppointmentRange?.end ? new Date(localFilters.lastAppointmentRange.end) : undefined}
                      onSelect={(date) => handleDateSelect('end', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
          <Button onClick={handleApplyFilters} className="bg-gradient-to-r from-primary to-primary-glow">
            Aplicar Filtros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};