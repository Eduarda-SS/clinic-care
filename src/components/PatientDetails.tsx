import React from 'react';
import { ArrowLeft, Edit, User, Contact, MapPin, FileText, Heart, Calendar, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Patient } from '@/types/patient';

interface PatientDetailsProps {
  patient: Patient;
  onEdit: () => void;
  onBack: () => void;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({ patient, onEdit, onBack }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '-';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '-';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return `${age} anos`;
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'masculine': return 'Masculino';
      case 'feminine': return 'Feminino';
      case 'other': return 'Outro';
      default: return '-';
    }
  };

  const getMaritalStatusLabel = (status: string) => {
    switch (status) {
      case 'single': return 'Solteiro(a)';
      case 'married': return 'Casado(a)';
      case 'divorced': return 'Divorciado(a)';
      case 'widowed': return 'Viúvo(a)';
      case 'union': return 'União Estável';
      default: return '-';
    }
  };

  const InfoItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value || '-'}</span>
    </div>
  );

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center overflow-hidden">
              {patient.photo ? (
                <img src={patient.photo} alt="Foto do paciente" className="w-full h-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                {patient.name}
                {patient.isVip && (
                  <Badge className="bg-medical-warning text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    VIP
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground">
                {patient.socialName && `${patient.socialName} • `}
                CPF: {patient.cpf}
              </p>
            </div>
          </div>
        </div>
        <Button onClick={onEdit} className="bg-gradient-to-r from-primary to-primary-glow shadow-medical">
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      {/* Dados Pessoais */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="Nome Completo" value={patient.name} />
            <InfoItem label="Nome Social" value={patient.socialName} />
            <InfoItem label="CPF" value={patient.cpf} />
            <InfoItem label="RG" value={patient.rg} />
            <InfoItem label="Sexo" value={getGenderLabel(patient.gender)} />
            <InfoItem label="Data de Nascimento" value={formatDate(patient.birthDate)} />
            <InfoItem label="Idade" value={calculateAge(patient.birthDate)} />
            <InfoItem label="Profissão" value={patient.profession} />
            <InfoItem label="Estado Civil" value={getMaritalStatusLabel(patient.maritalStatus || '')} />
            <InfoItem label="Nacionalidade" value={patient.nationality} />
            <InfoItem label="Naturalidade" value={patient.birthplace} />
            <InfoItem label="Etnia" value={patient.ethnicity} />
          </div>
        </CardContent>
      </Card>

      {/* Informações de Contato */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Contact className="h-5 w-5 text-primary" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="E-mail" value={patient.email} />
            <InfoItem label="Celular" value={formatPhone(patient.cellphone || '')} />
            <InfoItem label="Telefone 1" value={formatPhone(patient.phone1 || '')} />
            <InfoItem label="Telefone 2" value={formatPhone(patient.phone2 || '')} />
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      {patient.address && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="CEP" value={patient.address.zipCode} />
              <InfoItem label="Logradouro" value={patient.address.street} />
              <InfoItem label="Número" value={patient.address.number} />
              <InfoItem label="Complemento" value={patient.address.complement} />
              <InfoItem label="Bairro" value={patient.address.neighborhood} />
              <InfoItem label="Cidade" value={patient.address.city} />
              <InfoItem label="Estado" value={patient.address.state} />
              <InfoItem label="Ponto de Referência" value={patient.address.reference} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações Clínicas */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Informações Clínicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Convênio" value={patient.insurance} />
            <InfoItem label="Status VIP" value={patient.isVip ? 'Sim' : 'Não'} />
            <InfoItem label="Último Atendimento" value={formatDateTime(patient.lastAppointment || '')} />
            <InfoItem label="Próximo Atendimento" value={formatDateTime(patient.nextAppointment || '')} />
          </div>
        </CardContent>
      </Card>

      {/* Informações Familiares */}
      {(patient.motherName || patient.fatherName || patient.spouseName || patient.responsibleName) && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informações Familiares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Nome da Mãe" value={patient.motherName} />
              <InfoItem label="Profissão da Mãe" value={patient.motherProfession} />
              <InfoItem label="Nome do Pai" value={patient.fatherName} />
              <InfoItem label="Profissão do Pai" value={patient.fatherProfession} />
              <InfoItem label="Nome do Cônjuge" value={patient.spouseName} />
              <InfoItem label="Responsável" value={patient.responsibleName} />
              <InfoItem label="CPF do Responsável" value={patient.responsibleCpf} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observações */}
      {patient.observations && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground whitespace-pre-wrap">{patient.observations}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadados */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Cadastrado em" value={formatDateTime(patient.createdAt)} />
            <InfoItem label="Última atualização" value={formatDateTime(patient.updatedAt)} />
            {patient.legacyCode && <InfoItem label="Código Legado" value={patient.legacyCode} />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};