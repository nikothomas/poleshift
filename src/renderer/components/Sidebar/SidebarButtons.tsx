// src/components/Sidebar/SidebarButtons.tsx

import React from 'react';
import ScienceIcon from '@mui/icons-material/Science';
import FolderIcon from '@mui/icons-material/Folder';

interface SidebarButtonsProps {
  isSidebarCollapsed: boolean;
  onCreateSamplingEvent: () => void; // Renamed prop
  onCreateFolder: () => void;
}

const SidebarButtons: React.FC<SidebarButtonsProps> = ({
  isSidebarCollapsed,
  onCreateSamplingEvent, // Updated prop name
  onCreateFolder,
}) => {
  return (
    <div className="sidebar__buttons">
      <button
        type="button"
        className="sidebar__button"
        onClick={onCreateSamplingEvent} // Updated handler
        aria-label="Create New Sampling Event" // Updated aria-label
      >
        <ScienceIcon />
        {!isSidebarCollapsed && 'Create New Sampling Event'}{' '}
        {/* Updated label */}
      </button>
      <button
        type="button"
        className="sidebar__button"
        onClick={onCreateFolder}
        aria-label="Create New Folder"
      >
        <FolderIcon />
        {!isSidebarCollapsed && 'Create New Folder'}
      </button>
    </div>
  );
};

export default SidebarButtons;
