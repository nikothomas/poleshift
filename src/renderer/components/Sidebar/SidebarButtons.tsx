// src/components/Sidebar/SidebarButtons.tsx

import React from 'react';
import ScienceIcon from '@mui/icons-material/Science';
import FolderIcon from '@mui/icons-material/Folder';

interface SidebarButtonsProps {
  isSidebarCollapsed: boolean;
  onCreateSample: () => void;
  onCreateFolder: () => void;
}

const SidebarButtons: React.FC<SidebarButtonsProps> = ({
                                                         isSidebarCollapsed,
                                                         onCreateSample,
                                                         onCreateFolder,
                                                       }) => {
  return (
    <div className="sidebar__buttons">
      <button
        type="button"
        className="sidebar__button"
        onClick={onCreateSample}
        aria-label="Create New Sample"
      >
        <ScienceIcon />
        {!isSidebarCollapsed && 'Create New Sample'}
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
