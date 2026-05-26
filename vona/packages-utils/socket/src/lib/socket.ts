import type {
  ISocketEventPerformActionItem,
  ISocketEventPerformActionOptions,
  ISocketEventPerformActionOptionsInner,
  ISocketEventRecord,
  ISocketEventRecordSystem,
  IWebSocketOptions,
  TypeSocketEventPerformActionMethod,
  TypeSocketPacketEvent,
} from '../types/socket.ts';

import { socketEventRecord, socketEventRecordReverse } from '../types/socket.ts';

const SymbolPerformActionId = Symbol('SymbolPerformActionId');
const SymbolPerformActionRecord = Symbol('SymbolPerformActionRecord');

const __cabloyEventPrefix = '_:';
const __closeReasonNormal = 'Manual close';

export class WebSocketClient {
  private [SymbolPerformActionRecord]: Record<string, ISocketEventPerformActionItem | undefined> =
    {};

  private _ws?: WebSocket;
  private _timeoutRetry: any;
  private _reconnectDelay: number;
  private _reconnectDelayMax: number;
  private _reconnectAttemptsMax: number;
  private _reconnectAttempts: number = 0;

  public onReady?: () => void;
  public onEvent?: <K extends keyof ISocketEventRecord>(
    eventName: K,
    data: ISocketEventRecord[K],
    event: MessageEvent,
  ) => void;

  public onFallback?: (event: MessageEvent) => void;

  public onOpen?: (event: Event, reconnectAttempts: number) => void;
  public onError?: (event: Event) => void;
  public onClose?: (event: CloseEvent, reconnect: boolean) => void;

  constructor(options?: IWebSocketOptions) {
    this._reconnectDelay = options?.reconnectDelay || 1000;
    this._reconnectDelayMax = options?.reconnectDelayMax || 5000;
    this._reconnectAttemptsMax = options?.reconnectAttemptsMax || Infinity;
  }

  public get ws() {
    return this._ws;
  }

  public connect(url: string | URL, protocols?: string | string[]) {
    this.disconnect();
    this._connect(url, protocols);
  }

  private _connect(url: string | URL, protocols?: string | string[]) {
    const ws = (this._ws = new WebSocket(url, protocols));
    const onMessage = (event: MessageEvent) => {
      this._parseEvent(event);
    };
    const onOpen = (event: Event) => {
      this.onOpen?.(event, this._reconnectAttempts);
      this._reconnectAttempts = 0;
    };
    const onError = (event: Event) => {
      this.onError?.(event);
    };
    const onClose = (event: CloseEvent) => {
      this._closeEvents();
      this._closeTimeoutRetry();
      ws.removeEventListener('message', onMessage);
      ws.removeEventListener('open', onOpen);
      ws.removeEventListener('error', onError);
      ws.removeEventListener('close', onClose);
      const reconnect =
        event.reason !== __closeReasonNormal &&
        this._reconnectAttempts < this._reconnectAttemptsMax;
      this.onClose?.(event, reconnect);
      if (reconnect) {
        this._startTimeoutRetry(url, protocols);
      }
    };
    ws.addEventListener('message', onMessage);
    ws.addEventListener('open', onOpen);
    ws.addEventListener('error', onError);
    ws.addEventListener('close', onClose);
  }

  private _closeTimeoutRetry() {
    if (this._timeoutRetry) {
      clearTimeout(this._timeoutRetry);
      this._timeoutRetry = undefined;
    }
  }

  private _startTimeoutRetry(url: string | URL, protocols?: string | string[]) {
    this._closeTimeoutRetry();
    this._reconnectAttempts++;
    const delay = this._reconnectDelay * Math.min(this._reconnectAttempts, this._reconnectDelayMax);
    this._timeoutRetry = setTimeout(() => {
      this.connect(url, protocols);
    }, delay);
  }

  public disconnect() {
    if (this._ws) {
      this._ws.close(1000, __closeReasonNormal);
      this._ws = undefined;
    }
  }

  public sendEvent(eventName: keyof ISocketEventRecord, data: any) {
    if (!this._ws) throw new Error('ws closed');
    const eventNameInner = socketEventRecord[eventName] ?? eventName;
    this._ws.send(__cabloyEventPrefix + JSON.stringify([eventNameInner, data]));
  }

  private _parseEvent(event: MessageEvent) {
    const data = event.data;
    let packet: TypeSocketPacketEvent;
    if (typeof data === 'string' && data.startsWith(__cabloyEventPrefix)) {
      const packetInner = JSON.parse(data.substring(__cabloyEventPrefix.length));
      const eventName = socketEventRecordReverse[packetInner[0]] ?? packetInner[0];
      packet = [eventName, packetInner[1]];
    } else {
      packet = [undefined, data];
    }
    const eventName: keyof ISocketEventRecord | undefined = packet[0];
    const result = packet[1] as any;
    if (eventName === ('sysReady' satisfies keyof ISocketEventRecordSystem)) {
      this.onReady?.();
    } else if (eventName === ('sysPerformActionBack' satisfies keyof ISocketEventRecordSystem)) {
      const id = result.i;
      const performActionBack = this[SymbolPerformActionRecord][id];
      delete this[SymbolPerformActionRecord][id];
      if (performActionBack) {
        if (result.c === 0) {
          performActionBack.resolve(result.d);
        } else {
          const err = new Error();
          (err as any).code = result.c;
          err.message = result.m;
          performActionBack.reject(err);
        }
      }
    } else if (eventName !== undefined) {
      this.onEvent?.(eventName, result as never, event);
    } else {
      this.onFallback?.(event);
    }
    return packet;
  }

  public performAction(
    method: TypeSocketEventPerformActionMethod,
    path: string,
    options?: ISocketEventPerformActionOptions,
  ): Promise<any> {
    const id = (this[SymbolPerformActionId] ?? 0) + 1;
    this[SymbolPerformActionId] = id;
    return new Promise((resolve, reject) => {
      this[SymbolPerformActionRecord][id] = { resolve, reject };
      const data: ISocketEventPerformActionOptionsInner = {
        i: id,
        m: method,
        p: path,
        q: options?.query,
        b: options?.body,
        h: options?.headers,
      };
      this.sendEvent(
        'sysPerformAction' satisfies keyof ISocketEventRecordSystem as never,
        data as never,
      );
    });
  }

  private _closeEvents() {
    const callbacks = this[SymbolPerformActionRecord];
    this[SymbolPerformActionRecord] = {};
    for (const id in callbacks) {
      const callback = callbacks[id]!;
      const err = new Error();
      (err as any).code = 400;
      callback.reject(err);
    }
  }
}
