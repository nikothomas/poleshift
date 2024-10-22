// src/hooks/useProcessAndUpload.ts

import supabase from '../utils/supabaseClient';
import useAuth from './useAuth';
import { DropboxConfigItem } from '../config/dropboxConfig';
import { Sample } from '../types';

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

      if (!response.success) {
        throw new Error(response.message || 'Processing failed');
      }

      const processedData = response.result;
      const jsonBlob = new Blob([JSON.stringify(processedData.data)], {
        type: 'application/json',
      });
      const fileName = `${configItem.label.replace(/\s+/g, '_')}.json`;
      const storagePath = `${sample.storage_folder}${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('processed-data')
        .upload(storagePath, jsonBlob, { upsert: true });

      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      const lat = parseFloat(modalInputs.lat) || sample.lat;
      const long = parseFloat(modalInputs.long) || sample.long;
      const date = modalInputs.date || sample.date;
      const collected_datetime_local =
        modalInputs.collected_datetime_local || sample.collected_datetime_local;

      const { data: insertData, error: insertError } = await supabase
        .from('sample_metadata')
        .insert([
          {
            sample_id: sample.name,
            data_type: configItem.id,
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
    } catch (error: any) {
      onError(error.message || 'An unknown error occurred.');
    }
  };

  return { processAndUpload };
};
