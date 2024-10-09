// src/renderer/components/ContextMenu.tsx

import React, { useEffect } from 'react';
import useUI from '../hooks/useUI';
import './ContextMenu.css'

interface ContextMenuProps {
  deleteItem: (id: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ deleteItem }) => {
  const { contextMenuState, setContextMenuState } = useUI();
  const { isVisible, x, y, itemId } = contextMenuState;

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenuState((prevState) => ({ ...prevState, isVisible: false }));
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible, setContextMenuState]);

  const handleDelete = () => {
    if (itemId) {
      deleteItem(itemId);
      setContextMenuState((prevState) => ({ ...prevState, isVisible: false }));
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`context-menu ${isVisible ? 'context-menu--visible' : ''}`}
      style={{ top: `${y}px`, left: `${x}px`, position: 'absolute' }}
    >
      <ul className="context-menu__list">
        <li className="context-menu__item" onClick={handleDelete}>
          Delete
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
