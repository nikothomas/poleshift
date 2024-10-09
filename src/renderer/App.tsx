// src/renderer/App.tsx

import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { UIProvider } from './contexts/UIContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
          <UIProvider>
            <Router>
              <AppRoutes />
            </Router>
          </UIProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
