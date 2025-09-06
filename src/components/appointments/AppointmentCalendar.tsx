import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, startOfMonth, endOfMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Appointment, ViewMode, Unit, Professional } from '@/types/appointment';
import { cn } from '@/lib/utils';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  units: Unit[];
  professionals: Professional[];
  selectedDate: Date;
  viewMode: ViewMode;
  selectedUnitId?: string;
  selectedProfessionalId?: string;
  onDateSelect: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onUnitChange: (unitId: string) => void;
  onProfessionalChange: (professionalId: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
  onTimeSlotClick: (date: Date, time: string) => void;
}

const timeSlots = Array.from({ length: 54 }, (_, i) => {
  const hour = Math.floor(i / 6) + 7; // Start at 7:00
  const minute = (i % 6) * 10;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-medical-success text-white';
    case 'pending':
      return 'bg-medical-warning text-white';
    case 'absent':
      return 'bg-medical-error text-white';
    case 'cancelled':
      return 'bg-muted text-muted-foreground';
    case 'completed':
      return 'bg-primary text-primary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function AppointmentCalendar({
  appointments,
  units,
  professionals,
  selectedDate,
  viewMode,
  selectedUnitId,
  selectedProfessionalId,
  onDateSelect,
  onViewModeChange,
  onUnitChange,
  onProfessionalChange,
  onAppointmentClick,
  onTimeSlotClick
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'c' || e.key === 'C') {
        onDateSelect(new Date());
        setCurrentDate(new Date());
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onDateSelect]);

  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate: Date;
    
    switch (viewMode) {
      case 'day':
        newDate = direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1);
        break;
      case 'week':
        newDate = direction === 'next' ? addDays(currentDate, 7) : subDays(currentDate, 7);
        break;
      case 'month':
        newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1);
        break;
    }
    
    setCurrentDate(newDate);
    onDateSelect(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(today);
  };

  const getDateRange = () => {
    switch (viewMode) {
      case 'day':
        return [currentDate];
      case 'week':
        const start = startOfWeek(currentDate, { locale: ptBR });
        const end = endOfWeek(currentDate, { locale: ptBR });
        return eachDayOfInterval({ start, end });
      case 'month':
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return eachDayOfInterval({ start: monthStart, end: monthEnd });
    }
  };

  const getAppointmentsForDateAndTime = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(
      (apt) => 
        apt.date === dateStr && 
        apt.startTime === time &&
        (!selectedUnitId || apt.unitId === selectedUnitId) &&
        (!selectedProfessionalId || apt.professionalId === selectedProfessionalId)
    );
  };

  const filteredProfessionals = selectedUnitId 
    ? professionals.filter(prof => prof.unitIds.includes(selectedUnitId))
    : professionals;

  const renderDayView = () => {
    const dates = getDateRange();
    const date = dates[0];

    return (
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Time column */}
          <div className="w-20 flex-shrink-0 border-r border-border">
            <div className="h-12 border-b border-border"></div>
            {timeSlots.map((time) => (
              <div key={time} className="h-12 border-b border-border p-2 text-sm text-muted-foreground">
                {time}
              </div>
            ))}
          </div>

          {/* Day column */}
          <div className="flex-1 overflow-hidden">
            <div className="h-12 border-b border-border p-2 text-center font-medium">
              {format(date, 'EEEE, dd/MM', { locale: ptBR })}
              {isToday(date) && (
                <Badge variant="secondary" className="ml-2">Hoje</Badge>
              )}
            </div>
            <div className="overflow-y-auto" style={{ height: 'calc(100% - 3rem)' }}>
              {timeSlots.map((time) => {
                const appointmentsAtTime = getAppointmentsForDateAndTime(date, time);
                return (
                  <div
                    key={time}
                    className="h-12 border-b border-border p-1 hover:bg-accent/50 cursor-pointer relative"
                    onClick={() => appointmentsAtTime.length === 0 && onTimeSlotClick(date, time)}
                  >
                    {appointmentsAtTime.map((appointment, idx) => (
                      <div
                        key={appointment.id}
                        className={cn(
                          "absolute inset-x-1 rounded text-xs p-1 cursor-pointer",
                          getStatusColor(appointment.status)
                        )}
                        style={{ 
                          top: `${idx * 4}px`,
                          height: `${(appointment.duration / 10) * 12 - 2}px`,
                          zIndex: 10 + idx
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAppointmentClick(appointment);
                        }}
                      >
                        <div className="truncate font-medium">{appointment.patientName}</div>
                        <div className="truncate">{appointment.type}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const dates = getDateRange();

    return (
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Time column */}
          <div className="w-20 flex-shrink-0 border-r border-border">
            <div className="h-12 border-b border-border"></div>
            {timeSlots.map((time) => (
              <div key={time} className="h-12 border-b border-border p-2 text-sm text-muted-foreground">
                {time}
              </div>
            ))}
          </div>

          {/* Week columns */}
          <div className="flex-1 flex overflow-hidden">
            {dates.map((date) => (
              <div key={date.toISOString()} className="flex-1 border-r border-border last:border-r-0">
                <div className="h-12 border-b border-border p-2 text-center">
                  <div className="text-sm font-medium">
                    {format(date, 'EEE', { locale: ptBR })}
                  </div>
                  <div className={cn(
                    "text-lg",
                    isToday(date) && "text-primary font-bold"
                  )}>
                    {format(date, 'dd')}
                  </div>
                </div>
                <div className="overflow-y-auto" style={{ height: 'calc(100% - 3rem)' }}>
                  {timeSlots.map((time) => {
                    const appointmentsAtTime = getAppointmentsForDateAndTime(date, time);
                    return (
                      <div
                        key={time}
                        className="h-12 border-b border-border p-1 hover:bg-accent/50 cursor-pointer relative"
                        onClick={() => appointmentsAtTime.length === 0 && onTimeSlotClick(date, time)}
                      >
                        {appointmentsAtTime.map((appointment, idx) => (
                          <div
                            key={appointment.id}
                            className={cn(
                              "absolute inset-x-1 rounded text-xs p-1 cursor-pointer",
                              getStatusColor(appointment.status)
                            )}
                            style={{ 
                              top: `${idx * 4}px`,
                              height: `${(appointment.duration / 10) * 12 - 2}px`,
                              zIndex: 10 + idx
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppointmentClick(appointment);
                            }}
                          >
                            <div className="truncate font-medium">{appointment.patientName}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const dates = getDateRange();
    const weeks: Date[][] = [];
    
    for (let i = 0; i < dates.length; i += 7) {
      weeks.push(dates.slice(i, i + 7));
    }

    return (
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-border h-full">
          {/* Week headers */}
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="bg-background p-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
          
          {/* Month days */}
          {dates.map((date) => {
            const dayAppointments = appointments.filter(
              (apt) => 
                apt.date === format(date, 'yyyy-MM-dd') &&
                (!selectedUnitId || apt.unitId === selectedUnitId) &&
                (!selectedProfessionalId || apt.professionalId === selectedProfessionalId)
            );

            return (
              <div
                key={date.toISOString()}
                className={cn(
                  "bg-background p-2 cursor-pointer hover:bg-accent/50 min-h-[120px]",
                  isToday(date) && "bg-accent"
                )}
                onClick={() => onDateSelect(date)}
              >
                <div className={cn(
                  "text-sm mb-1",
                  isToday(date) && "font-bold text-primary"
                )}>
                  {format(date, 'd')}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className={cn(
                        "text-xs p-1 rounded truncate cursor-pointer",
                        getStatusColor(appointment.status)
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick(appointment);
                      }}
                    >
                      {appointment.startTime} - {appointment.patientName}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayAppointments.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Controls */}
      <div className="p-4 border-b border-border space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <Select value={selectedUnitId || "all"} onValueChange={(value) => onUnitChange(value === "all" ? "" : value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as unidades</SelectItem>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedProfessionalId || "all"} 
            onValueChange={(value) => onProfessionalChange(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar profissional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os profissionais</SelectItem>
              {filteredProfessionals.map((professional) => (
                <SelectItem key={professional.id} value={professional.id}>
                  {professional.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Navigation and View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoje
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <h2 className="text-lg font-semibold ml-4">
              {viewMode === 'month' && format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              {viewMode === 'week' && `${format(startOfWeek(currentDate, { locale: ptBR }), 'dd/MM')} - ${format(endOfWeek(currentDate, { locale: ptBR }), 'dd/MM/yyyy')}`}
              {viewMode === 'day' && format(currentDate, 'dd/MM/yyyy', { locale: ptBR })}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('day')}
            >
              Dia
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('week')}
            >
              Semana
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('month')}
            >
              Mês
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-medical-success"></div>
            <span>Confirmado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-medical-warning"></div>
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-medical-error"></div>
            <span>Ausente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span>Concluído</span>
          </div>
          <div className="text-muted-foreground ml-4">
            Atalho: Pressione 'C' para ir para hoje
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'month' && renderMonthView()}
    </div>
  );
}