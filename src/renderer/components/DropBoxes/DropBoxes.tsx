// src/renderer/components/DropBoxes/DropBoxes.tsx

import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Search as SearchOutlinedIcon,
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { Box, Typography } from '@mui/material';
import Modal from '../Modal';
import dropboxConfig, { DropboxConfigItem } from '../../config/dropboxConfig';
import styles from './DropBoxes.module.css';
import useAuth from '../../hooks/useAuth';
import supabase from '../../utils/supabaseClient';
import useUI from '../../hooks/useUI';
import { useProcessAndUpload } from '../../hooks/useProcessAndUpload.ts';
import DataTable from '../DataTable';

interface Sample {
  id: string;
  name: string;
  sampling_event_id: string;
  org_id: string;
  user_id: string;
  date: string;
  collected_datetime_local: string;
  storage_folder: string;
  [key: string]: any;
}

interface SamplingEvent {
  id: string;
  name: string;
  date: string;
  loc_id: string; // Added loc_id
  [key: string]: any;
}

interface SampleLocation {
  id: string;
  name: string;
  lat: number;
  long: number;
  [key: string]: any;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  type: 'input' | 'data';
  configItem?: DropboxConfigItem;
  modalInputs?: Record<string, string>;
  uploadedFiles?: File[];
  data?: any;
}

interface DropBoxesProps {
  onDataProcessed: (output: any, configItem: DropboxConfigItem) => void;
  onError: (message: string) => void;
}

interface DropBoxProps {
  configItem: DropboxConfigItem;
  isProcessing: boolean;
  hasData: boolean;
  isLocked: boolean;
  openModal: (
    title: string,
    configItem: DropboxConfigItem,
    uploadedFiles?: File[],
  ) => void;
  setProcessingState: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  sample: Sample;
  onDataProcessed: (
    insertData: any,
    configItem: DropboxConfigItem,
    processedData: any,
  ) => void;
  onError: (message: string) => void;
  uploadedDataItem: any;
  openDataModal: (title: string, data: any) => void;
}

const DropBox: React.FC<DropBoxProps> = ({
  configItem,
  isProcessing,
  hasData,
  isLocked,
  openModal,
  setProcessingState,
  sample,
  onDataProcessed,
  onError,
  uploadedDataItem,
  openDataModal,
}) => {
  const { processAndUpload } = useProcessAndUpload();

  const onDrop = async (acceptedFiles: File[]) => {
    if (!sample?.storage_folder) {
      onError('Storage path not found for this sample.');
      return;
    }

    setProcessingState((prev) => ({
      ...prev,
      [configItem.id]: true,
    }));

    await processAndUpload({
      functionName: configItem.processFunctionName,
      sample,
      modalInputs: {},
      uploadedFiles: acceptedFiles,
      configItem,
      onDataProcessed,
      onError,
    });

    setProcessingState((prev) => ({
      ...prev,
      [configItem.id]: false,
    }));
  };

  const accept = configItem.expectedFileTypes || undefined;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    disabled: isProcessing || isLocked,
  });

  const handleDataClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDataModal(configItem.label, uploadedDataItem?.data);
  };

  let IconComponent: React.ReactNode;
  if (isLocked) {
    IconComponent = <LockIcon className={styles.dropBoxIcon} />;
  } else if (isProcessing) {
    IconComponent = (
      <CircularProgress className={styles.dropBoxCircularProgress} />
    );
  } else if (hasData) {
    IconComponent = (
      <Box className={styles.dropBoxIconSuccess}>
        <CheckCircleIcon className={styles.dropBoxIconSuccess} />
        <Tooltip title="View Data">
          <SearchOutlinedIcon
            className={`${styles.dropBoxIconSuccess} ${styles.magnifyIcon}`}
            onClick={handleDataClick}
          />
        </Tooltip>
      </Box>
    );
  } else {
    IconComponent = <AddIcon className={styles.dropBoxIcon} />;
  }

  const dropBoxContent = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography variant="subtitle1" className={styles.dropBoxLabel}>
        {configItem.label}
      </Typography>
      {IconComponent}
    </Box>
  );

  const handleClick = () => {
    if (isLocked) return;
    if (configItem.isModalInput) {
      openModal(configItem.label, configItem);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isLocked) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (configItem.isModalInput) {
        openModal(configItem.label, configItem);
      }
    }
  };

  const lockedTooltipMessage =
    'Unable to perform this action, please contact your organization lead';

  if (configItem.isModalInput || isLocked) {
    return (
      <Tooltip
        title={isLocked ? lockedTooltipMessage : ''}
        disableHoverListener={!isLocked}
        arrow
      >
        <span style={{ width: '100%' }}>
          <Box
            className={`${styles.dropBox} ${
              isLocked ? styles.dropBoxDisabled : ''
            }`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            sx={{
              borderColor: 'grey.400',
              pointerEvents: isLocked ? 'none' : 'auto',
              height: 150,
            }}
          >
            {dropBoxContent}
          </Box>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={
        isProcessing
          ? 'Processing your files...'
          : hasData
            ? 'Click on the magnifying glass to view uploaded data'
            : 'Drag and drop files here or click to upload'
      }
      arrow
    >
      <span style={{ width: '100%' }}>
        <Box
          {...getRootProps()}
          className={styles.dropBox}
          sx={{
            borderColor: isDragActive ? 'primary.main' : 'grey.400',
            pointerEvents: isProcessing || isLocked ? 'none' : 'auto',
            height: 150,
          }}
        >
          <input {...getInputProps()} />
          {dropBoxContent}
        </Box>
      </span>
    </Tooltip>
  );
};

const DropBoxes: React.FC<DropBoxesProps> = ({ onDataProcessed, onError }) => {
  const { subscriptionLevel } = useAuth();
  const { selectedLeftItem } = useUI();
  const sample = selectedLeftItem?.data as Sample;

  const [samplingEvent, setSamplingEvent] = useState<SamplingEvent | null>(
    null,
  );
  const [sampleLocation, setSampleLocation] = useState<SampleLocation | null>(
    null,
  );

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    type: 'input',
    modalInputs: {},
  });

  const [processingState, setProcessingState] = useState<
    Record<string, boolean>
  >({});
  const [uploadedData, setUploadedData] = useState<Record<string, any>>({});

  const { processAndUpload } = useProcessAndUpload();

  useEffect(() => {
    if (!sample) return;

    const fetchSamplingEventAndLocation = async () => {
      // Fetch the samplingEvent that the sample belongs to
      const { data: samplingEventData, error: samplingEventError } =
        await supabase
          .from('sampling_event_metadata')
          .select('*')
          .eq('sample_id', sample.name)
          .single();

      if (samplingEventError) {
        console.error('Error fetching sampling event:', samplingEventError);
        return;
      }

      const samplingEvent = samplingEventData as SamplingEvent;
      setSamplingEvent(samplingEvent);

      // Fetch the sample location using loc_id from samplingEvent
      if (samplingEvent.loc_id) {
        const { data: locationData, error: locationError } = await supabase
          .from('sample_locations')
          .select('*')
          .eq('id', samplingEvent.loc_id)
          .single();

        if (locationError) {
          console.error('Error fetching sample location:', locationError);
          return;
        }

        setSampleLocation(locationData as SampleLocation);
      } else {
        console.warn('No loc_id found in sampling event');
      }
    };

    fetchSamplingEventAndLocation();

    const sampleId = sample.name;

    const fetchAndSetProcessedData = async () => {
      const { data, error } = await supabase
        .from('sample_metadata')
        .select('*')
        .eq('sample_id', sampleId);

      if (error) {
        console.error('Error fetching processed data:', error);
        return;
      }

      const uploadedDataMap: Record<string, any> = {};

      for (const item of data) {
        const configItem = dropboxConfig.find(
          (config) => config.id === item.data_type,
        );
        if (configItem) {
          const storagePath = item.storage_path;

          const { data: fileData, error: downloadError } =
            await supabase.storage.from('processed-data').download(storagePath);

          if (downloadError) {
            console.error('Error downloading file:', downloadError);
            continue;
          }

          const fileText = await fileData.text();
          const fileJson = JSON.parse(fileText);

          uploadedDataMap[configItem.id] = {
            ...item,
            data: fileJson,
          };
        }
      }

      setUploadedData(uploadedDataMap);
    };

    fetchAndSetProcessedData();
  }, [sample]);

  const openModal = (
    title: string,
    configItem: DropboxConfigItem,
    uploadedFiles: File[] = [],
  ) => {
    if (configItem.modalFields && configItem.modalFields.length > 0) {
      // Create a copy of modalFields and add lat, long, and date fields
      const extendedModalFields = [
        ...configItem.modalFields,
        // Add date field
        {
          name: 'date',
          label: 'Date',
          type: 'date',
          tooltip: 'Date of the sample',
        },
        // Add latitude field
        {
          name: 'lat',
          label: 'Latitude',
          type: 'number',
          tooltip: 'Latitude of the sample location',
        },
        // Add longitude field
        {
          name: 'long',
          label: 'Longitude',
          type: 'number',
          tooltip: 'Longitude of the sample location',
        },
      ];

      // Initialize modalInputs with default values from samplingEvent and sampleLocation
      const initialModalInputs: Record<string, string> = {
        date: samplingEvent?.date || '',
        lat: sampleLocation?.lat?.toString() || '',
        long: sampleLocation?.long?.toString() || '',
      };

      setModalState({
        isOpen: true,
        title,
        type: 'input',
        configItem: {
          ...configItem,
          modalFields: extendedModalFields,
        },
        modalInputs: initialModalInputs,
        uploadedFiles,
      });
    }
  };

  const openDataModal = (title: string, data: any) => {
    setModalState({
      isOpen: true,
      title: `Data for ${title}`,
      type: 'data',
      data,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      title: '',
      type: 'input',
      configItem: undefined,
      modalInputs: {},
      uploadedFiles: [],
      data: null,
    });
  };

  const handleModalChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setModalState((prevState) => ({
      ...prevState,
      modalInputs: {
        ...prevState.modalInputs,
        [name]: value,
      },
    }));
  };

  const handleDataProcessed = (
    insertData: any,
    configItem: DropboxConfigItem,
    processedData: any,
  ) => {
    setUploadedData((prev) => ({
      ...prev,
      [configItem.id]: {
        ...insertData[0],
        data: processedData.data,
      },
    }));
    onError('');
  };

  const handleModalSubmit = async () => {
    const { configItem, modalInputs, uploadedFiles } = modalState;

    if (!configItem || !sample) return;

    if (!sample.storage_folder) {
      onError('Storage path not found for this sample.');
      return;
    }

    setProcessingState((prev) => ({
      ...prev,
      [configItem.id]: true,
    }));

    await processAndUpload({
      functionName: configItem.processFunctionName,
      sample,
      modalInputs: modalInputs || {},
      uploadedFiles: uploadedFiles || [],
      configItem,
      onDataProcessed: handleDataProcessed,
      onError,
    });

    setProcessingState((prev) => ({
      ...prev,
      [configItem.id]: false,
    }));
    closeModal();
  };

  return (
    <Box className={styles.dropBoxes}>
      {!sample ? (
        <Typography>Please select a sample to view DropBoxes.</Typography>
      ) : (
        dropboxConfig.map((configItem) => {
          if (!configItem || !configItem.isEnabled) {
            return null;
          }

          const isProcessing = processingState[configItem.id];
          const hasData = uploadedData && uploadedData[configItem.id];

          const requiredLevel = configItem.requiredSubscriptionLevel ?? 0;
          const isLocked = subscriptionLevel < requiredLevel;

          return (
            <Box
              key={configItem.id}
              sx={{ width: { xs: '100%', sm: '48%', md: '31%' }, mb: 2 }}
            >
              <DropBox
                configItem={configItem}
                isProcessing={isProcessing}
                hasData={!!hasData}
                isLocked={isLocked}
                openModal={openModal}
                setProcessingState={setProcessingState}
                sample={sample}
                onDataProcessed={handleDataProcessed}
                onError={onError}
                uploadedDataItem={uploadedData[configItem.id]}
                openDataModal={openDataModal}
              />
            </Box>
          );
        })
      )}

      {modalState.isOpen && (
        <Modal
          isOpen={modalState.isOpen}
          title={modalState.title}
          onClose={closeModal}
          modalFields={modalState.configItem?.modalFields}
          modalInputs={modalState.modalInputs}
          handleModalChange={handleModalChange}
          handleModalSubmit={handleModalSubmit}
        >
          {modalState.type === 'data' && modalState.data ? (
            <DataTable data={modalState.data} />
          ) : null}
        </Modal>
      )}
    </Box>
  );
};

export default DropBoxes;
