import type { IJwtClientRecord, IJwtSignOptions, IJwtToken, IPayloadData } from 'vona-module-a-jwt';

import { catchError, isNil } from '@cabloy/utils';
import { BeanBase, beanFullNameFromOnionName } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type {
  IAuth,
  IAuthIdRecord,
  IAuthTokenOptions,
  ISigninOptions,
  TypeAuthTokenMode,
} from '../types/auth.ts';
import type { IAuthTokenAdapter, IAuthTokenCheckOptions } from '../types/authToken.ts';
import type { IPassport, IPassportAdapter } from '../types/passport.ts';
import type { IRole, IRoleNameRecord } from '../types/role.ts';
import type { IUser, IUserNameRecord } from '../types/user.ts';

import { $getAuthIdSystem, $getAuthTokenMode } from '../lib/auth.ts';

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

  public get authTokenMode(): TypeAuthTokenMode {
    return $getAuthTokenMode(this.scope.config.authToken);
  }

  public get isAuthenticated(): boolean {
    const user = this.currentUser;
    return !!user && !user.anonymous;
  }

  public get isActivated(): boolean {
    const user = this.currentUser;
    return !!user && !!user.activated;
  }

  public get isAccountActive(): boolean {
    const user = this.currentUser;
    return !!user && !user.anonymous && user.accountStatus !== 'disabled';
  }

  public ensureAccountActive(passport?: IPassport): void {
    const user = passport?.user ?? this.currentUser;
    if (user && !user.anonymous && user.accountStatus === 'disabled') {
      this.app.throw(403);
    }
  }

  public async isSystemAdmin(): Promise<boolean> {
    const passport = this.current;
    return await this.passportAdapter.isSystemAdmin(passport);
  }

  public async setCurrent(passport: IPassport | undefined) {
    this.ctx.state.passportPayloadData = undefined;
    this.ctx.state.passportAuthTokenClient = undefined;
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
    this._getAuthTokenAdapter('access', true);
    if (isNil(this.ctx.instanceName)) throw new Error('should specify instance');
    this.ensureAccountActive(passport);
    // current
    await this.setCurrent(passport);
    // event
    await this.scope.event.signin.emit(passport);
    return await this._createAuthToken(passport, {}, 'access', undefined, options?.authToken);
  }

  public async createAuthToken(
    passport: IPassport,
    payloadData: IPayloadData,
    clientName: keyof IJwtClientRecord = 'access',
    input?: unknown,
  ): Promise<IJwtToken> {
    this._ensureAuthTokenPassport(passport);
    return await this._createAuthToken(passport, payloadData, clientName, input);
  }

  private async _createAuthToken(
    passport: IPassport,
    seed: IPayloadData,
    clientName: keyof IJwtClientRecord,
    input?: unknown,
    options?: IAuthTokenOptions,
  ): Promise<IJwtToken> {
    if (isNil(this.ctx.instanceName)) throw new Error('should specify instance');
    this.ensureAccountActive(passport);
    const adapter = this._getAuthTokenAdapter(clientName, true);
    const authTokenOptions = await this._combineAuthTokenOptions(
      passport.auth!.authProviderId,
      options,
      {
        stateless: this.scope.config.authToken.stateless,
        strategy: this.scope.config.authToken.strategy.signin,
        ttl: this.scope.config.authToken.ttl,
      },
      adapter,
    );
    const payloadData = await this._passportSerialize(
      passport,
      authTokenOptions,
      true,
      clientName,
      seed,
      input,
    );
    return await this._issueAuthToken(
      passport,
      payloadData,
      clientName,
      adapter === this.authTokenAdapter && passport.auth?.id.toString() === '-1',
    );
  }

  private async _issueAuthToken(
    passport: IPassport,
    payloadData: IPayloadData,
    clientName: keyof IJwtClientRecord,
    dev = false,
  ): Promise<IJwtToken> {
    const adapter = this._getAuthTokenAdapter(clientName, true);
    const options = adapter.getJwtOptions?.(payloadData);
    const accessClient = options?.accessClient ?? 'access';
    const refreshClient = options?.refreshClient ?? 'refresh';
    if (
      this._getAuthTokenAdapter(accessClient, true) !== adapter ||
      this._getAuthTokenAdapter(refreshClient, true) !== adapter
    ) {
      return this.app.throw(403);
    }
    const jwt = await this.bean.jwt.create(payloadData, {
      dev,
      ...options,
    });
    await this._attachAuthToken(passport, payloadData, accessClient);
    return jwt;
  }

  private async _attachAuthToken(
    passport: IPassport,
    payloadData: IPayloadData,
    clientName: keyof IJwtClientRecord,
  ) {
    if (this.current !== passport) await this.setCurrent(passport);
    this.ctx.state.passportPayloadData = payloadData;
    this.ctx.state.passportAuthTokenClient = clientName;
  }

  public async signout(): Promise<void> {
    // current
    const passport = this.current;
    if (!passport) return;
    const adapter = this._getAuthTokenAdapter(this.ctx.state.passportAuthTokenClient ?? 'access');
    // removeAuthToken
    const payloadData =
      adapter === this.authTokenAdapter && this.authTokenMode === 'auth'
        ? await this.passportAdapter.serialize(passport)
        : this._getCurrentPayloadData();
    await adapter.remove(payloadData);
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
    clientName: keyof IJwtClientRecord = 'access',
    options?: IAuthTokenCheckOptions,
  ) {
    const [payloadData, err] = await catchError(() => {
      return this.bean.jwt.get(clientName).verify(accessToken, options);
    });
    if (err) {
      if (
        this.$scope.jwt.config.clients[clientName]?.authTokenAdapter ||
        ['access', 'refresh'].includes(clientName)
      ) {
        err.code = 401;
      }
      throw err;
    }
    if (!payloadData) return; // no jwt token
    const adapter = this._getAuthTokenAdapter(clientName);
    const passport = adapter.deserialize
      ? await adapter.deserialize(payloadData)
      : await this.passportAdapter.deserialize(payloadData);
    if (!passport) return this.app.throw(401);
    this.ensureAccountActive(passport);
    const authTokenOptions = await this._combineAuthTokenOptions(
      passport.auth!.authProviderId,
      undefined,
      { stateless: this.scope.config.authToken.stateless },
      adapter,
    );
    const operation = options?.operation ?? 'check';
    if (!authTokenOptions.stateless) {
      const verified = await adapter.verify(payloadData, {
        operation,
        clientName,
        input: options?.input,
      });
      if (!verified) return this.app.throw(401);
    }
    if (operation !== 'refresh') await this._attachAuthToken(passport, payloadData, clientName);
    return { payloadData, passport };
  }

  public async refreshAuthToken(
    refreshToken: string,
    clientName: keyof IJwtClientRecord = 'refresh',
    input?: unknown,
  ) {
    const adapter = this._getAuthTokenAdapter(clientName, true);
    const checkRes = await this.checkAuthToken(refreshToken, clientName, {
      operation: 'refresh',
      input,
    });
    if (!checkRes) return this.app.throw(401);
    const { passport } = checkRes;
    const authTokenOptions = await this._combineAuthTokenOptions(
      passport.auth!.authProviderId,
      undefined,
      {
        stateless: this.scope.config.authToken.stateless,
        strategy: this.scope.config.authToken.strategy.refreshAuthToken,
        ttl: this.scope.config.authToken.ttl,
      },
      adapter,
    );
    const payloadData = await this._handlePayloadData(
      checkRes.payloadData,
      authTokenOptions,
      adapter,
      input,
    );
    return await this._issueAuthToken(passport, payloadData, clientName);
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
    const payloadData = await this._passportSerialize(
      passport,
      { strategy: 'reuse' },
      false,
      'oauth',
    );
    // jwt token
    return await this.bean.jwt.createOauthAuthToken(payloadData, options);
  }

  public async createOauthCode(options?: IJwtSignOptions) {
    // current
    const passport = this.current;
    if (!passport) return this.app.throw(401);
    // payloadData
    const payloadData = await this._passportSerialize(
      passport,
      { strategy: 'reuse' },
      false,
      'code',
    );
    // code
    return await this.bean.jwt.createOauthCode(payloadData, options);
  }

  public async createOauthCodeFromOauthAuthToken(accessToken: string, options?: IJwtSignOptions) {
    this._getAuthTokenAdapter('code', true);
    // payloadData
    const payloadData =
      this.authTokenMode === 'session'
        ? (await this.checkAuthToken(accessToken))?.payloadData
        : await this.bean.jwt.get('access').verify(accessToken);
    if (!payloadData) return this.app.throw(401);
    // code
    return await this.bean.jwt.createOauthCode(payloadData, options);
  }

  public async createAuthTokenFromOauthCode(code: string) {
    this._getAuthTokenAdapter('access', true);
    // checkAuthToken by code
    const checkRes = await this.checkAuthToken(code, 'code');
    if (!checkRes) return this.app.throw(401);
    const { payloadData, passport } = checkRes;
    return await this._issueAuthToken(passport, payloadData, 'access');
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

  private _getAuthTokenAdapter(
    clientName: keyof IJwtClientRecord,
    issuance = false,
  ): IAuthTokenAdapter {
    const client = this.$scope.jwt.config.clients[clientName];
    if (!client) throw new Error(`jwt client not found: ${clientName}`);
    const adapter = client.authTokenAdapter
      ? (this.bean._getBean(
          beanFullNameFromOnionName(client.authTokenAdapter, 'service'),
        ) as IAuthTokenAdapter)
      : this.authTokenAdapter;
    if (!adapter) return this.app.throw(401);
    // Check before callers replace current: scoped authority cannot become ordinary credentials.
    const source = this.ctx.state.passportAuthTokenClient;
    if (issuance && source) {
      const sourceAdapter = this._getAuthTokenAdapter(source);
      if (sourceAdapter !== this.authTokenAdapter && sourceAdapter !== adapter)
        return this.app.throw(403);
    }
    return adapter;
  }

  private _ensureAuthTokenPassport(passport: IPassport): void {
    if (!passport.user || passport.user.anonymous || !passport.auth) return this.app.throw(401);
    this.ensureAccountActive(passport);
  }

  private _getCurrentPayloadData(): IPayloadData {
    const payloadData = this.ctx.state.passportPayloadData;
    if (!payloadData?.[this.scope.config.payloadData.fields.token]) return this.app.throw(401);
    return payloadData;
  }

  private async _passportSerialize(
    passport: IPassport,
    authTokenOptions?: IAuthTokenOptions,
    signin = false,
    clientName: keyof IJwtClientRecord = 'access',
    seed: IPayloadData = {},
    input?: unknown,
  ) {
    const adapter = this._getAuthTokenAdapter(clientName, true);
    if (adapter === this.authTokenAdapter && this.authTokenMode === 'session') {
      if (signin) {
        const payloadData = { ...seed, ...(await this.passportAdapter.serialize(passport)) };
        return await adapter.create(payloadData, authTokenOptions?.ttl, input);
      }
      return await this._handlePayloadData(
        this._getCurrentPayloadData(),
        authTokenOptions,
        adapter,
        input,
      );
    }
    const payloadData =
      !signin && adapter !== this.authTokenAdapter
        ? this._getCurrentPayloadData()
        : { ...seed, ...(await this.passportAdapter.serialize(passport)) };
    return await this._handlePayloadData(payloadData, authTokenOptions, adapter, input);
  }

  private async _handlePayloadData(
    payloadData: IPayloadData,
    authTokenOptions?: IAuthTokenOptions,
    adapter: IAuthTokenAdapter = this.authTokenAdapter,
    input?: unknown,
  ) {
    const stateless = authTokenOptions?.stateless;
    const strategy = authTokenOptions?.strategy ?? 'refresh';
    const ttl = authTokenOptions?.ttl;
    if (adapter === this.authTokenAdapter && this.authTokenMode === 'session') {
      if (stateless) throw new Error('Session auth-token mode requires stateful authentication');
      if (strategy === 'reissue') {
        throw new Error('Session auth-token mode does not support the reissue refresh strategy');
      }
      const verified = await adapter.verify(payloadData);
      if (!verified) return this.app.throw(401);
      if (strategy === 'refresh') await adapter.refresh(payloadData, ttl);
      return payloadData;
    }
    if (stateless) {
      return payloadData;
    } else if (strategy === 'reissue') {
      return await adapter.create(payloadData, ttl, input);
    } else {
      const payloadData2 = await adapter.retrieve(payloadData);
      if (!payloadData2) return await adapter.create(payloadData, ttl, input);
      if (strategy === 'refresh') await adapter.refresh(payloadData2, ttl);
      return payloadData2;
    }
  }

  private async _combineAuthTokenOptions(
    authProviderId: number | undefined,
    authTokenOptionsCustom: IAuthTokenOptions | undefined,
    authTokenOptionsDefault: IAuthTokenOptions,
    adapter: IAuthTokenAdapter = this.authTokenAdapter,
  ) {
    if (adapter.options) return adapter.options;
    let authTokenOptions = authTokenOptionsDefault;
    if (this.authTokenMode === 'session') {
      authTokenOptions = { ...authTokenOptions, ...authTokenOptionsCustom };
    }
    if (authProviderId) {
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
      authTokenOptions = clientOptions.authTokenOptions!;
    }
    if (this.authTokenMode === 'session' && authTokenOptions.stateless) {
      throw new Error('Session auth-token mode requires stateful authentication');
    }
    return authTokenOptions;
  }
}
