// src/components/LeftSidebar/LeftSidebar.tsx

import React, { useCallback, useState } from 'react';
import SyncIcon from '@mui/icons-material/Sync';
import Tooltip from '@mui/material/Tooltip';
import Modal from '../Modal';
import LeftSidebarToggleButton from './LeftSidebarToggleButton';
import AccountButton from './AccountButton';
import LeftSidebarButtons from './LeftSidebarButtons';
import LeftSidebarTree from './LeftSidebarTree';
import useData from '../../hooks/useData';
import useUI from '../../hooks/useUI';
import { ItemType } from '../../contexts/DataContext';

interface LeftSidebarProps {
  userTier: string;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ userTier }) => {
  const { addItem, fileTreeData, isSyncing, locations } = useData();

  const {
    isSidebarCollapsed,
    toggleSidebar,
    setErrorMessage,
    setShowAccountActions,
  } = useUI();

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    configItem: null,
    modalInputs: {},
    uploadedFiles: [],
    isProcessing: false,
  });

  const openModal = (
    title: string,
    configItem: ConfigItem,
    uploadedFiles: File[] = [],
  ) => {
    if (configItem.modalFields && configItem.modalFields.length > 0) {
      setModalState({
        isOpen: true,
        title,
        configItem,
        modalInputs: {},
        uploadedFiles,
        isProcessing: false,
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
      isProcessing: false,
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

  const handleModalSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const { configItem, modalInputs } = modalState;

    setModalState((prev) => ({
      ...prev,
      isProcessing: true,
    }));

    try {
      if (configItem?.processFunctionType) {
        await addItem(configItem.processFunctionType, modalInputs);
        setErrorMessage('');
      } else if (configItem?.processFileFunction) {
        // Handle file processing if needed
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setModalState((prev) => ({
        ...prev,
        isProcessing: false,
      }));
      closeModal();
    }
  };

  const handleCreateSamplingEvent = useCallback(() => {
    const configItem: ConfigItem = {
      id: 'create-samplingEvent',
      modalFields: [
        { name: 'collectionDate', label: 'Collection Date', type: 'date' },
        {
          name: 'locCharId',
          label: 'Location',
          type: 'select',
          options: locations.map((loc) => ({
            value: loc.char_id,
            label: loc.label,
          })),
        },
      ],
      processFunctionType: 'samplingEvent',
    };

    openModal('Create New Sampling Event', configItem);
  }, [locations]);

  const handleCreateFolder = useCallback(() => {
    const configItem: ConfigItem = {
      id: 'create-folder',
      modalFields: [{ name: 'name', label: 'Folder Name', type: 'text' }],
      processFunctionType: 'folder',
    };

    openModal('Create New Folder', configItem);
  }, []);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <LeftSidebarToggleButton toggleSidebar={toggleSidebar} />

      {/* Syncing Status Icon */}
      <div className="left-sidebar__sync-status-icon">
        <Tooltip title={isSyncing ? 'Syncing data...' : 'All changes saved'}>
          <SyncIcon
            className={isSyncing ? 'syncing' : ''}
            style={{
              fontSize: 24,
              fill: isSyncing ? '#f44336' : '#4caf50',
            }}
          />
        </Tooltip>
      </div>

      {/* Sidebar Container */}
      <div className={`left-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Account Button */}
        <AccountButton setShowAccountActions={setShowAccountActions} />

        {/* Buttons to Create Sampling Events and Folders */}
        <LeftSidebarButtons
          isSidebarCollapsed={isSidebarCollapsed}
          onCreateSamplingEvent={handleCreateSamplingEvent}
          onCreateFolder={handleCreateFolder}
        />
        {/* Tree View of Files and Folders */}
        <LeftSidebarTree />
      </div>

      {/* Modal for Creating Sampling Events and Folders */}
      {modalState.isOpen && modalState.configItem && (
        <Modal
          isOpen={modalState.isOpen}
          title={modalState.title}
          onClose={closeModal}
          modalFields={modalState.configItem.modalFields}
          modalInputs={modalState.modalInputs}
          handleModalChange={handleModalChange}
          handleModalSubmit={handleModalSubmit}
          isProcessing={modalState.isProcessing}
        />
      )}
    </>
  );
};

export default LeftSidebar;
