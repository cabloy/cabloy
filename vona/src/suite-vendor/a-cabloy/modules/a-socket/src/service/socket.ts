import type { IncomingMessage } from 'node:http';
import type { IInstanceRecord, ILocaleRecord, Next } from 'vona';
import type { IOnionSlice } from 'vona-module-a-onion';

import { compose } from '@cabloy/compose';
import { AsyncResource } from 'node:async_hooks';
import { URL } from 'node:url';
import { BeanBase, uuidv4 } from 'vona';
import { Service } from 'vona-module-a-bean';
import { WebSocket, WebSocketServer } from 'ws';

import type {
  ISocketConnectionComposeData,
  ISocketConnectionExecute,
  ISocketConnectionRecord,
  ISocketPacketComposeData,
} from '../types/socketConnection.ts';
import type { ISocketEventRecordSystem } from '../types/socketEvent.ts';
import type { ISocketNamespaceRecord } from '../types/socketNamespace.ts';
import type { ISocketPacketExecute, ISocketPacketRecord } from '../types/socketPacket.ts';

import { getCacheSocketConnections, getCacheSocketPackets } from '../lib/const.ts';

@Service()
export class ServiceSocket extends BeanBase {
  async appReady() {
    // maybe running in play
    if (!this.app.server) return;
    // wss
    this.app.wss = new WebSocketServer({ server: this.app.server });
    this.app.wss.on('connection', (ws, req) => {
      this._onConnection(ws, req);
    });
  }

  async appClose() {
    if (this.app.wss) {
      this.app.wss.close();
    }
    this.bean.socket.close();
  }

  private async _onConnection(ws: WebSocket, req: IncomingMessage) {
    if (this.app.meta.appClose) {
      // terminate
      ws.terminate();
      return;
    }
    const url = URL.parse(req.url ?? '', `https://${req.headers.host}`); // req.headers.host 'http://localhost'
    const instanceName = (url?.searchParams.get(this.scope.config.queryKey.instanceName) ||
      undefined) as keyof IInstanceRecord | undefined;
    const locale = (url?.searchParams.get(this.scope.config.queryKey.locale) || undefined) as
      | keyof ILocaleRecord
      | undefined;
    const tz = (url?.searchParams.get(this.scope.config.queryKey.tz) || undefined) as
      | string
      | undefined;
    // enter
    return await this.app.bean.executor.newCtx(
      async () => {
        const ctx = this.app.ctx;
        // ws
        Object.defineProperty(ctx, 'ws', {
          get() {
            return ws;
          },
        });
        // enter
        try {
          // namespace
          ws.namespace = this.getNamespace();
          // id
          ws.id = uuidv4();
          // add
          this.bean.socket.addClient(ws);
          // compose
          await this._getComposeSocketConnections(ws.namespace)({ method: 'enter', ws });
        } catch (err: any) {
          this.app.handleError(err);
          // terminate
          ws.terminate();
          return;
        }
        // promise
        return new Promise(resolve => {
          // exit
          ws.onclose = AsyncResource.bind(async () => {
            try {
              // compose
              await this._getComposeSocketConnections(ws.namespace)({ method: 'exit', ws });
            } catch (err: any) {
              this.app.handleError(err);
            } finally {
              // remove
              this.bean.socket.removeClient(ws);
              resolve(undefined);
            }
          });
          // message
          ws.onmessage = AsyncResource.bind(async event => {
            try {
              await this._getComposeSocketPackets(ws.namespace)({ data: event.data, ws });
            } catch (err: any) {
              this.app.handleError(err);
            }
          });
          // error
          ws.onerror = AsyncResource.bind(event => {
            this.$logger.error(event.error);
          });
          // onReady
          ws.sendEvent('sysReady' satisfies keyof ISocketEventRecordSystem as never);
        });
      },
      { dbInfo: { level: 0 }, innerAccess: false, req, instanceName, locale, tz },
    ); // not set instance: true
  }

  public getNamespace(): keyof ISocketNamespaceRecord {
    const globalPrefix = this.scope.config.globalPrefix;
    let path = this.ctx.path;
    if (path.startsWith(globalPrefix)) {
      path = path.substring(globalPrefix.length);
    }
    if (!path) path = '/';
    return path as keyof ISocketNamespaceRecord;
  }

  private _getComposeSocketConnections(namespace: keyof ISocketNamespaceRecord) {
    const cacheSocketConnections = getCacheSocketConnections(this.app);
    if (!cacheSocketConnections[namespace]) {
      const connections = this.bean.onion.socketConnection.getOnionsEnabledWrapped(item => {
        return this._wrapOnionConnection(item);
      });
      cacheSocketConnections[namespace] = compose(connections);
    }
    return cacheSocketConnections[namespace];
  }

  private _getComposeSocketPackets(namespace: keyof ISocketNamespaceRecord) {
    const cacheSocketPackets = getCacheSocketPackets(this.app);
    if (!cacheSocketPackets[namespace]) {
      const packets = this.bean.onion.socketPacket.getOnionsEnabledWrapped(item => {
        return this._wrapOnionPacket(item);
      });
      cacheSocketPackets[namespace] = compose(packets);
    }
    return cacheSocketPackets[namespace];
  }

  private _wrapOnionConnection<T extends keyof ISocketConnectionRecord>(
    item: IOnionSlice<ISocketConnectionRecord, T>,
  ) {
    const fn = (data: ISocketConnectionComposeData, next: Next) => {
      const options = item.beanOptions.options!;
      // execute
      const beanFullName = item.beanOptions.beanFullName;
      const beanInstance = this.app.bean._getBean<ISocketConnectionExecute>(beanFullName as any);
      if (!beanInstance) {
        throw new Error(`socketConnection bean not found: ${beanFullName}`);
      }
      return beanInstance[data.method](data.ws, options, next);
    };
    fn._name = item.name;
    return fn;
  }

  private _wrapOnionPacket<T extends keyof ISocketPacketRecord>(
    item: IOnionSlice<ISocketPacketRecord, T>,
  ) {
    const fn = (data: ISocketPacketComposeData, next: Next) => {
      const options = item.beanOptions.options!;
      // execute
      const beanFullName = item.beanOptions.beanFullName;
      const beanInstance = this.app.bean._getBean<ISocketPacketExecute>(beanFullName as any);
      if (!beanInstance) {
        throw new Error(`socketPacket bean not found: ${beanFullName}`);
      }
      return beanInstance.execute(data.data, data.ws, options, _patchPacketNext(data, next));
    };
    fn._name = item.name;
    return fn;
  }
}

function _patchPacketNext(data: ISocketPacketComposeData, next) {
  return (...args) => {
    const context = args.length === 0 ? data.data : args[0];
    return next({ data: context, ws: data.ws });
  };
}
