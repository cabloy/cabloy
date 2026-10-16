import type { SchemaObject } from 'openapi3-ts/oas31';
import type { ModelPersistenceToken } from 'zova-module-a-model';
import type { ISchemaObjectExtensionField, TypeFormSchemaScene } from 'zova-module-a-openapi';

import type { ModelDraft } from '../model/draft.js';

export interface IDraftIdentity {
  context: ModelPersistenceToken;
  resource: string;
  mode: 'create' | 'edit';
  id?: string | number;
  path: string;
}

export interface IDraftEditor {
  key: string;
  generation: number;
  owner: ModelDraft;
  identity: IDraftIdentity;
}

export interface IDraftSchemaOptions {
  scene: TypeFormSchemaScene;
  loadProperties: (
    schema: SchemaObject,
    scene: TypeFormSchemaScene,
  ) => ISchemaObjectExtensionField[] | undefined;
  resolveSchema: (reference: string) => SchemaObject | undefined;
}

export interface IDraftRelationRow {
  id?: string | number;
  deleted?: boolean;
}

export interface IDraftProjection {
  values: Record<string, unknown>;
  /** JSON-encoded paths distinguish nested rows from literal dotted keys. */
  relations: Record<string, IDraftRelationRow[]>;
  undefinedPaths: string[];
}

export interface IDraftEnvelope {
  version: 1;
  savedAt: number;
  schemaSignature: string;
  baselineSignature?: string;
  projection: IDraftProjection;
}
