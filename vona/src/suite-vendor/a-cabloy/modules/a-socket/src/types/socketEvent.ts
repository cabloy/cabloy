export interface ISocketEventRecordSystem {
  sysReady: never;
  sysPerformAction: never;
  sysPerformActionBack: never;
}

export interface ISocketEventRecord {}

export const socketEventRecord = {
  sysReady: '_a',
  sysPerformAction: '_b',
  sysPerformActionBack: '_c',
};
export const socketEventRecordReverse = {
  _a: 'sysReady',
  _b: 'sysPerformAction',
  _c: 'sysPerformActionBack',
};

export type TypeSocketEventPerformActionMethod = 'get' | 'post' | 'delete' | 'put' | 'patch';
export interface ISocketEventPerformActionOptions {
  method: TypeSocketEventPerformActionMethod;
  path: string;
  body?: any;
  headers?: object;
}
export interface ISocketEventPerformActionOptionsInner {
  i: number;
  m: TypeSocketEventPerformActionMethod;
  q?: object;
  p: string;
  b?: any;
  h?: object;
}

export type TypeSocketPacketEvent<K extends keyof ISocketEventRecord = never> = [
  K | undefined,
  ISocketEventRecord[K] | any,
];

export interface ISendEventOptions {
  mask?: boolean | undefined;
  binary?: boolean | undefined;
  compress?: boolean | undefined;
  fin?: boolean | undefined;
}

declare module 'ws' {
  export interface WebSocket {
    sendEvent<K extends keyof ISocketEventRecord>(
      eventName: K | PropertyKey,
      data?: ISocketEventRecord[K] | any,
      options?: ISendEventOptions,
      cb?: (err?: Error) => void,
    ): void;
    sendEvent<K extends keyof ISocketEventRecord>(
      eventName: K | PropertyKey,
      data?: ISocketEventRecord[K] | any,
      cb?: (err?: Error) => void,
    ): void;
  }
}
