import type { Next } from 'vona';
import type { IDecoratorGuardOptionsGlobal, IGuardExecute } from 'vona-module-a-aspect';

import { catchError } from '@cabloy/utils';
import { BeanBase, Global } from 'vona';
import { Guard } from 'vona-module-a-aspect';
import { checkErrorJwtExpiredAndThrow } from 'vona-module-a-jwt';

export interface IGuardOptionsPassport extends IDecoratorGuardOptionsGlobal {
  public: boolean;
  activated?: boolean;
  checkAuthToken: boolean; // default is true
}

@Guard<IGuardOptionsPassport>({ public: false, activated: true, checkAuthToken: true })
@Global()
export class GuardPassport extends BeanBase implements IGuardExecute {
  async execute(options: IGuardOptionsPassport, next: Next): Promise<boolean> {
    // auth token
    if (!this.bean.passport.current) {
      if (options.checkAuthToken) {
        // will return undefined if no accessToken, so not check options.public
        const [_, err] = await catchError(() => {
          return this.bean.passport.checkAuthToken();
        });
        if (err && !options.public) throw err;
        // throw error only when ErrorMessageJwtExpired
        checkErrorJwtExpiredAndThrow(err, this.ctx.headers);
      }
    }
    // check public
    if (!options.public && !this.bean.passport.isAuthenticated) {
      // return false;
      // 401 for this guard, 403 for the next guards
      return this.app.throw(401);
    }
    // anonymous
    if (!this.bean.passport.current) {
      await this.bean.passport.signinWithAnonymous();
    }
    // check activated
    if (this.bean.passport.isAuthenticated) {
      if (options.activated === true && !this.bean.passport.isActivated) {
        return this.app.throw(403);
      }
      if (options.activated === false && this.bean.passport.isActivated) {
        return this.app.throw(403);
      }
    }
    // check innerAccess
    if (this.ctx.innerAccess) return true;
    // next
    return next();
  }
}
