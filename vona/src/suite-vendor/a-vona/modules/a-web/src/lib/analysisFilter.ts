import type { Constructable } from 'vona';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';
import type { IAnalysisPolicy, TypeAnalysisMode } from 'vona-module-a-orm';
import type z from 'zod';

import { ZodMetadata } from '@cabloy/zod-openapi';
import { appResource } from 'vona';
import { $schema } from 'vona-module-a-openapiutils';
import { analysisCapabilities, analysisControlSchemas } from 'vona-module-a-orm';

import type { IDecoratorDtoOptions } from '../types/dto.ts';

export interface IArgFilterOptions {
  mode?: TypeAnalysisMode;
}

export function prepareAnalysisFilter(
  schemaLike: z.ZodType | Constructable,
  options?: IArgFilterOptions,
) {
  const schema = $schema(schemaLike as Constructable);
  if (!options?.mode) return { schema };
  const policy = (
    appResource.getBean(schemaLike as Constructable)?.options as IDecoratorDtoOptions | undefined
  )?.analysis;
  if (!policy) throw new Error('Analysis filter requires a DTO analysis policy');
  return {
    schema: createAnalysisFilterSchema(schema, policy, options.mode),
    analysis: policy,
    analysisMode: options.mode,
  };
}

function createAnalysisFilterSchema(
  schema: z.ZodType,
  policy: IAnalysisPolicy,
  mode: TypeAnalysisMode,
) {
  const inner = ZodMetadata.unwrapChained(schema);
  if (inner.type !== 'object') throw new Error('Analysis filter requires an object DTO schema');
  const object = schema as z.ZodObject;
  if (typeof object.safeExtend !== 'function') {
    throw new TypeError('Analysis filter requires an extensible object DTO schema');
  }
  for (const key of ['groups', 'aggrs', 'having', 'joins', 'distinct']) {
    if (key in object.shape) throw new Error(`Analysis control conflicts with DTO field: ${key}`);
  }
  const controls = analysisControlSchemas(policy, mode);
  const capabilities = analysisCapabilities(policy, mode);
  const metadata: ISchemaObjectExtensionField = {
    filter: { capabilities: { analysis: capabilities } },
  };
  const shape: Record<string, z.ZodType> = {
    aggrs: controls.aggrs.openapi(metadata),
  };
  if (controls.groups) shape.groups = controls.groups.openapi(metadata);
  const derived = object.safeExtend(shape);
  const original = ZodMetadata.getOpenapiMetadata(schema) as
    | ISchemaObjectExtensionField
    | undefined;
  const ref = ZodMetadata.getRefId(schema);
  return derived.openapi(`${ref ?? 'filter'}_${mode}`, {
    ...original,
    filter: {
      ...original?.filter,
      capabilities: { ...original?.filter?.capabilities, analysis: capabilities },
    },
  });
}
