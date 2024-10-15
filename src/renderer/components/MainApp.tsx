// src/renderer/components/MainApp.tsx

import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar/Sidebar';
import DropBoxes from './DropBoxes/DropBoxes';
import ConfirmDialog from './ConfirmDialog';
import ContextMenu from './ContextMenu';
import ErrorBoundary from './ErrorBoundary';
import useAuth from '../hooks/useAuth';
import useData from '../hooks/useData';
import useUI from '../hooks/useUI';
import AccountActions from './Account/AccountActions';

const MainApp: React.FC = () => {
  // Authentication hooks
  const {
    errorMessage,
    userTier,
    setErrorMessage: setGlobalErrorMessage,
  } = useAuth();

  // Data hooks
  const {
    fileTreeData,
    samplingEventData,
    setFileTreeData,
    setSamplingEventData,
    addItem,
    deleteItem, // Retrieved from useData
  } = useData();

  // UI hooks
  const {
    selectedItem,
    setSelectedItem,
    contextMenuState,
    setContextMenuState,
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
      if (selectedItem?.type === 'samplingEvent') {
        const samplingEventId = selectedItem.id;
        const existingSamplingEvent = samplingEventData[samplingEventId] || {
          id: samplingEventId,
          name: selectedItem.text,
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
    [selectedItem, samplingEventData, setSamplingEventData],
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
        setLocalErrorMessage('');
      } catch (error: any) {
        console.error('Error deleting item:', error);
        setLocalErrorMessage(error.message || 'Failed to delete the item.');
      }
    },
    [deleteItem],
  );

  // Determine the item name to display in the header
  let itemName = 'Welcome';
  if (selectedItem) {
    if (selectedItem.type === 'samplingEvent') {
      const { text } = selectedItem;
      itemName = text;
    } else {
      itemName = selectedItem.text;
    }
  }

  const samplingEventId =
    selectedItem && selectedItem.type === 'samplingEvent'
      ? selectedItem.id
      : null;
  const samplingEvent = samplingEventId
    ? samplingEventData[samplingEventId]
    : null;
  const uploadedData = samplingEvent?.data || {};

  return (
    <div id="app">
      <ErrorBoundary>
        {/* Sidebar Component */}
        <Sidebar userTier={userTier} />

        {/* Main Content Area */}
        <div className="main-content">
          <div className="content-header">
            <h2 id="item-name">{itemName}</h2>
          </div>
          <div className="content-body">
            {samplingEventId ? (
              <>
                {localErrorMessage && (
                  <div className="error-message">{localErrorMessage}</div>
                )}
                <DropBoxes
                  onDataProcessed={handleDataProcessed}
                  samplingEventName={itemName}
                  onError={setLocalErrorMessage}
                  uploadedData={uploadedData}
                />
              </>
            ) : (
              <p className="content-body__text">
                Select a sampling event from the sidebar to view details.
              </p>
            )}
          </div>

          {showAccountActions && <AccountActions />}
        </div>

        {/* Confirm Dialog for Deletion */}
        <ConfirmDialog
          confirmState={confirmState}
          setConfirmState={setConfirmState}
        />

        {/* Context Menu for Tree Items */}
        <ContextMenu
          contextMenuState={contextMenuState}
          setContextMenuState={setContextMenuState}
          deleteItem={handleDeleteItem}
          userTier={userTier}
        />

        {/* Global Error Message */}
        {errorMessage && (
          <div className="global-error-message">{errorMessage}</div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default MainApp;
