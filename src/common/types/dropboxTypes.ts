// src/common/types/dropboxTypes.ts

export type ProcessFunction = (
  studentName: string,
  modalInputs: Record<string, string>,
) => Promise<any>;

export type ProcessFileFunction = (
  studentName: string,
  modalInputs: Record<string, string>,
  uploadedFiles: File[],
) => Promise<any>;

export interface ModalField {
  name: string;
  label?: string;
  type: 'text' | 'textarea' | 'select' | 'number'; // Added 'textarea' for multi-line input
  options?: string[]; // Only applicable for 'select' type
}
