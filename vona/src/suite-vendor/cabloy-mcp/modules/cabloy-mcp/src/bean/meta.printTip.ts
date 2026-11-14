import type { IMetaPrintTipExecute, TypeMetaPrintTipResult } from 'vona-module-a-printtip';
import type { IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { resolveMcpResourceUrl } from 'vona-module-mcp-auth';

@Meta()
export class MetaPrintTip extends BeanBase implements IMetaPrintTipExecute {
  async execute(): Promise<TypeMetaPrintTipResult> {
    if (!this.scope.config.enabled) return;
    return this.app
      .scope('a-ssr')
      .service.ssr.getSitesEnabled()
      .map(site => {
        const options = site.beanOptions.options as IDecoratorSsrSiteOptions;
        const binding = resolveMcpResourceUrl(
          this.app,
          this.app.util.getAbsoluteUrl(`/mcp/${options.siteId}`),
        );
        return { title: `mcp:${binding.ssrSiteId}`, message: binding.resource };
      });
  }
}
