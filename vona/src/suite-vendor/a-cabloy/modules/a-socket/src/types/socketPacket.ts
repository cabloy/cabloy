import type { Next, OmitNever } from 'vona';
import type {
  IOnionOptionsDeps,
  ServiceOnion,
  TypeOnionOptionsBaseSimple,
} from 'vona-module-a-onion';
import type { WebSocket } from 'ws';

import type { ISocketNamespaceRecord } from './socketNamespace.ts';

export interface ISocketPacketRecord {}

export interface ISocketPacketExecute {
  execute: (
    data: any,
    ws: WebSocket,
    options: IDecoratorSocketPacketOptions,
    next: Next,
  ) => Promise<void>;
}

export interface IDecoratorSocketPacketOptions
  extends
    TypeOnionOptionsBaseSimple<keyof ISocketNamespaceRecord>,
    IOnionOptionsDeps<keyof ISocketPacketRecord> {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    socketPacket: ServiceOnion<ISocketPacketRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    socketPacket: OmitNever<ISocketPacketRecord>;
  }

  export interface IBeanSceneRecord {
    socketPacket: never;
  }
}
