// src/components/Sidebar/AccountButton.tsx

import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface AccountButtonProps {
  setShowAccountActions: (value: boolean) => void;
}

const AccountButton: React.FC<AccountButtonProps> = ({
  setShowAccountActions,
}) => {
  return (
    <div className="sidebar__account">
      <button
        type="button"
        className="sidebar__account-button"
        onClick={() => setShowAccountActions(true)}
        aria-label="Account Actions"
      >
        <AccountCircleIcon className="sidebar__account-icon" />
      </button>
    </div>
  );
};

export default AccountButton;
