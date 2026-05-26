import type z from 'zod';
import type { TypeSchemaOrderLevel, TypeSchemaScene } from 'zova-module-a-openapi';

export const OrderCoreBase = 100;
export const OrderBusinessBase = 1000;
export const OrderUnknownBase = 10000;
export const OrderMaxBase = 100000;

export const OrderLevelBaseMap = {
  core: OrderCoreBase,
  business: OrderBusinessBase,
  max: OrderMaxBase,
};

export function _generalSchemaRest<T extends z.ZodType>(schema: T, options: any, scene?: TypeSchemaScene) {
  return schema.openapi(scene ? { rest: { [scene]: options } } : { rest: options });
}

export function _order(order: number, level?: TypeSchemaOrderLevel) {
  const levelBase = OrderLevelBaseMap[level ?? 'business'];
  return levelBase + order;
}

export function _toLowerCaseFirstChar(str: string) {
  return str.charAt(0).toLowerCase() + str.substring(1);
}
