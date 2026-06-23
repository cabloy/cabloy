import type { IResourceDetailsActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';
import type { AppModalItem, IModalDialogOptions } from 'zova-module-basic-app';

import { BeanBase, deepExtend } from 'zova';
import { TypeFormOnSubmitData } from 'zova-module-a-form';
import { IIconRecord, ZIcon } from 'zova-module-a-icon';
import { TableCell } from 'zova-module-a-table';

import { ServiceDetail } from '../service/detail.jsx';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'basic-details:actionUpdate'?: ITableCellOptionsActionUpdate;
  }
}

export interface ITableCellOptionsActionUpdate extends IResourceDetailsActionRowOptionsBase {
  dialogOptions?: IModalDialogOptions & { icon?: keyof IIconRecord; title?: string };
}

@TableCell<ITableCellOptionsActionUpdate>({
  class: 'btn btn-outline btn-primary join-item',
})
export class TableCellActionUpdate extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionUpdate,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { ctx, $celScope, cellContext } = renderContext;
    return (
      <button
        class={options.class}
        type="button"
        onClick={async () => {
          const $$details = $celScope.$$details;
          if (!$$details) throw new Error('should provide $$details in cell scope');
          const detailItem = cellContext.row.original as Record<string, any>;
          const detailItemIndex = cellContext.row.index;
          const serverDetail = await ctx.bean._newBean(ServiceDetail, true, {
            locale: this.scope.locale,
            schema: $$details.schemaForm,
            data: deepExtend({}, detailItem),
            formScene: 'edit',
            schemaScene: 'form',
            icon: options.dialogOptions?.icon,
            title: options.dialogOptions?.title ?? this.scope.locale.EditDetail(),
            dialogOptions: options.dialogOptions,
            onSubmitData: (
              data: TypeFormOnSubmitData<Record<string, any>>,
              dialog: AppModalItem,
            ) => {
              const detailItemNew = deepExtend({}, detailItem, data.value);
              $$details.data = $$details.data.map((item, index) => {
                return index === detailItemIndex ? detailItemNew : item;
              });
              dialog.close();
            },
          });
          serverDetail.openDialogForm();
        }}
      >
        <ZIcon name="::draft" width={24}></ZIcon>
      </button>
    );
  }
}
