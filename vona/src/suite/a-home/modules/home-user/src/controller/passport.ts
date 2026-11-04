import type { IAuthenticateOptions, IAuthProviderRecord } from 'vona-module-a-auth';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { DtoJwtToken } from 'vona-module-a-jwt';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { EntityUser } from '../entity/user.ts';

import { DtoLogin } from '../dto/login.ts';
import { DtoPassport } from '../dto/passport.ts';
import { DtoPassportJwt } from '../dto/passportJwt.ts';
import { DtoRegister } from '../dto/register.ts';

export interface IControllerOptionsPassport extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPassport>('passport')
export class ControllerPassport extends BeanBase {
  @Web.get('current')
  @Passport.public()
  @Api.body(v.optional(), v.object(DtoPassport))
  async current(): Promise<DtoPassport | undefined> {
    return await this.scope.service.passport.combineDtoPassport();
  }

  @Web.post('logout')
  @Passport.activated('noCheck')
  async logout() {
    return await this.bean.passport.signout();
  }

  @Web.post('register')
  @Passport.public()
  @Core.captchaVerify({ scene: 'captcha-simple:simple' })
  @Api.body(v.object(DtoPassportJwt))
  async register(@Arg.body() data: DtoRegister) {
    const jwt = await this.bean.auth.authenticate('auth-simple:simple', {
      clientOptions: data,
      state: { intention: 'register' },
      clientName: 'default',
    });
    const user = this.bean.passport.current?.user as EntityUser | undefined;
    if (user && !user.activated && user.email) {
      await this.scope.service.account.issueActivationLink(user.id, data.consumerUrl);
    }
    return this.scope.service.passport.combineDtoPassportJwt(jwt);
  }

  @Web.post('login')
  @Passport.public()
  @Core.captchaVerify({ scene: 'captcha-simple:simple' })
  @Api.body(v.object(DtoPassportJwt))
  async login(@Arg.body() data: DtoLogin): Promise<DtoPassportJwt> {
    const jwt = await this.bean.auth.authenticate('auth-simple:simple', {
      clientOptions: data,
      state: { intention: 'login' },
      clientName: 'default',
    });
    return this.scope.service.passport.combineDtoPassportJwt(jwt);
  }

  @Web.get('login/:module/:providerName/:clientName?')
  @Passport.public()
  async loginOauth<T extends keyof IAuthProviderRecord>(
    @Arg.param('module') module: string,
    @Arg.param('providerName') providerName: string,
    @Arg.param('clientName', z.string().optional()) clientName?: IAuthenticateOptions<
      IAuthProviderRecord[T]
    >['clientName'],
    @Arg.query('redirect', v.optional()) redirect?: string,
  ) {
    // only support oauth, so not return jwt to client
    await this.bean.auth.authenticate(`${module}:${providerName}` as T, {
      state: { intention: 'login', redirect },
      clientName,
    });
  }

  @Web.get('associate/:module/:providerName/:clientName?')
  @Api.body(v.object(DtoPassportJwt))
  async associate<T extends keyof IAuthProviderRecord>(
    @Arg.param('module') module: string,
    @Arg.param('providerName') providerName: string,
    @Arg.param('clientName', z.string().optional()) clientName?: IAuthenticateOptions<
      IAuthProviderRecord[T]
    >['clientName'],
    @Arg.query('redirect', v.optional()) redirect?: string,
  ): Promise<DtoPassportJwt> {
    const jwt = await this.bean.auth.authenticate(`${module}:${providerName}` as T, {
      state: { intention: 'associate', redirect },
      clientName,
    });
    return this.scope.service.passport.combineDtoPassportJwt(jwt);
  }

  @Web.get('migrate/:module/:providerName/:clientName?')
  @Api.body(v.object(DtoPassportJwt))
  async migrate<T extends keyof IAuthProviderRecord>(
    @Arg.param('module') module: string,
    @Arg.param('providerName') providerName: string,
    @Arg.param('clientName', z.string().optional()) clientName?: IAuthenticateOptions<
      IAuthProviderRecord[T]
    >['clientName'],
    @Arg.query('redirect', v.optional()) redirect?: string,
  ): Promise<DtoPassportJwt> {
    const jwt = await this.bean.auth.authenticate(`${module}:${providerName}` as T, {
      state: { intention: 'migrate', redirect },
      clientName,
    });
    return this.scope.service.passport.combineDtoPassportJwt(jwt);
  }

  @Web.post('refreshAuthToken')
  @Passport.public()
  @Api.body(v.object(DtoJwtToken))
  async refreshAuthToken(@Arg.body('refreshToken') refreshToken: string): Promise<DtoJwtToken> {
    return await this.bean.passport.refreshAuthToken(refreshToken);
  }

  @Web.post('createPassportJwtFromOauthCode')
  @Passport.public()
  @Api.body(v.object(DtoPassportJwt))
  async createPassportJwtFromOauthCode(@Arg.body('code') code: string): Promise<DtoPassportJwt> {
    const jwt = await this.bean.passport.createAuthTokenFromOauthCode(code);
    return this.scope.service.passport.combineDtoPassportJwt(jwt);
  }

  @Web.post('createTempAuthToken')
  @Api.body(z.string())
  async createTempAuthToken(@Arg.query('path', v.optional()) path?: string): Promise<string> {
    return await this.bean.passport.createTempAuthToken({ path });
  }
}
