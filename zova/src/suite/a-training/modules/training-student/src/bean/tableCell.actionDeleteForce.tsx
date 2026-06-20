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
    'training-student:actionDeleteForce'?: ITableCellOptionsActionDeleteForce;
  }
}

export interface ITableCellOptionsActionDeleteForce extends IResourceTableActionRowOptionsBase {}

@TableCell<ITableCellOptionsActionDeleteForce>({
  class: 'btn btn-outline btn-error join-item',
})
export class TableCellActionDeleteForce extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionDeleteForce,
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
          // eslint-disable-next-line no-alert
          if (!window.confirm(this.scope.locale.ForceDeleteConfirm())) return;
          const modelStudent = await this._getModelStudent();
          await modelStudent.deleteForce(renderContext.cellContext.row.id).mutateAsync();
        }}
      >
        {this.scope.locale.ForceDelete()}
      </button>
    );
  }

  private async _getModelStudent() {
    return (await this.bean._getBean('training-student.model.student', true)) as ModelStudent;
  }
}
