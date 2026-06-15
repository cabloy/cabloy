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
    'demo-student:actionDeleteForce'?: ITableCellOptionsActionDeleteForce;
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
    const { cellContext, ctx } = renderContext;
    return (
      <button
        class={options.class}
        type="button"
        onClick={async () => {
          // eslint-disable-next-line no-alert
          if (!window.confirm('Force delete this student permanently?')) return;
          const id = cellContext.row.id as TableIdentity;
          const modelStudent = (await ctx.bean._getBean(
            'demo-student.model.student',
            true,
          )) as ModelStudent;
          await modelStudent.deleteForce(id).mutateAsync();
        }}
      >
        Force Delete
      </button>
    );
  }
}
