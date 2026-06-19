import type {
  IResourceRenderTableActionRowOptionsAction,
  IResourceTableActionRowOptionsBase,
} from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  IJsxRenderContextTableColumn,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import type { ModelStudent } from '../model/student.ts';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'demo-student:actionOperationsRow'?: ITableCellOptionsActionOperationsRow;
  }
}

export interface ITableCellOptionsActionOperationsRow extends IResourceTableActionRowOptionsBase {
  actions?: IResourceRenderTableActionRowOptionsAction[];
}

@TableCell<ITableCellOptionsActionOperationsRow>({
  class: 'join',
})
export class TableCellActionOperationsRow extends BeanBase implements ITableCellRender {
  async checkVisible(
    options: ITableCellOptionsActionOperationsRow,
    renderContext: IJsxRenderContextTableColumn,
  ): Promise<boolean> {
    const beanInstance = await this._getBaseOperationsRow();
    return await beanInstance.checkVisible!(options, renderContext);
  }

  render(
    options: ITableCellOptionsActionOperationsRow,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const rowId = renderContext.cellContext.row.id;
    const modelStudent = this.bean._getBeanSyncOnly('demo-student.model.student') as
      | ModelStudent
      | undefined;
    const querySummary = modelStudent?.isSummaryExpanded(rowId)
      ? modelStudent.summary(rowId)
      : undefined;
    return (
      <div class="flex flex-col items-start gap-2">
        {renderContext.$$table.cellRender(
          'basic-table:actionOperationsRow',
          options,
          renderContext,
        )}
        {querySummary && this._renderSummary(querySummary)}
      </div>
    );
  }

  private async _getBaseOperationsRow() {
    return (await this.bean._getBean(
      'basic-table.tableCell.actionOperationsRow',
      true,
    )) as ITableCellRender;
  }

  private _renderSummary(querySummary: ReturnType<ModelStudent['summary']>) {
    if (querySummary.isPending || querySummary.isFetching) {
      return (
        <div class="rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm">
          {this.scope.locale.SummaryLoading()}
        </div>
      );
    }
    if (querySummary.error) {
      return (
        <div class="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
          {querySummary.error.message}
        </div>
      );
    }
    if (!querySummary.data) {
      return (
        <div class="rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm">
          {this.scope.locale.SummaryNotFound()}
        </div>
      );
    }
    const summary = querySummary.data;
    return (
      <div class="w-80 max-w-[32rem] rounded-lg border border-base-300 bg-base-100 px-3 py-3 text-sm shadow-sm">
        <div class="font-medium text-base-content">{summary.summaryText}</div>
        <div class="mt-2 space-y-1 text-base-content/80">
          <div>
            <span class="font-medium">{this.scope.locale.Name()}:</span> {summary.name}
          </div>
          <div>
            <span class="font-medium">{this.scope.locale.Level()}:</span> {summary.levelTitle}
          </div>
          <div>
            <span class="font-medium">{this.scope.locale.DescriptionLength()}:</span>{' '}
            {summary.descriptionLength}
          </div>
          {summary.description && (
            <div>
              <span class="font-medium">{this.scope.locale.Description()}:</span>{' '}
              {summary.description}
            </div>
          )}
        </div>
      </div>
    );
  }
}
