// src/renderer/preload.d.ts

export {};

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (
          key: string,
          val: any,
        ) => Promise<{ success: boolean; message?: string }>;
        // Add more methods if you've defined them
      };
      processFunction: (
        functionName: string,
        studentName: string,
        modalInputs: any,
        files?: any,
      ) => Promise<{ success: boolean; result?: any; message?: string }>;
      encryptAndStore: (
        userId: string,
        key: string,
        value: string,
      ) => Promise<{ success: boolean; message?: string }>;
      retrieveAndDecrypt: (
        userId: string,
        key: string,
      ) => Promise<{ success: boolean; value?: string; message?: string }>;
    }
  }
}
