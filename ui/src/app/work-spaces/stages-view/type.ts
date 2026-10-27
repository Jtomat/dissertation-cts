import { NgcxTreeNode } from '@cluetec/ngcx-tree';

export enum TreeStatus {
  Computed = 'computed',
  Changed = 'changed',
  Error = 'error',
  Processing = 'processing',
}

export type TreeGroupIcon = string | ((expanded: boolean) => string);

export interface ProcessNodeData {
  status?: TreeStatus;
  type: 'item' | 'group';
  icon?: TreeGroupIcon;
  postfixIcon?: string;
}


export type TreeNodeBase<T extends ProcessNodeData = ProcessNodeData> = NgcxTreeNode & { children?: Array<TreeNodeBase<T>> } & T ;


