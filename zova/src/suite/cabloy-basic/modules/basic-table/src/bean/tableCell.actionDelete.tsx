import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { ZIcon } from 'zova-module-a-icon';
import { TableCell } from 'zova-module-a-table';
import { ZButton } from 'zova-module-basic-button';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'basic-table:actionDelete'?: ITableCellOptionsActionDelete;
  }
}

export interface ITableCellOptionsActionDelete extends IResourceTableActionRowOptionsBase {
  showLabel?: boolean;
}

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
        aria-label={this.scope.locale.Delete()}
        onPerform={async () => {
          const confirmed = await $host.$performCommand('basic-commands:confirm', {
            text: this.scope.locale.DeleteConfirm(),
          });
          if (!confirmed) return;
          await $host.$performCommand('basic-commands:delete', options, renderContext);
        }}
      >
        <ZIcon name="::delete" width={24} aria-hidden="true"></ZIcon>
        {options.showLabel && this.scope.locale.Delete()}
      </ZButton>
    );
  }
}
