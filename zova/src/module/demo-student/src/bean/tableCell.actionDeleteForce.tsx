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

export interface ITableCellOptionsActionDeleteForce extends IResourceTableActionRowOptionsBase {}

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionRowRecord {
    'demo-student:actionDeleteForce'?: ITableCellOptionsActionDeleteForce;
  }
}

@TableCell<ITableCellOptionsActionDeleteForce>({
  class: 'btn btn-outline btn-error join-item',
})
export class TableCellActionDeleteForce extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionDeleteForce,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host, cellContext, ctx } = renderContext;
    return (
      <button
        class={options.class}
        type="button"
        onClick={async () => {
          const confirmed = await $host.$performCommand(
            'basic-commands:confirm',
            { message: 'Permanently delete this student?' },
            renderContext,
          );
          if (!confirmed) return;
          const modelStudent = (await ctx.bean._getBean(
            'demo-student.model.student',
            true,
          )) as ModelStudent;
          await modelStudent.deleteForce(cellContext.row.id).mutateAsync();
        }}
      >
        <ZIcon name="::delete" width={24}></ZIcon>
      </button>
    );
  }
}
