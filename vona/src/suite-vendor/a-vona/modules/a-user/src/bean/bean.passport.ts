import type {
  IJwtClientRecord,
  IJwtSignOptions,
  IJwtToken,
  IJwtVerifyOptions,
  IPayloadData,
} from 'vona-module-a-jwt';

import { catchError, isNil } from '@cabloy/utils';
import { BeanBase, beanFullNameFromOnionName } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IAuth, IAuthIdRecord, IAuthTokenOptions, ISigninOptions } from '../types/auth.ts';
import type { IAuthTokenAdapter } from '../types/authToken.ts';
import type { IPassport, IPassportAdapter } from '../types/passport.ts';
import type { IRole, IRoleNameRecord } from '../types/role.ts';
import type { IUser, IUserNameRecord } from '../types/user.ts';

import { $getAuthIdSystem } from '../lib/auth.ts';

@Bean()
export class BeanPassport extends BeanBase {
  private _authTokenAdapter: IAuthTokenAdapter;
  private _passportAdapter: IPassportAdapter;
  private _mockCounter: number = 0;

  private get authTokenAdapter(): IAuthTokenAdapter {
    if (!this._authTokenAdapter) {
      const beanFullName = beanFullNameFromOnionName(
        this.scope.config.adapter.authToken,
        'service',
      );
      this._authTokenAdapter = this.bean._getBean(beanFullName) as IAuthTokenAdapter;
    }
    return this._authTokenAdapter;
  }

  private get passportAdapter(): IPassportAdapter {
    if (!this._passportAdapter) {
      const beanFullName = beanFullNameFromOnionName(this.scope.config.adapter.passport, 'service');
      this._passportAdapter = this.bean._getBean(beanFullName) as IPassportAdapter;
    }
    return this._passportAdapter;
  }

  public get isAuthenticated(): boolean {
    const user = this.currentUser;
    return !!user && !user.anonymous;
  }

  public get isActivated(): boolean {
    const user = this.currentUser;
    return !!user && !!user.activated;
  }

  public async isAdmin(): Promise<boolean> {
    const passport = this.current;
    return await this.passportAdapter.isAdmin(passport);
  }

  public async setCurrent(passport: IPassport | undefined) {
    this.ctx.state.passport = await this.passportAdapter.setCurrent(passport);
  }

  public get current(): IPassport | undefined {
    return this.ctx.state.passport;
  }

  public get currentUser(): IUser | undefined {
    return this.ctx.state.passport?.user;
  }

  public get currentAuth(): IAuth | undefined {
    return this.ctx.state.passport?.auth;
  }

  public get currentRoles(): IRole[] | undefined {
    return this.ctx.state.passport?.roles;
  }

  public async signin(passport: IPassport, options?: ISigninOptions): Promise<IJwtToken> {
    if (isNil(this.ctx.instanceName)) throw new Error('should specify instance');
    // current
    await this.setCurrent(passport);
    // event
    await this.scope.event.signin.emit(passport);
    // serialize: payloadData for client certificate
    const authTokenOptions = await this._combineAuthTokenOptions(
      passport.auth!.authProviderId,
      options?.authToken,
      {
        stateless: this.scope.config.authToken.stateless,
        strategy: this.scope.config.authToken.strategy.signin,
        ttl: this.scope.config.authToken.ttl,
      },
    );
    const payloadData = await this._passportSerialize(passport, authTokenOptions);
    // jwt token
    return await this.bean.jwt.create(payloadData, { dev: passport.auth?.id.toString() === '-1' });
  }

  public async signout(): Promise<void> {
    // current
    const passport = this.current;
    if (!passport) return;
    // removeAuthToken
    const payloadData = await this.passportAdapter.serialize(passport);
    await this.authTokenAdapter.remove(payloadData);
    // event
    await this.scope.event.signout.emit(passport);
    // ok
    await this.setCurrent(undefined);
  }

  public async signinSystem<K extends keyof IAuthIdRecord>(
    authName: IAuthIdRecord[K],
    authId: K,
    name?: string,
    options?: ISigninOptions,
  ): Promise<IJwtToken> {
    if (isNil(this.ctx.instanceName)) throw new Error('should specify instance');
    const user = await this.bean.user.findOneByName(name ?? 'admin');
    if (!user) return this.app.throw(401);
    const auth = { id: $getAuthIdSystem(authName, authId) };
    const roles = await this.bean.role.findAllByUserId(user.id);
    const passport = { user, auth, roles };
    return await this.signin(passport, options);
  }

  public async signinMock(
    name?: keyof IUserNameRecord,
    options?: ISigninOptions,
  ): Promise<IJwtToken> {
    return await this.signinSystem('mock', (-10000 - ++this._mockCounter) as any, name, options);
  }

  public async signinWithAnonymous(): Promise<void> {
    const userAnonymous = await this.bean.user.createAnonymous();
    const passport = { user: userAnonymous, auth: undefined };
    await this.setCurrent(passport);
  }

  public async kickOut(user?: IUser) {
    if (!user) return;
    await this.authTokenAdapter.removeAll(user);
  }

  public async checkAuthToken(
    accessToken?: string,
    clientName?: keyof IJwtClientRecord,
    options?: IJwtVerifyOptions,
  ) {
    clientName = clientName ?? 'access';
    const [payloadData, err] = await catchError(() => {
      return this.bean.jwt.get(clientName).verify(accessToken, options);
    });
    if (err) {
      if (['access', 'refresh'].includes(clientName)) {
        err.code = 401;
      }
      throw err;
    }
    if (!payloadData) return; // no jwt token
    const passport = await this.passportAdapter.deserialize(payloadData);
    if (!passport) return this.app.throw(401);
    // verified
    const authTokenOptions = await this._combineAuthTokenOptions(
      passport.auth!.authProviderId,
      undefined,
      {
        stateless: this.scope.config.authToken.stateless,
      },
    );
    if (!authTokenOptions.stateless) {
      const verified = await this.authTokenAdapter.verify(payloadData);
      if (!verified) return this.app.throw(401);
    }
    // setCurrent
    await this.setCurrent(passport);
    return { payloadData, passport };
  }

  public async refreshAuthToken(refreshToken: string) {
    // checkAuthToken by code
    const checkRes = await this.checkAuthToken(refreshToken, 'refresh');
    if (!checkRes) return this.app.throw(401);
    let { payloadData, passport } = checkRes;
    // refreshAuthToken
    const authTokenOptions = await this._combineAuthTokenOptions(
      passport.auth!.authProviderId,
      undefined,
      {
        stateless: this.scope.config.authToken.stateless,
        strategy: this.scope.config.authToken.strategy.refreshAuthToken,
        ttl: this.scope.config.authToken.ttl,
      },
    );
    payloadData = await this._handlePayloadData(payloadData, authTokenOptions);
    // jwt token
    return await this.bean.jwt.create(payloadData);
  }

  // only created by accessToken
  public async createTempAuthToken(options?: IJwtSignOptions) {
    // current
    const passport = this.current;
    if (!passport) return this.app.throw(401);
    // payloadData
    const payloadData = await this._passportSerialize(passport, { strategy: 'reuse' });
    // jwt token
    return await this.bean.jwt.createTempAuthToken(payloadData, options);
  }

  public async createOauthAuthToken(options?: IJwtSignOptions) {
    // current
    const passport = this.current;
    if (!passport) return this.app.throw(401);
    // payloadData
    const payloadData = await this._passportSerialize(passport, { strategy: 'reuse' });
    // jwt token
    return await this.bean.jwt.createOauthAuthToken(payloadData, options);
  }

  public async createOauthCode(options?: IJwtSignOptions) {
    // current
    const passport = this.current;
    if (!passport) return this.app.throw(401);
    // payloadData
    const payloadData = await this._passportSerialize(passport, { strategy: 'reuse' });
    // code
    return await this.bean.jwt.createOauthCode(payloadData, options);
  }

  public async createOauthCodeFromOauthAuthToken(accessToken: string, options?: IJwtSignOptions) {
    // payloadData
    const payloadData = await this.bean.jwt.get('access').verify(accessToken);
    if (!payloadData) return this.app.throw(401);
    // code
    return await this.bean.jwt.createOauthCode(payloadData, options);
  }

  public async createAuthTokenFromOauthCode(code: string) {
    // checkAuthToken by code
    const checkRes = await this.checkAuthToken(code, 'code');
    if (!checkRes) return this.app.throw(401);
    const { payloadData } = checkRes;
    // jwt token
    return await this.bean.jwt.create(payloadData);
  }

  public checkRoleName(name: keyof IRoleNameRecord | (keyof IRoleNameRecord)[]) {
    const user = this.bean.passport.currentUser;
    if (!user || user.anonymous) return false;
    const roles = this.bean.passport.currentRoles;
    if (!roles) return false;
    const roleNames = roles?.map(item => item.name as keyof IRoleNameRecord);
    const optionsName = Array.isArray(name) ? name : [name];
    if (!roleNames.some(roleName => optionsName.includes(roleName))) return false;
    return true;
  }

  public checkUserName(name: keyof IUserNameRecord | (keyof IUserNameRecord)[]) {
    const user = this.bean.passport.currentUser;
    if (!user || user.anonymous) return false;
    const userName = user.name as keyof IUserNameRecord;
    const optionsName = Array.isArray(name) ? name : [name];
    if (!optionsName.includes(userName)) return false;
    return true;
  }

  private async _passportSerialize(passport: IPassport, authTokenOptions?: IAuthTokenOptions) {
    // serialize
    const payloadData = await this.passportAdapter.serialize(passport);
    return await this._handlePayloadData(payloadData, authTokenOptions);
  }

  private async _handlePayloadData(
    payloadData: IPayloadData,
    authTokenOptions?: IAuthTokenOptions,
  ) {
    // auth token
    const stateless = authTokenOptions?.stateless;
    const strategy = authTokenOptions?.strategy ?? 'refresh';
    const ttl = authTokenOptions?.ttl;
    if (stateless) {
      // do nothing
      return payloadData;
    } else if (strategy === 'reissue') {
      return await this.authTokenAdapter.create(payloadData, ttl);
    } else {
      const payloadData2 = await this.authTokenAdapter.retrieve(payloadData);
      if (!payloadData2) {
        return await this.authTokenAdapter.create(payloadData, ttl);
      }
      if (strategy === 'refresh') {
        await this.authTokenAdapter.refresh(payloadData2, ttl);
      } else if (strategy === 'reuse') {
        // do nothing
      }
      return payloadData2;
    }
  }

  private async _combineAuthTokenOptions(
    authProviderId: number | undefined,
    authTokenOptionsCustom: IAuthTokenOptions | undefined,
    authTokenOptionsDefault: IAuthTokenOptions,
  ) {
    if (!authProviderId) return authTokenOptionsDefault;
    const { clientOptions } = await this.bean.authProvider.getClientOptions(
      {
        id: authProviderId,
      },
      { authTokenOptions: authTokenOptionsCustom ?? {} },
      {
        authTokenOptions: authTokenOptionsDefault,
      },
    );
    if (!clientOptions) this.app.throw(403);
    return clientOptions.authTokenOptions!;
  }
}
