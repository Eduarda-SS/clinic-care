import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Heart, Users } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-primary/10 via-primary-glow/5 to-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-primary-glow rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Cuidando da
                <span className="text-primary block">Sua Saúde</span>
                com Excelência
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Sistema completo de gestão médica para cuidar dos seus pacientes 
                com eficiência, segurança e dedicação.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary-glow text-primary-foreground group"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Saiba Mais
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Pacientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Especialidades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Suporte</div>
              </div>
            </div>
          </div>

          {/* Visual Elements */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Feature Cards */}
              <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-medical transition-all duration-300 hover:-translate-y-1">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Segurança</h3>
                <p className="text-sm text-muted-foreground">
                  Dados protegidos com criptografia avançada
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-medical transition-all duration-300 hover:-translate-y-1 mt-8">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Cuidado</h3>
                <p className="text-sm text-muted-foreground">
                  Atendimento humanizado e personalizado
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-medical transition-all duration-300 hover:-translate-y-1 -mt-4">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Equipe</h3>
                <p className="text-sm text-muted-foreground">
                  Profissionais qualificados e experientes
                </p>
              </div>

              <div className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-medical hover:shadow-soft transition-all duration-300 hover:-translate-y-1 mt-4">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Inovação</h3>
                <p className="text-sm text-primary-foreground/80">
                  Tecnologia de ponta para melhor atendimento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-white">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;