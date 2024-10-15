// src/renderer/utils/sidebarFunctions.ts

import { v4 as uuidv4 } from 'uuid';
import supabase from './supabaseClient';
import { sampleLocations } from '../config/sampleLocationsConfig';

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

// Process Functions Interface
interface ProcessFunctions {
  [key: string]: (
    inputs: Record<string, string>,
    samplingEventData: Record<string, any>,
    userOrgId: string | null,
    userOrgShortId: string | null,
  ) => Promise<ExtendedTreeItem>;
}

/**
 * Formats a Date object to a local datetime string without timezone information.
 * Example format: 'YYYY-MM-DDTHH:mm:ss'
 * @param date Date object to format
 * @returns Formatted local datetime string
 */
function formatLocalDate(date: Date): string {
  const pad = (num: number): string => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * Creates a new sampling event, including:
 * - Generating a unique sampling event name.
 * - Creating folders in Supabase Storage by uploading 'index_file.poleshift'.
 * - Inserting a new record into the sampling_event_metadata table.
 */
export const processCreateSamplingEvent = async (
  inputs: Record<string, string>,
  samplingEventData: Record<string, any>,
  userOrgId: string | null,
  userOrgShortId: string | null,
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

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Failed to get current user: ${userError.message}`);
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

  // Use sampleLocationsConfig to look up lat and long
  const location = sampleLocations.find((loc) => loc.char_id === locCharId);

  if (!location) {
    throw new Error(`Location with char_id ${locCharId} not found.`);
  }

  const { lat } = location;
  const { long } = location;

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
      .upload(`${rawDataFolderPath}index_file.poleshift`, placeholderContent, {
        upsert: false,
      });

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

    // Optionally format the local datetime as a string without timezone
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
        lat, // double precision
        long, // double precision
        date: formattedDate, // date
        collected_datetime_local: formattedLocalDate, // Stored as local datetime string
        storage_folder: rawDataFolderPath, // text
        collected_datetime_utc: utcDateISOString, // timestamptz (UTC)
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
      lat,
      long,
    },
  };
};

/**
 * Creates a new folder.
 * @param inputs Input parameters containing the folder name.
 * @param samplingEventData Existing sampling event data.
 * @param userOrgId User's organization ID.
 * @param userOrgShortId User's organization short ID.
 * @returns An ExtendedTreeItem representing the new folder.
 */
export const processCreateFolder = async (
  inputs: Record<string, string>,
  samplingEventData: Record<string, any>,
  userOrgId: string | null,
  userOrgShortId: string | null,
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

// Export all processing functions
export const processFunctions: ProcessFunctions = {
  samplingEvent: processCreateSamplingEvent, // Changed key to 'samplingEvent'
  folder: processCreateFolder, // Changed key to 'folder'
  // Add more processing functions here
};
