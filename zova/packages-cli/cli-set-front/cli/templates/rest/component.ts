import type z from 'zod';
import type { TypeRenderComponentJsx } from 'zova-jsx';
import type {
  IResourceFormFieldRecord,
  IResourceTableCellRecord,
  IResourceTableActionRowRecord,
  IResourceFormActionRowRecord,
  IResourceTableActionBulkRecord,
  IResourceBlockRecord,
  TypeFormSchemaScene,
  IResourceRenderTableActionRowOptionsAction,
  IResourceRenderFormActionRowOptionsAction,
  IResourceRenderTableActionBulkOptionsAction,
  IResourceRenderBlockOptionsBlock,
  IResourceTableActionRowOptionsBase,
  IResourceFormActionRowOptionsBase,
  IResourceTableActionBulkOptionsBase,
} from 'zova-module-a-openapi';

import { _generalSchemaRest, _toLowerCaseFirstChar } from './inner.ts';

export function schemaRenderField<K extends keyof IResourceFormFieldRecord, T extends z.ZodType>(
  render: K,
  options?: IResourceFormFieldRecord[K],
  scene?: TypeFormSchemaScene,
) {
  return function (schema: T): T {
    const options2 = options !== undefined ? { render, options } : { render };
    return _generalSchemaRest(schema, options2, scene ?? 'form'); // diff from table
  };
}

export function schemaRenderFieldJsx<T extends z.ZodType>(
  renderComponentJsx: TypeRenderComponentJsx,
  scene?: TypeFormSchemaScene,
) {
  return function (schema: T): T {
    const options = { render: renderComponentJsx };
    return _generalSchemaRest(schema, options, scene ?? 'form'); //diff from table
  };
}

export function schemaRenderCell<
  K extends keyof (IResourceTableCellRecord & IResourceTableActionRowRecord),
  T extends z.ZodType,
>(render: K, options?: (IResourceTableCellRecord & IResourceTableActionRowRecord)[K]) {
  return function (schema: T): T {
    const options2 = options !== undefined ? { render, columnProps: options } : { render };
    return _generalSchemaRest(schema, options2, 'table');
  };
}

export function schemaRenderCellJsx<T extends z.ZodType>(
  renderComponentJsx: TypeRenderComponentJsx,
  options?: Pick<IResourceTableActionRowOptionsBase, 'permission'>,
) {
  return function (schema: T): T {
    const options2 =
      options !== undefined
        ? { render: renderComponentJsx, columnProps: options }
        : { render: renderComponentJsx };
    return _generalSchemaRest(schema, options2, 'table');
  };
}

export function schemaRenderTableActionRow<K extends keyof IResourceTableActionRowRecord>(
  render: K,
  options?: IResourceTableActionRowRecord[K],
): IResourceRenderTableActionRowOptionsAction {
  const pos = render.toString().indexOf(':action');
  const name =
    pos > -1
      ? _toLowerCaseFirstChar(render.toString().substring(pos + ':action'.length))
      : undefined;
  return { $$typeof: 'zova-jsx:actionRow', name, render, options };
}

export function schemaRenderTableActionRowJsx(
  renderComponentJsx: TypeRenderComponentJsx,
  options?: Pick<IResourceTableActionRowOptionsBase, 'permission'>,
) {
  return { render: renderComponentJsx, options };
}

export function schemaRenderFormActionRow<K extends keyof IResourceFormActionRowRecord>(
  render: K,
  options?: IResourceFormActionRowRecord[K],
): IResourceRenderFormActionRowOptionsAction {
  const pos = render.toString().indexOf(':action');
  const name =
    pos > -1
      ? _toLowerCaseFirstChar(render.toString().substring(pos + ':action'.length))
      : undefined;
  return { $$typeof: 'zova-jsx:actionRow', name, render, options };
}

export function schemaRenderFormActionRowJsx(
  renderComponentJsx: TypeRenderComponentJsx,
  options?: Pick<IResourceFormActionRowOptionsBase, 'permission'>,
) {
  return { render: renderComponentJsx, options };
}

export function schemaRenderTableActionBulk<K extends keyof IResourceTableActionBulkRecord>(
  render: K,
  options?: IResourceTableActionBulkRecord[K],
): IResourceRenderTableActionBulkOptionsAction {
  const pos = render.toString().indexOf(':action');
  const name =
    pos > -1
      ? _toLowerCaseFirstChar(render.toString().substring(pos + ':action'.length))
      : undefined;
  return { $$typeof: 'zova-jsx:actionBulk', name, render, options };
}

export function schemaRenderTableActionBulkJsx(
  renderComponentJsx: TypeRenderComponentJsx,
  options?: Pick<IResourceTableActionBulkOptionsBase, 'permission'>,
) {
  return { render: renderComponentJsx, options };
}

export function schemaRenderBlock<K extends keyof IResourceBlockRecord>(
  render: K,
  options?: IResourceBlockRecord[K],
): IResourceRenderBlockOptionsBlock {
  return { $$typeof: 'zova-jsx:block', render, options };
}

export function schemaRenderBlockJsx(renderComponentJsx: TypeRenderComponentJsx) {
  return { render: renderComponentJsx };
}
