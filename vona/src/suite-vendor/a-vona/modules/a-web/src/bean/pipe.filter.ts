import type {
  IDecoratorPipeOptions,
  IDecoratorPipeOptionsArgument,
  IPipeTransform,
} from 'vona-module-a-aspect';
import type {
  ISchemaObjectExtensionField,
  ITableQuery,
  RouteHandlerArgumentMeta,
} from 'vona-module-a-openapi';
import type { ValidatorOptions } from 'vona-module-a-validation';

import { isNil, isNilOrEmptyString } from '@cabloy/utils';
import { ZodMetadata } from '@cabloy/zod-openapi';
import { isNullableSchema } from '@cabloy/zod-query';
import { BeanBase, beanFullNameFromOnionName, cast } from 'vona';
import { createArgumentPipe, Pipe } from 'vona-module-a-aspect';

import type {
  IFilterTransformRecord,
  IFilterTransformWhere,
  TypeQueryParamsPatch,
} from '../types/filterTransform.ts';

export type TypePipeFilterData = ITableQuery;

export type TypePipeFilterResult = TypeQueryParamsPatch;
type TypeQueryJoin = NonNullable<TypeQueryParamsPatch['joins']>[number];

export interface IPipeOptionsFilter
  extends IDecoratorPipeOptions, IDecoratorPipeOptionsArgument, ValidatorOptions {}

const __FieldsSystem = ['columns', 'where', 'orders', 'pageNo', 'pageSize'];

@Pipe<IPipeOptionsFilter>({
  // ValidatorOptions
  disableErrorMessages: false,
  errorHttpStatusCode: 400,
  loose: false,
  strict: false,
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
    // validateSchema
    value = (await this.bean.validator.validateSchema(
      options.schema,
      value,
      options,
      metadata.field,
    )) as TypePipeFilterData;
    // transform
    const params = await this._transform(value, options);
    // ok
    return params;
  }

  private async _transform(value: TypePipeFilterData, options: IPipeOptionsFilter) {
    // 1. system: columns/where/orders/pageNo/pageSize
    const params = this._transformSystem(value);
    const rootOpenapi = ZodMetadata.getOpenapiMetadata(options.schema!) as
      | ISchemaObjectExtensionField
      | undefined;
    // 2. fields
    await this._transformFields(params, value, options, rootOpenapi);
    // 3. system: orders
    this._transformOrders(params, options, rootOpenapi);
    // ok
    return params;
  }

  // system: columns/where/orders/pageNo/pageSize
  private _transformSystem(value: TypePipeFilterData) {
    const params = {} as TypeQueryParamsPatch;
    // columns
    if (!isNil(value.columns)) params.columns = value.columns as any;
    // where
    params.where = value.where ?? {};
    // orders
    if (!isNil(value.orders)) {
      if (typeof value.orders === 'string') {
        if (value.orders.startsWith('[') && value.orders.endsWith(']')) {
          params.orders = JSON.parse(value.orders);
        } else {
          params.orders = [cast(value.orders).split(',')];
        }
      } else {
        params.orders = value.orders as any;
      }
    }
    // pageNo/pageSize
    if (!isNil(value.pageNo) && !isNil(value.pageSize)) {
      params.offset = (value.pageNo - 1) * value.pageSize;
      params.limit = value.pageSize;
    }
    // ok
    return params;
  }

  private _transformOrders(
    params: TypeQueryParamsPatch,
    options: IPipeOptionsFilter,
    rootOpenapi: ISchemaObjectExtensionField | undefined,
  ) {
    if (!params.orders) return;
    for (const order of params.orders) {
      if (!Array.isArray(order) || order.length !== 2) {
        throw new Error('invalid order');
      }
      const [key, direction] = order;
      if (typeof key !== 'string' || (direction !== 'asc' && direction !== 'desc')) {
        throw new Error('invalid order');
      }
      const info = this._resolveField(key, options, rootOpenapi);
      if (!info || info.openapi?.filter?.capabilities?.order === false) {
        throw new Error(`invalid order field: ${key}`);
      }
      cast(order)[0] = info.orderFullName;
      this._addJoin(params, info.joinInfo);
    }
  }

  private _resolveField(
    key: string,
    options: IPipeOptionsFilter,
    rootOpenapi: ISchemaObjectExtensionField | undefined,
  ) {
    const fieldSchema = ZodMetadata.getFieldSchema(options.schema!, key);
    if (!fieldSchema) {
      if (!rootOpenapi?.filter?.table) {
        return { orderFullName: key };
      }
      const keyParts = key.split('.');
      const [table, field] = keyParts;
      if (!table || !field || keyParts.length !== 2) return;
      const resolved = this._resolveField(field, options, rootOpenapi);
      if (!resolved || resolved.orderFullName !== key) return;
      return resolved;
    }
    const fieldSchemaInner = ZodMetadata.unwrapChained(fieldSchema);
    const openapi: ISchemaObjectExtensionField | undefined = ZodMetadata.getOpenapiMetadata(
      fieldSchema,
    ) as ISchemaObjectExtensionField | undefined;
    const originalName = openapi?.filter?.originalName ?? key;
    const table = openapi?.filter?.table ?? rootOpenapi?.filter?.table;
    const joinInfo = openapi?.filter?.joinOn
      ? ([
          openapi.filter.joinType ?? 'innerJoin',
          openapi.filter.table,
          openapi.filter.joinOn,
        ] as TypeQueryJoin)
      : undefined;
    return {
      fieldSchema,
      fieldSchemaInner,
      openapi,
      originalName,
      fullName: joinInfo ? `${openapi?.filter?.table}.${originalName}` : originalName,
      orderFullName: table ? `${table}.${originalName}` : originalName,
      joinInfo,
    };
  }

  private _addJoin(params: TypeQueryParamsPatch, joinInfo: TypeQueryJoin | undefined) {
    if (!joinInfo) return;
    if (!params.joins) params.joins = [];
    if (params.joins.findIndex(item => item[1] === joinInfo[1]) === -1) {
      params.joins.push(joinInfo);
    }
  }

  private async _transformField(
    key: string,
    fieldValue: any,
    params: TypeQueryParamsPatch,
    value: any,
    options: IPipeOptionsFilter,
    rootOpenapi: ISchemaObjectExtensionField | undefined,
  ) {
    if (__FieldsSystem.includes(key)) return;
    const info = this._resolveField(key, options, rootOpenapi);
    if (!info) return;
    const { fieldSchema, fieldSchemaInner, openapi, originalName, fullName, joinInfo } = info;
    const [transformName, transformOptions] = openapi?.filter?.transform ?? [
      'a-web:base',
      undefined,
    ];
    const fieldNullable = fieldValue === null && isNullableSchema(fieldSchema);
    if (isNilOrEmptyString(fieldValue) && !fieldNullable) return;
    // check where
    if (Object.prototype.hasOwnProperty.call(params.where, fullName)) return;
    // filter transform
    const transformOptions2 = this.bean.onion.filterTransform.getOnionOptionsDynamic(
      transformName as keyof IFilterTransformRecord,
      transformOptions,
    );
    // execute
    const beanFullName = beanFullNameFromOnionName(transformName, 'filterTransform');
    const beanInstance = this.bean._getBean(beanFullName) as unknown as IFilterTransformWhere;
    if (!beanInstance) {
      throw new Error(`filterTransform bean not found: ${beanFullName}`);
    }
    if (!beanInstance.where) {
      throw new Error(`filterTransform.where not found: ${beanFullName}`);
    }
    const transformInfo = {
      params,
      query: value,
      options,
      originalName,
      fullName,
      key,
      value: fieldValue,
      type: fieldSchemaInner.type,
      schema: fieldSchema,
      openapi,
    };
    const resTransform = await beanInstance.where(transformInfo, transformOptions2);
    if (resTransform !== undefined) {
      // where
      params.where[fullName] = resTransform;
      // join
      this._addJoin(params, joinInfo);
    }
  }

  private async _transformFields(
    params: TypeQueryParamsPatch,
    value: any,
    options: IPipeOptionsFilter,
    rootOpenapi: ISchemaObjectExtensionField | undefined,
  ) {
    // loop
    for (const key in value) {
      await this._transformField(key, value[key], params, value, options, rootOpenapi);
    }
  }
}

export const ArgFilterPro = createArgumentPipe('a-web:filter');
