import type {
  IDecoratorPipeOptions,
  IDecoratorPipeOptionsArgument,
  IPipeTransform,
} from 'vona-module-a-aspect';
import type { ISchemaObjectExtensionField, RouteHandlerArgumentMeta } from 'vona-module-a-openapi';
import type {
  IAnalysisPolicy,
  IQueryPolicy,
  TypeAnalysisMode,
  TypeQueryInput,
  TypeQueryPredicate,
} from 'vona-module-a-orm';
import type { ValidatorOptions } from 'vona-module-a-validation';
import type z from 'zod';

import { ZodMetadata } from '@cabloy/zod-openapi';
import { isNullableSchema } from '@cabloy/zod-query';
import { BeanBase, beanFullNameFromOnionName, runWithZodQueryCoercion } from 'vona';
import { createArgumentPipe, Pipe } from 'vona-module-a-aspect';
import {
  checkQueryBudget,
  PublicQueryError,
  queryDefaultLimits,
  resolveAnalysis,
  validateQuery,
} from 'vona-module-a-orm';

import type { IFilterTransformRecord, IFilterTransformWhere } from '../types/filterTransform.ts';

import { filterControlNames } from '../lib/analysisFilter.ts';

export type TypePipeFilterData = Record<string, unknown>;
export type TypePipeFilterResult = TypeQueryInput;

export interface IPipeOptionsFilter
  extends IDecoratorPipeOptions, IDecoratorPipeOptionsArgument, ValidatorOptions {
  query?: IQueryPolicy;
  namedSchema?: z.ZodObject;
  analysis?: IAnalysisPolicy;
  analysisMode?: TypeAnalysisMode;
}

const jsonControls = ['where', 'orders', 'groups', 'aggrs'];

@Pipe<IPipeOptionsFilter>({
  disableErrorMessages: false,
  errorHttpStatusCode: 400,
  loose: false,
  strict: true,
})
export class PipeFilter
  extends BeanBase
  implements IPipeTransform<TypePipeFilterData, TypePipeFilterResult>
{
  async transform(
    value: TypePipeFilterData,
    metadata: RouteHandlerArgumentMeta,
    options: IPipeOptionsFilter,
  ): Promise<TypePipeFilterResult> {
    if (!options.schema) {
      throw new Error(
        `should specify the schema of pipeFilter: ${metadata.controller.name}.${metadata.method}#${metadata.index}`,
      );
    }
    if (!!options.analysis !== !!options.analysisMode)
      throw new TypeError('Analysis filter requires both a policy and an action mode');
    const object = ZodMetadata.unwrapChained(options.schema) as z.ZodObject;
    if (object.type !== 'object') throw new TypeError('Filter requires an object schema');
    const limits = options.query?.limits ?? queryDefaultLimits;
    // Bound bytes and graph traversal before JSON decoding, without applying leaf-string
    // limits to serialized AST controls. Native inputs receive the real limits below.
    checkQueryBudget(value, { ...limits, maxStringLength: limits.maxBytes });
    if (!value || typeof value !== 'object' || Array.isArray(value))
      throw new PublicQueryError('query_shape');
    for (const key of Object.keys(value)) {
      if (!Object.hasOwn(object.shape, key))
        throw new PublicQueryError('query_unknown_control', key);
    }
    const prepared = { ...value };
    if ((options.type ?? metadata.type) === 'query') {
      for (const key of jsonControls) {
        if (typeof prepared[key] !== 'string') continue;
        try {
          prepared[key] = JSON.parse(prepared[key]);
        } catch {
          throw new PublicQueryError('query_json', key);
        }
      }
      for (const key of ['pageNo', 'pageSize']) {
        if (typeof prepared[key] !== 'string') continue;
        if (!/^[1-9]\d*$/.test(prepared[key])) throw new PublicQueryError('query_pagination', key);
        prepared[key] = Number(prepared[key]);
      }
    }
    checkQueryBudget(prepared, limits);
    const controls = Object.fromEntries(
      Object.entries(prepared).filter(([key]) => filterControlNames.includes(key as any)),
    );
    let canonical: TypeQueryInput;
    if (options.query) {
      canonical = validateQuery(
        options.query,
        controls,
        options.analysisMode ?? 'select',
        options.analysis,
      );
    } else {
      const pages = object
        .pick(
          Object.fromEntries(
            ['pageNo', 'pageSize'].filter(key => object.shape[key]).map(key => [key, true]),
          ) as any,
        )
        .strict();
      canonical = (await this.bean.validator.validateSchema(
        pages,
        controls,
        { ...options, queryCoercion: false },
        metadata.field,
      )) as TypeQueryInput;
    }
    const namedSchema =
      options.namedSchema ??
      object
        .omit(
          Object.fromEntries(
            filterControlNames.filter(key => object.shape[key]).map(key => [key, true]),
          ) as any,
        )
        .strict();
    const namedInput = Object.fromEntries(
      Object.entries(prepared).filter(([key]) => !filterControlNames.includes(key as any)),
    );
    const named = (await this.bean.validator.validateSchema(
      namedSchema,
      namedInput,
      options,
      metadata.field,
    )) as Record<string, unknown>;
    const predicates: TypeQueryPredicate[] = canonical.where ? [canonical.where] : [];
    for (const [key, fieldValue] of Object.entries(named)) {
      const fieldSchema = namedSchema.shape[key] as z.ZodType;
      const fieldNullable = fieldValue === null && isNullableSchema(fieldSchema);
      if ((fieldValue === undefined || fieldValue === null || fieldValue === '') && !fieldNullable)
        continue;
      const openapi = ZodMetadata.getOpenapiMetadata(fieldSchema) as
        | ISchemaObjectExtensionField
        | undefined;
      const convenience = options.query?.conveniences[key];
      const field = convenience?.field ?? key;
      if (options.query && !options.query.fields[field])
        throw new PublicQueryError('query_field', key);
      const [transformName, transformOptions] = openapi?.filter?.transform ?? [
        'a-web:base',
        undefined,
      ];
      const dynamic = this.bean.onion.filterTransform.getOnionOptionsDynamic(
        transformName as keyof IFilterTransformRecord,
        transformOptions,
      );
      const beanFullName = beanFullNameFromOnionName(transformName, 'filterTransform');
      const transform = this.bean._getBean(beanFullName) as unknown as IFilterTransformWhere;
      if (!transform?.where) throw new Error(`filterTransform.where not found: ${beanFullName}`);
      const predicate = await transform.where(
        {
          params: canonical,
          query: prepared,
          options,
          originalName: field,
          fullName: field,
          key,
          value: fieldValue,
          type: options.query?.fields[field]?.type ?? ZodMetadata.unwrapChained(fieldSchema).type,
          op: convenience?.op,
          schema: fieldSchema,
          openapi,
        },
        dynamic,
      );
      if (predicate) predicates.push(predicate);
    }
    // A supplied predicate and each named contribution are all effective; named
    // controls never survive into the canonical input or compiler revalidation.
    if (predicates.length) {
      canonical = {
        ...canonical,
        where: predicates.length === 1 ? predicates[0] : { and: predicates },
      } as TypeQueryInput;
    }
    if (options.analysis && options.analysisMode) {
      Object.assign(
        canonical,
        runWithZodQueryCoercion(false, () =>
          resolveAnalysis(options.analysis!, options.analysisMode!, canonical),
        ),
      );
    }
    if (options.query) {
      canonical = validateQuery(
        options.query,
        canonical,
        options.analysisMode ?? 'select',
        options.analysis,
        true,
      );
    } else {
      checkQueryBudget(canonical, {
        ...limits,
        maxNodes: limits.maxNodes + 64,
        maxBytes: limits.maxBytes + 4096,
        maxValueDepth: limits.maxValueDepth + 2,
      });
    }
    return canonical;
  }
}

export const ArgFilterPro = createArgumentPipe('a-web:filter');
