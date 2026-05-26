import type { Next, OmitNever } from 'vona';
import type {
  IOnionOptionsDeps,
  ServiceOnion,
  TypeOnionOptionsBaseSimple,
} from 'vona-module-a-onion';
import type { WebSocket } from 'ws';

import type { ISocketNamespaceRecord } from './socketNamespace.ts';

export interface ISocketConnectionRecord {}

export interface ISocketConnectionExecute {
  enter: (ws: WebSocket, options: IDecoratorSocketConnectionOptions, next: Next) => Promise<void>;
  exit: (ws: WebSocket, options: IDecoratorSocketConnectionOptions, next: Next) => Promise<void>;
}

export interface IDecoratorSocketConnectionOptions
  extends
    TypeOnionOptionsBaseSimple<keyof ISocketNamespaceRecord>,
    IOnionOptionsDeps<keyof ISocketConnectionRecord> {}

export interface ISocketConnectionComposeData {
  method: 'enter' | 'exit';
  ws: WebSocket;
}

export interface ISocketPacketComposeData {
  data: any;
  ws: WebSocket;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    socketConnection: ServiceOnion<ISocketConnectionRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    socketConnection: OmitNever<ISocketConnectionRecord>;
  }

  export interface IBeanSceneRecord {
    socketConnection: never;
  }
}
