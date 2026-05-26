import type { IJsxRenderContextBase, IJsxRenderContextPage } from 'zova-module-a-openapi';

import { BeanBase } from 'zova';

import type { ICommandBulkOptionsBase } from '../types/command.js';

export class BeanCommandBulkBase extends BeanBase {
  getResource(options: ICommandBulkOptionsBase, renderContext: IJsxRenderContextBase) {
    let resource: string | undefined = options.resource;
    if (renderContext.$scene === 'page') {
      const { $celScope } = renderContext as IJsxRenderContextPage;
      resource = resource ?? $celScope.resource;
    }
    if (!resource) {
      throw new Error(`should specify resource in scene: ${renderContext.$scene}`);
    }
    return { resource };
  }
}
