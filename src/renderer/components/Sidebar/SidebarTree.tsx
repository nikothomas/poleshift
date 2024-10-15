// src/components/Sidebar/SidebarTree.tsx

import React, { useCallback } from 'react';
import { Tree, NodeApi, CursorProps } from 'react-arborist';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ScienceIcon from '@mui/icons-material/Science';
import useUI from '../../hooks/useUI';
import { handleMove, TreeItem } from '../../utils/treeUtils';
import './SidebarTree.css';
import CustomCursor from './CustomCursor';

interface SidebarTreeProps {
  treeData: TreeItem[];
  setTreeData: (data: TreeItem[]) => void;
}

const SidebarTree: React.FC<SidebarTreeProps> = ({ treeData, setTreeData }) => {
  const {
    selectedItem,
    setSelectedItem,
    setContextMenuState,
    setErrorMessage,
  } = useUI();

  // Handle node movement (drag and drop)
  const onMove = useCallback(
    (params) => {
      handleMove(params, treeData, setTreeData, setErrorMessage);
    },
    [treeData, setTreeData, setErrorMessage],
  );

  // Define the Node component for rendering each node
  const Node = ({
    node,
    style,
    dragHandle,
  }: {
    node: NodeApi<TreeItem>;
    style: React.CSSProperties;
    dragHandle?: (el: HTMLDivElement | null) => void;
  }) => {
    const isSelected = selectedItem && selectedItem.id === node.data.id;
    const isFolder = node.data.type === 'folder';
    const isSamplingEvent = node.data.type === 'samplingEvent'; // Updated from 'isSample'

    const handleClick = (e: React.MouseEvent) => {
      node.handleClick(e);
      setSelectedItem(node.data);
      if (isFolder) {
        node.toggle();
      }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      setSelectedItem(node.data);
      setContextMenuState({
        isVisible: true,
        x: e.pageX,
        y: e.pageY,
        itemId: node.data.id,
      });
    };

    // Apply styles directly via inline styles or CSS classes
    const nodeClassNames = [
      'tree-node',
      isSelected ? 'tree-node--selected' : '',
      isFolder
        ? 'tree-node--folder'
        : isSamplingEvent
          ? 'tree-node--samplingEvent'
          : 'tree-node--file',
    ]
      .join(' ')
      .trim();

    return (
      <div
        ref={dragHandle}
        className={nodeClassNames}
        style={style}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <div className="tree-node__icon">
          {isFolder ? (
            node.isOpen ? (
              <FolderOpenIcon />
            ) : (
              <FolderIcon />
            )
          ) : isSamplingEvent ? ( // Updated condition
            <ScienceIcon />
          ) : (
            <FolderIcon /> // You might want to change this to a different icon if it's neither folder nor sampling event
          )}
        </div>
        <div className="tree-node__text">{node.data.text}</div>
      </div>
    );
  };

  return (
    <div className="sidebar__content">
      <Tree
        data={treeData}
        onMove={onMove}
        onSelect={(nodes: NodeApi<TreeItem>[]) => {
          if (nodes.length > 0) {
            setSelectedItem(nodes[0].data);
          } else {
            setSelectedItem(null);
          }
        }}
        selection={selectedItem ? selectedItem.id : undefined}
        disableDrag={() => false} // Enable dragging for all nodes
        disableDrop={({ parentNode }) =>
          parentNode?.data.type === 'samplingEvent'
        } // Prevent dropping onto sampling events
        rowHeight={36} // Set row height via the Tree component
        indent={24} // Set indentation via the Tree component
        renderCursor={(props: CursorProps) => <CustomCursor {...props} />} // Use the custom cursor
      >
        {Node}
      </Tree>
    </div>
  );
};

export default SidebarTree;
