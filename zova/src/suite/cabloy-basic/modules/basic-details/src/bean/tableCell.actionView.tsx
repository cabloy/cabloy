import type { IResourceDetailsActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { IIconRecord } from 'zova-module-a-icon';
import { TableCell } from 'zova-module-a-table';
import { IModalDialogOptions } from 'zova-module-basic-app';

import { ServiceDetail } from '../service/detail.jsx';
import { IDialogFormOptions } from '../types/dialogForm.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'basic-details:actionView'?: ITableCellOptionsActionView;
  }
}

export interface ITableCellOptionsActionView extends IResourceDetailsActionRowOptionsBase {
  dialogOptions?: IModalDialogOptions & { icon?: keyof IIconRecord; title?: string };
}

@TableCell<ITableCellOptionsActionView>({
  class: 'hover:text-blue-500',
})
export class TableCellActionView extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionView,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const { ctx, $celScope, cellContext } = renderContext;
    const value = next();
    return (
      <a
        class={options.class}
        href="#"
        onClick={async e => {
          e.preventDefault();
          e.stopPropagation();
          const $$details = $celScope.$$details;
          if (!$$details) throw new Error('should provide $$details in cell scope');
          const detailItem = cellContext.row.original as Record<string, any>;
          const serverDetail = await ctx.bean._newBean(ServiceDetail, true, {
            locale: this.scope.locale,
            schema: $$details.schemaForm,
            data: detailItem,
            formScene: 'view',
            schemaScene: 'form-view',
            icon: options.dialogOptions?.icon,
            title: options.dialogOptions?.title ?? this.scope.locale.ViewDetail(),
            dialogOptions: options.dialogOptions,
          } satisfies IDialogFormOptions);
          serverDetail.openDialogForm();
        }}
      >
        {value}
      </a>
    );
  }
}
