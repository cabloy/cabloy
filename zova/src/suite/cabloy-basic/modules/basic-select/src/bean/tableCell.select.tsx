import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

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
    _next: NextTableCellRender,
  ) {
    const value = _next();
    const items = options.items;
    const itemValue = options.itemValue;
    const itemTitle = options.itemTitle;
    const item = items?.find(item => {
      const itemValue2 = item[String(itemValue)];
      if (String(itemValue2) === String(value)) return true;
      if (typeof itemValue2 !== 'boolean') return false;
      return itemValue2 ? value === 1 || value === '1' : value === 0 || value === '0';
    });
    const value2 = item?.[String(itemTitle)];
    if (!options.class) return value2;
    return <div class={options.class}>{value2}</div>;
  }
}
