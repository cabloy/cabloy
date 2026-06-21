import type {
  IResourceDetailsActionRowOptionsBase,
  IResourceRenderDetailsActionRowOptionsAction,
} from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'basic-details:actionOperationsRow'?: ITableCellOptionsActionOperationsRow;
  }
}

export interface ITableCellOptionsActionOperationsRow extends IResourceDetailsActionRowOptionsBase {
  actions?: IResourceRenderDetailsActionRowOptionsAction[];
}

@TableCell<ITableCellOptionsActionOperationsRow>()
export class TableCellActionOperationsRow extends BeanBase implements ITableCellRender {
  render(
    _options: ITableCellOptionsActionOperationsRow,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    return <div>sssss</div>;
    return next();
  }
}
