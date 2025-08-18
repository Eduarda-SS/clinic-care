import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src="/lovable-uploads/10bb155d-3895-4658-8d42-8f1c5068d5e4.png" 
                  alt="HealthCare Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">HealthCare</h3>
                <p className="text-xs text-muted">Sistema Médico</p>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Dedicados a fornecer cuidados de saúde excepcionais 
              com tecnologia avançada e atendimento humanizado.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Links Rápidos</h4>
            <ul className="space-y-2">
              {['Início', 'Sobre Nós', 'Serviços', 'Especialidades', 'Contato'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Serviços</h4>
            <ul className="space-y-2">
              {['Consultas', 'Exames', 'Cirurgias', 'Emergência', 'Check-up'].map((service) => (
                <li key={service}>
                  <a href="#" className="text-sm text-muted hover:text-primary transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-muted/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted">
              © 2024 HealthCare. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted hover:text-primary transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-sm text-muted hover:text-primary transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;