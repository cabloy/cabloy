import type { TableIdentity } from 'table-identity';
import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';
import type { ModelStudent } from 'zova-module-demo-student';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'demo-student:actionSummary'?: ITableCellOptionsActionSummary;
  }
}

export interface ITableCellOptionsActionSummary extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionSummary>({
  class: 'btn btn-outline btn-info join-item',
})
export class TableCellActionSummary extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionSummary,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host, cellContext, ctx } = renderContext;
    return (
      <button
        class={options.class}
        type="button"
        onClick={async () => {
          const id = cellContext.row.id as TableIdentity;
          const modelStudent = (await ctx.bean._getBean(
            'demo-student.model.student',
            true,
          )) as ModelStudent;
          const querySummary = modelStudent.summary(id);
          const { data: summary } = await querySummary.refetch();
          const message = [
            `${this.scope.locale.Id()}: ${summary?.id ?? '-'}`,
            `${this.scope.locale.Name()}: ${summary?.name ?? '-'}`,
            `${this.scope.locale.Level()}: ${summary?.level ?? '-'}`,
            `${this.scope.locale.Description()}: ${summary?.description ?? '-'}`,
          ].join('\n');
          await $host.$performCommand('basic-commands:alert', { message }, renderContext);
        }}
      >
        {this.scope.locale.Summary()}
      </button>
    );
  }
}
