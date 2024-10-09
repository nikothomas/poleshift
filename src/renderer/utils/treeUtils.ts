// src/renderer/utils/treeUtils.ts
export interface TreeItem {
  id: string;
  text: string;
  droppable: boolean;
  type: 'folder' | 'sample';
  parent?: string | null;
  data?: any;
  children?: TreeItem[];
}

/**
 * Get all descendant IDs of a given node ID.
 * Useful for operations like deleting a node and all its descendants.
 */
export const getDescendantIds = (nodes: TreeItem[], nodeId: string): number[] => {
  const ids: number[] = [];
  const findNode = (items: TreeItem[]): void => {
    for (const item of items) {
      if (item.id === nodeId) {
        traverse(item);
        break;
      } else if (item.children) {
        findNode(item.children);
      }
    }
  };

  const traverse = (node: TreeItem): void => {
    if (node.children) {
      for (const child of node.children) {
        ids.push(Number(child.id));
        traverse(child);
      }
    }
  };

  findNode(nodes);
  return ids;
};

export const insertItem = (
  treeData: TreeItem[],
  newItem: TreeItem,
  parentItem: TreeItem | null,
): TreeItem[] => {
  if (!parentItem) {
    return [...treeData, newItem];
  }

  const insertNode = (nodes: TreeItem[]): boolean => {
    for (const node of nodes) {
      if (node.id === parentItem.id) {
        if (!node.children) {
          node.children = [];
        }
        node.children.push(newItem);
        return true;
      } else if (node.children) {
        if (insertNode(node.children)) {
          return true;
        }
      }
    }
    return false;
  };

  insertNode(treeData);
  return treeData;
};

export const handleMove = (
  {
    dragIds,
    parentId,
    index,
  }: { dragIds: string[]; parentId: string | null; index: number },
  treeData: TreeItem[],
  setTreeData: (data: TreeItem[]) => void,
  setErrorMessage: (message: string) => void,
) => {
  try {
    const dragId = dragIds[0]; // Assuming single node drag-and-drop
    if (!dragId) return;

    // Remove the node from its current location
    let nodeToMove: TreeItem | null = null;
    const removeNode = (nodes: TreeItem[]): TreeItem[] => {
      return nodes.reduce<TreeItem[]>((acc, node) => {
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

    const updatedTreeData = removeNode(treeData);

    if (!nodeToMove) {
      throw new Error('Node to move not found');
    }

    // Insert the node at the new location
    const insertNode = (nodes: TreeItem[]): boolean => {
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

    setTreeData(updatedTreeData);
  } catch (error) {
    console.error('Error during drag and drop:', error);
    setErrorMessage('An error occurred while moving items.');
  }
};
