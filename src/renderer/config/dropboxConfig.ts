// src/renderer/config/dropboxConfig.ts

export interface ModalField {
  name: string;
  label?: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date'; // Added 'date' type
  options?: string[]; // Only applicable for 'select' type
  tooltip?: string;
}

export interface DropboxConfigItem {
  id: string; // Unique identifier, now using dataType
  label: string;
  dataType: string; // The type of data
  expectedFileTypes: Record<string, string[]> | null;
  isEnabled: boolean;
  isModalInput: boolean;
  processFunctionName: string;
  requiredSubscriptionLevel?: number;
  modalFields: ModalField[];
}

const dropboxConfig: DropboxConfigItem[] = [
  {
    id: 'nutrient_ammonia', // Using dataType as id
    label: 'Nutrient (Ammonium)',
    dataType: 'nutrient_ammonia',
    expectedFileTypes: null,
    isEnabled: true,
    isModalInput: true,
    processFunctionName: 'handleNutrientAmmoniaInput',
    requiredSubscriptionLevel: 1,
    modalFields: [
      {
        name: 'ammoniaValue',
        type: 'number',
        label: 'Ammonia Value',
        tooltip:
          'Please input the Ammonia value, this will be converted to Ammonium.',
      },
    ],
  },
  // Add other unique entries as needed
];

export default dropboxConfig;
