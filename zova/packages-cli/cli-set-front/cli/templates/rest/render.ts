import {
  schemaRenderBlock,
  schemaRenderBlockJsx,
  schemaRenderCell,
  schemaRenderCellJsx,
  schemaRenderField,
  schemaRenderFieldJsx,
  schemaRenderFormActionRow,
  schemaRenderFormActionRowJsx,
  schemaRenderTableActionBulk,
  schemaRenderTableActionBulkJsx,
  schemaRenderTableActionRow,
  schemaRenderTableActionRowJsx,
} from './component.ts';
import {
  schemaRenderDisableNotifyChanged,
  schemaRenderFieldSource,
  schemaRenderLayout,
  schemaRenderOrder,
  schemaRenderReadonly,
  schemaRenderVisible,
} from './rest.ts';

export const ZovaRender = {
  // render
  layout: schemaRenderLayout,
  visible: schemaRenderVisible,
  readonly: schemaRenderReadonly,
  order: schemaRenderOrder,
  disableNotifyChanged: schemaRenderDisableNotifyChanged,
  fieldSource: schemaRenderFieldSource,
  // component
  field: schemaRenderField,
  fieldJsx: schemaRenderFieldJsx,
  cell: schemaRenderCell,
  cellJsx: schemaRenderCellJsx,
  tableActionRow: schemaRenderTableActionRow,
  tableActionRowJsx: schemaRenderTableActionRowJsx,
  formActionRow: schemaRenderFormActionRow,
  formActionRowJsx: schemaRenderFormActionRowJsx,
  tableActionBulk: schemaRenderTableActionBulk,
  tableActionBulkJsx: schemaRenderTableActionBulkJsx,
  block: schemaRenderBlock,
  blockJsx: schemaRenderBlockJsx,
};
