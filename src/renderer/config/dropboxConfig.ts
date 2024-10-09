// src/renderer/config/dropboxConfig.ts
export interface DropboxConfigItem {
  id: number; // Unique identifier
  label: string;
  testName: string;
  expectedFileTypes: Record<string, string[]> | null; // Adjust according to your needs
  isEnabled: boolean;
  isModalInput: boolean;
  processFunctionName: string; // Optional, as it might not be present
  requiredSubscriptionLevel?: number;
  modalFields: ModalField[]; // Defines fields in the modal
}

import { ModalField } from "../../common/types/dropboxTypes"; // Import the interface

const dropboxConfig: DropboxConfigItem[] = [

  // Add Custom Input modal
  {
    id: 1,
    label: 'Custom Input',
    testName: 'Custom Input',
    expectedFileTypes: null,
    isEnabled: true,
    isModalInput: true, // Set to true to use modal
    processFunctionName: 'handleCustomInput', // Ensure this function matches the ProcessFunction type
    requiredSubscriptionLevel: 1, // Adjust as needed
    modalFields: [
      {
        name: 'customInput',
        type: 'textarea', // Use 'textarea' for multi-line input
      },
    ],
  },
  {
    id: 2,
    label: 'Custom Input',
    testName: 'Custom Input',
    expectedFileTypes: null,
    isEnabled: true,
    isModalInput: true, // Set to true to use modal
    processFunctionName: 'handleCustomInput', // Ensure this function matches the ProcessFunction type
    requiredSubscriptionLevel: 1, // Adjust as needed
    modalFields: [
      {
        name: 'customInput',
        type: 'textarea', // Use 'textarea' for multi-line input
      },
    ],
  },
  {
    id: 3,
    label: 'Custom Input',
    testName: 'Custom Input',
    expectedFileTypes: null,
    isEnabled: true,
    isModalInput: true, // Set to true to use modal
    processFunctionName: 'handleCustomInput', // Ensure this function matches the ProcessFunction type
    requiredSubscriptionLevel: 1, // Adjust as needed
    modalFields: [
      {
        name: 'customInput',
        type: 'textarea', // Use 'textarea' for multi-line input
      },
    ],
  },
  {
    id: 4,
    label: 'Custom Input',
    testName: 'Custom Input',
    expectedFileTypes: null,
    isEnabled: true,
    isModalInput: true, // Set to true to use modal
    processFunctionName: 'handleCustomInput', // Ensure this function matches the ProcessFunction type
    requiredSubscriptionLevel: 1, // Adjust as needed
    modalFields: [
      {
        name: 'customInput',
        type: 'textarea', // Use 'textarea' for multi-line input
      },
    ],
  },
  {
    id: 5,
    label: 'Custom Input',
    testName: 'Custom Input',
    expectedFileTypes: null,
    isEnabled: true,
    isModalInput: true, // Set to true to use modal
    processFunctionName: 'handleCustomInput', // Ensure this function matches the ProcessFunction type
    requiredSubscriptionLevel: 1, // Adjust as needed
    modalFields: [
      {
        name: 'customInput',
        type: 'textarea', // Use 'textarea' for multi-line input
      },
    ],
  },
  {
    id: 6,
    label: 'Custom Input',
    testName: 'Custom Input',
    expectedFileTypes: null,
    isEnabled: true,
    isModalInput: true, // Set to true to use modal
    processFunctionName: 'handleCustomInput', // Ensure this function matches the ProcessFunction type
    requiredSubscriptionLevel: 1, // Adjust as needed
    modalFields: [
      {
        name: 'customInput',
        type: 'textarea', // Use 'textarea' for multi-line input
      },
    ],
  },
  // ... other configurations
];

export default dropboxConfig;
