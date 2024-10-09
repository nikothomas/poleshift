// src/renderer/components/DropBoxes/DropBoxes.tsx

import React, { useState, useContext } from 'react';
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
import useAuth from '../../hooks/useAuth'; // Import the CSS Module

interface ModalState {
  isOpen: boolean;
  title: string;
  configItem: DropboxConfigItem | null;
  modalInputs: Record<string, string>;
  uploadedFiles: File[];
}

interface DataModalState {
  isOpen: boolean;
  title: string;
  data: any;
}

interface DropBoxesProps {
  onDataProcessed: (output: any, configItem: DropboxConfigItem) => void;
  sampleName: string;
  onError: (message: string) => void;
  uploadedData: Record<string, any>;
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
  sampleName: string;
  onDataProcessed: (output: any, configItem: DropboxConfigItem) => void;
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
                                           sampleName,
                                           onDataProcessed,
                                           onError,
                                           uploadedDataItem,
                                           openDataModal,
                                         }) => {
  const onDrop = async (acceptedFiles: File[]) => {
    setProcessingState((prev) => ({
      ...prev,
      [configItem.id]: true,
    }));
    try {
      const functionName = configItem.processFunctionName;
      const response = await window.electron.processFunction(
        functionName,
        sampleName,
        {}, // No modal inputs for file uploads
        acceptedFiles,
      );
      if (response.success) {
        onDataProcessed(response.result, configItem);
        onError('');
      } else {
        throw new Error(response.message || 'Processing failed');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('An unknown error occurred.');
      }
    } finally {
      setProcessingState((prev) => ({
        ...prev,
        [configItem.id]: false,
      }));
    }
  };

  const accept = configItem.expectedFileTypes || undefined;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    disabled: isProcessing || isLocked,
  });

  const handleDataClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the parent onClick event
    openDataModal(configItem.label, uploadedDataItem.data);
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
    if (isLocked) {
      return;
    }
    if (configItem.isModalInput) {
      openModal(configItem.label, configItem);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isLocked) {
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (configItem.isModalInput) {
        openModal(configItem.label, configItem);
      }
    }
  };

  // Define tooltip message for locked DropBoxes
  const lockedTooltipMessage =
    'Upgrade your subscription to access this feature';

  // Conditional rendering based on whether the DropBox is a modal input or locked
  if (configItem.isModalInput || isLocked) {
    return (
      <Tooltip
        title={isLocked ? lockedTooltipMessage : ''}
        disableHoverListener={!isLocked}
        arrow
      >
        {/* Wrapping with a span to enable Tooltip on disabled elements */}
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
              borderColor: 'grey.400', // Simplified border color
              pointerEvents: isLocked ? 'none' : 'auto', // Disable interactions if locked
              height: 150, // Fixed height for uniformity
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
      {/* Wrapping with a span to ensure Tooltip works even when the Box is disabled */}
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

const DropBoxes: React.FC<DropBoxesProps> = ({
                                               onDataProcessed,
                                               sampleName,
                                               onError,
                                               uploadedData,
                                             }) => {
  const { subscriptionLevel } = useAuth(); // Use the custom hook here
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    configItem: null,
    modalInputs: {},
    uploadedFiles: [],
  });

  const [processingState, setProcessingState] = useState<
    Record<string, boolean>
  >({});

  // New state for data modal
  const [dataModalState, setDataModalState] = useState<DataModalState>({
    isOpen: false,
    title: '',
    data: null,
  });

  const openModal = (
    title: string,
    configItem: DropboxConfigItem,
    uploadedFiles: File[] = [],
  ) => {
    if (configItem.modalFields && configItem.modalFields.length > 0) {
      setModalState({
        isOpen: true,
        title,
        configItem,
        modalInputs: {},
        uploadedFiles,
      });
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      title: '',
      configItem: null,
      modalInputs: {},
      uploadedFiles: [],
    });
  };

  const openDataModal = (title: string, data: any) => {
    setDataModalState({
      isOpen: true,
      title,
      data,
    });
  };

  const closeDataModal = () => {
    setDataModalState({
      isOpen: false,
      title: '',
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

  const handleModalSubmit = async () => {
    const { configItem, modalInputs, uploadedFiles } = modalState;

    if (!configItem) return;

    setProcessingState((prev) => ({
      ...prev,
      [configItem.id]: true,
    }));

    try {
      const functionName = configItem.processFunctionName;
      const response = await window.electron.processFunction(
        functionName,
        sampleName,
        modalInputs,
        uploadedFiles,
      );
      if (response.success) {
        onDataProcessed(response.result, configItem);
        onError('');
      } else {
        throw new Error(response.message || 'Processing failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        onError(error.message);
      } else {
        console.error(error);
        onError('An unknown error occurred.');
      }
    } finally {
      setProcessingState((prev) => ({
        ...prev,
        [configItem.id]: false,
      }));
      closeModal();
    }
  };

  // Helper function to render data table
  const renderDataTable = (data: any) => {
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return <Typography>No data available</Typography>;
      }
      const headers = Object.keys(data[0]);
      return (
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <Box component="thead">
            <Box component="tr">
              {headers.map((key) => (
                <Box
                  component="th"
                  key={key}
                  sx={{
                    border: '1px solid #ddd',
                    padding: 1,
                    textAlign: 'left',
                    backgroundColor: 'grey.200',
                  }}
                >
                  {key}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {data.map((item: any, index: number) => (
              <Box component="tr" key={index}>
                {headers.map((key) => (
                  <Box
                    component="td"
                    key={key}
                    sx={{
                      border: '1px solid #ddd',
                      padding: 1,
                    }}
                  >
                    {String(item[key])}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      );
    }
    if (typeof data === 'object' && data !== null) {
      return (
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <Box component="tbody">
            {Object.entries(data).map(([key, value], index) => (
              <Box component="tr" key={index}>
                <Box
                  component="th"
                  sx={{
                    border: '1px solid #ddd',
                    padding: 1,
                    textAlign: 'left',
                    backgroundColor: 'grey.200',
                  }}
                >
                  {key}
                </Box>
                <Box
                  component="td"
                  sx={{
                    border: '1px solid #ddd',
                    padding: 1,
                  }}
                >
                  {String(value)}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      );
    }
    return <Typography>{String(data)}</Typography>;
  };

  return (
    <Box className={styles.dropBoxes}>
      {dropboxConfig.map((configItem: DropboxConfigItem | undefined) => {
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
            sx={{ width: { xs: '100%', sm: '48%', md: '31%' } }}
          >
            <DropBox
              configItem={configItem}
              isProcessing={isProcessing}
              hasData={hasData}
              isLocked={isLocked}
              openModal={openModal}
              setProcessingState={setProcessingState}
              sampleName={sampleName}
              onDataProcessed={onDataProcessed}
              onError={onError}
              uploadedDataItem={uploadedData[configItem.id]}
              openDataModal={openDataModal}
            />
          </Box>
        );
      })}

      {/* Modal for input fields */}
      {modalState.isOpen && modalState.configItem && (
        <Modal
          isOpen={modalState.isOpen}
          title={modalState.title}
          onClose={closeModal}
          modalFields={modalState.configItem.modalFields}
          modalInputs={modalState.modalInputs}
          handleModalChange={handleModalChange}
          handleModalSubmit={handleModalSubmit}
        />
      )}

      {/* Modal for displaying data */}
      {dataModalState.isOpen && (
        <Modal
          isOpen={dataModalState.isOpen}
          title={`Data for ${dataModalState.title}`}
          onClose={closeDataModal}
        >
          {dataModalState.data ? (
            renderDataTable(dataModalState.data)
          ) : (
            <Typography>No data available</Typography>
          )}
        </Modal>
      )}
    </Box>
  );
};

export default DropBoxes;
