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

  protected async __init__() {
    this.schemaLogin = this.$computed(() => {
      return this.apiSchemasLogin.requestBody;
    });
    this.passport = process.env.CLIENT
      ? this.$useStateLocal({ queryKey: ['passport'] })
      : this.$useStateMem({ queryKey: ['passport'] });
    this.jwt = this.$useStateLocal({ queryKey: ['jwt'] });
    this.expireTime = this.$useStateLocal({ queryKey: ['expireTime'] });
    this.accessToken = this.sys.config.ssr.ignoreCookieOnServer
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
        // clear: should after goto login page, avoid home-layouttabs use some cache data
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
    if (!this.sys.config.ssr.ignoreCookieOnServer && !this.isAuthenticated && this.accessToken) {
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
    this._setPassport(data?.passport);
    this._setJwt(data?.jwt);
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
    )
      return true;
    // roleNames
    if (
      permissions.roleNames &&
      permissions.roleNames.some(roleName => this.roles?.some(role => role.name === roleName))
    )
      return true;
    // actions
    if (permissions.actions && !!permissions.actions[permissionAction]) return true;
    // others
    return false;
  }
}
