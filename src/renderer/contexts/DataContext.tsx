// src/contexts/DataContext.tsx

import React, { createContext, ReactNode, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { useFileTreeData } from '../hooks/useFileTreeData';
import { useSamplingEventData } from '../hooks/useSamplingEventData';
import { useLocations } from '../hooks/useLocations';
import { processCreateSamplingEvent } from '../utils/samplingEventUtils';
import { processCreateFolder } from '../utils/folderUtils';
import supabase from '../utils/supabaseClient';
import { DataContextType, ItemType } from '../types';
import { ExtendedTreeItem } from '../../types.ts';

export const DataContext = createContext<DataContextType | undefined>(
  undefined,
);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user, userOrgId, userOrgShortId } = useAuth();

  const { fileTreeData, setFileTreeData, isSyncing } = useFileTreeData();
  const { samplingEventData, setSamplingEventData } = useSamplingEventData();
  const { locations } = useLocations();

  /**
   * Function to save tree data to Supabase
   */
  const saveTreeData = useCallback(async () => {
    if (!user || !userOrgId) return;

    try {
      const { error } = await supabase.from('file_tree').upsert(
        {
          org_id: userOrgId,
          tree_data: fileTreeData,
        },
        { onConflict: 'org_id' },
      );

      if (error) {
        console.error('Error saving tree data:', error);
      }
    } catch (error) {
      console.error('Error saving tree data:', error);
    }
  }, [user, userOrgId, fileTreeData]);

  /**
   * Function to add a new item (samplingEvent or folder)
   */
  const addItem = useCallback(
    async (type: ItemType, inputs: Record<string, string>) => {
      try {
        if (!user || !userOrgId || !userOrgShortId) {
          throw new Error('User or organization information is missing.');
        }

        let newItem: ExtendedTreeItem;

        if (type === 'samplingEvent') {
          // Process create sampling event

          const newSamplingEventItem = await processCreateSamplingEvent(
            inputs,
            samplingEventData,
            user,
            userOrgId,
            userOrgShortId,
            locations,
          );

          newItem = newSamplingEventItem;

          setSamplingEventData((prevSamplingEventData) => ({
            ...prevSamplingEventData,
            [newItem.id]: {
              id: newItem.id,
              name: newItem.text,
              loc_id: newItem.data.locId, // Corrected property name
              storage_folder: newItem.data.storage_folder, // Include storage_folder
              data: newItem.data || {},
            },
          }));
        } else if (type === 'folder') {
          // Process create folder
          newItem = await processCreateFolder(inputs);
        } else {
          throw new Error(`Unknown item type: ${type}`);
        }

        // Ensure the new item has a valid 'id'
        if (!newItem.id || typeof newItem.id !== 'string') {
          throw new Error('New item is missing a valid "id" property.');
        }

        setFileTreeData((prevFileTreeData) => [...prevFileTreeData, newItem]);

        // Save the updated tree data to Supabase
        await saveTreeData();

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
      user,
      userOrgId,
      userOrgShortId,
      locations,
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
          const newData = { ...prevSamplingEventData };
          delete newData[id];
          return newData;
        });

        // Delete the sampling event from Supabase
        await supabase.from('sampling_event_metadata').delete().eq('id', id);

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
        isSyncing,
        locations,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
