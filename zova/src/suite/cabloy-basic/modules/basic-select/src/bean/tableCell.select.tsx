import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';

import { BeanBase } from 'zova';
import {
  TableCell,
  type IJsxRenderContextTableCell,
  type ITableCellRender,
  type NextTableCellRender,
} from 'zova-module-a-table';

import { ZSelectProps } from '../.metadata/index.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'basic-select:select'?: ITableCellOptionsSelect;
  }
}

export interface ITableCellOptionsSelect extends IResourceTableCellOptionsBase, ZSelectProps {}

@TableCell<ITableCellOptionsSelect>({
  itemValue: 'value',
  itemTitle: 'title',
})
export class TableCellSelect extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsSelect,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    const item = options.items?.find(
      item => String(item[String(options.itemValue)]) === String(value),
    );
    const value2 = item?.[String(options.itemTitle)];
    if (!options.class) return value2;
    return <div class={options.class}>{value2}</div>;
  }
}
