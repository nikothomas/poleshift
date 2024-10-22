// src/types.ts

import React from 'react';

export type ItemType = 'samplingEvent' | 'folder';

export interface ExtendedTreeItem {
  id: string;
  text: string;
  droppable: boolean;
  type: ItemType;
  children?: ExtendedTreeItem[];
  data?: { [key: string]: any };
}

export interface LocationOption {
  id: string;
  char_id: string;
  label: string;
  lat: number;
  long: number;
}

export interface SamplingEvent {
  id: string;
  name: string;
  loc_id: string;
  storage_folder: string;
  data: { [key: string]: any };
}

export interface SamplingEventData {
  [id: string]: SamplingEvent;
}

export interface DataContextType {
  fileTreeData: ExtendedTreeItem[];
  setFileTreeData: React.Dispatch<React.SetStateAction<ExtendedTreeItem[]>>;
  samplingEventData: SamplingEventData;
  setSamplingEventData: React.Dispatch<React.SetStateAction<SamplingEventData>>;
  addItem: (type: ItemType, inputs: Record<string, string>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  isSyncing: boolean;
  locations: LocationOption[];
}
