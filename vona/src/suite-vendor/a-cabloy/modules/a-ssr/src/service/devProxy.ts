import type http from 'node:http';

import Server from 'http-proxy';
import web_outgoing from 'http-proxy/lib/http-proxy/passes/web-outgoing.js';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { SymbolStaticGetFullPathInner } from 'vona-module-a-static';

import type { IDecoratorSsrSiteOptions } from '../types/ssrSite.ts';

interface IDevProxyRecord {
  resolve: Function;
  reject: Function;
  options: Server.ServerOptions;
}

const SymbolDevProxyRecordId = Symbol('SymbolDevProxyRecordId');

@Service()
export class ServiceDevProxy extends BeanBase {
  private _siteOptions: IDecoratorSsrSiteOptions;
  private _devProxy: Server;
  private _devProxyCounter: number = 0;
  private _devProxyPromises: Record<number, IDevProxyRecord> = {};
  // private _devProxyNotRunning: boolean = false;

  protected __init__(siteOptions: IDecoratorSsrSiteOptions) {
    this._siteOptions = siteOptions;
    const devProxy = (this._devProxy = Server.createProxyServer());
    devProxy.on('proxyRes', ((
      proxyRes: http.ServerResponse<http.IncomingMessage>,
      req: http.IncomingMessage,
      res: http.ServerResponse<http.IncomingMessage>,
    ) => {
      const record = this._devProxyPromises[req[SymbolDevProxyRecordId]];
      if (!record) return;
      if (proxyRes.statusCode === 404) {
        delete this._devProxyPromises[req[SymbolDevProxyRecordId]];
        return record.resolve(undefined);
      }
      for (const key in web_outgoing) {
        if (web_outgoing[key](req, res, proxyRes, record.options)) {
          break;
        }
      }
      proxyRes.pipe(res);
    }) as any);
    devProxy.on('end', (req: http.IncomingMessage) => {
      const record = this._devProxyPromises[req[SymbolDevProxyRecordId]];
      if (!record) return;
      delete this._devProxyPromises[req[SymbolDevProxyRecordId]];
      record.resolve(true);
    });
    devProxy.on('error', (err: Error, req: http.IncomingMessage) => {
      const record = this._devProxyPromises[req[SymbolDevProxyRecordId]];
      if (!record) return;
      delete this._devProxyPromises[req[SymbolDevProxyRecordId]];
      if (err.code === ('ECONNREFUSED' as any)) {
        // this._devProxyNotRunning = true;
        return record.resolve(undefined);
      }
      record.reject(err);
    });
  }

  public async dispose() {
    if (this._devProxy) {
      this._devProxy.removeAllListeners();
      this._devProxy.close();
      this._devProxy = undefined as any;
    }
  }

  public async web(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
  ): Promise<true | undefined> {
    // need not check _devProxyNotRunning
    // if (this._devProxyNotRunning) return undefined;
    if (await this._routerLookup(req)) return undefined;
    return new Promise((resolve, reject) => {
      const options = {
        target: this._siteOptions.dev.host,
        changeOrigin: true,
        selfHandleResponse: true,
      };
      req[SymbolDevProxyRecordId] = ++this._devProxyCounter;
      this._devProxyPromises[req[SymbolDevProxyRecordId]] = { resolve, reject, options };
      this._devProxy.web(req, res, options);
    });
  }

  private async _routerLookup(req: http.IncomingMessage) {
    if (req.url === '/') return false;
    // static
    const staticFile = await this.ctx[SymbolStaticGetFullPathInner]?.();
    if (staticFile) return true;
    // route
    const route = this.app.router.find(this.ctx.req.method as any, this.ctx.url);
    return !!route;
    // should not check static & route
    // if (req.url?.startsWith(this.app.config.server.globalPrefix)) return true;
    // if (req.url?.startsWith('/swagger/json')) return true;
    // return false;
  }
}
