/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, type ReactNode } from 'react';

interface NavigationContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMainNavCollapsed: boolean;
  setIsMainNavCollapsed: (collapsed: boolean) => void;
  isShapesSidebarCollapsed: boolean;
  setIsShapesSidebarCollapsed: (collapsed: boolean) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState(''); // Start with no active section
  const [isMainNavCollapsed, setIsMainNavCollapsed] = useState(false);
  const [isShapesSidebarCollapsed, setIsShapesSidebarCollapsed] = useState(false);

  const value = {
    activeSection,
    setActiveSection,
    isMainNavCollapsed,
    setIsMainNavCollapsed,
    isShapesSidebarCollapsed,
    setIsShapesSidebarCollapsed,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
