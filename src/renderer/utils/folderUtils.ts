// src/utils/folderUtils.ts

import { ExtendedTreeItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const processCreateFolder = async (
  inputs: Record<string, string>,
): Promise<ExtendedTreeItem> => {
  const { name } = inputs;
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
