import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'commerce-trade:actionAdjustStock'?: ITableCellOptionsActionAdjustStock;
  }
}

export interface ITableCellOptionsActionAdjustStock extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionAdjustStock>({
  class: 'btn btn-outline btn-secondary join-item',
})
export class TableCellActionAdjustStock extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionAdjustStock,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    return renderContext.$jsx.render(
      'commerce-trade:tableCellActionAdjustStock',
      options,
      renderContext.$celScope,
      renderContext,
    );
  }
}
