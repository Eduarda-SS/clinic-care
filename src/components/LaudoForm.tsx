import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, Save, FileText, User, AlertCircle } from 'lucide-react';
import { Laudo } from '@/types/laudo';
import { Patient } from '@/types/patient';

interface LaudoFormProps {
  laudo?: Laudo;
  patients: Patient[];
  onSave: (laudo: Omit<Laudo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const LaudoForm: React.FC<LaudoFormProps> = ({
  laudo,
  patients,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    patientId: laudo?.patientId || '',
    patientName: laudo?.patientName || '',
    doctorName: laudo?.doctorName || '',
    examType: laudo?.examType || '',
    examDate: laudo?.examDate || new Date().toISOString().split('T')[0],
    reportDate: laudo?.reportDate || new Date().toISOString().split('T')[0],
    status: laudo?.status || 'draft' as Laudo['status'],
    priority: laudo?.priority || 'normal' as Laudo['priority'],
    clinicalData: laudo?.clinicalData || '',
    findings: laudo?.findings || '',
    conclusion: laudo?.conclusion || '',
    recommendations: laudo?.recommendations || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const examTypes = [
    'Raio-X',
    'Ultrassom',
    'Tomografia Computadorizada',
    'Ressonância Magnética',
    'Ecocardiograma',
    'Eletrocardiograma',
    'Eletroencefalograma',
    'Mamografia',
    'Endoscopia',
    'Colonoscopia',
    'Biópsia',
    'Exame de Sangue',
    'Exame de Urina',
    'Outros'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-fill patient name when patient is selected
    if (field === 'patientId' && value) {
      const selectedPatient = patients.find(p => p.id === value);
      if (selectedPatient) {
        setFormData(prev => ({ ...prev, patientName: selectedPatient.name }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) newErrors.patientId = 'Paciente é obrigatório';
    if (!formData.doctorName.trim()) newErrors.doctorName = 'Nome do médico é obrigatório';
    if (!formData.examType) newErrors.examType = 'Tipo de exame é obrigatório';
    if (!formData.examDate) newErrors.examDate = 'Data do exame é obrigatória';
    if (!formData.findings.trim()) newErrors.findings = 'Achados são obrigatórios';
    if (!formData.conclusion.trim()) newErrors.conclusion = 'Conclusão é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const laudoData = {
      ...formData,
      deliveredAt: formData.status === 'delivered' ? new Date().toISOString() : laudo?.deliveredAt,
      reviewedBy: formData.status === 'reviewed' ? 'Sistema' : laudo?.reviewedBy,
      reviewedAt: formData.status === 'reviewed' ? new Date().toISOString() : laudo?.reviewedAt
    };

    onSave(laudoData);
  };

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
      low: { variant: 'secondary' as const, label: 'Baixa' },
      normal: { variant: 'outline' as const, label: 'Normal' },
      high: { variant: 'default' as const, label: 'Alta' },
      urgent: { variant: 'destructive' as const, label: 'Urgente' }
    };
    return variants[priority];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {laudo ? 'Editar Laudo' : 'Novo Laudo'}
          </h1>
          <p className="text-muted-foreground">
            {laudo ? 'Edite as informações do laudo médico' : 'Preencha as informações do novo laudo médico'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Básicos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Paciente *</Label>
                <Select value={formData.patientId} onValueChange={(value) => handleInputChange('patientId', value)}>
                  <SelectTrigger className={errors.patientId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.cpf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.patientId && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.patientId}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorName">Médico Responsável *</Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  placeholder="Nome do médico"
                  className={errors.doctorName ? 'border-destructive' : ''}
                />
                {errors.doctorName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.doctorName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="examType">Tipo de Exame *</Label>
                <Select value={formData.examType} onValueChange={(value) => handleInputChange('examType', value)}>
                  <SelectTrigger className={errors.examType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione o tipo de exame" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.examType && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.examType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="examDate">Data do Exame *</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => handleInputChange('examDate', e.target.value)}
                  className={errors.examDate ? 'border-destructive' : ''}
                />
                {errors.examDate && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.examDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportDate">Data do Laudo</Label>
                <Input
                  id="reportDate"
                  type="date"
                  value={formData.reportDate}
                  onChange={(e) => handleInputChange('reportDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex flex-wrap gap-2">
                  {(['draft', 'completed', 'reviewed', 'delivered'] as const).map(status => (
                    <Button
                      key={status}
                      type="button"
                      variant={formData.status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleInputChange('status', status)}
                    >
                      {getStatusBadge(status).label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <div className="flex flex-wrap gap-2">
                  {(['low', 'normal', 'high', 'urgent'] as const).map(priority => (
                    <Button
                      key={priority}
                      type="button"
                      variant={formData.priority === priority ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleInputChange('priority', priority)}
                    >
                      {getPriorityBadge(priority).label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Clínicos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Clínicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clinicalData">Dados Clínicos</Label>
              <Textarea
                id="clinicalData"
                value={formData.clinicalData}
                onChange={(e) => handleInputChange('clinicalData', e.target.value)}
                placeholder="Histórico clínico, sintomas, informações relevantes..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="findings">Achados *</Label>
              <Textarea
                id="findings"
                value={formData.findings}
                onChange={(e) => handleInputChange('findings', e.target.value)}
                placeholder="Descreva os achados do exame..."
                rows={4}
                className={errors.findings ? 'border-destructive' : ''}
              />
              {errors.findings && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.findings}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="conclusion">Conclusão *</Label>
              <Textarea
                id="conclusion"
                value={formData.conclusion}
                onChange={(e) => handleInputChange('conclusion', e.target.value)}
                placeholder="Conclusão do exame..."
                rows={3}
                className={errors.conclusion ? 'border-destructive' : ''}
              />
              {errors.conclusion && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.conclusion}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendations">Recomendações</Label>
              <Textarea
                id="recommendations"
                value={formData.recommendations}
                onChange={(e) => handleInputChange('recommendations', e.target.value)}
                placeholder="Recomendações médicas..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            {laudo ? 'Atualizar Laudo' : 'Salvar Laudo'}
          </Button>
        </div>
      </form>
    </div>
  );
};