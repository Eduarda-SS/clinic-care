import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, USER_ROLES } from '@/types/user';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  userRoles: UserRole[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Mock user with multiple roles for demo
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '1',
    name: 'Dr. João Silva',
    email: 'joao@example.com',
    role: USER_ROLES[0], // Primary role
    status: 'active',
    createdAt: new Date(),
  });

  // User can have multiple roles - for demo, let's assume they can have médico and gestão
  const userRoles: UserRole[] = currentUser 
    ? [USER_ROLES[0], USER_ROLES[2]] // Gestão and Médico
    : [];

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, userRoles }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
