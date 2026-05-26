import type { VonaApplication, VonaContext } from 'vona';
import type { ServiceFilter } from 'vona-module-a-aspectutils';

import { accepts } from '../lib/utils.ts';

export function config(_app: VonaApplication) {
  return {
    error: {
      // ssr: {
      //   site: 'a-ssrcabloy:cabloy',
      //   pagePath: '/a/ssrcabloy/error',
      // },
      templatePath: '',
      errorPageUrl(_err: Error, _ctx: VonaContext): string | undefined {
        return undefined;
      },
    },
    onerror: {
      accepts(this: VonaContext) {
        const fn = accepts;
        return fn(this as any);
      },
      async logWithApp(err: Error, app: VonaApplication) {
        return await _performErrorFilters(app, err, 'log');
      },
      async log(err: Error, ctx: VonaContext) {
        return await _performErrorFiltersWithCtx(ctx, err, 'log');
      },
      async json(err: Error, ctx: VonaContext) {
        return await _performErrorFiltersWithCtx(ctx, err, 'json');
      },
      async html(err: Error, ctx: VonaContext) {
        return await _performErrorFiltersWithCtx(ctx, err, 'html');
      },
      async text(err: Error, ctx: VonaContext) {
        ctx.body = err.code; // not set err.message for safety
      },
    },
  };
}

async function _performErrorFiltersWithCtx(ctx: VonaContext, err: Error, method: string) {
  return await ctx.app.ctxStorage.run(ctx as any, async () => {
    return await _performErrorFilters(ctx.app, err, method);
  });
}

async function _performErrorFilters(app: VonaApplication, err: Error, method: string) {
  const beanFilter = app.bean._getBean('a-aspectutils.service.filter' as never) as ServiceFilter;
  return await beanFilter.performErrorFilters(err, method);
}
