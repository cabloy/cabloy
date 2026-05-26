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
import { BeanBase, beanFullNameFromOnionName, cast } from 'vona';
import { createArgumentPipe, Pipe } from 'vona-module-a-aspect';

import type {
  IFilterTransformRecord,
  IFilterTransformWhere,
  TypeQueryParamsPatch,
} from '../types/filterTransform.ts';

export type TypePipeFilterData = ITableQuery;

export type TypePipeFilterResult = TypeQueryParamsPatch;

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
    // 2. fields
    await this._transformFields(params, value, options);
    // 3. system: orders
    this._transformOrders(params, options);
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

  private _transformOrders(params: TypeQueryParamsPatch, options: IPipeOptionsFilter) {
    if (!params.orders) return;
    // openapi
    const openapi: ISchemaObjectExtensionField | undefined = ZodMetadata.getOpenapiMetadata(
      options.schema!,
    ) as ISchemaObjectExtensionField | undefined;
    const table = openapi?.filter?.table;
    // loop
    for (const order of params.orders) {
      const field = order[0] as string;
      if (field.includes('.')) continue;
      let tableCurrent = table;
      let fieldCurrent = field;
      const fieldSchema = ZodMetadata.getFieldSchema(options.schema, field);
      if (fieldSchema) {
        const openapi: ISchemaObjectExtensionField | undefined = ZodMetadata.getOpenapiMetadata(
          fieldSchema,
        ) as ISchemaObjectExtensionField | undefined;
        if (openapi?.filter?.table) {
          tableCurrent = openapi?.filter?.table;
        }
        if (openapi?.filter?.originalName) {
          fieldCurrent = openapi?.filter?.originalName;
        }
      }
      cast(order)[0] = tableCurrent ? `${tableCurrent}.${fieldCurrent}` : fieldCurrent;
    }
  }

  private async _transformField(
    key: string,
    fieldValue: any,
    params: TypeQueryParamsPatch,
    value: any,
    options: IPipeOptionsFilter,
  ) {
    if (isNilOrEmptyString(fieldValue)) return;
    if (__FieldsSystem.includes(key)) return;
    const fieldSchema = ZodMetadata.getFieldSchema(options.schema, key);
    if (!fieldSchema) return;
    const fieldSchemaInner = ZodMetadata.unwrapChained(fieldSchema);
    // openapi
    const openapi: ISchemaObjectExtensionField | undefined = ZodMetadata.getOpenapiMetadata(
      fieldSchema,
    ) as ISchemaObjectExtensionField | undefined;
    // name
    const originalName = openapi?.filter?.originalName ?? key;
    let fullName: string;
    // joins
    let joinInfo;
    if (openapi?.filter?.joinOn) {
      const joinType = openapi.filter.joinType ?? 'innerJoin';
      const joinTable = openapi.filter.table;
      const joinOn = openapi.filter.joinOn;
      joinInfo = [joinType, joinTable, joinOn];
      fullName = `${joinTable}.${originalName}`;
    } else {
      fullName = originalName;
    }
    // check where
    if (Object.prototype.hasOwnProperty.call(params.where, fullName)) return;
    // filter transform
    const [transformName, transformOptions] = openapi?.filter?.transform ?? [
      'a-web:base',
      undefined,
    ];
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
    const info = {
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
    const resTransform = await beanInstance.where(info, transformOptions2);
    if (resTransform !== undefined) {
      // where
      params.where[fullName] = resTransform;
      // join
      if (joinInfo) {
        if (!params.joins) params.joins = [];
        if (params.joins.findIndex(item => item[1] === joinInfo.joinTable) === -1) {
          params.joins.push(joinInfo);
        }
      }
    }
  }

  private async _transformFields(
    params: TypeQueryParamsPatch,
    value: any,
    options: IPipeOptionsFilter,
  ) {
    // loop
    for (const key in value) {
      await this._transformField(key, value[key], params, value, options);
    }
  }
}

export const ArgFilterPro = createArgumentPipe('a-web:filter');
