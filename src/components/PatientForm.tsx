import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Upload, X, Save, ArrowLeft, User, Contact, MapPin, FileText, Heart } from 'lucide-react';
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
    isVip: false,
    insurance: '',
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
                <Label htmlFor="nationality">Nacionalidade</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                />
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="md:col-span-2">
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

        {/* Informações Clínicas */}
        <CollapsibleSection
          title="Informações Clínicas"
          icon={<Heart className="h-5 w-5 text-primary" />}
          defaultOpen={false}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insurance">Convênio</Label>
                <Input
                  id="insurance"
                  value={formData.insurance}
                  onChange={(e) => handleInputChange('insurance', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="isVip"
                  checked={formData.isVip}
                  onCheckedChange={(checked) => handleInputChange('isVip', checked)}
                />
                <Label htmlFor="isVip">Paciente VIP</Label>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Observações */}
        <CollapsibleSection
          title="Observações"
          icon={<FileText className="h-5 w-5 text-primary" />}
          defaultOpen={false}
        >
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