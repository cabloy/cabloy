import type { TypeSchemaScene } from './rest.ts';

export type TypeSchemaOrderLevel = 'core' | 'business' | 'max';

export interface ISchemaOrderParams {
  order: number;
  level?: TypeSchemaOrderLevel;
  scene?: TypeSchemaScene;
}
