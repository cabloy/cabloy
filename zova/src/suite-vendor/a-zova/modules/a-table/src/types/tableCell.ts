import type { CellContext } from '@tanstack/table-core';
import type { OmitNever } from 'zova';
import type { ServiceOnion } from 'zova-module-a-bean';
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import type { ControllerTable } from '../component/table/controller.jsx';
import type { IJsxRenderContextTableColumn, ITableCellScope } from './tableColumn.js';

export interface IJsxRenderContextTableCell<TData extends {} = any> extends IJsxRenderContextBase {
  $celScope: ITableCellScope;
  $$table: ControllerTable<TData>;
  cellContext: CellContext<TData, any>;
}

export type NextTableCellRender = () => any;

export interface ITableCellRecord {}

export interface ITableCellRender {
  render(
    options: IDecoratorTableCellOptions,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ): any;
  checkVisible?(
    options: IDecoratorTableCellOptions,
    renderContext: IJsxRenderContextTableColumn,
  ): Promise<boolean>;
}

export interface IDecoratorTableCellOptions {}

declare module 'zova-module-a-bean' {
  export interface SysOnion {
    tableCell: ServiceOnion<IDecoratorTableCellOptions, keyof ITableCellRecord>;
  }
}

declare module 'zova' {
  export interface ConfigOnions {
    tableCell: OmitNever<ITableCellRecord>;
  }

  export interface IBeanSceneRecord {
    tableCell: never;
  }
}
