import type { IResourceDetailsActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { IIconRecord, ZIcon } from 'zova-module-a-icon';
import { TableCell } from 'zova-module-a-table';
import { IModalDialogOptions } from 'zova-module-basic-app';

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
    _renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    // const { $host } = renderContext;
    return (
      <button
        class={options.class}
        type="button"
        onClick={async () => {
          // edit detail
        }}
      >
        <ZIcon name="::draft" width={24}></ZIcon>
      </button>
    );
  }
}
