import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import type { ApiSchemaCommerceTradeDtoOrderSelectResItem } from '../api/openapi/schemas.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'commerce-trade:actionRefund'?: ITableCellOptionsActionRefund;
  }
}

export interface ITableCellOptionsActionRefund extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionRefund>({
  class: 'btn btn-outline btn-warning join-item',
})
export class TableCellActionRefund extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionRefund,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const order = renderContext.cellContext.row
      .original as ApiSchemaCommerceTradeDtoOrderSelectResItem;
    if (order.state !== 'refund_requested' && order.state !== 'refund_approved') return;
    return renderContext.$jsx.render(
      'commerce-trade:tableCellActionRefund',
      options,
      renderContext.$celScope,
      renderContext,
    );
  }
}
