import type { IJsxRenderContextBase } from 'zova-module-a-openapi';
import type { IJsxRenderContextTableCell } from 'zova-module-a-table';

import { isNil } from '@cabloy/utils';
import { TableIdentity } from 'table-identity';
import { BeanBase } from 'zova';

import type { ICommandRowOptionsBase } from '../types/command.js';

export class BeanCommandRowBase extends BeanBase {
  getResourceAndId(options: ICommandRowOptionsBase, renderContext: IJsxRenderContextBase) {
    let resource: string | undefined = options.resource;
    let id: TableIdentity | undefined = options.id;
    if (renderContext.$scene === 'tableCell') {
      const { $celScope, cellContext } = renderContext as IJsxRenderContextTableCell;
      resource = resource ?? $celScope.resource;
      id = id ?? cellContext.row.id;
    }
    if (isNil(resource) || isNil(id)) {
      throw new Error(`should specify resource or id in scene: ${renderContext.$scene}`);
    }
    return { resource, id };
  }
}
