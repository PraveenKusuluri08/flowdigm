// App.jsx - How to integrate all components
import React from 'react';
import { NavigationProvider } from './context/NavigationProvider';
import AppContent from './components/Layout/AppContent';

const App = () => {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
};

export default App;