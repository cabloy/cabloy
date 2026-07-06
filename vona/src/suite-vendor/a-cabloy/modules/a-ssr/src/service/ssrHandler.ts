import type { TypeEventResolvePathResult } from 'vona-module-a-static';

import fse from 'fs-extra';
import path from 'node:path';
import { BeanBase, pathToHref } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IDecoratorSsrSiteOptions, ISsrHandlerRenderOptionsInner } from '../types/ssrSite.ts';

@Service()
export class ServiceSsrHandler extends BeanBase {
  private _siteOptions: IDecoratorSsrSiteOptions;
  private _siteAssetDir: string;
  private _handlerPromise: Promise<any>;
  private _ssrHandler: any;
  private _handlerNonce: number;

  protected __init__(siteOptions: IDecoratorSsrSiteOptions, siteAssetDir: string) {
    this._siteOptions = siteOptions;
    this._siteAssetDir = siteAssetDir;
    this._handlerNonce = Date.now();
  }

  public async dispose() {
    if (this._ssrHandler) {
      this._ssrHandler.dispose();
      this._ssrHandler = undefined;
    }
  }

  async resolvePath(filename: string): Promise<TypeEventResolvePathResult> {
    const ssrHandler = await this.ensureReady();
    return await ssrHandler.resolvePath(filename);
  }

  public async render(options: ISsrHandlerRenderOptionsInner) {
    const ssrHandler = await this.ensureReady();
    return await ssrHandler.render(options);
  }

  public async ensureReady() {
    if (!this._ssrHandler) {
      if (!this._handlerPromise) {
        this._handlerPromise = this._prepareHandler();
      }
      this._ssrHandler = await this._handlerPromise;
    }
    return this._ssrHandler;
  }

  private async _prepareHandler() {
    // handler
    const fileHandler = path.join(this._siteAssetDir, 'handler.js');
    if (!fse.existsSync(fileHandler)) {
      throw new Error(this._createMissingBundleMessage());
    }
    // import
    const fileUrl = `${pathToHref(fileHandler)}?${this._handlerNonce}`;
    const handlerInstance = await import(fileUrl);
    // initialize
    const zovaEnvServer = this._siteOptions.envServer;
    const zovaSys = await handlerInstance.initialize(zovaEnvServer);
    // ssr handler
    const ssrHandler = await zovaSys.meta.$getSsrHandler(this._siteAssetDir);
    await ssrHandler.ensureReady(this._handlerNonce);
    // ok
    return ssrHandler;
  }

  private _createMissingBundleMessage() {
    const diagnostics = this._siteOptions.diagnostics;
    const siteName = diagnostics?.siteName ?? String(this._siteOptions.publicPath || 'unknown');
    const buildCommand = diagnostics?.buildCommand;
    const commandHint = buildCommand ? ` Run "${buildCommand}" at the repository root.` : '';
    return `The bundlePath of ssr site ${siteName} does not exist: ${this._siteAssetDir}. Missing SSR bundle.${commandHint}`;
  }
}
