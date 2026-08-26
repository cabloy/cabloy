import type { BeanRouter } from 'zova-module-a-router';

import { catchError } from '@cabloy/utils';
import { Service } from 'zova-module-a-bean';
import { BeanRouterGuardsBase } from 'zova-module-a-router';

@Service()
export class ServiceRouterGuards extends BeanRouterGuardsBase {
  protected onRouterGuards(router: BeanRouter) {
    router.beforeEach(async to => {
      if (to.meta.requiresAuth === false) return;
      if (this.$ssr.cookieDisabledOnServer) return;
      if (!this.$passport.isAuthenticated) {
        const [_res, err] = await catchError(() => {
          return this.$passport.ensurePassport();
        });
        if (err) {
          this.$errorHandler(err, 'onRouterGuards');
          return false;
        }
      }
      if (!this.$passport.isAuthenticated) {
        const pagePath = this.app.$getPagePathLogin(to.fullPath);
        if (process.env.SERVER) {
          try {
            this.app.$redirect(pagePath);
          } catch (err: any) {
            this.$errorHandler(err);
          }
          return false;
        }
        return pagePath;
      }
      const siteId = this.sys.env.SITE_ID;
      const siteAdmitted =
        !!siteId && !!this.$passport.roles?.some(role => role.siteIds.includes(siteId));
      if (!siteAdmitted) {
        const pagePath = this.app.$getPagePathAccessDenied();
        if (process.env.SERVER) {
          try {
            this.app.$redirect(pagePath);
          } catch (err: any) {
            this.$errorHandler(err);
          }
          return false;
        }
        return { path: pagePath, replace: true };
      }
    });
  }
}
