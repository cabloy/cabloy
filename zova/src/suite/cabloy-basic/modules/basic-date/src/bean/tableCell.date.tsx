import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';

import { BeanBase } from 'zova';
import {
  TableCell,
  type IJsxRenderContextTableCell,
  type ITableCellRender,
  type NextTableCellRender,
} from 'zova-module-a-table';

import { dateFormatUtil } from '../lib/utils.js';
import { TypeDateFormatPreset } from '../types/date.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'basic-date:date'?: ITableCellOptionsDate;
  }
}

export interface ITableCellOptionsDate extends IResourceTableCellOptionsBase {
  preset?: TypeDateFormatPreset;
  format?: string;
}

@TableCell<ITableCellOptionsDate>({
  preset: 'DATETIME_SHORT',
})
export class TableCellDate extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsDate,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = dateFormatUtil(next(), options);
    if (!options.class) return value;
    return <div class={options.class}>{value}</div>;
  }
}
