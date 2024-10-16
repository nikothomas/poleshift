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
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for UUID generation
import { AuthContext } from './AuthContext';
import supabase from '../utils/supabaseClient';

// Define possible item types
export type ItemType = 'samplingEvent' | 'folder';

// Extend TreeItem
export interface ExtendedTreeItem {
  id: string;
  text: string;
  droppable: boolean;
  type: ItemType;
  children?: ExtendedTreeItem[];
  data?: { [key: string]: any };
}

export interface LocationOption {
  id: string; // UUID from Supabase
  char_id: string;
  label: string;
  lat: number; // Use 'lat' instead of 'latitude'
  long: number; // Use 'long' instead of 'longitude'
}

export interface SamplingEvent {
  id: string;
  name: string;
  loc_id: string; // Store location UUID
  storage_folder: string; // Include storage_folder
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
  addItem: (type: ItemType, inputs: Record<string, string>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  isSyncing: boolean;
  locations: LocationOption[]; // Include locations in the context
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
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // State to hold the fetched locations from the database
  const [locations, setLocations] = useState<LocationOption[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('sample_locations')
        .select('id, char_id, label, lat, long')
        .eq('is_enabled', true);

      if (error) {
        console.error('Error fetching sample locations:', error.message);
        // Handle error as needed
      } else if (data) {
        const formattedLocations = data.map(
          (location: {
            id: string;
            char_id: string;
            label: string;
            lat: number;
            long: number;
          }) => ({
            id: location.id,
            char_id: location.char_id,
            label: location.label,
            lat: location.lat,
            long: location.long,
          }),
        );
        setLocations(formattedLocations);
      }
    };

    fetchLocations();
  }, []);

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

    setIsSyncing(true); // Start syncing

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
    } finally {
      setIsSyncing(false); // Stop syncing
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

  // Real-time synchronization using Supabase Realtime for file_tree
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
   * Function to load sampling event data from Supabase
   */
  const loadSamplingEventData = useCallback(async () => {
    if (!user || !userOrgId) {
      setSamplingEventData({});
      return;
    }

    try {
      const { data, error } = await supabase
        .from('sampling_event_metadata')
        .select('*')
        .eq('org_id', userOrgId);

      if (error) {
        console.error('Error loading sampling event data:', error);
      } else if (data) {
        const samplingEventData: SamplingEventData = {};
        data.forEach((event: any) => {
          samplingEventData[event.id] = {
            id: event.id,
            name: event.sample_id,
            loc_id: event.loc_id,
            storage_folder: event.storage_folder, // Include storage_folder
            data: {}, // Include other fields as necessary
          };
        });
        setSamplingEventData(samplingEventData);
      }
    } catch (error) {
      console.error('Error loading sampling event data:', error);
    }
  }, [user, userOrgId]);

  // Load sampling event data on mount
  useEffect(() => {
    loadSamplingEventData();
  }, [loadSamplingEventData]);

  // Real-time synchronization using Supabase Realtime for sampling_event_metadata
  useEffect(() => {
    if (!user || !userOrgId) {
      return;
    }

    const channel = supabase
      .channel('sampling_event_metadata_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sampling_event_metadata',
          filter: `org_id=eq.${userOrgId}`,
        },
        (payload) => {
          if (
            payload.eventType === 'INSERT' ||
            payload.eventType === 'UPDATE'
          ) {
            const event = payload.new;
            setSamplingEventData((prevData) => ({
              ...prevData,
              [event.id]: {
                id: event.id,
                name: event.sample_id,
                loc_id: event.loc_id,
                storage_folder: event.storage_folder, // Include storage_folder
                data: {}, // Include other fields as necessary
              },
            }));
          } else if (payload.eventType === 'DELETE') {
            const event = payload.old;
            setSamplingEventData((prevData) => {
              const newData = { ...prevData };
              delete newData[event.id];
              return newData;
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userOrgId]);

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

  // Processing functions moved from sidebarFunctions

  /**
   * Formats a Date object to a local datetime string without timezone information.
   * Example format: 'YYYY-MM-DDTHH:mm:ss'
   * @param date Date object to format
   * @returns Formatted local datetime string
   */
  function formatLocalDate(date: Date): string {
    const pad = (num: number): string => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  /**
   * Creates a new sampling event
   */
  const processCreateSamplingEvent = async (
    inputs: Record<string, string>,
    samplingEventData: SamplingEventData,
    user: any,
    userOrgId: string,
    userOrgShortId: string,
    locations: LocationOption[],
  ): Promise<ExtendedTreeItem> => {
    const { collectionDate, locCharId } = inputs;
    const orgId = userOrgId;
    const orgShortId = userOrgShortId;

    // Input validation
    if (!collectionDate || !locCharId) {
      throw new Error(
        'Collection date and location are required to create a sampling event.',
      );
    }

    if (!orgId || !orgShortId) {
      throw new Error('Organization information is missing from user data.');
    }

    const userId = user?.id;
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    // Format the date as YYYY-MM-DD
    const formattedDate = new Date(collectionDate).toISOString().split('T')[0];
    const baseName = `${formattedDate}-${locCharId}`;

    // Find existing sampling events with the same date, location char_id, and org
    const existingSamplingEvents = Object.values(samplingEventData).filter(
      (samplingEvent) => {
        const regex = new RegExp(`^${baseName}-(\\d{2})-${orgShortId}$`);
        return regex.test(samplingEvent.name);
      },
    );

    // Extract existing numbers
    const existingNumbers = existingSamplingEvents
      .map((samplingEvent) => {
        const regex = new RegExp(`^${baseName}-(\\d{2})-${orgShortId}$`);
        const match = samplingEvent.name.match(regex);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((num): num is number => num !== null);

    // Determine the next available number
    let nextNumber = 0;
    while (existingNumbers.includes(nextNumber)) {
      nextNumber += 1;
    }
    const formattedNumber = String(nextNumber).padStart(2, '0');

    // Construct the sampling event name
    const samplingEventName = `${baseName}-${formattedNumber}-${orgShortId}`;

    const newId = uuidv4(); // Generate a UUID for the sampling event

    // Map locCharId to locId using the locations array
    const location = locations.find((loc) => loc.char_id === locCharId);

    if (!location) {
      throw new Error(`Location with char_id ${locCharId} not found.`);
    }

    const locId = location.id;

    // Create folder paths in Supabase Storage
    const rawDataFolderPath = `${orgShortId}/${samplingEventName}/`;
    const processedDataFolderPath = `${orgShortId}/${samplingEventName}/`;

    try {
      // Supabase Storage handles folder creation implicitly via object paths.
      // To simulate folder creation, upload an 'index_file.poleshift' with a single character.

      const placeholderContent = new Blob(['a'], { type: 'text/plain' });

      // Upload placeholder file to raw-data bucket
      const { error: rawError } = await supabase.storage
        .from('raw-data')
        .upload(
          `${rawDataFolderPath}index_file.poleshift`,
          placeholderContent,
          {
            upsert: false,
          },
        );

      if (rawError) {
        if (
          rawError.status === 400 &&
          rawError.message.includes('Bucket not found')
        ) {
          throw new Error(
            'The "raw-data" bucket does not exist in Supabase Storage.',
          );
        }
        // Ignore "File exists" error (status code 409) if folder already exists
        if (rawError.status !== 409) {
          throw new Error(
            `Failed to create folder in "raw-data": ${rawError.message}`,
          );
        }
      }

      // Upload placeholder file to processed-data bucket
      const { error: processedError } = await supabase.storage
        .from('processed-data')
        .upload(
          `${processedDataFolderPath}index_file.poleshift`,
          placeholderContent,
          {
            upsert: false,
          },
        );

      if (processedError) {
        if (
          processedError.status === 400 &&
          processedError.message.includes('Bucket not found')
        ) {
          throw new Error(
            'The "processed-data" bucket does not exist in Supabase Storage.',
          );
        }
        // Ignore "File exists" error (status code 409) if folder already exists
        if (processedError.status !== 409) {
          throw new Error(
            `Failed to create folder in "processed-data": ${processedError.message}`,
          );
        }
      }

      // Format the collection date as a Date object
      const localDate = new Date(collectionDate);

      // Format the local datetime as a string without timezone
      const formattedLocalDate = formatLocalDate(localDate);

      // Convert the local datetime to UTC ISO string
      const utcDateISOString = localDate.toISOString();

      // Insert a new record into the sampling_event_metadata table
      const { error: insertError } = await supabase
        .from('sampling_event_metadata')
        .insert({
          id: newId, // uuid
          created_at: new Date().toISOString(), // timestamptz (UTC)
          org_id: orgId, // uuid
          user_id: userId, // uuid
          sample_id: samplingEventName, // text
          date: formattedDate, // date
          collected_datetime_local: formattedLocalDate, // Stored as local datetime string
          storage_folder: rawDataFolderPath, // Include storage_folder
          collected_datetime_utc: utcDateISOString, // timestamptz (UTC)
          loc_id: locId, // uuid of the location
        });

      if (insertError) {
        throw new Error(
          `Failed to insert record into sampling_event_metadata: ${insertError.message}`,
        );
      }
    } catch (error: any) {
      console.error('Error in processCreateSamplingEvent:', error);
      throw new Error(`Failed to create sampling event: ${error.message}`);
    }

    return {
      id: newId,
      text: samplingEventName,
      droppable: false,
      type: 'samplingEvent',
      data: {
        name: samplingEventName,
        collectionDate,
        locCharId,
        orgId,
        locId, // Ensure locId is correctly set
        storage_folder: rawDataFolderPath, // Include storage_folder
      },
    };
  };

  /**
   * Creates a new folder.
   */
  const processCreateFolder = async (
    inputs: Record<string, string>,
  ): Promise<ExtendedTreeItem> => {
    const { name } = inputs;

    // Input validation
    if (!name) {
      throw new Error('Folder name is required to create a folder.');
    }

    const newId = `folder-${uuidv4()}`;
    return {
      id: newId,
      text: name,
      droppable: true,
      type: 'folder',
      children: [],
    };
  };

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
        locations, // Provide locations in the context
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
