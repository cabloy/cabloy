import type { ParameterObject, ReferenceObject, SchemaObject } from 'openapi3-ts/oas31';

export interface IRestResourceSchemaBootstrap {
  parameters?: (ReferenceObject | ParameterObject)[];
  paged: boolean;
  schemaPaged?: SchemaObject;
  schemaRow?: SchemaObject;
}
