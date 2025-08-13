import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Upload, X, Save, ArrowLeft, User, Contact, MapPin, FileText, Heart, Stethoscope, CreditCard, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Patient } from '@/types/patient';

interface PatientFormProps {
  patient?: Patient;
  onSave: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = true 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="shadow-soft">
      <CardHeader 
        className="cursor-pointer hover:bg-medical-light/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      {isOpen && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
};

export const PatientForm: React.FC<PatientFormProps> = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '',
    socialName: '',
    cpf: '',
    rg: '',
    otherDocuments: {
      type: '',
      number: ''
    },
    gender: 'masculine',
    birthDate: '',
    ethnicity: '',
    race: '',
    nationality: 'Brasileira',
    birthplace: '',
    profession: '',
    maritalStatus: '',
    motherName: '',
    motherProfession: '',
    fatherName: '',
    fatherProfession: '',
    responsibleName: '',
    responsibleCpf: '',
    spouseName: '',
    isNewbornWithInsurance: false,
    legacyCode: '',
    email: '',
    cellphone: '',
    phone1: '',
    phone2: '',
    address: {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      reference: ''
    },
    observations: '',
    attachments: [],
    bloodType: '',
    weight: undefined,
    height: undefined,
    allergies: '',
    insurance: '',
    plan: '',
    registrationNumber: '',
    cardValidity: '',
    indefiniteValidity: false,
    isVip: false,
    ...patient
  });

  const [photo, setPhoto] = useState<string | null>(patient?.photo || null);

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cpf) {
      alert('Nome e CPF são obrigatórios');
      return;
    }

    onSave({
      ...formData,
      photo: photo || undefined
    } as Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const calculateBMI = (weight: number, height: number): string => {
    if (!weight || !height) return '';
    const bmi = weight / (height * height);
    return bmi.toFixed(1);
  };

  const getBMIClassification = (bmi: number): string => {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onCancel} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {patient ? 'Editar Paciente' : 'Novo Paciente'}
          </h1>
          <p className="text-muted-foreground">
            {patient ? 'Atualize as informações do paciente' : 'Cadastre um novo paciente no sistema'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Pessoais */}
        <CollapsibleSection
          title="Dados Pessoais"
          icon={<User className="h-5 w-5 text-primary" />}
        >
          <div className="space-y-4">
            {/* Foto */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center overflow-hidden">
                {photo ? (
                  <img src={photo} alt="Foto do paciente" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              <div>
                <Label htmlFor="photo" className="block text-sm font-medium mb-2">
                  Foto do Paciente
                </Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" asChild>
                    <label htmlFor="photo" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Carregar Foto
                    </label>
                  </Button>
                  {photo && (
                    <Button type="button" variant="ghost" onClick={() => setPhoto(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="socialName">Nome Social</Label>
                <Input
                  id="socialName"
                  value={formData.socialName}
                  onChange={(e) => handleInputChange('socialName', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  value={formData.rg}
                  onChange={(e) => handleInputChange('rg', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender">Sexo</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculine">Masculino</SelectItem>
                    <SelectItem value="feminine">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="otherDocType">Outros Documentos</Label>
                <Select value={formData.otherDocuments?.type} onValueChange={(value) => handleInputChange('otherDocuments', { ...formData.otherDocuments, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cnh">CNH</SelectItem>
                    <SelectItem value="passport">Passaporte</SelectItem>
                    <SelectItem value="identity">Carteira de Identidade</SelectItem>
                    <SelectItem value="work">Carteira de Trabalho</SelectItem>
                    <SelectItem value="military">Certificado Militar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="otherDocNumber">Número do Documento</Label>
                <Input
                  id="otherDocNumber"
                  value={formData.otherDocuments?.number}
                  onChange={(e) => handleInputChange('otherDocuments', { ...formData.otherDocuments, number: e.target.value })}
                  placeholder="Número"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="profession">Profissão</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthplace">Naturalidade</Label>
                <Input
                  id="birthplace"
                  value={formData.birthplace}
                  onChange={(e) => handleInputChange('birthplace', e.target.value)}
                  placeholder="Cidade de nascimento"
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nacionalidade</Label>
                <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brasileira">Brasileira</SelectItem>
                    <SelectItem value="Argentina">Argentina</SelectItem>
                    <SelectItem value="Paraguaia">Paraguaia</SelectItem>
                    <SelectItem value="Uruguaia">Uruguaia</SelectItem>
                    <SelectItem value="Boliviana">Boliviana</SelectItem>
                    <SelectItem value="Chilena">Chilena</SelectItem>
                    <SelectItem value="Colombiana">Colombiana</SelectItem>
                    <SelectItem value="Peruana">Peruana</SelectItem>
                    <SelectItem value="Venezuelana">Venezuelana</SelectItem>
                    <SelectItem value="Outra">Outra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maritalStatus">Estado Civil</Label>
                <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Solteiro(a)</SelectItem>
                    <SelectItem value="married">Casado(a)</SelectItem>
                    <SelectItem value="divorced">Divorciado(a)</SelectItem>
                    <SelectItem value="widowed">Viúvo(a)</SelectItem>
                    <SelectItem value="union">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ethnicity">Etnia</Label>
                <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao-indigena">Não Indígena</SelectItem>
                    <SelectItem value="indigena">Indígena</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="race">Raça/Cor</Label>
                <Select value={formData.race} onValueChange={(value) => handleInputChange('race', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branca">Branca</SelectItem>
                    <SelectItem value="preta">Preta</SelectItem>
                    <SelectItem value="parda">Parda</SelectItem>
                    <SelectItem value="amarela">Amarela</SelectItem>
                    <SelectItem value="indigena">Indígena</SelectItem>
                    <SelectItem value="sem-informacao">Sem informação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Informações da Família */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-semibold text-foreground">Informações da Família</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="motherName">Nome da Mãe</Label>
                  <Input
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="motherProfession">Profissão da Mãe</Label>
                  <Input
                    id="motherProfession"
                    value={formData.motherProfession}
                    onChange={(e) => handleInputChange('motherProfession', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fatherName">Nome do Pai</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fatherProfession">Profissão do Pai</Label>
                  <Input
                    id="fatherProfession"
                    value={formData.fatherProfession}
                    onChange={(e) => handleInputChange('fatherProfession', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="responsibleName">Nome do Responsável</Label>
                  <Input
                    id="responsibleName"
                    value={formData.responsibleName}
                    onChange={(e) => handleInputChange('responsibleName', e.target.value)}
                    placeholder="Para menores ou dependentes"
                  />
                </div>
                <div>
                  <Label htmlFor="responsibleCpf">CPF do Responsável</Label>
                  <Input
                    id="responsibleCpf"
                    value={formData.responsibleCpf}
                    onChange={(e) => handleInputChange('responsibleCpf', formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
                <div>
                  <Label htmlFor="spouseName">Nome do Esposo(a)</Label>
                  <Input
                    id="spouseName"
                    value={formData.spouseName}
                    onChange={(e) => handleInputChange('spouseName', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Configurações Especiais */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-semibold text-foreground">Configurações Especiais</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <Label htmlFor="legacyCode">Código Legado</Label>
                  <Input
                    id="legacyCode"
                    value={formData.legacyCode}
                    onChange={(e) => handleInputChange('legacyCode', e.target.value)}
                    placeholder="Identificador de outro sistema"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isNewbornWithInsurance"
                    checked={formData.isNewbornWithInsurance}
                    onCheckedChange={(checked) => handleInputChange('isNewbornWithInsurance', checked)}
                  />
                  <Label htmlFor="isNewbornWithInsurance">RN na Guia do Convênio</Label>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-semibold text-foreground">Observações</h4>
              <div>
                <Label htmlFor="observations">Observações Gerais</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Adicione observações importantes sobre o paciente (alergias, restrições, etc.)"
                  rows={4}
                />
              </div>
            </div>

            {/* Anexos do Paciente */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Anexos do Paciente
              </h4>
              
              <div className="space-y-2">
                <Button type="button" variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Adicionar Documento
                </Button>
                
                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {formData.attachments.map((attachment, index) => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm font-medium">{attachment.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(attachment.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                        <Button type="button" variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Informações de Contato */}
        <CollapsibleSection
          title="Informações de Contato"
          icon={<Contact className="h-5 w-5 text-primary" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cellphone">Celular</Label>
              <Input
                id="cellphone"
                value={formData.cellphone}
                onChange={(e) => handleInputChange('cellphone', formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
            <div>
              <Label htmlFor="phone1">Telefone 1</Label>
              <Input
                id="phone1"
                value={formData.phone1}
                onChange={(e) => handleInputChange('phone1', formatPhone(e.target.value))}
                placeholder="(00) 0000-0000"
                maxLength={14}
              />
            </div>
            <div>
              <Label htmlFor="phone2">Telefone 2</Label>
              <Input
                id="phone2"
                value={formData.phone2}
                onChange={(e) => handleInputChange('phone2', formatPhone(e.target.value))}
                placeholder="(00) 0000-0000"
                maxLength={14}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Endereço */}
        <CollapsibleSection
          title="Endereço"
          icon={<MapPin className="h-5 w-5 text-primary" />}
          defaultOpen={false}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={formData.address?.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  placeholder="00000-000"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="street">Logradouro</Label>
                <Input
                  id="street"
                  value={formData.address?.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={formData.address?.number}
                  onChange={(e) => handleInputChange('address.number', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.address?.complement}
                  onChange={(e) => handleInputChange('address.complement', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.address?.neighborhood}
                  onChange={(e) => handleInputChange('address.neighborhood', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.address?.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.address?.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reference">Ponto de Referência</Label>
              <Input
                id="reference"
                value={formData.address?.reference}
                onChange={(e) => handleInputChange('address.reference', e.target.value)}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Informações Médicas */}
        <CollapsibleSection
          title="Informações Médicas"
          icon={<Stethoscope className="h-5 w-5 text-primary" />}
          defaultOpen={false}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
                <Select value={formData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="allergies">Alergias</Label>
                <Input
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="Descreva as alergias conhecidas"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || undefined)}
                  placeholder="Ex: 70.5"
                />
              </div>
              <div>
                <Label htmlFor="height">Altura (m)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  value={formData.height || ''}
                  onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || undefined)}
                  placeholder="Ex: 1.75"
                />
              </div>
              <div>
                <Label htmlFor="bmi">IMC</Label>
                {formData.weight && formData.height ? (
                  <div className="flex flex-col">
                    <div className="p-2 bg-muted rounded-md text-center">
                      <span className="text-lg font-semibold">
                        {calculateBMI(formData.weight, formData.height)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 text-center">
                      {getBMIClassification(parseFloat(calculateBMI(formData.weight, formData.height)))}
                    </span>
                  </div>
                ) : (
                  <div className="p-2 bg-muted rounded-md text-center text-muted-foreground">
                    Calcular automaticamente
                  </div>
                )}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Informações de Convênio */}
        <CollapsibleSection
          title="Informações de Convênio"
          icon={<CreditCard className="h-5 w-5 text-primary" />}
          defaultOpen={false}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insurance">Convênio</Label>
                <Select value={formData.insurance} onValueChange={(value) => handleInputChange('insurance', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sus">SUS</SelectItem>
                    <SelectItem value="unimed">Unimed</SelectItem>
                    <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                    <SelectItem value="amil">Amil</SelectItem>
                    <SelectItem value="sulamerica">SulAmérica</SelectItem>
                    <SelectItem value="notredame">Notre Dame</SelectItem>
                    <SelectItem value="golden">Golden Cross</SelectItem>
                    <SelectItem value="particular">Particular</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="plan">Plano</Label>
                <Input
                  id="plan"
                  value={formData.plan}
                  onChange={(e) => handleInputChange('plan', e.target.value)}
                  placeholder="Nome do plano"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="registrationNumber">Nº de Matrícula</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  placeholder="Número da matrícula"
                />
              </div>
              <div>
                <Label htmlFor="cardValidity">Validade da Carteirinha</Label>
                <div className="space-y-2">
                  <Input
                    id="cardValidity"
                    type="date"
                    value={formData.cardValidity}
                    onChange={(e) => handleInputChange('cardValidity', e.target.value)}
                    disabled={formData.indefiniteValidity}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="indefiniteValidity"
                      checked={formData.indefiniteValidity}
                      onCheckedChange={(checked) => {
                        handleInputChange('indefiniteValidity', checked);
                        if (checked) {
                          handleInputChange('cardValidity', '');
                        }
                      }}
                    />
                    <Label htmlFor="indefiniteValidity">Validade Indeterminada</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Checkbox
                id="isVip"
                checked={formData.isVip}
                onCheckedChange={(checked) => handleInputChange('isVip', checked)}
              />
              <Label htmlFor="isVip">Paciente VIP</Label>
            </div>
          </div>
        </CollapsibleSection>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-primary to-primary-glow shadow-medical">
            <Save className="mr-2 h-4 w-4" />
            Salvar Paciente
          </Button>
        </div>
      </form>
    </div>
  );
};