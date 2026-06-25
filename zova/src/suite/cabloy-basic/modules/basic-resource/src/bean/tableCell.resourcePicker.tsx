import type { IResourceTableCellOptionsBase, ITableQuery } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';
import { ZSelectProps } from 'zova-module-basic-select';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'start-resource:resourcePicker'?: ITableCellOptionsResourcePicker;
  }
}

export interface ITableCellOptionsResourcePicker extends IResourceTableCellOptionsBase {
  resource?: string;
  actionPath?: string;
  query?: ITableQuery;
  relationName?: string;
  selectOptions?: ZSelectProps;
}

@TableCell<ITableCellOptionsResourcePicker>({
  selectOptions: { itemValue: 'id', itemTitle: 'name' },
})
export class TableCellResourcePicker extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsResourcePicker,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $celScope, cellContext } = renderContext;
    // const value = next();
    let relationName = options.relationName;
    if (!relationName) {
      relationName = $celScope.name.substring(0, $celScope.name.lastIndexOf('Id'));
    }
    const obj = cellContext.row.original[relationName];
    const value2 = obj?.[String(options.selectOptions!.itemTitle)];
    if (!options.class) return value2;
    return <div class={options.class}>{value2}</div>;
  }
}
