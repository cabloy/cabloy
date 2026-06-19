import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

import type { ModelStudent } from '../model/student.ts';

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
          modelStudent.toggleSummary(renderContext.cellContext.row.id);
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
