import type { ZovaMetaMode } from '@cabloy/module-info';
import type { IParamsAndQuery } from '@cabloy/utils';
import type { ILocaleRecord } from 'vona';
import type { IMenuGroup, IMenuItem } from 'vona-module-a-menu';
import type { IOnionSlice } from 'vona-module-a-onion';
import type { TypeEventResolvePathData, TypeEventResolvePathResult } from 'vona-module-a-static';

import {
  catchError,
  combineParamsAndQuery,
  combineQueries,
  defaultPathSerializer,
} from '@cabloy/utils';
import path from 'node:path';
import { BeanBase, cast, deepExtend, SymbolModuleName } from 'vona';
import { checkErrorJwtExpiredAndThrow } from 'vona-module-a-jwt';

import type { TypeEventRetrieveMenusResult } from '../bean/event.retrieveMenus.ts';
import type { IDecoratorSsrMenuOptions, ISsrMenuRecord } from '../types/ssrMenu.ts';
import type { ISsrMenuGroupRecord } from '../types/ssrMenuGroup.ts';
import type {
  IDecoratorSsrSiteOptions,
  ISsrHandlerRenderOptions,
  ISsrHandlerRenderOptionsInner,
  ISsrSitePerformActionOptions,
  TypeSsrSitePerformAction,
} from '../types/ssrSite.ts';

import { ServiceDevProxy } from '../service/devProxy.ts';
import { ServiceSsrHandler } from '../service/ssrHandler.ts';
import { SymbolCacheMenus } from './const.ts';

export class BeanSsrSiteBase<
  SsrSiteOptions extends IDecoratorSsrSiteOptions = IDecoratorSsrSiteOptions,
> extends BeanBase {
  private _siteOptions: SsrSiteOptions;
  private _devProxy: ServiceDevProxy;
  private _ssrHandler: ServiceSsrHandler;

  protected async __dispose__() {
    if (this._devProxy) {
      this._devProxy.dispose();
    }
    if (this._ssrHandler) {
      await this._ssrHandler.dispose();
    }
  }

  async resolvePath(data: TypeEventResolvePathData): Promise<TypeEventResolvePathResult> {
    const { req, res } = this.ctx;
    // dev proxy
    if (this.siteOptions.apiType === 'dev') {
      return await this.devProxy.web(req, res);
    }
    // ssr handler
    await this.ssrHandler.ensureReady();
    // static
    const fileAsset = await this.ssrHandler.resolvePath(data.filename);
    if (fileAsset) return fileAsset;
    // render
    return await this.render(undefined, undefined, { req, res });
  }

  async redirect<
    PAGEPATH extends keyof SsrSiteOptions['pages'],
    PAGEOPTIONS extends Omit<SsrSiteOptions['pages'][PAGEPATH], 'data'>,
  >(pagePath?: PAGEPATH, pageOptions?: PAGEOPTIONS): Promise<undefined | never> {
    // pagePath
    pagePath = this.$scope.ssr.service.ssr.prepareMenuLink(pagePath as any) as any;
    // pagePathFull
    let pagePathFull = combineParamsAndQuery(pagePath as any, pageOptions as IParamsAndQuery);
    if (this.siteOptions.publicPath) {
      pagePathFull = `/${this.siteOptions.publicPath}${pagePathFull as string}`;
    }
    if (this.siteOptions.apiType === 'dev') {
      const url = `${this.siteOptions.dev.host}${pagePathFull}`;
      this.ctx.redirect(url);
    } else {
      this.ctx.redirect(pagePathFull as string);
    }
  }

  async render<
    PAGEPATH extends keyof SsrSiteOptions['pages'],
    PAGEOPTIONS extends SsrSiteOptions['pages'][PAGEPATH],
  >(
    pagePath?: PAGEPATH,
    pageOptions?: PAGEOPTIONS,
    renderOptions?: ISsrHandlerRenderOptions,
  ): Promise<TypeEventResolvePathResult> {
    if (this.siteOptions.apiType === 'dev') return;
    // ssr handler ensureReady: maybe invoked directly
    await this.ssrHandler.ensureReady();
    // performAction
    let performAction: TypeSsrSitePerformAction | undefined;
    if (this.siteOptions.apiType === 'performAction') {
      performAction = await this._createPerformAction();
    }
    // pagePath
    if (pagePath) {
      pagePath = this.$scope.ssr.service.ssr.prepareMenuLink(pagePath as any) as any;
      pagePath = defaultPathSerializer(
        pagePath as string,
        (pageOptions as IParamsAndQuery)?.params,
      ) as any;
    }
    // url
    let pagePathFull = pagePath;
    if (pagePathFull) {
      pagePathFull = combineQueries(
        pagePathFull as any,
        (pageOptions as IParamsAndQuery)?.query,
      ) as any;
    }
    // optionsInner
    const req = renderOptions?.req ?? this.ctx.req;
    const res = renderOptions?.res ?? this.ctx.res;
    const optionsInner: ISsrHandlerRenderOptionsInner = {
      req,
      res,
      performAction,
      state: {
        envClient: this.siteOptions.envClient,
        pagePathFull: pagePathFull as any,
        pagePath: pagePath as any,
        pageData: cast(pageOptions)?.data,
      },
    };
    // ssr render
    const html = await this.ssrHandler.render(optionsInner);
    if (!html) return;
    if (html === true) return true;
    // output
    if (renderOptions?.returnHtml) return html;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
    return true;
  }

  async retrieveMenus(): Promise<TypeEventRetrieveMenusResult | undefined> {
    return await this._getMenusCache(this.ctx.locale);
  }

  public get siteOptions() {
    if (!this._siteOptions) {
      const onionOptions = this.$onionOptions as IDecoratorSsrSiteOptions;
      const SSR_WITH_VONA = 'true';
      const META_MODE: ZovaMetaMode =
        process.env.META_MODE === 'dev' ? 'development' : 'production';
      const baseUrl = `${this.app.util.protocol}://${this.app.util.host}`;
      this._siteOptions = deepExtend(
        {
          envServer: {
            SSR_API_BASE_URL: baseUrl,
            SSR_PROD_PROTOCOL: this.app.util.protocol,
            SSR_PROD_HOST: this.app.util.host,
            SSR_WITH_VONA,
            META_MODE,
          },
          envClient: {
            API_BASE_URL: baseUrl,
            SSR_PROD_PROTOCOL: this.app.util.protocol,
            SSR_PROD_HOST: this.app.util.host,
            SSR_WITH_VONA,
            META_MODE,
          },
        },
        this.$scope.ssr.config.site.default,
        onionOptions,
      );
    }
    return this._siteOptions;
  }

  private get devProxy() {
    if (!this._devProxy) {
      this._devProxy = this.bean._newBean(ServiceDevProxy, this.siteOptions);
    }
    return this._devProxy;
  }

  private get ssrHandler() {
    if (!this._ssrHandler) {
      this._ssrHandler = this.bean._newBean(
        ServiceSsrHandler,
        this.siteOptions,
        this._getAssetPathPhysical(''),
      );
    }
    return this._ssrHandler;
  }

  private _getAssetPathPhysical(filePath: string) {
    return this.app.util.getAssetPathPhysical(
      this[SymbolModuleName] as any,
      'site',
      path.join(this.siteOptions.bundlePath, filePath),
    );
  }

  private async _createPerformAction() {
    let ctxInited: boolean = false;
    // performAction
    return async (data: ISsrSitePerformActionOptions) => {
      // headers
      const headers = cast(data.headers)?.toJSON();
      if (headers?.Accept) {
        headers.accept = headers.Accept;
        delete headers.Accept;
      }
      // passport
      if (!ctxInited) {
        // init instance
        await this.$scope.instance.service.instance.initInstance();
        // auth token
        if (!this.bean.passport.current) {
          const accessToken =
            this.$scope.jwt.service.jwtExtract.fromAuthHeaderWithScheme(
              headers.Authorization ?? headers.authorization,
            ) ?? '';
          const [_, err] = await catchError(() => {
            return this.bean.passport.checkAuthToken(accessToken);
          });
          // throw error only when ErrorMessageJwtExpired
          checkErrorJwtExpiredAndThrow(err, headers);
        }
        // check current
        if (!this.bean.passport.current) {
          await this.bean.passport.signinWithAnonymous();
        }
        ctxInited = true;
      }
      // performAction
      const res = await this.$scope.executor.service.executor.performActionInner(
        data.method,
        data.path as never,
        {
          innerAccess: false,
          query: data.query,
          body: data.body,
          headers,
        },
      );
      // let toJSON take affect
      return res && typeof res === 'object' ? JSON.parse(JSON.stringify(res)) : res;
    };
  }

  private async _getMenusCache(locale: keyof ILocaleRecord): Promise<TypeEventRetrieveMenusResult> {
    if (!this.app.meta[SymbolCacheMenus]) this.app.meta[SymbolCacheMenus] = {};
    const cacheMenus: Record<keyof ILocaleRecord, TypeEventRetrieveMenusResult> =
      this.app.meta[SymbolCacheMenus];
    const beanFullName = this.$beanFullName;
    const instanceName = this.ctx.instanceName;
    const host = this.ctx.host;
    const cacheKey = `${instanceName}:${host}:${locale}`;
    if (!cacheMenus[beanFullName]) cacheMenus[beanFullName] = {};
    if (!cacheMenus[beanFullName][cacheKey]) {
      cacheMenus[beanFullName][cacheKey] = await this._prepareMenus(locale);
    }
    return cacheMenus[beanFullName][cacheKey];
  }

  private async _prepareMenus(locale: keyof ILocaleRecord): Promise<TypeEventRetrieveMenusResult> {
    return await this.$scope.ssr.event.retrieveMenusSite.emit(
      { ssrSite: this, locale },
      async () => {
        // menus
        const ssrMenus = this.bean.onion.ssrMenu.getOnionsEnabled();
        const menus = this._prepareMenusOrGroups(locale, ssrMenus);
        // groups
        const ssrMenuGroups = this.bean.onion.ssrMenuGroup.getOnionsEnabled();
        const groups = this._prepareMenusOrGroups(locale, ssrMenuGroups);
        // ok
        return { menus, groups };
      },
    );
  }

  private _prepareMenusOrGroups<T extends keyof ISsrMenuRecord>(
    locale: keyof ILocaleRecord,
    ssrMenus: IOnionSlice<ISsrMenuRecord, T, unknown>[],
  ): IMenuItem[];
  private _prepareMenusOrGroups<T extends keyof ISsrMenuGroupRecord>(
    locale: keyof ILocaleRecord,
    ssrMenus: IOnionSlice<ISsrMenuGroupRecord, T, unknown>[],
  ): IMenuGroup[];
  private _prepareMenusOrGroups<T extends keyof ISsrMenuRecord | keyof ISsrMenuGroupRecord>(
    locale: keyof ILocaleRecord,
    ssrMenus: IOnionSlice<ISsrMenuRecord & ISsrMenuGroupRecord, T, unknown>[],
  ) {
    const siteOnionName = this.$onionName;
    // menus
    const menus: IMenuItem<keyof SsrSiteOptions['pages']>[] = [];
    for (const ssrMenu of ssrMenus) {
      const siteMenuOptions = ssrMenu.beanOptions
        .options as IDecoratorSsrMenuOptions<IDecoratorSsrSiteOptions>;
      if (!_checkValidSiteOrLocale(siteOnionName, siteMenuOptions.site)) continue;
      if (!_checkValidSiteOrLocale(locale, siteMenuOptions.locale)) continue;
      const menusFrom =
        siteMenuOptions.items || (siteMenuOptions.item && { '': siteMenuOptions.item });
      if (!menusFrom) continue;
      for (const key in menusFrom) {
        const menuFrom = menusFrom[key];
        const name = !key ? ssrMenu.name : `${ssrMenu.name}#${key}`;
        const title = menuFrom.title
          ? this.app.meta.text.locale(locale, menuFrom.title)
          : menuFrom.title;
        const description = menuFrom.description
          ? this.app.meta.text.locale(locale, menuFrom.description)
          : menuFrom.description;
        const link = this.$scope.ssr.service.ssr.prepareMenuLink(menuFrom.link);
        menus.push({ ...menuFrom, name, title, description, link });
      }
    }
    return menus;
  }
}

function _checkValidSiteOrLocale(expect: any, target: any) {
  if (!target) return true;
  if (Array.isArray(target) && target.includes(expect)) return true;
  if (expect === target) return true;
  return false;
}
