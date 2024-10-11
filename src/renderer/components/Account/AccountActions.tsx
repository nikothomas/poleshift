// src/renderer/components/Account/AccountActions.tsx

import React from 'react';
import Modal from '../Modal';
import useUI from '../../hooks/useUI';
import useAuth from '../../hooks/useAuth';
import styles from './AccountActions.module.css'; // Import the CSS module
import { useNavigate } from 'react-router-dom';

const AccountActions: React.FC = () => {
  const { showAccountActions, setShowAccountActions } = useUI();
  const {
    user,
    userTier,
    userOrg,
    handleLogout,
    errorMessage,
  } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const closeModal = () => {
    setShowAccountActions(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    closeModal();
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Modal isOpen={showAccountActions} title="Account" onClose={closeModal}>
      <div className={styles.accountInfo}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{user?.email}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>User type:</span>
          <span className={styles.value}>{capitalizeFirstLetter(userTier)}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Organization:</span>
          <span className={styles.value}>{capitalizeFirstLetter(userOrg)}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Last Sign In:</span>
          <span className={styles.value}>
            {user?.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleString()
              : 'N/A'}
          </span>
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={handleLogoutClick}
            className={`${styles.button} ${styles.logoutButton}`}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      </div>
    </Modal>
  );
};

export default AccountActions;
