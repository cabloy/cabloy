import type { IResourceDetailsActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { ZIcon } from 'zova-module-a-icon';
import { TableCell } from 'zova-module-a-table';
import { ZButton } from 'zova-module-basic-button';

import { ICommandOptionsDelete } from './command.delete.jsx';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionRowRecord {
    'basic-details:actionDelete'?: ITableCellOptionsActionDelete;
  }
}

export interface ITableCellOptionsActionDelete extends IResourceDetailsActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionDelete>({
  class: 'btn btn-outline btn-error join-item',
})
export class TableCellActionDelete extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionDelete,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host } = renderContext;
    return (
      <ZButton
        class={options.class}
        onPerform={async () => {
          const confirmed = await $host.$performCommand('basic-commands:confirm', {
            text: this.scope.locale.DeleteConfirm(),
          });
          if (!confirmed) return;
          await $host.$performCommand(
            'basic-details:delete',
            options as Partial<ICommandOptionsDelete>,
            renderContext,
          );
        }}
      >
        <ZIcon name="::delete" width={24}></ZIcon>
      </ZButton>
    );
  }
}
