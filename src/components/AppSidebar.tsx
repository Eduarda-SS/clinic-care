import { Calendar, Users, FileText, Settings, Clock, User, BarChart3, Shield, Stethoscope, ClipboardList, Activity } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

// Navigation items per role
const roleNavigation = {
  'gestao-coordenacao': [
    { title: "Dashboard Admin", url: "/admin/dashboard", icon: BarChart3 },
    { title: "Gestão de Usuários", url: "/admin/users", icon: Shield },
    { title: "Agenda", url: "/agenda", icon: Calendar },
    { title: "Pacientes", url: "/patients", icon: Users },
    { title: "Profissionais", url: "/professionals", icon: User },
    { title: "Laudos", url: "/laudos", icon: FileText },
    { title: "Fila de Espera", url: "/waiting-list", icon: Clock },
    { title: "Relatórios", url: "/reports", icon: ClipboardList },
    { title: "Configurações", url: "/settings", icon: Settings },
  ],
  'secretaria': [
    { title: "Agenda", url: "/agenda", icon: Calendar },
    { title: "Pacientes", url: "/patients", icon: Users },
    { title: "Fila de Espera", url: "/waiting-list", icon: Clock },
  ],
  'medico': [
    { title: "Meus Pacientes", url: "/my-patients", icon: Users },
    { title: "Minha Agenda", url: "/my-agenda", icon: Calendar },
    { title: "Laudos", url: "/laudos", icon: FileText },
    { title: "Atendimentos", url: "/consultations", icon: Stethoscope },
    { title: "Estatísticas", url: "/my-stats", icon: Activity },
  ],
};

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userRoles } = useUser();

  const isActive = (path: string) => currentPath === path;

  const getNavCls = (active: boolean) =>
    active 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50";

  // If user has only one role, don't use collapsible
  if (userRoles.length === 1) {
    const role = userRoles[0];
    const items = roleNavigation[role.id as keyof typeof roleNavigation] || [];

    return (
      <Sidebar collapsible="icon">
        <SidebarTrigger className="m-2 self-end" />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{role.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavCls(isActive(item.url))}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Multiple roles - use collapsible groups
  return (
    <Sidebar collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        {userRoles.map((role) => {
          const items = roleNavigation[role.id as keyof typeof roleNavigation] || [];
          const hasActiveItem = items.some(item => isActive(item.url));

          return (
            <RoleSection
              key={role.id}
              roleName={role.name}
              items={items}
              isActive={isActive}
              getNavCls={getNavCls}
              defaultOpen={hasActiveItem}
            />
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}

interface RoleSectionProps {
  roleName: string;
  items: Array<{ title: string; url: string; icon: any }>;
  isActive: (path: string) => boolean;
  getNavCls: (active: boolean) => string;
  defaultOpen?: boolean;
}

function RoleSection({ roleName, items, isActive, getNavCls, defaultOpen = false }: RoleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md p-2 flex items-center justify-between">
            <span>{roleName}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls(isActive(item.url))}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}