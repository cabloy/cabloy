import type { WebSocket } from 'ws';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { ISocketNamespaceRecord } from '../types/socketNamespace.ts';

@Bean()
export class BeanSocket extends BeanBase {
  private _clients: Record<string, WebSocket | undefined> = {};
  private _clientsNamespace: Record<keyof ISocketNamespaceRecord, string[] | undefined> = {} as any;

  protected async __dispose__() {
    this.close();
  }

  public close() {
    const clients = this._clients;
    this._clients = {};
    for (const id in clients) {
      clients[id]?.terminate();
    }
  }

  public get clients() {
    return this._clients;
  }

  public get clientsNamespace() {
    return this._clientsNamespace;
  }

  getClient(id: string) {
    return this._clients[id];
  }

  addClient(ws: WebSocket) {
    const id = ws.id;
    const namespace = ws.namespace;
    this._clients[id] = ws;
    if (!this._clientsNamespace[namespace]) this._clientsNamespace[namespace] = [];
    this._clientsNamespace[namespace].push(id);
  }

  removeClient(ws: WebSocket): void;
  removeClient(id: string): void;
  removeClient(ws: WebSocket | string): void {
    const id = typeof ws === 'string' ? ws : ws.id;
    const ws2 = this.getClient(id);
    if (!ws2) return;
    const namespace = ws2.namespace;
    delete this._clients[id];
    if (this._clientsNamespace[namespace]) {
      const index = this._clientsNamespace[namespace].indexOf(id);
      if (index !== -1) {
        this._clientsNamespace[namespace].splice(index, 1);
      }
    }
  }
}
