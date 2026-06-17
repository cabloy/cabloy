import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { ZIcon } from 'zova-module-a-icon';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import type { ModelStudent } from '../model/student.js';

export interface ITableCellOptionsActionSummary extends IResourceTableActionRowOptionsBase {}

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'demo-student:actionSummary'?: ITableCellOptionsActionSummary;
  }
}

@TableCell<ITableCellOptionsActionSummary>({
  class: 'btn btn-outline join-item',
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
          const modelStudent = (await ctx.bean._getBean(
            'demo-student.model.student',
            true,
          )) as ModelStudent;
          const query = modelStudent.summary(cellContext.row.id);
          const summary = query.data ?? (await query.refetch()).data ?? null;
          const message = summary
            ? [
                `Name: ${summary.name}`,
                `Level: ${summary.level}`,
                `Description: ${summary.description ?? '-'}`,
              ].join('\n')
            : 'Student not found';
          await $host.$performCommand('basic-commands:alert', { message }, renderContext);
        }}
      >
        <ZIcon name="::done" width={24}></ZIcon>
      </button>
    );
  }
}
