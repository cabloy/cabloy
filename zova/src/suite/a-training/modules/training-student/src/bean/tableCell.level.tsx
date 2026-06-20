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
    'training-student:level'?: ITableCellOptionsLevel;
  }
}

export interface ITableCellOptionsLevelItem {
  value?: any;
  title?: string;
}

export interface ITableCellOptionsLevel extends IResourceTableCellOptionsBase {
  items?: ITableCellOptionsLevelItem[];
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
    return (
      <span
        class={classes(
          'badge badge-sm font-medium border-0 whitespace-nowrap px-2',
          this._getBadgeClass(value),
          options.class,
        )}
      >
        {title}
      </span>
    );
  }

  private _getBadgeClass(value: unknown) {
    if (String(value) === '1') return 'badge-warning text-warning-content';
    if (String(value) === '2') return 'badge-info text-info-content';
    if (String(value) === '3') return 'badge-success text-success-content';
    return 'badge-neutral text-neutral-content';
  }
}
