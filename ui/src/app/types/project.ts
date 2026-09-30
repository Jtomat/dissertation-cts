import { Declaration } from '@app/types/equation';

export enum ResourceType {
  PointCloud = 'PointCloud',
  Json = 'Json',
}

export interface Stage {
  name: string;
  declarations: Array<Declaration>;
}

export interface Resource {
  name: string;
  uri: string;
  type: ResourceType;
}

export interface Project {
  uuid: string;
  name: string;
  stages: Array<Stage>;
  globals: Array<Declaration>;
  resources: Array<Resource>;
}