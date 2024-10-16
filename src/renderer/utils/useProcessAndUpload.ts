// src/utils/useProcessAndUpload.ts

import supabase from './supabaseClient';
import useAuth from '../hooks/useAuth'; // Adjust the import path as necessary
import { DropboxConfigItem } from '../config/dropboxConfig';

interface Sample {
  id: string;
  name: string;
  org_id: string;
  user_id: string;
  date: string;
  collected_datetime_local: string;
  lat: number;
  long: number;
  storage_folder: string;
  [key: string]: any;
}

interface ProcessAndUploadParams {
  functionName: string;
  sample: Sample;
  modalInputs: Record<string, string>;
  uploadedFiles: File[];
  configItem: DropboxConfigItem;
  onDataProcessed: (
    insertData: any,
    configItem: DropboxConfigItem,
    processedData: any,
  ) => void;
  onError: (message: string) => void;
}

export const useProcessAndUpload = () => {
  const { user, userOrgId } = useAuth();

  const processAndUpload = async ({
    functionName,
    sample,
    modalInputs,
    uploadedFiles,
    configItem,
    onDataProcessed,
    onError,
  }: ProcessAndUploadParams) => {
    try {
      const response = await window.electron.processFunction(
        functionName,
        sample.name,
        modalInputs,
        uploadedFiles,
      );

      if (response.success) {
        const processedData = response.result;
        const jsonString = JSON.stringify(processedData.data);
        const jsonBlob = new Blob([jsonString], { type: 'application/json' });
        const fileName = `${configItem.label.replace(/\s+/g, '_')}.json`;
        const storagePath = `${sample.storage_folder}${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('processed-data')
          .upload(storagePath, jsonBlob, { upsert: true });

        if (uploadError) {
          throw new Error(`Failed to upload file: ${uploadError.message}`);
        }

        // Use lat, long, and date from modalInputs if provided, else use sample
        const lat = modalInputs.lat ? parseFloat(modalInputs.lat) : sample.lat;
        const long = modalInputs.long
          ? parseFloat(modalInputs.long)
          : sample.long;
        const date = modalInputs.date || sample.date;
        const collected_datetime_local =
          modalInputs.collected_datetime_local ||
          sample.collected_datetime_local;

        // Insert into sample_metadata with all required fields
        const { data: insertData, error: insertError } = await supabase
          .from('sample_metadata')
          .insert([
            {
              sample_id: sample.name,
              data_type: configItem.id, // Use configItem.id as data_type
              storage_path: storagePath,
              org_id: sample.org_id || userOrgId,
              user_id: sample.user_id || user.id,
              date,
              collected_datetime_local,
              lat,
              long,
              processed_datetime: new Date().toISOString(),
              status: 'processed',
            },
          ])
          .select('*');

        if (insertError) {
          throw new Error(`Failed to insert data: ${insertError.message}`);
        }

        onDataProcessed(insertData, configItem, processedData);
        onError('');
      } else {
        throw new Error(response.message || 'Processing failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('An unknown error occurred.');
      }
    }
  };

  return { processAndUpload };
};
