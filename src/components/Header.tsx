import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SupportChat from './SupportChat';

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentSection }) => {
  const [chatOpen, setChatOpen] = useState(false);
  
  const menuItems = [
    { id: 'home', label: 'Início' },
    { id: 'patients', label: 'Pacientes' },
    { id: 'laudos', label: 'Laudos' },
    { id: 'about', label: 'Sobre' },
    { id: 'services', label: 'Serviços' },
    { id: 'contact', label: 'Contato' }
  ];

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">

      {/* Main Navigation */}
      <nav className="py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src="/lovable-uploads/10bb155d-3895-4658-8d42-8f1c5068d5e4.png" 
                  alt="HealthCare Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">HealthCare</h1>
                <p className="text-xs text-muted-foreground">Sistema Médico</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-primary relative ${
                    currentSection === item.id ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {item.label}
                  {currentSection === item.id && (
                    <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Suporte</h4>
                      <p className="text-sm text-muted-foreground">
                        Entre em contato conosco através dos canais abaixo
                      </p>
                    </div>
                    <div className="space-y-3">
                      <a 
                        href="mailto:suporte@mediconnect.com"
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-xs text-muted-foreground">suporte@mediconnect.com</p>
                        </div>
                      </a>
                      <a 
                        href="tel:+551133334444"
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Telefone</p>
                          <p className="text-xs text-muted-foreground">(11) 3333-4444</p>
                        </div>
                      </a>
                      <button 
                        onClick={() => setChatOpen(true)}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors w-full"
                      >
                        <MessageCircle className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <p className="text-sm font-medium">Chat Online</p>
                          <p className="text-xs text-muted-foreground">Disponível 24/7</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                onClick={() => onNavigate('patients')}
                className="bg-primary hover:bg-primary-glow"
              >
                Acessar Sistema
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden">
              <Menu className="h-6 w-6 text-foreground" />
            </button>
          </div>
        </div>
      </nav>
      
      <SupportChat open={chatOpen} onOpenChange={setChatOpen} />
    </header>
  );
};

export default Header;