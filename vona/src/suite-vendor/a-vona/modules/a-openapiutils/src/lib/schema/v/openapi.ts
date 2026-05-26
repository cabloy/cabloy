import type { ILocaleMagic } from 'vona';
import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';
import type { z } from 'zod';

export function schemaOpenapi<T extends z.ZodType>(metadata: ISchemaObjectExtensionField): T;
export function schemaOpenapi<T extends z.ZodType>(
  refId: string,
  metadata?: ISchemaObjectExtensionField,
): T;
export function schemaOpenapi<T extends z.ZodType>(refId: any, metadata?: any) {
  return function (schema: T): T {
    return schema.openapi(refId, metadata);
  };
}

export function schemaTitle<T extends z.ZodType>(title?: string | ILocaleMagic) {
  return function (schema: T): T {
    return schema.openapi({ title });
  };
}

export function schemaDescription<T extends z.ZodType>(description?: string | ILocaleMagic) {
  return function (schema: T): T {
    return schema.openapi({ description });
  };
}

export function schemaExample<T extends z.ZodType>(example?: any) {
  return function (schema: T): T {
    return schema.openapi({ example });
  };
}
