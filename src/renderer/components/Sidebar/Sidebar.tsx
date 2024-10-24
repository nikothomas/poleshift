// src/renderer/components/Sidebar/Sidebar.tsx

import React, { useCallback, useState } from 'react';
import Modal from '../Modal';
import SidebarToggleButton from './SidebarToggleButton';
import AccountButton from './AccountButton';
import SidebarButtons from './SidebarButtons';
import SidebarTree from './SidebarTree';
import useData from '../../hooks/useData';
import useUI from '../../hooks/useUI';
import { processFunctions } from '../../utils/sidebarFunctions';
import { sampleLocations } from '../../config/sampleLocationsConfig.ts';
import './Sidebar.css';

// Define the shape of the modal state for better type safety
interface ModalState {
  isOpen: boolean;
  title: string;
  configItem: ConfigItem | null;
  modalInputs: Record<string, string>;
  uploadedFiles: File[];
  isProcessing: boolean;
}

// Define the ConfigItem interface for better type safety
interface ConfigField {
  name: string;
  label: string;
  type: string;
  options?: string[]; // Add options if needed for select fields
}

interface ConfigItem {
  id: string;
  modalFields: ConfigField[];
  processFunction?: keyof typeof processFunctions;
  processFileFunction?: string; // If applicable
}

const Sidebar: React.FC = () => {
  // Use the useData hook to access addItem, fileTreeData, and setFileTreeData
  const { addItem, fileTreeData, setFileTreeData } = useData();

  // Use the useUI hook to access UI-related state and actions
  const {
    isSidebarCollapsed,
    toggleSidebar,
    setErrorMessage,
    setShowAccountActions,
  } = useUI();

  // Manage the state of the modal
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    configItem: null,
    modalInputs: {},
    uploadedFiles: [],
    isProcessing: false,
  });

  /**
   * Opens the modal with the specified configuration
   * @param title - The title of the modal
   * @param configItem - Configuration object containing modal fields and processing function
   * @param uploadedFiles - Optional array of uploaded files
   */
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

  /**
   * Closes the modal and resets its state
   */
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

  /**
   * Handles input changes within the modal
   * @param e - The change event from the input elements
   */
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

  /**
   * Handles form submission within the modal
   * Utilizes the addItem function from DataContext to add new items
   * @param e - The form submission event
   */
  const handleModalSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const { configItem, modalInputs } = modalState;

    setModalState((prev) => ({
      ...prev,
      isProcessing: true,
    }));

    try {
      if (configItem?.processFunction) {
        // Use addItem from DataContext to handle adding items
        await addItem(configItem.processFunction, modalInputs);
        // Clear any global error messages if applicable
        setErrorMessage('');
      } else if (configItem?.processFileFunction) {
        // Handle file processing if needed
        // Example:
        // await addFile(configItem.processFileFunction, modalInputs, uploadedFiles);
      }
    } catch (error: any) {
      // Handle errors by setting an error message
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setModalState((prev) => ({
        ...prev,
        isProcessing: false,
      }));
      closeModal();
    }
  };

  /**
   * Initiates the creation of a new sample by opening the modal
   */
  const handleCreateSample = useCallback(() => {
    const configItem: ConfigItem = {
      id: 'create-sample',
      modalFields: [
        { name: 'collectionDate', label: 'Collection Date', type: 'date' },
        {
          name: 'locCharId',
          label: 'Location',
          type: 'select',
          options: sampleLocations
            .filter((location) => location.isEnabled)
            .map((location) => ({
              value: location.char_id, // Use 'char_id' as the value
              label: location.label,
            })),
        },
      ],
      processFunction: 'sample',
    };

    openModal('Create New Sample', configItem);
  }, [openModal]);

  /**
   * Initiates the creation of a new folder by opening the modal
   */
  const handleCreateFolder = useCallback(() => {
    const configItem: ConfigItem = {
      id: 'create-folder',
      modalFields: [{ name: 'name', label: 'Folder Name', type: 'text' }],
      processFunction: 'processCreateFolder',
    };

    openModal('Create New Folder', configItem);
  }, []);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <SidebarToggleButton toggleSidebar={toggleSidebar} />

      {/* Sidebar Container */}
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Account Button */}
        <AccountButton setShowAccountActions={setShowAccountActions} />

        {/* Buttons to Create Samples and Folders */}
        <SidebarButtons
          isSidebarCollapsed={isSidebarCollapsed}
          onCreateSample={handleCreateSample}
          onCreateFolder={handleCreateFolder}
        />
        {/* Tree View of Files and Folders */}
        <SidebarTree
          treeData={fileTreeData}
          setTreeData={setFileTreeData} // Ensure setTreeData is passed correctly
        />
      </div>

      {/* Modal for Creating Samples and Folders */}
      {modalState.isOpen && modalState.configItem && (
        <Modal
          isOpen={modalState.isOpen}
          title={modalState.title}
          onClose={closeModal}
          modalFields={modalState.configItem.modalFields}
          modalInputs={modalState.modalInputs}
          handleModalChange={handleModalChange}
          handleModalSubmit={handleModalSubmit}
          // Optionally, you can pass `isProcessing` to disable inputs or show a loader
        />
      )}
    </>
  );
};

export default Sidebar;
