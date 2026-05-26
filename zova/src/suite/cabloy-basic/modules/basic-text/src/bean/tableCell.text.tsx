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
    'basic-text:text'?: ITableCellOptionsText;
  }
}

export interface ITableCellOptionsText extends IResourceTableCellOptionsBase {}

@TableCell<ITableCellOptionsText>()
export class TableCellText extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsText,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    if (!options.class) return value;
    return <div class={options.class}>{value}</div>;
  }
}
