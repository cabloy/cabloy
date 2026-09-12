import type { AriaAttributes, CSSProperties } from 'vue';

import { FlexRender } from '@tanstack/vue-table';
import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ControllerTable, TableColumnIdSelection, ZTable } from 'zova-module-a-table';

@Render()
export class RenderTable<TData extends {} = {}> extends BeanRenderBase {
  public render() {
    return (
      <ZTable
        data={this.$props.data}
        schema={this.$props.schema}
        schemaOrder={this.$props.schemaOrder}
        sorting={this.$props.sorting}
        onSortingChange={this.$props.onSortingChange}
        enableRowSelection={this.$props.enableRowSelection}
        rowSelection={this.$props.rowSelection}
        onRowSelectionChange={this.$props.onRowSelectionChange}
        tableScope={this.$props.tableScope}
        getColumns={this.$props.getColumns}
        getRowId={this.$props.getRowId}
        controllerRef={ref => {
          this.$props?.tableRef?.(ref);
        }}
        slotDefault={$$table => {
          return this._renderTable($$table);
        }}
      ></ZTable>
    );
  }

  private _getColumnStyle(column: any): CSSProperties {
    const rest = (column.columnDef.meta as any)?.rest;
    const fixed = column.getIsPinned();
    const width = rest?.width ? `${rest.width}px` : undefined;
    return {
      width,
      minWidth: width,
      textAlign: rest?.align,
      position: fixed ? ('sticky' as const) : undefined,
      left: fixed === 'left' ? `${column.getStart('left')}px` : undefined,
      right: fixed === 'right' ? `${column.getAfter('right')}px` : undefined,
      zIndex: fixed ? 1 : undefined,
    };
  }

  public _renderTable($$table: ControllerTable<TData>) {
    const table = $$table.table;
    const selectionEnabled = $$table.columns.some(column => column.id === TableColumnIdSelection);
    return (
      <table class="table">
        <thead>
          <tr>
            {table.getFlatHeaders().map(header => {
              const column = header.column;
              const canSort = column.getCanSort();
              const sorted = column.getIsSorted();
              const fixed = column.getIsPinned();
              const headerDefinition = column.columnDef.header;
              const selection = selectionEnabled && column.id === TableColumnIdSelection;
              const headerContent = selection ? (
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  checked={table.getIsAllPageRowsSelected()}
                  indeterminate={table.getIsSomePageRowsSelected()}
                  aria-checked={table.getIsSomePageRowsSelected() ? 'mixed' : undefined}
                  aria-label={this.scope.locale.SelectAllPageRows()}
                  disabled={table.getRowModel().rows.every(row => !row.getCanSelect())}
                  onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
              ) : (
                <FlexRender render={headerDefinition} props={header.getContext()}></FlexRender>
              );
              let sortAria: AriaAttributes['aria-sort'] = 'none';
              let sortIcon: '▲' | '▼' | '↕' = '↕';
              if (sorted === 'asc') {
                sortAria = 'ascending';
                sortIcon = '▲';
              } else if (sorted === 'desc') {
                sortAria = 'descending';
                sortIcon = '▼';
              }
              return (
                <th
                  key={header.id}
                  class={fixed ? 'bg-base-100' : undefined}
                  style={this._getColumnStyle(column)}
                  aria-sort={sortAria}
                >
                  {canSort ? (
                    <button
                      type="button"
                      class="inline-flex w-full items-center gap-1"
                      onClick={column.getToggleSortingHandler()}
                      aria-label={`Sort by ${column.id}`}
                    >
                      {headerContent}
                      <span aria-hidden="true">{sortIcon}</span>
                    </button>
                  ) : (
                    headerContent
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id} aria-selected={row.getIsSelected()}>
                {row.getVisibleCells().map(cell => {
                  const column = cell.column;
                  const selection = selectionEnabled && column.id === TableColumnIdSelection;
                  return (
                    <td
                      key={cell.id}
                      class={column.getIsPinned() ? 'bg-base-100' : undefined}
                      style={this._getColumnStyle(column)}
                    >
                      {selection ? (
                        <input
                          type="checkbox"
                          class="checkbox checkbox-sm"
                          checked={row.getIsSelected()}
                          disabled={!row.getCanSelect()}
                          aria-label={this.scope.locale.SelectRow(row.id)}
                          onChange={row.getToggleSelectedHandler()}
                        />
                      ) : (
                        <FlexRender
                          render={column.columnDef.cell}
                          props={cell.getContext()}
                        ></FlexRender>
                      )}
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
}
