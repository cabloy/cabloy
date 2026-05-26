import { catchError } from '@cabloy/utils';
import { RouteLocationResolvedGeneric } from '@cabloy/vue-router';
import fse from 'fs-extra';
import ms from 'ms';
import path, { basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { BeanBase, cast, Use, UseScope } from 'zova';
import { Service } from 'zova-module-a-bean';
import { SysRouter } from 'zova-module-a-router';
import { ScopeModuleASsr } from 'zova-module-a-ssr';

import { ISsrHandlerRenderOptionsInner, TypeEventResolvePathResult } from '../types/ssr.js';

const jsRE = /\.js$/;
const cssRE = /\.css$/;
const woffRE = /\.woff$/;
const woff2RE = /\.woff2$/;
const gifRE = /\.gif$/;
const jpgRE = /\.jpe?g$/;
const pngRE = /\.png$/;

@Service()
export class ServiceSsrHandler extends BeanBase {
  private _siteAssetDir: string;
  private _handlerPromise: Promise<any>;
  private _handlerInstance: any;
  private _clientManifest: any;
  private _ssrModulesZovaCache: any = {};

  @Use()
  $$sysRouter: SysRouter;

  @UseScope()
  $$scopeSsr: ScopeModuleASsr;

  protected __init__(siteAssetDir: string) {
    this._siteAssetDir = siteAssetDir;
  }

  protected __dispose__() {
    this.dispose();
  }

  public dispose() {
    this.sys.close();
    this._handlerInstance = undefined;
  }

  async resolvePath(filename: string): Promise<TypeEventResolvePathResult> {
    if (filename === '') filename = 'index.html';
    // assets
    const fileAsset = path.join(this._siteAssetDir, 'client', filename);
    if (await fse.exists(fileAsset)) return fileAsset;
    // not found
    return undefined;
  }

  public async render(options: ISsrHandlerRenderOptionsInner) {
    // resolve route
    const pagePathFull =
      options.state?.pagePathFull ?? this.sys.util.getPagePathFromAbsoluteUrl(options.req.url!);
    const route = await this.$$sysRouter.resolveRoute(pagePathFull, true, false);
    if (!route) return;
    // handler
    const { serverEntry, renderToString, renderTemplate } = this._handlerInstance;
    // ssrContext
    const onRenderedList: Function[] = [];
    const ssrContext = {
      ...options,
      _meta: {} as any,
      onRendered: fn => {
        onRenderedList.push(fn);
      },
    };
    // render
    const renderFn = await serverEntry(ssrContext);
    const [runtimePageContent, err] = await catchError(() => {
      return renderToString(renderFn, ssrContext);
    });

    const error = ssrContext._meta.renderError ?? err;
    onRenderedList.forEach(fn => {
      fn(error);
    });
    cast(ssrContext).rendered(error);
    if (error) {
      if (error instanceof Error) throw error;
      return error;
    }

    ssrContext._meta.runtimePageContent = runtimePageContent;

    // @vitejs/plugin-vue injects code into a component's setup() that registers
    // itself on ctx.modules. After the render, ctx.modules would contain all the
    // components that have been instantiated during this render call.
    ssrContext._meta.endingHeadTags += this._renderModulesPreload_zova(cast(ssrContext).modules, {
      ssrContext,
    });
    ssrContext._meta.endingHeadTags += this._renderModulesPreload(cast(ssrContext).modules, {
      ssrContext,
    });

    const html = renderTemplate(ssrContext);

    // transferCache
    await this._renderTransferCache(options, route);

    // todo: ssg

    return html;
  }

  public async ensureReady(handlerNonce: number) {
    if (!this._handlerInstance) {
      if (!this._handlerPromise) {
        this._handlerPromise = this._prepareHandler(handlerNonce);
      }
      this._handlerInstance = await this._handlerPromise;
    }
    return this._handlerInstance;
  }

  private async _prepareHandler(handlerNonce: number) {
    // handler
    const fileHandler = path.join(this._siteAssetDir, 'handler.js');
    const fileUrl = `${pathToHref(fileHandler)}?${handlerNonce}`;
    const handlerInstance = await import(/* @vite-ignore */ fileUrl);
    // clientManifest
    const fileManifest = path.join(this._siteAssetDir, 'quasar.manifest.json');
    const contentManifest = await fse.readFile(fileManifest, { encoding: 'utf-8' });
    this._clientManifest = JSON.parse(contentManifest);
    // ok
    return handlerInstance;
  }

  private _renderModulesPreload(modules, opts) {
    let links = '';
    const seen = new Set();

    modules.forEach(id => {
      const files = this._clientManifest[id];
      if (files === void 0) return;

      files.forEach(file => {
        if (seen.has(file) === true) return;

        seen.add(file);
        const filename = basename(file);

        if (this._clientManifest[filename] !== void 0) {
          for (const depFile of this._clientManifest[filename]) {
            if (seen.has(depFile) === false) {
              links += this._renderPreloadTag(depFile, opts);
              seen.add(depFile);
            }
          }
        }

        links += this._renderPreloadTag(file, opts);
      });
    });

    return links;
  }

  private _renderModulesPreload_zova(modules2, opts) {
    let links = '';
    const seen = /* @__PURE__ */ new Set();
    modules2.forEach(id => {
      if (!id.startsWith('@@')) return;
      if (seen.has(id) === true) return;
      let cache = this._ssrModulesZovaCache[id];
      if (!cache) {
        for (const key in this._clientManifest) {
          const prefix = `${id.substring(2)}-`;
          const postfix = '.js';
          if (key.startsWith(prefix) && key.endsWith(postfix)) {
            cache = this._resolveUrlPath(`/assets/${key}`);
            break;
          }
        }
        this._ssrModulesZovaCache[id] = cache;
      }
      links += this._renderPreloadTag(cache, opts);
      seen.add(id);
    });
    return links;
  }

  private _resolveUrlPath(url: string) {
    let publicPath = this.sys.env.APP_PUBLIC_PATH;
    if (publicPath) publicPath = `/${publicPath}`;
    return publicPath + url;
  }

  private _renderPreloadTag(file: string, _opts) {
    file = this.sys.util.getAbsoluteUrlFromPagePath(file, false, true);
    if (jsRE.test(file) === true) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`;
    }

    if (cssRE.test(file) === true) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`;
    }

    if (woffRE.test(file) === true) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
    }

    if (woff2RE.test(file) === true) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
    }

    if (gifRE.test(file) === true) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`;
    }

    if (jpgRE.test(file) === true) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`;
    }

    if (pngRE.test(file) === true) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`;
    }

    return '';
  }

  private async _renderTransferCache(
    options: ISsrHandlerRenderOptionsInner,
    route: RouteLocationResolvedGeneric,
  ) {
    const { res } = options;
    const transferCache = route.meta.transferCache ?? this.$$scopeSsr.config.transferCache;
    if (transferCache === false) return;
    // expires
    const transferCacheExpires = transferCache.expires ?? 0;
    const expires =
      typeof transferCacheExpires === 'string'
        ? ms(transferCacheExpires) / 1000
        : transferCacheExpires;
    if (expires === 0) {
      res.appendHeader('cache-control', 'no-cache, no-store, must-revalidate');
    } else {
      res.appendHeader('cache-control', `public, max-age=${expires}`);
    }
  }
}

export function pathToHref(fileName: string): string {
  return pathToFileURL(fileName).href;
  // return Path.sep === '\\' ? pathToFileURL(fileName).href : fileName;
}
