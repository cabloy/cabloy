import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { classes } from 'typestyle';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'demo-student:level'?: ITableCellOptionsLevel;
  }
}

export interface ITableCellOptionsLevel extends IResourceTableCellOptionsBase {
  items?: any[];
  itemValue?: string;
  itemTitle?: string;
}

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
    return <span class={this._getBadgeClass(value, options.class)}>{title}</span>;
  }

  private _getBadgeClass(value: unknown, className?: string) {
    return classes(
      'badge font-medium whitespace-nowrap',
      this._getBadgeTone(value),
      className,
    );
  }

  private _getBadgeTone(value: unknown) {
    switch (String(value)) {
      case '1':
        return 'badge-neutral';
      case '2':
        return 'badge-info';
      case '3':
        return 'badge-success';
      default:
        return 'badge-ghost';
    }
  }
}
