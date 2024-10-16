// src/renderer/components/Modal/Modal.tsx

import React, { useEffect, useRef } from 'react';
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip from Material-UI

// Updated Field interface to include a tooltip property
interface Field {
  name: string;
  label?: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date';
  options?: { value: string; label: string }[];
  tooltip?: string; // Tooltip property
}

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  className?: string;

  modalFields?: Field[];
  modalInputs?: Record<string, string>;
  handleModalChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  handleModalSubmit?: () => void;

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
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`modal-dialog ${className}`} ref={modalRef}>
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close Modal"
          >
            ×
          </button>
        </div>
        <div className="modal-content">
          {modalFields &&
          modalInputs &&
          handleModalChange &&
          handleModalSubmit ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleModalSubmit();
              }}
              className="modal-form"
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
                  title: field.tooltip || undefined, // Tooltip support
                };

                return (
                  <div key={field.name} className="modal-field">
                    {hasLabel && (
                      <label className="modal-label" htmlFor={field.name}>
                        {field.tooltip ? (
                          <Tooltip title={field.tooltip} arrow>
                            <span>{field.label}</span>
                          </Tooltip>
                        ) : (
                          field.label
                        )}
                      </label>
                    )}
                    {field.type === 'select' ? (
                      <select {...commonProps} className="modal-select">
                        <option value="" disabled>
                          Select an option
                        </option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        {...commonProps}
                        className="modal-textarea"
                        rows={5}
                        placeholder={
                          hasLabel
                            ? `Enter ${field.label?.toLowerCase()}...`
                            : `Enter your text here...`
                        }
                      />
                    ) : (
                      <input
                        {...commonProps}
                        type={field.type}
                        className="modal-input"
                        placeholder={
                          hasLabel
                            ? `Enter ${field.label?.toLowerCase()}...`
                            : `Enter your input...`
                        }
                      />
                    )}
                  </div>
                );
              })}
              <div className="modal-buttons">
                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-button">
                  Submit
                </button>
              </div>
            </form>
          ) : (
            <div className="data-content">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
