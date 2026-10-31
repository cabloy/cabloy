import type { AriaAttributes, CSSProperties, ComponentPublicInstance } from 'vue';

import { FlexRender } from '@tanstack/vue-table';
import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ControllerTable, TableColumnIdSelection, ZTable } from 'zova-module-a-table';

@Render()
export class RenderTable<TData extends {} = {}> extends BeanRenderBase {
  public render() {
    return (
      <div
        class="min-w-0 max-w-full overflow-x-auto"
        data-table-compact={this.compact ? 'true' : 'false'}
        ref={(element: Element | ComponentPublicInstance | null) => {
          if (this.ctx.disposed) return;
          this.setContainer?.((element as HTMLElement | null) ?? undefined);
        }}
      >
        <ZTable
          data={this.$props.data}
          schema={this.$props.schema}
          schemaOrder={this.$props.schemaOrder}
          sorting={this.$props.sorting}
          onSortingChange={this.$props.onSortingChange}
          enableRowSelection={this.$props.enableRowSelection}
          selectionMode={this.$props.selectionMode}
          rowSelection={this.$props.rowSelection}
          onRowSelectionChange={this.$props.onRowSelectionChange}
          tableScope={this.$props.tableScope}
          getColumns={this.$props.getColumns}
          getRowId={this.$props.getRowId}
          layout={this.$props.layout}
          compact={this.compact}
          columnSizing={this.columnSizing}
          controllerRef={ref => {
            this.innerTable = ref;
            this.$props?.tableRef?.(ref);
          }}
          slotDefault={$$table => {
            return this._renderTable($$table);
          }}
        ></ZTable>
      </div>
    );
  }

  private _getColumnStyle(column: any, $$table: ControllerTable<TData>): CSSProperties {
    const rest = (column.columnDef.meta as any)?.rest;
    const fixed = column.getIsPinned();
    const compactOperations = this.compact && this.isOperationsColumn(column.id, $$table);
    const width = compactOperations ? 80 : column.getSize();
    return {
      ...(compactOperations ||
      typeof rest?.width === 'number' ||
      typeof this.columnSizing[column.id] === 'number'
        ? { width: `${width}px`, minWidth: `${width}px` }
        : {}),
      textAlign: rest?.align,
      position: fixed ? ('sticky' as const) : undefined,
      left: fixed === 'left' ? `${column.getStart('left')}px` : undefined,
      right: fixed === 'right' ? `${column.getAfter('right')}px` : undefined,
      zIndex: fixed ? 1 : undefined,
    };
  }

  public _renderTable($$table: ControllerTable<TData>) {
    const table = $$table.table;
    const selectionMode = this.$props.selectionMode ?? 'multiple';
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
                selectionMode === 'single' ? null : (
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
                )
              ) : this.compact && this.isOperationsColumn(column.id, $$table) ? (
                <span class="sr-only">
                  <FlexRender render={headerDefinition} props={header.getContext()}></FlexRender>
                </span>
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
                  style={this._getColumnStyle(column, $$table)}
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
                      style={this._getColumnStyle(column, $$table)}
                    >
                      {selection ? (
                        <input
                          type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                          class={
                            selectionMode === 'single' ? 'radio radio-sm' : 'checkbox checkbox-sm'
                          }
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
