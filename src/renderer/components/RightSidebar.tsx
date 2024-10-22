import React, { useCallback, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close'; // Using Material UI icons
import IconButton from '@mui/material/IconButton';
import useUI from '../hooks/useUI';
import useData from '../hooks/useData';

const RightSidebar: React.FC = () => {
  const {
    selectedRightItem,
    setSelectedRightItem,
    isRightSidebarCollapsed,
    closeRightSidebar,
  } = useUI();
  const { samplingEventData } = useData();

  const closeSidebar = useCallback(() => {
    setSelectedRightItem(null);
    closeRightSidebar();
    console.log('Sidebar closed.');
  }, [setSelectedRightItem, closeRightSidebar]);

  // Move useEffect above any conditional returns
  useEffect(() => {
    if (selectedRightItem && !isRightSidebarCollapsed) {
      console.log('RightSidebar is now visible.');
    }
  }, [selectedRightItem, isRightSidebarCollapsed]);

  // Keep the early return after the hooks
  if (!selectedRightItem) {
    return null;
  }

  const samplesAtLocation = Object.values(samplingEventData).filter(
    (event) => event.loc_id === selectedRightItem.id,
  );

  return (
    <div
      className={`right-sidebar ${isRightSidebarCollapsed ? 'collapsed' : ''}`}
    >
      <IconButton
        className="right-sidebar__close-button"
        onClick={closeSidebar}
        aria-label="Close Sidebar"
      >
        <CloseIcon />
      </IconButton>

      <div className="right-sidebar__content">
        <h2>{selectedRightItem.label}</h2>
        <p>
          <strong>Location ID:</strong> {selectedRightItem.char_id}
        </p>
        <p>
          <strong>Latitude:</strong> {selectedRightItem.lat}
        </p>
        <p>
          <strong>Longitude:</strong> {selectedRightItem.long}
        </p>

        {/* Display samples at this location */}
        {samplesAtLocation.length > 0 ? (
          <div>
            <h3>Samples at this location:</h3>
            <ul>
              {samplesAtLocation.map((sample) => (
                <li key={sample.id}>
                  <strong>{sample.name}</strong> (Sample ID: {sample.id})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No samples at this location.</p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
