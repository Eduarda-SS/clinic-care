import { useState } from 'react';
import { Doctor } from '@/types/doctor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface DoctorFormProps {
  doctor?: Doctor | null;
  onClose: () => void;
}

export const DoctorForm = ({ doctor, onClose }: DoctorFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    cpf: doctor?.cpf || '',
    rg: doctor?.rg || '',
    gender: doctor?.gender || 'masculine',
    birthDate: doctor?.birthDate || '',
    crm: doctor?.crm || '',
    crmState: doctor?.crmState || '',
    specialty: doctor?.specialty || '',
    subspecialty: doctor?.subspecialty || '',
    email: doctor?.email || '',
    cellphone: doctor?.cellphone || '',
    phone: doctor?.phone || '',
    zipCode: doctor?.address?.zipCode || '',
    street: doctor?.address?.street || '',
    number: doctor?.address?.number || '',
    complement: doctor?.address?.complement || '',
    neighborhood: doctor?.address?.neighborhood || '',
    city: doctor?.address?.city || '',
    state: doctor?.address?.state || '',
    status: doctor?.status || 'active',
    workSchedule: doctor?.workSchedule || '',
    observations: doctor?.observations || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const doctorData: Partial<Doctor> = {
      ...formData,
      address: {
        zipCode: formData.zipCode,
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
      },
      gender: formData.gender as 'masculine' | 'feminine' | 'other',
      status: formData.status as 'active' | 'inactive',
    };

    console.log('Salvando profissional:', doctorData);
    
    toast({
      title: doctor ? 'Profissional atualizado' : 'Profissional cadastrado',
      description: `${formData.name} foi ${doctor ? 'atualizado' : 'cadastrado'} com sucesso.`,
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>{doctor ? 'Editar Profissional' : 'Novo Profissional'}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Dados Pessoais</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div>
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e) => handleChange('rg', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender">Sexo *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
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
            <div>
              <Label htmlFor="birthDate">Data de Nascimento *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Dados Profissionais</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="crm">CRM *</Label>
              <Input
                id="crm"
                value={formData.crm}
                onChange={(e) => handleChange('crm', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="crmState">UF CRM *</Label>
              <Input
                id="crmState"
                value={formData.crmState}
                onChange={(e) => handleChange('crmState', e.target.value)}
                placeholder="SP"
                maxLength={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="specialty">Especialidade *</Label>
              <Input
                id="specialty"
                value={formData.specialty}
                onChange={(e) => handleChange('specialty', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="subspecialty">Subespecialidade</Label>
              <Input
                id="subspecialty"
                value={formData.subspecialty}
                onChange={(e) => handleChange('subspecialty', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Contato</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cellphone">Celular</Label>
              <Input
                id="cellphone"
                value={formData.cellphone}
                onChange={(e) => handleChange('cellphone', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(00) 0000-0000"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Endereço</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                placeholder="00000-000"
              />
            </div>
            <div>
              <Label htmlFor="street">Logradouro</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleChange('street', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => handleChange('number', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={formData.complement}
                onChange={(e) => handleChange('complement', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => handleChange('neighborhood', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="SP"
                maxLength={2}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Informações Adicionais</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="workSchedule">Horário de Trabalho</Label>
              <Input
                id="workSchedule"
                value={formData.workSchedule}
                onChange={(e) => handleChange('workSchedule', e.target.value)}
                placeholder="Ex: Seg-Sex 08:00-17:00"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {doctor ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
};
