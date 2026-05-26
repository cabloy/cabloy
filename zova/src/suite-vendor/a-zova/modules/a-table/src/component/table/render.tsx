import { FlexRender } from '@tanstack/vue-table';
import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';

@Render()
export class RenderTable extends BeanRenderBase {
  private _renderTableDefault() {
    const table = this.table;
    return (
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
    );
  }

  public render() {
    return this.$slotDefault ? this.$slotDefault(this) : this._renderTableDefault();
  }
}
