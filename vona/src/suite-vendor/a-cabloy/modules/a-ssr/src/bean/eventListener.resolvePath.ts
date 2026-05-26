import type { IEventExecute, NextEvent } from 'vona-module-a-event';
import type { TypeEventResolvePathData, TypeEventResolvePathResult } from 'vona-module-a-static';

import { isNil } from '@cabloy/utils';
import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

import type { BeanSsrSiteBase } from '../lib/beanSsrSiteBase.ts';
import type { IDecoratorSsrSiteOptions } from '../types/ssrSite.ts';

type TypeEventData = TypeEventResolvePathData;
type TypeEventResult = TypeEventResolvePathResult;

@EventListener({ match: 'a-static:resolvePath' })
export class EventListenerResolvePath
  extends BeanBase
  implements IEventExecute<TypeEventData, TypeEventResult>
{
  async execute(
    data: TypeEventData,
    next: NextEvent<TypeEventData, TypeEventResult>,
  ): Promise<TypeEventResult> {
    // check sites
    const sites = this.scope.service.ssr.getSitesEnabled();
    for (const site of sites) {
      // publicPath
      const siteOptions = site.beanOptions.options as IDecoratorSsrSiteOptions;
      let publicPath = siteOptions.publicPath as string;
      if (isNil(publicPath))
        throw new Error(`Should specify publicPath of ssr site: ${site.beanOptions.beanFullName}`);
      if (publicPath) {
        publicPath = `${publicPath}/`;
      }
      // filename
      let filename: string;
      if (!publicPath) {
        filename = data.filename;
      } else {
        if (data.filename.startsWith(publicPath)) {
          filename = data.filename.substring(publicPath.length);
        } else if (`${data.filename}/`.startsWith(publicPath)) {
          filename = data.filename.substring(publicPath.length - 1);
        } else {
          continue;
        }
      }
      // resolvePath
      const beanInstance = this.bean._getBean<BeanSsrSiteBase>(
        site.beanOptions.beanFullName as any,
      );
      const res = await beanInstance.resolvePath({ ...data, filename });
      if (res) return res;
    }
    // next
    return next();
  }
}
