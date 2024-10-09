// src/components/Sidebar/SidebarToggleButton.tsx

import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';

interface SidebarToggleButtonProps {
  toggleSidebar: () => void;
}

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({ toggleSidebar }) => {
  return (
    <button
      type="button"
      className="sidebar-toggle-button"
      onClick={toggleSidebar}
      aria-label="Toggle Sidebar"
    >
      <MenuIcon />
    </button>
  );
};

export default SidebarToggleButton;
