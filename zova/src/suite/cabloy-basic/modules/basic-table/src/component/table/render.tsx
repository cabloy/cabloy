import { FlexRender } from '@tanstack/vue-table';
import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ControllerTable, ZTable } from 'zova-module-a-table';

@Render()
export class RenderTable<TData extends {} = {}> extends BeanRenderBase {
  public render() {
    return (
      <ZTable
        {...this.$props}
        slotDefault={$$table => {
          return this._renderTable($$table);
        }}
      ></ZTable>
    );
  }

  public _renderTable($$table: ControllerTable<TData>) {
    const table = $$table.table;
    return (
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              {table.getFlatHeaders().map(header => {
                return (
                  <th key={header.id}>
                    <FlexRender
                      render={header.column.columnDef.header}
                      props={header.getContext()}
                    ></FlexRender>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        <FlexRender
                          render={cell.column.columnDef.cell}
                          props={cell.getContext()}
                        ></FlexRender>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
