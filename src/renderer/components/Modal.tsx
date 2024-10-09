// src/components/Modal.tsx

import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css'; // Ensure you have appropriate CSS

interface Field {
  name: string;
  label?: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  options?: string[]; // Only for 'select' type
}

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  className?: string; // Optional additional class names

  // For forms
  modalFields?: Field[];
  modalInputs?: Record<string, string>;
  handleModalChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  handleModalSubmit?: () => void;

  // For generic content
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  className = '',
  modalFields,
  modalInputs,
  handleModalChange,
  handleModalSubmit,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
  >(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Focus on the first input when the modal opens (for forms)
  useEffect(() => {
    if (
      isOpen &&
      modalFields &&
      modalFields.length > 0 &&
      firstInputRef.current
    ) {
      if ('focus' in firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }
  }, [isOpen, modalFields]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`${styles.modal} ${className}`} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            {title}
          </h2>
          <button
            className={styles.modalCloseButton}
            onClick={onClose}
            aria-label="Close Modal"
          >
            ×
          </button>
        </div>
        <div className={styles.modalContent}>
          {modalFields &&
          modalInputs &&
          handleModalChange &&
          handleModalSubmit ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (handleModalSubmit) {
                  handleModalSubmit();
                }
              }}
              className={styles.modalForm}
            >
              {modalFields.map((field, index) => {
                const hasLabel = Boolean(field.label);
                const commonProps = {
                  id: field.name,
                  name: field.name,
                  value: modalInputs[field.name] || '',
                  onChange: handleModalChange,
                  required: true,
                  'aria-label': !hasLabel ? field.name : undefined,
                  ref: index === 0 ? firstInputRef : null,
                };

                return (
                  <div
                    key={field.name}
                    className={`${styles.modalField} ${
                      !hasLabel ? styles.modalField : ''
                    }`}
                  >
                    {hasLabel && (
                      <label className={styles.modalLabel} htmlFor={field.name}>
                        {field.label}
                      </label>
                    )}
                    {field.type === 'select' ? (
                      <select {...commonProps} className={styles.modalSelect}>
                        <option value="" disabled>
                          Select an option
                        </option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        {...commonProps}
                        className={styles.modalTextarea}
                        rows={5}
                        placeholder={
                          hasLabel
                            ? `Enter ${field.label?.toLowerCase()}...`
                            : `Alice has been progressing well in math, however...`
                        }
                      />
                    ) : (
                      <input
                        {...commonProps}
                        type={field.type}
                        className={styles.modalInput}
                        placeholder={
                          hasLabel
                            ? `Enter ${field.label?.toLowerCase()}...`
                            : `Alice has been progressing well in math, however...`
                        }
                      />
                    )}
                  </div>
                );
              })}
              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.modalCancelButton}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSubmitButton}>
                  Submit
                </button>
              </div>
            </form>
          ) : (
            // Render children if not a form
            <div className={styles.dataContent}>{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
