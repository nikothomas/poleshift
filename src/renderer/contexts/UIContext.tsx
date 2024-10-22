// src/renderer/contexts/UIContext.tsx

import React, {
  createContext,
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

export interface UIContextType {
  selectedLeftItem: any; // Left sidebar (sampling event)
  setSelectedLeftItem: React.Dispatch<React.SetStateAction<any>>;
  selectedRightItem: any; // Right sidebar (location)
  setSelectedRightItem: React.Dispatch<React.SetStateAction<any>>;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isRightSidebarCollapsed: boolean;
  toggleRightSidebar: () => void;
  openRightSidebar: () => void; // **New Method**
  closeRightSidebar: () => void; // **New Method**
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
  const [selectedLeftItem, setSelectedLeftItem] = useState<any>(null); // For left sidebar (sampling events)
  const [selectedRightItem, setSelectedRightItem] = useState<any>(null); // For right sidebar (locations)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState<boolean>(
    true, // **Initialize as collapsed**
  ); // New state
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

  const toggleRightSidebar = useCallback(() => {
    setIsRightSidebarCollapsed((prev) => !prev);
  }, []);

  const openRightSidebar = useCallback(() => {
    setIsRightSidebarCollapsed(false);
  }, []);

  const closeRightSidebar = useCallback(() => {
    setIsRightSidebarCollapsed(true);
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
      selectedLeftItem,
      setSelectedLeftItem,
      selectedRightItem,
      setSelectedRightItem,
      isSidebarCollapsed,
      toggleSidebar,
      isRightSidebarCollapsed,
      toggleRightSidebar,
      openRightSidebar, // **Include in context**
      closeRightSidebar, // **Include in context**
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
      selectedLeftItem,
      setSelectedLeftItem,
      selectedRightItem,
      setSelectedRightItem,
      isSidebarCollapsed,
      toggleSidebar,
      isRightSidebarCollapsed,
      toggleRightSidebar,
      openRightSidebar,
      closeRightSidebar,
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
