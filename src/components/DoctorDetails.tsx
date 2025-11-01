import { Doctor } from '@/types/doctor';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Calendar, FileText, Stethoscope } from 'lucide-react';

interface DoctorDetailsProps {
  doctor: Doctor;
  onClose: () => void;
  onEdit: () => void;
}

export const DoctorDetails = ({ doctor, onClose, onEdit }: DoctorDetailsProps) => {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle className="text-2xl">{doctor.name}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {doctor.specialty}
              {doctor.subspecialty && ` - ${doctor.subspecialty}`}
            </p>
          </div>
          <Badge variant={doctor.status === 'active' ? 'default' : 'secondary'}>
            {doctor.status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">CPF:</span>
              <p className="font-medium">{doctor.cpf}</p>
            </div>
            {doctor.rg && (
              <div>
                <span className="text-muted-foreground">RG:</span>
                <p className="font-medium">{doctor.rg}</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Sexo:</span>
              <p className="font-medium">
                {doctor.gender === 'masculine' ? 'Masculino' : doctor.gender === 'feminine' ? 'Feminino' : 'Outro'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Data de Nascimento:</span>
              <p className="font-medium">
                {new Date(doctor.birthDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Dados Profissionais
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">CRM:</span>
              <p className="font-medium">{doctor.crm}/{doctor.crmState}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Especialidade:</span>
              <p className="font-medium">{doctor.specialty}</p>
            </div>
            {doctor.subspecialty && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Subespecialidade:</span>
                <p className="font-medium">{doctor.subspecialty}</p>
              </div>
            )}
            {doctor.workSchedule && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Horário de Trabalho:</span>
                <p className="font-medium">{doctor.workSchedule}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contato
          </h3>
          <div className="space-y-2 text-sm">
            {doctor.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.email}</span>
              </div>
            )}
            {doctor.cellphone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.cellphone}</span>
              </div>
            )}
            {doctor.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.phone}</span>
              </div>
            )}
          </div>
        </div>

        {doctor.address && (doctor.address.street || doctor.address.city) && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço
              </h3>
              <div className="text-sm space-y-1">
                {doctor.address.street && (
                  <p>
                    {doctor.address.street}
                    {doctor.address.number && `, ${doctor.address.number}`}
                    {doctor.address.complement && ` - ${doctor.address.complement}`}
                  </p>
                )}
                {doctor.address.neighborhood && <p>{doctor.address.neighborhood}</p>}
                {doctor.address.city && (
                  <p>
                    {doctor.address.city}/{doctor.address.state}
                  </p>
                )}
                {doctor.address.zipCode && <p>CEP: {doctor.address.zipCode}</p>}
              </div>
            </div>
          </>
        )}

        {doctor.observations && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Observações</h3>
              <p className="text-sm text-muted-foreground">{doctor.observations}</p>
            </div>
          </>
        )}

        <Separator />

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            Cadastrado em {new Date(doctor.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button onClick={onEdit}>
          Editar
        </Button>
      </div>
    </div>
  );
};
