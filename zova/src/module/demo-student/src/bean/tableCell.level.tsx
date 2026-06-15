import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type { ZSelectProps } from 'zova-module-basic-select';

import { BeanBase } from 'zova';
import {
  TableCell,
  type IJsxRenderContextTableCell,
  type ITableCellRender,
  type NextTableCellRender,
} from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'demo-student:level'?: ITableCellOptionsLevel;
  }
}

export interface ITableCellOptionsLevel extends IResourceTableCellOptionsBase, ZSelectProps {}

@TableCell<ITableCellOptionsLevel>({
  itemValue: 'value',
  itemTitle: 'title',
})
export class TableCellLevel extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsLevel,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    const item = options.items?.find(
      item => String(item[String(options.itemValue)]) === String(value),
    );
    const title = item?.[String(options.itemTitle)] ?? value;
    return (
      <div class="inline-flex min-w-24 justify-center rounded-full bg-info/10 px-3 py-1 text-xs font-medium text-info">
        {title}
      </div>
    );
  }
}
