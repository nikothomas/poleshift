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
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed and imported
import { ExtendedTreeItem, processFunctions } from '../utils/sidebarFunctions';
import { AuthContext } from './AuthContext';
import supabase from '../utils/supabaseClient'; // Ensure correct path

export interface SamplingEvent {
  id: string;
  name: string;
  data: { [key: string]: any };
}

interface SamplingEventData {
  [id: string]: SamplingEvent;
}

interface AppData {
  fileTreeData: ExtendedTreeItem[];
  samplingEventData: SamplingEventData;
}

export interface DataContextType extends AppData {
  setFileTreeData: (data: ExtendedTreeItem[]) => void;
  setSamplingEventData: (newData: SamplingEventData) => void;
  addItem: (
    type: keyof typeof processFunctions,
    inputs: Record<string, string>,
  ) => Promise<void>;
  deleteItem: (id: string) => Promise<void>; // Added deleteItem
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
  const [samplingEventData, setSamplingEventData] = useState<SamplingEventData>(
    {},
  );

  const getUserKey = (baseKey: string) => {
    return user ? `${baseKey}_${user.id}` : baseKey;
  };

  /**
   * Function to load data from Electron Store (with decryption)
   */
  const loadData = useCallback(async () => {
    if (!user) {
      setFileTreeData([]);
      setSamplingEventData({});
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

      // Retrieve and decrypt samplingEventData
      const samplingEventDataResult = await window.electron.retrieveAndDecrypt(
        user.id,
        getUserKey('samplingEventData'),
      );
      if (samplingEventDataResult.success) {
        const parsedSamplingEventData = JSON.parse(
          samplingEventDataResult.value,
        ); // Parse the decrypted JSON string
        if (
          parsedSamplingEventData &&
          typeof parsedSamplingEventData === 'object'
        ) {
          setSamplingEventData(parsedSamplingEventData);
        } else {
          console.warn(
            'samplingEventData is not an object. Initializing with default values.',
          );
          setSamplingEventData({});
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

      const setSamplingEventDataResult = await window.electron.encryptAndStore(
        user.id,
        getUserKey('samplingEventData'),
        JSON.stringify(samplingEventData), // Stringify the data before encryption
      );
      if (!setSamplingEventDataResult.success) {
        console.error(
          'Failed to save samplingEventData:',
          setSamplingEventDataResult.message,
        );
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [fileTreeData, getUserKey, samplingEventData, user]);

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
  }, [fileTreeData, samplingEventData, debouncedSaveData, authLoading, user]);

  useEffect(() => {
    if (!user && !authLoading) {
      setFileTreeData([]);
      setSamplingEventData({});
    }
  }, [user, authLoading]);

  /**
   * Function to add a new item (samplingEvent or folder)
   */
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
          samplingEventData,
          userOrgId,
          userOrgShortId,
        );

        // Ensure the new item has a valid 'id'
        if (!newItem.id || typeof newItem.id !== 'string') {
          throw new Error('New item is missing a valid "id" property.');
        }

        setFileTreeData((prevFileTreeData) => [...prevFileTreeData, newItem]);

        if (newItem.type === 'samplingEvent') {
          const newSamplingEvent: SamplingEvent = {
            id: newItem.id,
            name: newItem.text,
            data: newItem.data || {},
          };

          setSamplingEventData((prevSamplingEventData) => ({
            ...prevSamplingEventData,
            [newSamplingEvent.id]: newSamplingEvent,
          }));
        }

        console.log(`Added new item of type "${type}" with ID: ${newItem.id}`);
      } catch (error: any) {
        console.error('Error adding item:', error);
        throw error;
      }
    },
    [
      samplingEventData,
      setFileTreeData,
      setSamplingEventData,
      userOrgId,
      userOrgShortId,
    ],
  );

  /**
   * Function to delete an item from the tree, samplingEventData, and the database
   * @param id - The ID of the item to delete
   */
  const deleteItem = useCallback(
    async (id: string) => {
      try {
        console.log(`Attempting to delete sampling event with ID: ${id}`);

        // **Step 1: Delete from Supabase**
        const { data, error } = await supabase
          .from('sampling_event_metadata') // Replace with your actual table name
          .delete()
          .eq('id', id); // Replace 'id' with your actual primary key column if different

        if (error) {
          console.error(`Supabase deletion error for ID ${id}:`, error);
          throw new Error(`Failed to delete sampling event: ${error.message}`);
        }

        console.log(`Successfully deleted sampling event with ID: ${id} from Supabase`);

        // **Step 2: Remove item from hierarchical tree data**
        const removeItem = (items: ExtendedTreeItem[], idToRemove: string): ExtendedTreeItem[] => {
          return items
            .filter((item) => item.id !== idToRemove)
            .map((item) => ({
              ...item,
              children: item.children ? removeItem(item.children, idToRemove) : undefined,
            }));
        };
        setFileTreeData((prevFileTreeData) => removeItem(prevFileTreeData, id));

        console.log(`Removed sampling event with ID: ${id} from frontend tree data`);

        // **Step 3: Remove from samplingEventData**
        setSamplingEventData((prevSamplingEventData) => {
          const newSamplingEventData = { ...prevSamplingEventData };
          delete newSamplingEventData[id];
          return newSamplingEventData;
        });

        console.log(`Removed sampling event with ID: ${id} from frontend state`);
      } catch (error: any) {
        console.error(`Error deleting sampling event with ID ${id}:`, error);
        throw error; // To allow the caller to handle the error
      }
    },
    [setFileTreeData, setSamplingEventData],
  );


  return (
    <DataContext.Provider
      value={{
        fileTreeData,
        samplingEventData,
        setFileTreeData,
        setSamplingEventData,
        addItem,
        deleteItem, // Expose deleteItem
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
