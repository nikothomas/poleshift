// src/renderer/components/RightSidebar.tsx

import React, { useCallback } from 'react';
import CloseIcon from '@mui/icons-material/Close'; // Using Material UI icons
import IconButton from '@mui/material/IconButton';
import useUI from '../hooks/useUI';
import useData from '../hooks/useData';

const RightSidebar: React.FC = () => {
  const {
    selectedRightItem,
    setSelectedRightItem,
    isRightSidebarCollapsed,
    toggleRightSidebar,
  } = useUI();
  const { samplingEventData } = useData();

  const closeSidebar = useCallback(() => {
    setSelectedRightItem(null);
    // We can remove toggleRightSidebar if we're not collapsing
    // toggleRightSidebar();
  }, [setSelectedRightItem]);

  // If no location is selected, don't render the sidebar
  if (!selectedRightItem) {
    return null;
  }

  // Filter sampling events that match the selected location
  const samplesAtLocation = Object.values(samplingEventData).filter(
    (event) => event.loc_id === selectedRightItem.id,
  );

  return (
    <div
      className={`right-sidebar ${
        isRightSidebarCollapsed ? 'collapsed' : ''
      }`}
    >
      {/* Close Button inside the sidebar */}
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
          <strong>Location ID:</strong> {selectedRightItem.id}
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
