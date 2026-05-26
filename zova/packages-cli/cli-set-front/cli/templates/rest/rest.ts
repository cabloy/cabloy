import type z from 'zod';

import { TypeFormSchemaScene } from 'zova-module-a-openapi';
import { ISchemaRenderComponentLayoutOptions } from 'zova-module-a-openapi';
import { TypeSchemaScene } from 'zova-module-a-openapi';
import { TypeSchemaOrderLevel } from 'zova-module-a-openapi';

import { _generalSchemaRest, _order } from './inner.ts';

export function schemaRenderLayout<T extends z.ZodType>(
  layoutOptions: ISchemaRenderComponentLayoutOptions,
  scene?: TypeFormSchemaScene,
) {
  return function (schema: T): T {
    const options = { layout: layoutOptions };
    return _generalSchemaRest(schema, options, scene);
  };
}

export function schemaRenderVisible<T extends z.ZodType>(
  visible: boolean = true,
  scene?: TypeSchemaScene,
) {
  return function (schema: T): T {
    const options = { visible };
    return _generalSchemaRest(schema, options, scene);
  };
}

export function schemaRenderReadonly<T extends z.ZodType>(
  readonly: boolean = true,
  scene?: TypeSchemaScene,
) {
  return function (schema: T): T {
    const options = { readonly };
    return _generalSchemaRest(schema, options, scene);
  };
}

export function schemaRenderDisableNotifyChanged<T extends z.ZodType>(
  disableNotifyChanged: boolean = true,
  scene?: TypeSchemaScene,
) {
  return function (schema: T): T {
    const options = { disableNotifyChanged };
    return _generalSchemaRest(schema, options, scene);
  };
}

export function schemaRenderFieldSource<T extends z.ZodType>(
  fieldSource: string,
  scene?: TypeSchemaScene,
) {
  return function (schema: T): T {
    const options = { fieldSource };
    return _generalSchemaRest(schema, options, scene);
  };
}

export function schemaRenderOrder<T extends z.ZodType>(
  order: number,
  level?: TypeSchemaOrderLevel,
  scene?: TypeSchemaScene,
) {
  const orderReal = _order(order, level);
  return function (schema: T): T {
    const options = { order: orderReal };
    return _generalSchemaRest(schema, options, scene);
  };
}
