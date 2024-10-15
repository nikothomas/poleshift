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
import supabase from '../utils/supabaseClient';

export interface SamplingEvent {
  id: string;
  name: string;
  data: { [key: string]: any };
}

interface SamplingEventData {
  [id: string]: SamplingEvent;
}

export interface DataContextType {
  fileTreeData: ExtendedTreeItem[];
  setFileTreeData: React.Dispatch<React.SetStateAction<ExtendedTreeItem[]>>;
  samplingEventData: SamplingEventData;
  setSamplingEventData: React.Dispatch<React.SetStateAction<SamplingEventData>>;
  addItem: (
    type: keyof typeof processFunctions,
    inputs: Record<string, string>,
  ) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
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

  const { user, userOrgId, userOrgShortId } = authContext;

  const [fileTreeData, setFileTreeData] = useState<ExtendedTreeItem[]>([]);
  const [samplingEventData, setSamplingEventData] = useState<SamplingEventData>(
    {},
  );

  /**
   * Function to load tree data from Supabase
   */
  const loadTreeData = useCallback(async () => {
    if (!user || !userOrgId) {
      setFileTreeData([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('file_tree')
        .select('tree_data')
        .eq('org_id', userOrgId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116: No rows found
        console.error('Error fetching tree data:', error);
      } else if (data) {
        setFileTreeData(data.tree_data);
      } else {
        // If no data exists for the organization, initialize with an empty array
        setFileTreeData([]);
      }
    } catch (error) {
      console.error('Error loading tree data:', error);
    }
  }, [user, userOrgId]);

  /**
   * Function to save tree data to Supabase
   */
  const saveTreeData = useCallback(async () => {
    if (!user || !userOrgId) {
      return;
    }

    try {
      const { error } = await supabase.from('file_tree').upsert(
        {
          org_id: userOrgId,
          tree_data: fileTreeData,
        },
        {
          onConflict: 'org_id',
        },
      );

      if (error) {
        console.error('Error saving tree data:', error);
      }
    } catch (error) {
      console.error('Error saving tree data:', error);
    }
  }, [user, userOrgId, fileTreeData]);

  // Debounce the saveTreeData function to prevent excessive writes
  const debouncedSaveTreeData = useCallback(
    debounce(() => {
      saveTreeData();
    }, 500),
    [saveTreeData],
  );

  // Load tree data on mount
  useEffect(() => {
    loadTreeData();
  }, [loadTreeData]);

  // Save tree data whenever it changes
  useEffect(() => {
    if (user && userOrgId) {
      debouncedSaveTreeData();
    }
    return () => {
      debouncedSaveTreeData.cancel();
    };
  }, [fileTreeData, debouncedSaveTreeData, user, userOrgId]);

  // Real-time synchronization using Supabase Realtime
  useEffect(() => {
    if (!user || !userOrgId) {
      return;
    }

    const channel = supabase
      .channel('file_tree_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'file_tree',
          filter: `org_id=eq.${userOrgId}`,
        },
        (payload) => {
          if (
            payload.eventType === 'UPDATE' ||
            payload.eventType === 'INSERT'
          ) {
            const updatedTreeData = payload.new.tree_data;
            setFileTreeData(updatedTreeData);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userOrgId]);

  /**
   * Function to load sampling event data from local storage
   * Assuming samplingEventData is user-specific and stored locally
   */
  const loadSamplingEventData = useCallback(async () => {
    if (!user) {
      setSamplingEventData({});
      return;
    }

    try {
      // Retrieve and decrypt samplingEventData from local storage
      const samplingEventDataResult = await window.electron.retrieveAndDecrypt(
        user.id,
        `samplingEventData_${user.id}`,
      );
      if (samplingEventDataResult.success) {
        const parsedSamplingEventData = JSON.parse(
          samplingEventDataResult.value,
        );
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
      console.error('Error loading sampling event data:', error);
    }
  }, [user]);

  /**
   * Function to save sampling event data to local storage
   */
  const saveSamplingEventData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const setSamplingEventDataResult = await window.electron.encryptAndStore(
        user.id,
        `samplingEventData_${user.id}`,
        JSON.stringify(samplingEventData),
      );
      if (!setSamplingEventDataResult.success) {
        console.error(
          'Failed to save samplingEventData:',
          setSamplingEventDataResult.message,
        );
      }
    } catch (error) {
      console.error('Error saving sampling event data:', error);
    }
  }, [samplingEventData, user]);

  // Debounce the saveSamplingEventData function to prevent excessive writes
  const debouncedSaveSamplingEventData = useCallback(
    debounce(() => {
      saveSamplingEventData();
    }, 500),
    [saveSamplingEventData],
  );

  // Load sampling event data on mount
  useEffect(() => {
    loadSamplingEventData();
  }, [loadSamplingEventData]);

  // Save sampling event data whenever it changes
  useEffect(() => {
    if (user) {
      debouncedSaveSamplingEventData();
    }
    return () => {
      debouncedSaveSamplingEventData.cancel();
    };
  }, [samplingEventData, debouncedSaveSamplingEventData, user]);

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

        // Save the updated tree data to Supabase
        await saveTreeData();

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
      saveTreeData,
      setFileTreeData,
      setSamplingEventData,
      userOrgId,
      userOrgShortId,
    ],
  );

  /**
   * Function to delete an item from the tree
   * @param id - The ID of the item to delete
   */
  const deleteItem = useCallback(
    async (id: string) => {
      try {
        console.log(`Attempting to delete item with ID: ${id}`);

        // Perform any additional deletion logic if necessary

        // Remove item from hierarchical tree data
        const removeItem = (
          items: ExtendedTreeItem[],
          idToRemove: string,
        ): ExtendedTreeItem[] => {
          return items
            .filter((item) => item.id !== idToRemove)
            .map((item) => ({
              ...item,
              children: item.children
                ? removeItem(item.children, idToRemove)
                : undefined,
            }));
        };
        setFileTreeData((prevFileTreeData) => removeItem(prevFileTreeData, id));

        // Save the updated tree data to Supabase
        await saveTreeData();

        // Remove from samplingEventData if it's a sampling event
        setSamplingEventData((prevSamplingEventData) => {
          const newSamplingEventData = { ...prevSamplingEventData };
          delete newSamplingEventData[id];
          return newSamplingEventData;
        });

        console.log(`Removed item with ID: ${id} from tree data`);
      } catch (error: any) {
        console.error(`Error deleting item with ID ${id}:`, error);
        throw error;
      }
    },
    [saveTreeData, setFileTreeData, setSamplingEventData],
  );

  return (
    <DataContext.Provider
      value={{
        fileTreeData,
        setFileTreeData,
        samplingEventData,
        setSamplingEventData,
        addItem,
        deleteItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
