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
    'basic-table:actionView'?: ITableCellOptionsActionView;
  }
}

export interface ITableCellOptionsActionView extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionView>({
  class: 'hover:text-blue-500',
})
export class TableCellActionView extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionView,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const { $host } = renderContext;
    const value = next();
    return (
      <a
        class={options.class}
        href="#"
        onClick={async e => {
          e.preventDefault();
          e.stopPropagation();
          await $host.$performCommand('basic-commands:view', options, renderContext);
        }}
      >
        {value}
      </a>
    );
  }
}
