// src/renderer/utils/sidebarFunctions.ts

import { v4 as uuidv4 } from 'uuid';
import { TreeItem } from "./treeUtils";

// Define possible item types using a TypeScript union type for better type safety
export type ItemType = 'sample' | 'folder';

// Extend TreeItem to use the defined ItemType
export interface ExtendedTreeItem extends TreeItem {
  type: ItemType;
}

interface ProcessFunctions {
  [key: string]: (inputs: Record<string, string>) => ExtendedTreeItem;
}

/**
 * Creates a new TreeItem representing a sample.
 * @param inputs - An object containing `name` and optionally `description`.
 * @returns A TreeItem with type 'sample'.
 * @throws Error if `name` is missing.
 */
export const processCreateSample = (
  inputs: Record<string, string>,
): ExtendedTreeItem => {
  const { name, description } = inputs;

  // Input validation
  if (!name) {
    throw new Error('Sample name is required to create a sample.');
  }

  const newId = `sample-${uuidv4()}`;
  return {
    id: newId,
    text: name,
    droppable: false,
    type: 'sample',
    data: {
      name,
      description: description || '',
    },
  };
};

/**
 * Creates a new TreeItem representing a folder.
 * @param inputs - An object containing `name`.
 * @returns A TreeItem with type 'folder'.
 * @throws Error if `name` is missing.
 */
export const processCreateFolder = (
  inputs: Record<string, string>,
): ExtendedTreeItem => {
  const { name } = inputs;

  // Input validation
  if (!name) {
    throw new Error('Folder name is required to create a folder.');
  }

  const newId = `folder-${uuidv4()}`;
  return {
    id: newId,
    text: name,
    droppable: true,
    type: 'folder',
    children: [],
  };
};

// Export all processing functions
export const processFunctions: ProcessFunctions = {
  processCreateSample,
  processCreateFolder,
  // Add more processing functions here
};
