// src/renderer/utils/treeUtils.ts

import { ExtendedTreeItem } from '../contexts/DataContext';
import useData from '../hooks/useData';

export const handleMove = (
  {
    dragIds,
    parentId,
    index,
  }: { dragIds: string[]; parentId: string | null; index: number },
  setErrorMessage: (message: string) => void,
) => {
  const { fileTreeData, setFileTreeData } = useData();

  try {
    const dragId = dragIds[0]; // Assuming single node drag-and-drop
    if (!dragId) return;

    let nodeToMove: ExtendedTreeItem | null = null;

    // Remove the node from its current location
    const removeNode = (nodes: ExtendedTreeItem[]): ExtendedTreeItem[] => {
      return nodes.reduce<ExtendedTreeItem[]>((acc, node) => {
        if (node.id === dragId) {
          nodeToMove = node;
          return acc;
        } else if (node.children) {
          node.children = removeNode(node.children);
        }
        acc.push(node);
        return acc;
      }, []);
    };

    const updatedTreeData = removeNode(fileTreeData);

    if (!nodeToMove) {
      throw new Error('Node to move not found');
    }

    // Insert the node at the new location
    const insertNode = (nodes: ExtendedTreeItem[]): boolean => {
      if (parentId === null) {
        // Insert at root level
        nodes.splice(index, 0, nodeToMove!);
        return true;
      }
      for (const node of nodes) {
        if (node.id === parentId) {
          if (!node.children) {
            node.children = [];
          }
          node.children.splice(index, 0, nodeToMove!);
          return true;
        } else if (node.children) {
          if (insertNode(node.children)) {
            return true;
          }
        }
      }
      return false;
    };

    insertNode(updatedTreeData);

    setFileTreeData(updatedTreeData);
  } catch (error) {
    console.error('Error during drag and drop:', error);
    setErrorMessage('An error occurred while moving items.');
  }
};
