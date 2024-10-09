// src/renderer/processors/dropboxProcessors.ts

import {
  ProcessFunction,
  ProcessFileFunction,
} from '../../common/types/dropboxTypes'; // Import the types

// Process DEMI Input
export const processDEMIInput: ProcessFunction = async (
  studentName: string,
  modalInputs: Record<string, string>,
) => {
  const response = await window.electron.processDEMIInput(
    studentName,
    modalInputs,
  );
  if (response.success) {
    return response.result;
  }
  throw new Error(response.message || 'Failed to process DEMI input');
};

// Handle FAST aReading
export const handleFASTaReading: ProcessFunction = async (
  studentName: string,
  modalInputs: Record<string, string>,
) => {
  const response = await window.electron.processFASTaReading(
    studentName,
    modalInputs,
  );
  if (response.success) {
    return response.result;
  }
  throw new Error(response.message || 'Failed to process FAST aReading');
};

// Process WCJ File
export const processWCJFile: ProcessFileFunction = async (
  studentName: string,
  modalInputs: Record<string, string>,
  uploadedFiles: File[],
) => {
  const file = uploadedFiles[0];
  if (!file) {
    throw new Error('No file uploaded');
  }

  const arrayBuffer = await file.arrayBuffer();
  const saveResponse = await window.electron.saveFile(arrayBuffer, file.name);
  if (!saveResponse.success) {
    throw new Error(saveResponse.message || 'Failed to save file');
  }

  const { filePath } = saveResponse;
  const response = await window.electron.processWCJFile(
    studentName,
    modalInputs,
    filePath,
  );

  if (response.success) {
    return response.result;
  }
  throw new Error(response.message || 'Failed to process WCJ file');
};

// Process Teacher Feedback
export const processTeacherFeedbackForm: ProcessFileFunction = async (
  studentName: string,
  modalInputs: Record<string, string>,
  uploadedFiles: File[],
) => {
  const file = uploadedFiles[0];
  if (!file) {
    throw new Error('No file uploaded');
  }

  const arrayBuffer = await file.arrayBuffer();
  const saveResponse = await window.electron.saveFile(arrayBuffer, file.name);
  if (!saveResponse.success) {
    throw new Error(saveResponse.message || 'Failed to save file');
  }

  const { filePath } = saveResponse;
  const response = await window.electron.processTeacherFeedbackForm(
    studentName,
    modalInputs,
    filePath,
  );

  if (response.success) {
    return response.result;
  }
  throw new Error(
    response.message || 'Failed to process Teacher Feedback file',
  );
};

// Handle Custom Input
export const handleCustomInput: ProcessFunction = async (
  studentName: string,
  modalInputs: Record<string, string>,
) => {
  const { customInput } = modalInputs;
  if (!customInput || !customInput.trim()) {
    throw new Error('Custom input cannot be empty.');
  }

  const response = await window.electron.processCustomInput(
    studentName,
    customInput,
  );
  if (response.success) {
    return response.result;
  }
  throw new Error(response.message || 'Failed to process custom input');
};

// Add more processing functions as needed
