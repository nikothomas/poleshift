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
import { getDescendantIds } from '../utils/treeUtils';

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
    sampleData,
    setFileTreeData,
    setSampleData,
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
      if (selectedItem?.type === 'sample') {
        const sampleId = selectedItem.id;
        const existingSample = sampleData[sampleId] || {
          id: sampleId,
          name: selectedItem.data.name,
          data: {},
          reports: [],
        };
        const newSampleData = {
          ...sampleData,
          [sampleId]: {
            ...existingSample,
            data: {
              ...existingSample.data,
              [configItem.id]: data,
            },
          },
        };
        setSampleData(newSampleData);
        setLocalErrorMessage('');
      } else {
        console.error('No sample selected or selected item is not a sample.');
        setLocalErrorMessage('Please select a sample before uploading data.');
      }
    },
    [selectedItem, sampleData, setSampleData],
  );

  /**
   * Function to delete an item from the tree and sample data
   * @param itemId - The ID of the item to delete
   */
  const deleteItem = (itemId: string) => {
    // Remove item from hierarchical tree data
    const removeItem = (items: any[], idToRemove: string): any[] => {
      return items
        .filter((item) => item.id !== idToRemove)
        .map((item) => {
          if (item.children) {
            return { ...item, children: removeItem(item.children, idToRemove) };
          }
          return item;
        });
    };

    const updatedTreeData = removeItem(fileTreeData, itemId);
    setFileTreeData(updatedTreeData);

    // Also remove from sampleData if necessary
    const descendantIds = getDescendantIds(fileTreeData, itemId);
    const idsToRemove = [itemId, ...descendantIds];

    const newSampleData = { ...sampleData };
    idsToRemove.forEach((id) => {
      if (newSampleData[id]) {
        delete newSampleData[id];
      }
    });
    setSampleData(newSampleData);

    if (selectedItem && idsToRemove.includes(selectedItem.id)) {
      setSelectedItem(null);
    }
  };

  // Determine the item name to display in the header
  let itemName = 'Welcome';
  if (selectedItem) {
    if (selectedItem.type === 'sample') {
      const { name } = selectedItem.data;
      itemName = name;
    } else {
      itemName = selectedItem.text;
    }
  }

  const sampleId =
    selectedItem && selectedItem.type === 'sample' ? selectedItem.id : null;
  const sample = sampleId ? sampleData[sampleId] : null;
  const uploadedData = sample?.data || {};

  return (
    <div id="app">
      <ErrorBoundary>
        {/* Sidebar Component */}
        <Sidebar
          userTier={userTier}
        />

        {/* Main Content Area */}
        <div className="main-content">
          <div className="content-header">
            <h2 id="item-name">{itemName}</h2>
          </div>
          <div className="content-body">
            {sampleId ? (
              <>
                {localErrorMessage && (
                  <div className="error-message">{localErrorMessage}</div>
                )}
                <DropBoxes
                  onDataProcessed={handleDataProcessed}
                  sampleName={itemName}
                  onError={setLocalErrorMessage}
                  uploadedData={uploadedData}
                />
              </>
            ) : (
              <p className="content-body__text">
                Select a sample from the sidebar to view details.
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
          deleteItem={deleteItem}
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
