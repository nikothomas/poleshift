// src/main/preload.ts

import { contextBridge, ipcRenderer } from 'electron';

// Define the channels for electron-store
const storeChannels = {
  get: 'electron-store-get',
  set: 'electron-store-set',
  // Add more channels if you extend functionality
};

// Expose APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  store: {
    /**
     * Synchronously retrieves a value from the store.
     * @param key - The key to retrieve.
     * @returns The value associated with the key or null if not found.
     */
    get: (key: string): any => {
      return ipcRenderer.sendSync(storeChannels.get, key);
    },
    /**
     * Asynchronously sets a value in the store.
     * @param key - The key to set.
     * @param value - The value to associate with the key.
     * @returns A promise that resolves to the result of the set operation.
     */
    set: async (
      key: string,
      value: any,
    ): Promise<{ success: boolean; message?: string }> => {
      return ipcRenderer.invoke(storeChannels.set, key, value);
    },
    // You can add more methods like has, delete, etc., here
  },
  // Expose other APIs as needed
  generateReport: async (prompts: string[], studentName: string) => {
    return ipcRenderer.invoke('generate-report', prompts, studentName);
  },

  processFunction: async (
    functionName: string,
    studentName: string,
    modalInputs: any,
    files?: any,
  ) => {
    return ipcRenderer.invoke('process-function', functionName, studentName, modalInputs, files);
  },

  saveFile: async (fileBuffer: ArrayBuffer, fileName: string) => {
    return ipcRenderer.invoke('save-file', fileBuffer, fileName);
  },
  encryptAndStore: (userId: string, key: string, value: string) =>
    ipcRenderer.invoke('encrypt-and-store', userId, key, value),
  retrieveAndDecrypt: (userId: string, key: string) =>
    ipcRenderer.invoke('retrieve-and-decrypt', userId, key),
});
