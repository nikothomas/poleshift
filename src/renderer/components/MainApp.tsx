// src/renderer/components/MainApp.tsx

import React, { useState, useCallback, useEffect } from 'react';
import LeftSidebar from './LeftSidebar/LeftSidebar';
import ConfirmDialog from './ConfirmDialog';
import ContextMenu from './ContextMenu';
import ErrorBoundary from './ErrorBoundary';
import useAuth from '../hooks/useAuth';
import useData from '../hooks/useData';
import useUI from '../hooks/useUI';
import AccountActions from './Account/AccountActions';
import GlobeComponent from './GlobeComponent';
import RightSidebar from './RightSidebar';
import DropBoxes from './DropBoxes/DropBoxes';
import ErrorMessage from './ErrorMessage'; // Corrected import path

const MainApp: React.FC = () => {
  // Authentication hooks
  const {
    errorMessage,
    userTier,
    setErrorMessage: setGlobalErrorMessage,
  } = useAuth();

  // Data hooks
  const {
    samplingEventData,
    setSamplingEventData,
    deleteItem,
  } = useData();

  // UI hooks
  const {
    selectedLeftItem,
    setSelectedLeftItem,
    contextMenuState,
    confirmState,
    setConfirmState,
    showAccountActions,
  } = useUI();

  // Local state for error messages
  const [localErrorMessage, setLocalErrorMessage] = useState<string>('');

  /**
   * Function to handle processed data upload
   * @param data - The processed data
   * @param configItem - Configuration item associated with the data
   */
  const handleDataProcessed = useCallback(
    (data: any, configItem: any) => {
      if (selectedLeftItem?.type === 'samplingEvent') {
        const samplingEventId = selectedLeftItem.id;
        const existingSamplingEvent = samplingEventData[samplingEventId] || {
          id: samplingEventId,
          name: selectedLeftItem.text,
          data: {},
        };

        const newSamplingEventData = {
          ...samplingEventData,
          [samplingEventId]: {
            ...existingSamplingEvent,
            data: {
              ...existingSamplingEvent.data,
              [configItem.id]: data,
            },
          },
        };

        setSamplingEventData(newSamplingEventData);
        setLocalErrorMessage('');
      } else {
        console.error(
          'No sampling event selected or selected item is not a sampling event.',
        );
        setLocalErrorMessage(
          'Please select a sampling event before uploading data.',
        );
      }
    },
    [selectedLeftItem, samplingEventData, setSamplingEventData],
  );

  /**
   * Function to delete an item from the tree and sampling event data
   * Utilizes the deleteItem function from DataContext to handle deletion
   * @param itemId - The ID of the item to delete
   */
  const handleDeleteItem = useCallback(
    async (itemId: string) => {
      try {
        await deleteItem(itemId); // Delete from database and frontend
        // If the deleted item is the currently selected left item, clear it
        if (selectedLeftItem && selectedLeftItem.id === itemId) {
          setSelectedLeftItem(null);
        }
        setLocalErrorMessage('');
      } catch (error: any) {
        console.error('Error deleting item:', error);
        setLocalErrorMessage(error.message || 'Failed to delete the item.');
      }
    },
    [deleteItem, selectedLeftItem, setSelectedLeftItem],
  );

  let itemName = null;
  if (selectedLeftItem) {
    itemName = selectedLeftItem.text;
  }

  const samplingEventId =
    selectedLeftItem && selectedLeftItem.type === 'samplingEvent'
      ? selectedLeftItem.id
      : null;
  const samplingEvent = samplingEventId
    ? samplingEventData[samplingEventId]
    : null;
  const uploadedData = samplingEvent?.data || {};

  // Function to determine which error message to display
  const getDisplayedErrorMessage = () => {
    if (errorMessage) {
      return {
        message: errorMessage,
        onClose: () => setGlobalErrorMessage(''),
        className: 'error-message', // Use a common class
      };
    } else if (localErrorMessage) {
      return {
        message: localErrorMessage,
        onClose: () => setLocalErrorMessage(''),
        className: 'error-message', // Use a common class
      };
    } else {
      return null;
    }
  };

  const displayedError = getDisplayedErrorMessage();

  // Auto-hide the displayed error message after 5 seconds
  useEffect(() => {
    if (displayedError) {
      const timer = setTimeout(() => {
        displayedError.onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [displayedError]);

  return (
    <div id="app">
      <ErrorBoundary>
        {/* App Container */}
        <div className="app-container">
          {/* Left Sidebar Component */}
          <LeftSidebar userTier={userTier} />

          {/* Main Content Area */}
          <div className="main-content">
            <div className="content-header">
              <h2 id="item-name">{itemName}</h2>
            </div>

            {/* Display the Error Message */}
            {displayedError && (
              <ErrorMessage
                message={displayedError.message}
                onClose={displayedError.onClose}
                className={displayedError.className}
              />
            )}

            <div className="content-body">
              {selectedLeftItem && selectedLeftItem.type === 'samplingEvent' ? (
                <DropBoxes
                  onDataProcessed={handleDataProcessed}
                  sampleId={samplingEventId} // Pass sampleId instead of sampleName
                  onError={setLocalErrorMessage}
                  uploadedData={uploadedData}
                />
              ) : (
                <GlobeComponent />
              )}
            </div>
          </div>

          {/* Include the RightSidebar */}
          <RightSidebar />
        </div>

        {showAccountActions && <AccountActions />}

        {/* Confirm Dialog for Deletion */}
        <ConfirmDialog
          confirmState={confirmState}
          setConfirmState={setConfirmState}
        />

        {/* Context Menu for Tree Items */}
        <ContextMenu deleteItem={handleDeleteItem} userTier={userTier} />
      </ErrorBoundary>
    </div>
  );
};

export default MainApp;
