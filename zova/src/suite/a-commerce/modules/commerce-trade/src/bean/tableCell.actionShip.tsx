import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import type { ApiSchemaCommerceTradeDtoOrderSelectResItem } from '../api/openapi/schemas.ts';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'commerce-trade:actionShip'?: ITableCellOptionsActionShip;
  }
}

export interface ITableCellOptionsActionShip extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionShip>({
  class: 'btn btn-outline btn-primary join-item',
})
export class TableCellActionShip extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionShip,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { cellContext } = renderContext;
    const order = cellContext.row.original as ApiSchemaCommerceTradeDtoOrderSelectResItem;
    const state = order.state;
    if (state !== 'paid') return;
    return renderContext.$jsx.render(
      'commerce-trade:tableCellActionShip',
      options,
      renderContext.$celScope,
      renderContext,
    );
  }
}
