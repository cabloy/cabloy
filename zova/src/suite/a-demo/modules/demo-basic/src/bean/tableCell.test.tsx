import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';

import { BeanBase } from 'zova';
import { ZIcon } from 'zova-module-a-icon';
import {
  TableCell,
  type IJsxRenderContextTableCell,
  type ITableCellRender,
  type NextTableCellRender,
} from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'demo-basic:test'?: ITableCellOptionsTest;
  }
}

export interface ITableCellOptionsTest extends IResourceTableCellOptionsBase {
  iconPrefix?: string;
}

@TableCell<ITableCellOptionsTest>({
  iconPrefix: '::home',
})
export class TableCellTest extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsTest,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    const iconPrefix = options.iconPrefix;
    if (!iconPrefix) return value;
    return (
      <div>
        <ZIcon name={iconPrefix as any} width={24}></ZIcon>
        <span>{value}</span>
      </div>
    );
  }
}
