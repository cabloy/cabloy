import type { Constructable, ILocaleMagic } from 'vona';
import type { ISchemaObjectExtensionField, TypeSchemaOrderLevel } from 'vona-module-a-openapi';

import { isClass, isEmptyObject } from '@cabloy/utils';
import { ZodMetadata } from '@cabloy/zod-openapi';
import { appMetadata, appResource, cast, deepExtend, registerMappedClassMetadataKey } from 'vona';
import { z } from 'zod';

import type { SchemaLike, TypeDecoratorRules } from '../types/decorator.ts';

import { OrderLevelBaseMap } from './const/database.ts';
import {
  SymbolDecoratorDtoOpenapi,
  SymbolDecoratorDtoPipes,
  SymbolDecoratorRule,
} from './const/decorator.ts';

export function getTargetDecoratorRules(
  target: object,
  disableRegisterMetadata?: boolean,
): TypeDecoratorRules {
  if (!disableRegisterMetadata) {
    registerMappedClassMetadataKey(target, SymbolDecoratorRule, {
      partialClass: (meta: z.ZodType) => {
        return meta.optional();
      },
    });
  }
  return appMetadata.getOwnMetadataMap(true, SymbolDecoratorRule, target);
}

export function getTargetDecoratorDtoOpenapi(
  target: object,
  disableRegisterMetadata?: boolean,
): ISchemaObjectExtensionField | undefined {
  if (!disableRegisterMetadata) {
    registerMappedClassMetadataKey(target, SymbolDecoratorDtoOpenapi, {
      replace: true,
    });
  }
  return appMetadata.getOwnMetadata(SymbolDecoratorDtoOpenapi, target);
}

export function setTargetDecoratorDtoOpenapi(
  openapi: ISchemaObjectExtensionField | undefined,
  target: object,
) {
  appMetadata.defineMetadata(SymbolDecoratorDtoOpenapi, openapi, target);
}

export function getTargetDecoratorDtoPipes(
  target: object,
  disableRegisterMetadata?: boolean,
): SchemaLike | SchemaLike[] | undefined {
  if (!disableRegisterMetadata) {
    registerMappedClassMetadataKey(target, SymbolDecoratorDtoPipes, {
      replace: true,
    });
  }
  return appMetadata.getOwnMetadata(SymbolDecoratorDtoPipes, target);
}

export function setTargetDecoratorDtoPipes(
  pipes: SchemaLike | SchemaLike[] | undefined,
  target: object,
) {
  appMetadata.defineMetadata(SymbolDecoratorDtoPipes, pipes, target);
}

export function getTargetDecoratorRuleColumns(target: object): string[] {
  const rules = getTargetDecoratorRules(target, true);
  return Object.keys(rules);
}

export function getTargetDecoratorRuleColumnsMap(target: object): Record<string, string> {
  const columns = getTargetDecoratorRuleColumns(target);
  const map = {};
  for (const column of columns) {
    map[column] = column;
  }
  return map;
}

export function mergeDtoFieldsOpenapiMetadata(target: Constructable) {
  // beanOptions
  const beanOptions = appResource.getBean(target);
  const fields = cast(beanOptions?.options)?.fields;
  if (!fields) return;
  for (const key in fields) {
    const field: ISchemaObjectExtensionField | z.ZodType = fields[key];
    if (!field) continue;
    mergeFieldOpenapiMetadata(target.prototype, key, field);
  }
}

export function mergeSchemaOpenapiMetadata<T>(
  schemaPrevious: z.ZodType<T> | undefined,
  schemaCurrent: z.ZodType<T>,
): z.ZodType<T> {
  if (!schemaPrevious) return schemaCurrent;
  if (schemaPrevious === schemaCurrent) return schemaCurrent;
  const metadataPrevious = ZodMetadata.getOpenapiMetadata(schemaPrevious);
  if (isEmptyObject(metadataPrevious)) return schemaCurrent;
  const metadataCurrent = ZodMetadata.getOpenapiMetadata(schemaCurrent);
  return schemaCurrent.openapi(deepExtend({}, metadataPrevious, metadataCurrent));
}

// fieldRule maybe undefined
export function mergeFieldOpenapiMetadata(
  target: object,
  prop: string,
  fieldRule?: ISchemaObjectExtensionField | z.ZodType,
): TypeDecoratorRules {
  // rules
  const rules = getTargetDecoratorRules(target);
  // rule
  const schemaCurrent = rules[prop];
  const metadataCurrent = schemaCurrent ? ZodMetadata.getOpenapiMetadata(schemaCurrent) : undefined;
  // merge
  if (Object.prototype.hasOwnProperty.call(fieldRule, 'parseAsync')) {
    rules[prop] = mergeSchemaOpenapiMetadata(schemaCurrent as any, fieldRule as any) as any;
  } else {
    if (schemaCurrent) {
      if (!isEmptyObject(fieldRule)) {
        rules[prop] = schemaCurrent.openapi(deepExtend({}, metadataCurrent, fieldRule));
      }
    } else {
      if (isEmptyObject(fieldRule)) {
        rules[prop] = z.any();
      } else {
        rules[prop] = z.any().openapi(fieldRule as any);
      }
    }
  }
  return rules;
}

export function prepareClassType<T>(
  classType: (() => Constructable<T>) | Constructable<T>,
): Constructable<T> {
  return isClass(classType) ? (classType as Constructable<T>) : cast(classType)();
}

export function normalizeErrorParams(params?: string | ILocaleMagic | any, errorDefault?: any) {
  const params2 = params as any;
  if (!params2) return errorDefault;
  if (params2.toJSON) {
    return { error: () => params2 };
  }
  return z.util.normalizeParams(params2);
}

export function $order(order: number, level?: TypeSchemaOrderLevel) {
  const levelBase = OrderLevelBaseMap[level ?? 'business'];
  return levelBase + order;
}
