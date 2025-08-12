import { useContext } from 'react';
import { NavigationContext } from '../context/NavigationProvider';

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
