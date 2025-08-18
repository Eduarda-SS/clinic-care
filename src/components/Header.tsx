import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentSection }) => {
  const menuItems = [
    { id: 'home', label: 'Início' },
    { id: 'patients', label: 'Pacientes' },
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
            <div className="hidden md:block">
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
    </header>
  );
};

export default Header;