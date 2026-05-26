import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';

import { BeanBase } from 'zova';
import {
  TableCell,
  type IJsxRenderContextTableCell,
  type ITableCellRender,
  type NextTableCellRender,
} from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'basic-text:textarea'?: ITableCellOptionsTextarea;
  }
}

export interface ITableCellOptionsTextarea extends IResourceTableCellOptionsBase {}

@TableCell<ITableCellOptionsTextarea>()
export class TableCellTextarea extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsTextarea,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    if (!options.class) return value;
    return <div class={options.class}>{value}</div>;
  }
}
