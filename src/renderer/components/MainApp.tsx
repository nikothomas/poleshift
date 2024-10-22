// src/renderer/components/MainApp.tsx

import React, { useState, useCallback, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useData from '../hooks/useData';
import useUI from '../hooks/useUI';
import LeftSidebar from './LeftSidebar/LeftSidebar';
import RightSidebar from './RightSidebar';
import DropBoxes from './DropBoxes/DropBoxes';
import ErrorMessage from './ErrorMessage';
import GlobeComponent from './GlobeComponent';
import ConfirmDialog from './ConfirmDialog';
import ContextMenu from './ContextMenu';
import AccountActions from './Account/AccountActions';
import ErrorBoundary from './ErrorBoundary';
// import TestButton from './TestButton'; // Optional: For testing

const MainApp: React.FC = () => {
  const {
    errorMessage,
    userTier,
    setErrorMessage: setGlobalErrorMessage,
  } = useAuth();
  const { samplingEventData, setSamplingEventData, deleteItem } = useData();
  const {
    selectedLeftItem,
    setSelectedLeftItem,
    contextMenuState,
    confirmState,
    setConfirmState,
    showAccountActions,
  } = useUI();

  const [localErrorMessage, setLocalErrorMessage] = useState<string>('');

  const handleDataProcessed = useCallback(
    (data: any, configItem: any) => {
      if (selectedLeftItem?.type === 'samplingEvent') {
        const samplingEventId = selectedLeftItem.id;
        const existingEvent = samplingEventData[samplingEventId] || {
          id: samplingEventId,
          name: selectedLeftItem.text,
          data: {},
        };

        setSamplingEventData({
          ...samplingEventData,
          [samplingEventId]: {
            ...existingEvent,
            data: {
              ...existingEvent.data,
              [configItem.id]: data,
            },
          },
        });
        setLocalErrorMessage('');
      } else {
        setLocalErrorMessage(
          'Please select a sampling event before uploading data.',
        );
      }
    },
    [selectedLeftItem, samplingEventData, setSamplingEventData],
  );

  const handleDeleteItem = useCallback(
    async (itemId: string) => {
      try {
        await deleteItem(itemId);
        if (selectedLeftItem?.id === itemId) {
          setSelectedLeftItem(null);
        }
        setLocalErrorMessage('');
      } catch (error: any) {
        setLocalErrorMessage(error.message || 'Failed to delete the item.');
      }
    },
    [deleteItem, selectedLeftItem, setSelectedLeftItem],
  );

  const itemName = selectedLeftItem?.text || null;
  const samplingEventId =
    selectedLeftItem?.type === 'samplingEvent' ? selectedLeftItem.id : null;
  const samplingEvent = samplingEventId
    ? samplingEventData[samplingEventId]
    : null;
  const uploadedData = samplingEvent?.data || {};

  const displayedError = errorMessage || localErrorMessage;

  useEffect(() => {
    if (displayedError) {
      const timer = setTimeout(() => {
        errorMessage ? setGlobalErrorMessage('') : setLocalErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [displayedError, errorMessage, setGlobalErrorMessage]);

  return (
    <div id="app">
      <ErrorBoundary>
        <div className="app-container">
          <LeftSidebar userTier={userTier} />

          <div className="main-content">
            <div className="content-header">
              <h2 id="item-name">{itemName}</h2>
            </div>

            {displayedError && (
              <ErrorMessage
                message={displayedError}
                onClose={() =>
                  errorMessage
                    ? setGlobalErrorMessage('')
                    : setLocalErrorMessage('')
                }
                className="error-message"
              />
            )}

            <div className="content-body">
              {selectedLeftItem?.type === 'samplingEvent' ? (
                <DropBoxes
                  onDataProcessed={handleDataProcessed}
                  sampleId={samplingEventId!}
                  onError={setLocalErrorMessage}
                  uploadedData={uploadedData}
                />
              ) : (
                <>
                  <GlobeComponent />
                  {/* <TestButton /> */} {/* Optional: For testing */}
                </>
              )}
            </div>
          </div>

          <RightSidebar />
        </div>

        {showAccountActions && <AccountActions />}
        <ConfirmDialog
          confirmState={confirmState}
          setConfirmState={setConfirmState}
        />
        <ContextMenu deleteItem={handleDeleteItem} userTier={userTier} />
      </ErrorBoundary>
    </div>
  );
};

export default MainApp;
