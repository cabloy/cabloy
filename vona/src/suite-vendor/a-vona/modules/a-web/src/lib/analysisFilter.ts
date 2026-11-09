import type { Constructable } from 'vona';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';
import type { IQueryPolicy, TypeAnalysisMode } from 'vona-module-a-orm';
import type z from 'zod';

import { ZodMetadata } from '@cabloy/zod-openapi';
import { appResource } from 'vona';
import { $schema } from 'vona-module-a-openapiutils';
import {
  analysisCapabilities,
  analysisControlSchemas,
  queryCapabilities,
  queryControlSchemas,
  SymbolQueryPolicy,
} from 'vona-module-a-orm';

import type { IDecoratorDtoOptions } from '../types/dto.ts';

export interface IArgFilterOptions {
  mode?: TypeAnalysisMode;
}

export const filterControlNames = [
  'where',
  'orders',
  'pageNo',
  'pageSize',
  'groups',
  'aggrs',
  'columns',
  'joins',
  'having',
  'distinct',
  'include',
  'with',
  'limit',
  'offset',
] as const;

/** Derive action contracts without changing the DTO's reusable named form schema. */
export function prepareAnalysisFilter(
  schemaLike: z.ZodType | Constructable,
  options?: IArgFilterOptions,
) {
  const schema = $schema(schemaLike as Constructable);
  const dto = appResource.getBean(schemaLike as Constructable)?.options as
    | IDecoratorDtoOptions
    | undefined;
  const query =
    dto?.query ??
    (schemaLike as unknown as { [SymbolQueryPolicy]?: IQueryPolicy })[SymbolQueryPolicy];
  const analysis = options?.mode ? dto?.analysis : undefined;
  if (options?.mode && !analysis) throw new Error('Analysis filter requires a DTO analysis policy');
  if (options?.mode && !query) throw new Error('Analysis filter requires a DTO query policy');
  const object = ZodMetadata.unwrapChained(schema) as z.ZodObject;
  if (object.type !== 'object' || typeof object.safeExtend !== 'function') {
    throw new TypeError('Filter requires an extensible object DTO schema');
  }
  const names = Object.keys(object.shape).filter(key => !filterControlNames.includes(key as any));
  if (query) {
    for (const name of names) {
      const field = query.conveniences[name]?.field ?? name;
      if (!query.fields[field])
        throw new TypeError(`Filter field has no query policy binding: ${name}`);
    }
  }
  const namedSchema = object
    .pick(Object.fromEntries(names.map(key => [key, true])) as any)
    .strict();
  const mode = options?.mode ?? 'select';
  const controls: Record<string, z.ZodType> = query ? queryControlSchemas(query, mode) : {};
  // Plain product DTOs expose only their authored named contract and declared pagination.
  if (!query) {
    for (const key of ['pageNo', 'pageSize']) {
      if (object.shape[key]) controls[key] = object.shape[key];
    }
    for (const key of filterControlNames) {
      if (key !== 'pageNo' && key !== 'pageSize' && object.shape[key]) {
        throw new TypeError(`Filter control requires a query policy: ${key}`);
      }
    }
  }
  const capabilities: NonNullable<
    NonNullable<ISchemaObjectExtensionField['filter']>['capabilities']
  > = {};
  if (query) capabilities.query = queryCapabilities(query);
  if (analysis && options?.mode) {
    if (analysis.modelClass !== query!.modelClass)
      throw new TypeError('Query analysis policy/model mismatch');
    for (const key of ['groups', 'aggrs', 'having', 'joins', 'distinct']) {
      if (key in object.shape) throw new Error(`Analysis control conflicts with DTO field: ${key}`);
    }
    const analysisControls = analysisControlSchemas(analysis, options.mode);
    capabilities.analysis = analysisCapabilities(analysis, options.mode);
    const metadata: ISchemaObjectExtensionField = {
      filter: { capabilities: { analysis: capabilities.analysis } },
    };
    controls.aggrs = analysisControls.aggrs.openapi(metadata);
    if (analysisControls.groups) controls.groups = analysisControls.groups.openapi(metadata);
  }
  const original = ZodMetadata.getOpenapiMetadata(schema) as
    | ISchemaObjectExtensionField
    | undefined;
  const ref = ZodMetadata.getRefId(schema);
  // A separate ref for every action mode prevents registration-order collisions.
  const derived = object
    .pick(Object.fromEntries(names.map(key => [key, true])) as any)
    .safeExtend(controls)
    .strict()
    .openapi(`${ref ?? 'filter'}_${mode}`, {
      ...original,
      filter: {
        ...original?.filter,
        capabilities: { ...original?.filter?.capabilities, ...capabilities },
      },
    });
  return {
    schema: derived,
    namedSchema,
    query,
    ...(analysis ? { analysis, analysisMode: options!.mode } : {}),
  };
}
