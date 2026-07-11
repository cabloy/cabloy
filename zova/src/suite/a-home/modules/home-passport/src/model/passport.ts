import type { IJwtInfo } from 'zova-module-a-interceptor';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type {
  ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeRequestBody,
  ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeResponseBody,
  ApiApiHomeUserPassportloginRequestBody,
  ApiApiHomeUserPassportloginResponseBody,
} from 'zova-module-home-api';

import { combineQueries, isNil } from '@cabloy/utils';
import { SchemaObject } from 'openapi3-ts/oas31';
import { $protocolKey } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';
import {
  IPermissionHintGeneral,
  IResourceFormActionRowNameRecord,
  IResourceTableActionNameRecord,
  TypeOpenapiPermissions,
} from 'zova-module-a-openapi';
import { ApiApiHomeUserPassportloginOauthPath, OpenApiBaseURL } from 'zova-module-home-api';

export interface IModelOptionsPassport extends IDecoratorModelOptions {}

@Model<IModelOptionsPassport>()
export class ModelPassport extends BeanModelBase {
  passport?: ApiApiHomeUserPassportloginResponseBody['passport'];
  jwt?: ApiApiHomeUserPassportloginResponseBody['jwt'];
  accessToken?: string;
  expireTime?: number;
  schemaLogin?: SchemaObject;
  private _mediaPassportCodes = new Map<string, { token: string; expiresAt: number }>();
  private _mediaPassportCodePromises = new Map<string, Promise<string | undefined>>();

  protected async __init__() {
    this.schemaLogin = this.$computed(() => {
      return this.apiSchemasLogin.requestBody;
    });
    this.passport = process.env.CLIENT
      ? this.$useStateLocal({ queryKey: ['passport'] })
      : this.$useStateMem({ queryKey: ['passport'] });
    this.jwt = this.$useStateLocal({ queryKey: ['jwt'] });
    this.expireTime = this.$useStateLocal({ queryKey: ['expireTime'] });
    this.accessToken = this.sys.config.ssr.cookieDisabledOnServer
      ? undefined
      : this.$useStateCookie({ queryKey: ['token'] });
    if (process.env.CLIENT) {
      this._setLocaleTz();
    }
  }

  get apiSchemasLogin() {
    return this.$apiSchema.homeUserPassport.login({ authToken: false });
  }

  login() {
    return this.$useMutationData<
      ApiApiHomeUserPassportloginResponseBody,
      ApiApiHomeUserPassportloginRequestBody
    >({
      mutationKey: ['login'],
      mutationFn: async params => {
        return this.$api.homeUserPassport.login(params, { authToken: false });
      },
      onSuccess: data => {
        this.afterLogin(data);
      },
    });
  }

  loginByOauthCode() {
    return this.$useMutationData<
      ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeResponseBody,
      ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeRequestBody
    >({
      mutationKey: ['loginByOauthCode'],
      mutationFn: async params => {
        return this.$api.homeUserPassport.createPassportJwtFromOauthCode(params, {
          authToken: false,
        });
      },
      onSuccess: data => {
        this.afterLogin(data);
      },
    });
  }

  async resolveMediaPassportCodeUrl(url: string | undefined): Promise<string | undefined> {
    if (!url || !process.env.CLIENT || !this.isAuthenticated) return url;
    const apiBaseUrl = new URL(
      this.sys.config.api.baseURL ?? globalThis.location.href,
      globalThis.location.href,
    );
    const parsedUrl = new URL(url, apiBaseUrl);
    if (parsedUrl.origin !== apiBaseUrl.origin) return url;
    const passportCodeKey = $protocolKey('x-vona-passport-code');
    if (parsedUrl.searchParams.has(passportCodeKey)) return url;
    const scope = this._resolveMediaPassportCodeScope(parsedUrl.pathname);
    if (!scope) return url;
    const code = await this._getMediaPassportCode(scope);
    if (!code) return url;
    parsedUrl.searchParams.set(passportCodeKey, code);
    return parsedUrl.toString();
  }

  private _resolveMediaPassportCodeScope(pathname: string) {
    const apiPrefix = this.sys.config.api.prefix ?? '/api';
    const scopes = [`${apiPrefix}/file/download`, `${apiPrefix}/image/delivery`];
    return scopes.find(scope => pathname === scope || pathname.startsWith(`${scope}/`));
  }

  private async _getMediaPassportCode(scope: string) {
    const userId = this.user?.id;
    if (!userId) return;
    const key = `${String(userId)}:${scope}`;
    const cached = this._mediaPassportCodes.get(key);
    if (cached && cached.expiresAt > Date.now() + 30 * 1000) return cached.token;
    let pending = this._mediaPassportCodePromises.get(key);
    if (!pending) {
      pending = this.$api.homeUserPassport
        .createTempAuthToken(undefined, {
          query: { path: scope, pathMatch: 'prefix' },
        })
        .then(result => {
          this._mediaPassportCodes.set(key, {
            token: result.token,
            expiresAt: Date.now() + result.expiresIn * 1000,
          });
          return result.token;
        })
        .finally(() => {
          this._mediaPassportCodePromises.delete(key);
        });
      this._mediaPassportCodePromises.set(key, pending);
    }
    return await pending;
  }

  getOauthLoginUrl(module: string, providerName: string, clientName?: string): string {
    const apiPath = this.sys.util.apiActionPathTranslate(ApiApiHomeUserPassportloginOauthPath, {
      module,
      providerName,
      clientName,
    });
    const returnTo = this.app.$getReturnTo();
    const redirect = this.$router.getPagePath(
      '/home/base/authCallback',
      { query: { returnTo } },
      true,
    );
    return combineQueries(`${OpenApiBaseURL(this.sys)}${apiPath}`, { redirect });
  }

  afterLogin(data?: ApiApiHomeUserPassportloginResponseBody) {
    // save
    this._setPassportJwt(data);
    // page: returnTo
    this.app.$gotoReturnTo();
  }

  logout() {
    return this.$useMutationData<void, void>({
      mutationKey: ['logout'],
      mutationFn: async () => {
        await this.$api.homeUserPassport.logout();
      },
      onSuccess: async () => {
        this._setPassportJwt();
        // page: login
        await this.app.$gotoLogin();
        // clear: should after goto login page, avoid home-layoutadmin use some cache data
        this.$clear(); // not await
      },
    });
  }

  get isAuthenticated(): boolean {
    return !!this.passport;
    // return !!this.accessToken && !!this.expireTime && this.expireTime > Date.now();
  }

  get user() {
    return this.passport?.user;
  }

  get roles() {
    return this.passport?.roles;
  }

  async getJwtInfo(): Promise<IJwtInfo | undefined> {
    if (!this.accessToken) return undefined;
    return {
      accessToken: this.accessToken,
      refreshToken: this.jwt?.refreshToken,
      expiresIn: this.jwt?.expiresIn,
      expireTime: this.expireTime,
    };
  }

  async refreshAuthToken(refreshToken: string): Promise<IJwtInfo> {
    const jwt = await this.$api.homeUserPassport.refreshAuthToken(
      { refreshToken },
      { authToken: false },
    );
    this._setJwt(jwt);
    return (await this.getJwtInfo())!;
  }

  async ensurePassport() {
    if (process.env.CLIENT) return this.passport;
    if (!this.sys.config.ssr.cookieDisabledOnServer && !this.isAuthenticated && this.accessToken) {
      this.passport = await this.$api.homeUserPassport.current();
      this._setLocaleTz();
    }
    return this.passport;
  }

  private _setLocaleTz() {
    const user = this.passport?.user;
    if (!user) return;
    // locale
    if (user.locale) {
      const cookieLocale = this.app.meta.cookie.getItem(this.sys.config.locale.storeKey);
      if (!cookieLocale) {
        this.app.meta.locale.current = user.locale as any;
      }
    }
    // tz
    if (user.tz) {
      const cookieTz = this.app.meta.cookie.getItem(this.sys.config.tz.storeKey);
      if (!cookieTz) {
        this.app.meta.locale.tz = user.tz;
      }
    }
  }

  private _setPassportJwt(data?: ApiApiHomeUserPassportloginResponseBody) {
    this._clearMediaPassportCodes();
    this._setPassport(data?.passport);
    this._setJwt(data?.jwt);
  }

  private _clearMediaPassportCodes() {
    this._mediaPassportCodes.clear();
    this._mediaPassportCodePromises.clear();
  }

  private _setPassport(passport?: ApiApiHomeUserPassportloginResponseBody['passport']) {
    if (passport) {
      this.passport = passport;
    } else {
      this.passport = undefined;
    }
  }

  private _setJwt(jwt?: ApiApiHomeUserPassportloginResponseBody['jwt']) {
    if (jwt) {
      this.jwt = jwt;
      this.expireTime =
        Date.now() + (jwt.expiresIn - this.scope.config.accessToken.expireTimeDelay) * 1000;
      this.accessToken = jwt.accessToken;
    } else {
      this.jwt = undefined;
      this.expireTime = undefined;
      this.accessToken = undefined;
    }
  }

  public checkPermission(
    permissions: TypeOpenapiPermissions | undefined,
    actionName?: keyof (IResourceTableActionNameRecord & IResourceFormActionRowNameRecord),
    permissionHint?: IPermissionHintGeneral,
  ): boolean {
    if (permissionHint?.public) return true;
    const permissionAction = permissionHint?.actionInherit ?? actionName;
    if (!permissionAction) return true;
    if (isNil(permissions)) return false;
    if (permissions === false) return false;
    if (permissions === true) return true;
    // roleIds
    if (
      permissions.roleIds &&
      permissions.roleIds.some(roleId => this.roles?.some(role => role.id === roleId))
    ) {
      return true;
    }
    // roleNames
    if (
      permissions.roleNames &&
      permissions.roleNames.some(roleName => this.roles?.some(role => role.name === roleName))
    ) {
      return true;
    }
    // actions
    if (permissions.actions && !!permissions.actions[permissionAction]) return true;
    // others
    return false;
  }
}
