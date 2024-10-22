// src/utils/samplingEventUtils.ts

import { v4 as uuidv4 } from 'uuid';
import supabase from './supabaseClient';
import { ExtendedTreeItem, SamplingEventData, LocationOption } from '../types';

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
 * Creates a new sampling event and returns the corresponding tree item.
 */
export const processCreateSamplingEvent = async (
  inputs: Record<string, string>,
  samplingEventData: SamplingEventData,
  user: any,
  userOrgId: string,
  userOrgShortId: string,
  locations: LocationOption[],
): Promise<ExtendedTreeItem> => {
  const { collectionDate, locCharId } = inputs;

  // Input validation
  if (!collectionDate || !locCharId) {
    throw new Error(
      'Collection date and location are required to create a sampling event.',
    );
  }

  if (!userOrgId || !userOrgShortId) {
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
      const regex = new RegExp(`^${baseName}-(\\d{2})-${userOrgShortId}$`);
      return regex.test(samplingEvent.name);
    },
  );

  // Extract existing numbers
  const existingNumbers = existingSamplingEvents
    .map((samplingEvent) => {
      const regex = new RegExp(`^${baseName}-(\\d{2})-${userOrgShortId}$`);
      const match = samplingEvent.name.match(regex);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((num): num is number => num !== null);

  // Determine the next available number
  let nextNumber = 0;
  while (existingNumbers.includes(nextNumber)) {
    nextNumber += 1;
  }
  const formattedNumber = String(nextNumber).padStart(2, '2'); // Adjust padding as needed

  // Construct the sampling event name
  const samplingEventName = `${baseName}-${formattedNumber}-${userOrgShortId}`;

  const newId = uuidv4(); // Generate a UUID for the sampling event

  // Map locCharId to locId using the locations array
  const location = locations.find((loc) => loc.char_id === locCharId);

  if (!location) {
    throw new Error(`Location with char_id ${locCharId} not found.`);
  }

  const locId = location.id;

  // Create folder paths in Supabase Storage
  const rawDataFolderPath = `${userOrgShortId}/${samplingEventName}/`;
  const processedDataFolderPath = `${userOrgShortId}/${samplingEventName}/`;

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

    if (rawError && rawError.status !== 409) {
      throw new Error(
        `Failed to create folder in "raw-data": ${rawError.message}`,
      );
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

    if (processedError && processedError.status !== 409) {
      throw new Error(
        `Failed to create folder in "processed-data": ${processedError.message}`,
      );
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
        org_id: userOrgId, // uuid
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
      orgId: userOrgId,
      locId, // Ensure locId is correctly set
      storage_folder: rawDataFolderPath, // Include storage_folder
    },
  };
};
