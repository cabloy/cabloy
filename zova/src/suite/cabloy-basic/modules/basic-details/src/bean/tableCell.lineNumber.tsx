import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'basic-details:lineNumber'?: ITableCellOptionsLineNumber;
  }
}

export interface ITableCellOptionsLineNumber extends IResourceTableCellOptionsBase {}

@TableCell<ITableCellOptionsLineNumber>()
export class TableCellLineNumber extends BeanBase implements ITableCellRender {
  render(
    _options: ITableCellOptionsLineNumber,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { cellContext } = renderContext;
    const row = cellContext?.row;
    return row.index + 1;
  }
}
