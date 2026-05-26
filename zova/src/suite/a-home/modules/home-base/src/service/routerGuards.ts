import type { BeanRouter } from 'zova-module-a-router';

import { catchError } from '@cabloy/utils';
import { Service } from 'zova-module-a-bean';
import { BeanRouterGuardsBase } from 'zova-module-a-router';

@Service()
export class ServiceRouterGuards extends BeanRouterGuardsBase {
  protected onRouterGuards(router: BeanRouter) {
    router.beforeEach(async to => {
      if (
        !this.sys.config.ssr.ignoreCookieOnServer &&
        to.meta.requiresAuth !== false &&
        !this.$passport.isAuthenticated
      ) {
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
      }
    });
  }
}
