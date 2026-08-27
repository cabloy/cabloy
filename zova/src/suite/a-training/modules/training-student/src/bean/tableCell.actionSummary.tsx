import type { TableIdentity } from 'table-identity';
import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';
import type { ModelStudent } from 'zova-module-training-student';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';
import { ZMarkdownHtml } from 'zova-module-basic-markdown';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'training-student:actionSummary'?: ITableCellOptionsActionSummary;
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
            'training-student.model.student',
            true,
          )) as ModelStudent;
          const querySummary = modelStudent.summary(id);
          const { data: summary } = await querySummary.refetch();
          $host.$appModal.dialog(
            {
              title: this.scope.locale.Summary(),
              slotDefault: () => (
                <div class="student-summary-description">
                  <ZMarkdownHtml html={summary?.descriptionHtml} />
                </div>
              ),
            },
            {
              maxWidth: 720,
              maxHeight: 'calc(100vh - 2rem)',
              closeOnBackdrop: true,
              closeOnEscape: true,
              showCloseButton: true,
            },
          );
        }}
      >
        {this.scope.locale.Summary()}
      </button>
    );
  }
}
