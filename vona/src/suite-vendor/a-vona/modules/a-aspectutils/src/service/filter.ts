import type { IFilterComposeData, IFilterJson } from 'vona-module-a-aspect';
import type { ContextRoute } from 'vona-module-a-web';

import { BeanBase, VonaApplication } from 'vona';
import { SymbolCacheComposeFilters } from 'vona-module-a-aspect';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceFilter extends BeanBase {
  async performErrorFilters(err: Error, method: string) {
    const filterContext: IFilterComposeData = { err, method };
    return await _composeFilters(this.app, this.ctx?.route)(filterContext);
  }
}

function _composeFilters(app: VonaApplication, route: ContextRoute | undefined) {
  // compose
  if (!app.meta[SymbolCacheComposeFilters]) app.meta[SymbolCacheComposeFilters] = {};
  const cacheComposeFilters: Record<string, Function> = app.meta[SymbolCacheComposeFilters];
  const beanFullName = route?.controllerBeanFullName ?? '';
  const handlerName = route?.action ?? '';
  const key = `${beanFullName}:${handlerName}`;
  if (!cacheComposeFilters[key]) {
    cacheComposeFilters[key] = app.bean.onion.filter.compose(
      route,
      undefined,
      undefined,
      undefined,
      (beanInstance: IFilterJson, data: IFilterComposeData, options, next) => {
        if (!beanInstance[data.method]) return next();
        return beanInstance[data.method](data.err, options, next);
      },
    );
  }
  return cacheComposeFilters[key];
}
