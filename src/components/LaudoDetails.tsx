import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit3, 
  Download, 
  Printer, 
  Calendar, 
  User, 
  FileText, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Laudo } from '@/types/laudo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LaudoDetailsProps {
  laudo: Laudo;
  onBack: () => void;
  onEdit: () => void;
}

export const LaudoDetails: React.FC<LaudoDetailsProps> = ({
  laudo,
  onBack,
  onEdit
}) => {
  const getStatusBadge = (status: Laudo['status']) => {
    const variants = {
      draft: { 
        variant: 'secondary' as const, 
        label: 'Rascunho',
        icon: Clock,
        description: 'Laudo em elaboração'
      },
      completed: { 
        variant: 'default' as const, 
        label: 'Concluído',
        icon: CheckCircle2,
        description: 'Laudo finalizado'
      },
      reviewed: { 
        variant: 'outline' as const, 
        label: 'Revisado',
        icon: CheckCircle2,
        description: 'Laudo revisado por supervisor'
      },
      delivered: { 
        variant: 'destructive' as const, 
        label: 'Entregue',
        icon: CheckCircle2,
        description: 'Laudo entregue ao paciente'
      }
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

  const statusInfo = getStatusBadge(laudo.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Detalhes do Laudo</h1>
            <p className="text-muted-foreground">
              {laudo.examType} - {laudo.patientName}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={onEdit} size="sm" className="gap-2">
            <Edit3 className="h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Status and Priority */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5 text-primary" />
                <div>
                  <Badge {...getStatusBadge(laudo.status)}>
                    {getStatusBadge(laudo.status).label}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {statusInfo.description}
                  </p>
                </div>
              </div>
              
              <Separator orientation="vertical" className="h-8" />
              
              <div>
                <Badge 
                  variant={getPriorityBadge(laudo.priority).variant}
                  className={getPriorityBadge(laudo.priority).className}
                >
                  {getPriorityBadge(laudo.priority).label}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Prioridade do exame
                </p>
              </div>
            </div>

            {laudo.priority === 'urgent' && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Atenção: Exame urgente</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Patient and Exam Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome do Paciente</label>
              <p className="text-lg font-semibold">{laudo.patientName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Médico Responsável</label>
              <p className="font-medium">{laudo.doctorName}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informações do Exame
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de Exame</label>
              <p className="font-medium">{laudo.examType}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data do Exame</label>
                <p className="font-medium">
                  {format(new Date(laudo.examDate), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data do Laudo</label>
                <p className="font-medium">
                  {format(new Date(laudo.reportDate), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Data */}
      {laudo.clinicalData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dados Clínicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">
              {laudo.clinicalData}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Achados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-foreground leading-relaxed">
            {laudo.findings}
          </p>
        </CardContent>
      </Card>

      {/* Conclusion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Conclusão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-foreground leading-relaxed font-medium">
            {laudo.conclusion}
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {laudo.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">
              {laudo.recommendations}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Administrativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="font-medium text-muted-foreground">Criado em</label>
              <p>{format(new Date(laudo.createdAt), 'dd/MM/yyyy - HH:mm', { locale: ptBR })}</p>
            </div>
            
            <div>
              <label className="font-medium text-muted-foreground">Última atualização</label>
              <p>{format(new Date(laudo.updatedAt), 'dd/MM/yyyy - HH:mm', { locale: ptBR })}</p>
            </div>
            
            {laudo.reviewedBy && laudo.reviewedAt && (
              <div>
                <label className="font-medium text-muted-foreground">Revisado por</label>
                <p>{laudo.reviewedBy}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(laudo.reviewedAt), 'dd/MM/yyyy - HH:mm', { locale: ptBR })}
                </p>
              </div>
            )}
            
            {laudo.deliveredAt && (
              <div>
                <label className="font-medium text-muted-foreground">Entregue em</label>
                <p>{format(new Date(laudo.deliveredAt), 'dd/MM/yyyy - HH:mm', { locale: ptBR })}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};