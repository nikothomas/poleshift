// src/renderer/hooks/useData.ts

import { useContext } from 'react';
import { DataContext, DataContextType } from '../contexts/DataContext';

const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default useData;
