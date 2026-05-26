import type { IFilterTransformRecord, ISchemaObjectExtensionFieldFilter } from 'vona-module-a-web';
import type z from 'zod';

export function schemaFilter(options: ISchemaObjectExtensionFieldFilter) {
  return function (schema: z.ZodType): z.ZodType {
    return schema.openapi({
      filter: options,
    });
  };
}

export function schemaFilterTransform<T extends keyof IFilterTransformRecord>(
  filterTransformName: T,
  options?: Partial<IFilterTransformRecord[T]>,
) {
  return function (schema: z.ZodType): z.ZodType {
    return schema.openapi({
      filter: {
        transform: [filterTransformName, options],
      },
    });
  };
}

// export function schemaFilterDateRange(options?: Partial<IFilterTransformOptionsDateRange>) {
//   const separator = options?.separator;
//   const fnFilterRender = schemaRenderComponent(
//     'dataRange',
//     separator ? { separator } : undefined,
//     'filter',
//   );
//   const fnFilterTransform = schemaFilterTransform('a-web:dateRange', options);
//   return function (schema: z.ZodType): z.ZodType {
//     return fnFilterTransform(fnFilterRender(schema));
//   };
// }
