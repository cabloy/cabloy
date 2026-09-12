import type { TableIdentity } from 'table-identity';
import type { IJsxRenderContextBase, IJsxRenderContextPage } from 'zova-module-a-openapi';

import { isNil } from '@cabloy/utils';
import { BeanBase } from 'zova';

import type { ICommandSelectedOptionsBase } from '../types/command.js';

export class BeanCommandSelectedBase extends BeanBase {
  getResourceAndIds(
    options: ICommandSelectedOptionsBase,
    renderContext: IJsxRenderContextBase,
  ): { resource: string; ids: readonly TableIdentity[] } {
    let resource: string | undefined = options.resource;
    let ids = options.ids;
    if (renderContext.$scene === 'page') {
      const { $celScope } = renderContext as IJsxRenderContextPage;
      resource = resource ?? $celScope.resource;
      ids = ids ?? $celScope.selection?.ids;
    }
    if (isNil(resource) || !ids || ids.length === 0) {
      throw new Error(`should specify resource and selected ids in scene: ${renderContext.$scene}`);
    }
    const keys = new Set<string>();
    for (const id of ids) {
      if (isNil(id) || id === '') throw new Error('selected row id cannot empty');
      const key = String(id);
      if (keys.has(key)) throw new Error(`duplicate selected row id: ${key}`);
      keys.add(key);
    }
    return { resource, ids };
  }
}
