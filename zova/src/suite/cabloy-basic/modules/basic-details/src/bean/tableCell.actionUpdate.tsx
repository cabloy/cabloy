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
    'basic-details:actionUpdate'?: ITableCellOptionsActionUpdate;
  }
}

export interface ITableCellOptionsActionUpdate extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionUpdate>()
export class TableCellActionUpdate extends BeanBase implements ITableCellRender {
  render(
    _options: ITableCellOptionsActionUpdate,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    return next();
  }
}
