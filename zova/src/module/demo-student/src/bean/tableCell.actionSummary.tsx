import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import type { ModelStudent } from '../model/student.ts';

function formatSummaryMessage(summary: Awaited<ReturnType<ModelStudent['summary']>>) {
  if (!summary) return undefined;
  const details = [
    summary.summaryText,
    `Name: ${summary.name}`,
    `Level: ${summary.levelTitle}`,
    `Description Length: ${summary.descriptionLength}`,
  ];
  if (summary.description) {
    details.push(`Description: ${summary.description}`);
  }
  return details.join('\n');
}

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
    return (
      <button
        class={options.class}
        type="button"
        onClick={async e => {
          e.preventDefault();
          e.stopPropagation();
          const modelStudent = await this._getModelStudent();
          const summary = await modelStudent.summary(renderContext.cellContext.row.id);
          await this.$performCommand('basic-commands:alert', {
            message: formatSummaryMessage(summary) ?? this.scope.locale.SummaryNotFound(),
          });
        }}
      >
        {this.scope.locale.Summary()}
      </button>
    );
  }

  private async _getModelStudent() {
    return (await this.bean._getBean('demo-student.model.student', true)) as ModelStudent;
  }
}
