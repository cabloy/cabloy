import type { BeanRouter } from 'zova-module-a-router';

import { catchError } from '@cabloy/utils';
import { cast, Use } from 'zova';
import { Service } from 'zova-module-a-bean';
import { BeanRouterGuardsBase } from 'zova-module-a-router';

import { ServiceLocale } from './locale.js';

@Service()
export class ServiceRouterGuards extends BeanRouterGuardsBase {
  @Use()
  $$serviceLocale: ServiceLocale;

  protected onRouterGuards(router: BeanRouter) {
    router.beforeEach(async to => {
      if (to.meta.requiresAuth === false) return;
      if (this.sys.config.ssr.cookieDisabledOnServer) return;
      const [_res, err] = await catchError(() => {
        return this.$passport.ensurePassport();
      });
      if (err) {
        this.$errorHandler(err, 'onRouterGuards');
        return false;
      }
      if (!this.$passport.isAuthenticated) {
        try {
          this.app.$gotoLogin(to.fullPath);
        } catch (err: any) {
          this.$errorHandler(err);
        }
        return false;
      }
      const siteId = this.sys.env.SITE_ID;
      const siteAdmitted =
        !!siteId && !!this.$passport.roles?.some(role => role.siteIds.includes(siteId));
      if (!siteAdmitted) {
        await this.app.$gotoAccessDenied();
        return false;
      }
    });
    router.beforeResolve(async to => {
      const locale = to.meta?.locale;
      if (locale) {
        const localeCurrent = cast(to.params)?.locale ?? this.sys.config.locale.default;
        this.$$serviceLocale.setLocale(localeCurrent);
      }
    });
  }
}
