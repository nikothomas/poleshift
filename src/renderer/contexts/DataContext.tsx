// src/renderer/contexts/DataContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useContext,
} from 'react';
import debounce from 'lodash/debounce';
import { ExtendedTreeItem, processFunctions } from '../utils/sidebarFunctions';
import { AuthContext } from './AuthContext';

export interface Sample {
  id: string;
  name: string;
  data: { [key: string]: any };
}

interface SampleData {
  [id: string]: Sample;
}

interface AppData {
  fileTreeData: ExtendedTreeItem[];
  sampleData: SampleData;
}

export interface DataContextType extends AppData {
  setFileTreeData: (data: ExtendedTreeItem[]) => void;
  setSampleData: (newData: SampleData) => void;
  addItem: (
    type: keyof typeof processFunctions,
    inputs: Record<string, string>,
  ) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(
  undefined,
);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('DataProvider must be used within an AuthProvider');
  }

  const { user, userOrgId, userOrgShortId, loading: authLoading } = authContext;

  const [fileTreeData, setFileTreeData] = useState<ExtendedTreeItem[]>([]);
  const [sampleData, setSampleData] = useState<SampleData>({});

  const getUserKey = (baseKey: string) => {
    return user ? `${baseKey}_${user.id}` : baseKey;
  };

  /**
   * Function to load data from Electron Store (with decryption)
   */
  const loadData = useCallback(async () => {
    if (!user) {
      setFileTreeData([]);
      setSampleData({});
      return;
    }

    try {
      // Retrieve and decrypt fileTreeData
      const fileTreeDataResult = await window.electron.retrieveAndDecrypt(
        user.id,
        getUserKey('fileTreeData'),
      );
      if (fileTreeDataResult.success) {
        const parsedFileTreeData = JSON.parse(fileTreeDataResult.value); // Parse the decrypted JSON string
        if (Array.isArray(parsedFileTreeData)) {
          // Validate each item has an 'id'
          const validatedFileTreeData = parsedFileTreeData.filter(
            (item: any) => {
              if (!item.id || typeof item.id !== 'string') {
                console.warn(
                  'Invalid item detected (missing or invalid id):',
                  item,
                );
                return false; // Skip items without a valid 'id'
              }
              return true;
            },
          );
          setFileTreeData(validatedFileTreeData);
        } else {
          console.warn(
            'fileTreeData is not an array. Initializing with an empty array.',
          );
          setFileTreeData([]);
        }
      }

      // Retrieve and decrypt sampleData
      const sampleDataResult = await window.electron.retrieveAndDecrypt(
        user.id,
        getUserKey('sampleData'),
      );
      if (sampleDataResult.success) {
        const parsedSampleData = JSON.parse(sampleDataResult.value); // Parse the decrypted JSON string
        if (parsedSampleData && typeof parsedSampleData === 'object') {
          setSampleData(parsedSampleData);
        } else {
          console.warn(
            'sampleData is not an object. Initializing with default values.',
          );
          setSampleData({});
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [user]);

  /**
   * Function to save data to Electron Store (with encryption)
   */
  const saveData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const setFileTreeResult = await window.electron.encryptAndStore(
        user.id,
        getUserKey('fileTreeData'),
        JSON.stringify(fileTreeData), // Stringify the data before encryption
      );
      if (!setFileTreeResult.success) {
        console.error(
          'Failed to save fileTreeData:',
          setFileTreeResult.message,
        );
      }

      const setSampleDataResult = await window.electron.encryptAndStore(
        user.id,
        getUserKey('sampleData'),
        JSON.stringify(sampleData), // Stringify the data before encryption
      );
      if (!setSampleDataResult.success) {
        console.error(
          'Failed to save sampleData:',
          setSampleDataResult.message,
        );
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [fileTreeData, getUserKey, sampleData, user]);

  // Debounce the saveData function to prevent excessive writes
  const debouncedSaveData = useCallback(
    debounce(() => {
      saveData();
    }, 500),
    [saveData],
  );

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [loadData, authLoading]);

  useEffect(() => {
    if (!authLoading && user) {
      debouncedSaveData();
    }
    return () => {
      debouncedSaveData.cancel();
    };
  }, [fileTreeData, sampleData, debouncedSaveData, authLoading, user]);

  useEffect(() => {
    if (!user && !authLoading) {
      setFileTreeData([]);
      setSampleData({});
    }
  }, [user, authLoading]);

  const addItem = useCallback(
    async (
      type: keyof typeof processFunctions,
      inputs: Record<string, string>,
    ) => {
      try {
        const processingFunction = processFunctions[type];
        if (!processingFunction) {
          throw new Error(
            `Processing function for type "${type}" does not exist.`,
          );
        }

        if (!userOrgId || !userOrgShortId) {
          throw new Error('User organization information is missing.');
        }

        // Call the processing function with required parameters
        const newItem: ExtendedTreeItem = await processingFunction(
          inputs,
          sampleData,
          userOrgId,
          userOrgShortId,
        );

        // Ensure the new item has a valid 'id'
        if (!newItem.id || typeof newItem.id !== 'string') {
          throw new Error('New item is missing a valid "id" property.');
        }

        setFileTreeData((prevFileTreeData) => [...prevFileTreeData, newItem]);

        if (newItem.type === 'sample') {
          const newSample: Sample = {
            id: newItem.id,
            name: newItem.text,
            data: newItem.data || {},
          };

          setSampleData((prevSampleData) => ({
            ...prevSampleData,
            [newSample.id]: newSample,
          }));
        }

        console.log(`Added new item of type "${type}" with ID: ${newItem.id}`);
      } catch (error: any) {
        console.error('Error adding item:', error);
        throw error;
      }
    },
    [sampleData, setFileTreeData, setSampleData, userOrgId, userOrgShortId],
  );

  return (
    <DataContext.Provider
      value={{
        fileTreeData,
        sampleData,
        setFileTreeData,
        setSampleData,
        addItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
