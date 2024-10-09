// src/contexts/UIContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';

interface Field {
  name: string;
  label?: string; // Made label optional
  type: string; // 'text', 'textarea', 'select', etc.
  options?: string[]; // Only for 'select' type
}

interface ModalState {
  isOpen: boolean;
  title: string;
  callback: (() => void) | null;
  fields: Field[];
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  callback: (() => void) | null;
}

interface ContextMenuState {
  isVisible: boolean;
  x: number;
  y: number;
  itemId: string | null;
}

interface ContextMenuProps {
  contextMenuState: ContextMenuState;
  setContextMenuState: React.Dispatch<React.SetStateAction<ContextMenuState>>;
  deleteItem: (id: string) => void;
}

export interface UIContextType {
  selectedItem: any; // Adjust type based on your implementation
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  modalState: ModalState;
  openModal: (title: string, fields: Field[], callback?: () => void) => void;
  closeModal: () => void;
  confirmState: ConfirmState;
  setConfirmState: React.Dispatch<React.SetStateAction<ConfirmState>>;
  contextMenuState: ContextMenuState;
  setContextMenuState: React.Dispatch<React.SetStateAction<ContextMenuState>>;
  showAccountActions: boolean;
  setShowAccountActions: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<any>(null); // Adjust type as needed
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    callback: null,
    fields: [],
  });
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    callback: null,
  });
  const [contextMenuState, setContextMenuState] = useState<ContextMenuState>({
    isVisible: false,
    x: 0,
    y: 0,
    itemId: null,
  });
  const [showAccountActions, setShowAccountActions] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Memoize functions to prevent them from being recreated on every render
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const openModal = useCallback(
    (title: string, fields: Field[], callback?: () => void) => {
      setModalState({
        isOpen: true,
        title,
        fields,
        callback: callback || null,
      });
    },
    [],
  );

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      title: '',
      fields: [],
      callback: null,
    });
  }, []);

  // Memoize the context value
  const value = useMemo(
    () => ({
      selectedItem,
      setSelectedItem,
      isSidebarCollapsed,
      toggleSidebar,
      modalState,
      openModal,
      closeModal,
      confirmState,
      setConfirmState,
      contextMenuState,
      setContextMenuState,
      showAccountActions,
      setShowAccountActions,
      errorMessage,
      setErrorMessage,
    }),
    [
      selectedItem,
      setSelectedItem,
      isSidebarCollapsed,
      toggleSidebar,
      modalState,
      openModal,
      closeModal,
      confirmState,
      setConfirmState,
      contextMenuState,
      setContextMenuState,
      showAccountActions,
      setShowAccountActions,
      errorMessage,
      setErrorMessage,
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export default useUI;
