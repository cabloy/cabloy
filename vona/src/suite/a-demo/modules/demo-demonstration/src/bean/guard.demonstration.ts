import type { Next } from 'vona';
import type { IDecoratorGuardOptionsGlobal, IGuardExecute } from 'vona-module-a-aspect';

import { $protocolKey, BeanBase, Global, useApp } from 'vona';
import { Guard } from 'vona-module-a-aspect';

const app = useApp();

const methodsForWrite = ['POST', 'PATCH', 'DELETE', 'PUT'];

export function parseUsernameWhitelist(value: string | undefined): string[] {
  if (!value) return [];
  return [
    ...new Set(
      value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean),
    ),
  ];
}

export interface IGuardOptionsDemonstration extends IDecoratorGuardOptionsGlobal {
  methodsForWrite: string[];
  usernameWhitelist: string[];
}

@Guard<IGuardOptionsDemonstration>({
  enable: app.meta.env.DEMONSTRATION_ENABLED === 'true',
  methodsForWrite,
  usernameWhitelist: parseUsernameWhitelist(app.meta.env.DEMONSTRATION_USERNAME_WHITELIST),
  ignore: [
    '/home/user/passport/logout',
    '/home/user/passport/register',
    '/home/user/passport/login',
    '/home/user/passport/login/:module/:providerName/:clientName?',
    '/home/user/passport/associate/:module/:providerName/:clientName?',
    '/home/user/passport/migrate/:module/:providerName/:clientName?',
    '/home/user/passport/refreshAuthToken',
    '/home/user/passport/createPassportJwtFromOauthCode',
    '/home/user/passport/createTempAuthToken',
    '/auth/passport/callback',
  ],
  dependencies: 'a-user:passport',
})
@Global()
export class GuardDemonstration extends BeanBase implements IGuardExecute {
  async execute(options: IGuardOptionsDemonstration, next: Next): Promise<boolean> {
    const headerOpenapiSchema = this.ctx.headers[$protocolKey('x-vona-openapi-schema')];
    if (headerOpenapiSchema?.toString() === 'true') return next();

    const method = this.ctx.method.toUpperCase();
    if (!options.methodsForWrite.some(item => item.toUpperCase() === method)) {
      return next();
    }

    const user = this.bean.passport.currentUser;
    if (
      this.bean.passport.isAuthenticated &&
      this.bean.passport.isAccountActive &&
      user &&
      !user.anonymous &&
      options.usernameWhitelist.includes(user.name)
    ) {
      return next();
    }

    this.scope.error.WriteForbidden.throw();
    return false;
  }
}
