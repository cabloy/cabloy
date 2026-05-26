// eslint-disable
/** bean: begin */
export * from '../bean/bean.socket.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-socket' {
  
        export interface BeanSocket {
          /** @internal */
          get scope(): ScopeModuleASocket;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanSocket } from '../bean/bean.socket.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'socket': BeanSocket;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/socket.ts';
export * from '../service/socketEvent.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-socket:socket': never;
'a-socket:socketEvent': never;
    }

  
}
declare module 'vona-module-a-socket' {
  
        export interface ServiceSocket {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface ServiceSocket {
            get $beanFullName(): 'a-socket.service.socket';
            get $onionName(): 'a-socket:socket';
            
          }

        export interface ServiceSocketEvent {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface ServiceSocketEvent {
            get $beanFullName(): 'a-socket.service.socketEvent';
            get $onionName(): 'a-socket:socketEvent';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceSocket } from '../service/socket.ts';
import type { ServiceSocketEvent } from '../service/socketEvent.ts';
export interface IModuleService {
  'socket': ServiceSocket;
'socketEvent': ServiceSocketEvent;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-socket.service.socket': ServiceSocket;
'a-socket.service.socketEvent': ServiceSocketEvent;
  }
}
/** service: end */
/** broadcast: begin */
export * from '../bean/broadcast.broadcast.ts';
export * from '../bean/broadcast.send.ts';

import { type IDecoratorBroadcastOptions } from 'vona-module-a-broadcast';
declare module 'vona-module-a-broadcast' {
  
    export interface IBroadcastRecord {
      'a-socket:broadcast': IDecoratorBroadcastOptions;
'a-socket:send': IDecoratorBroadcastOptions;
    }

  
}
declare module 'vona-module-a-socket' {
  
        export interface BroadcastBroadcast {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface BroadcastBroadcast {
            get $beanFullName(): 'a-socket.broadcast.broadcast';
            get $onionName(): 'a-socket:broadcast';
            get $onionOptions(): IDecoratorBroadcastOptions;
          }

        export interface BroadcastSend {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface BroadcastSend {
            get $beanFullName(): 'a-socket.broadcast.send';
            get $onionName(): 'a-socket:send';
            get $onionOptions(): IDecoratorBroadcastOptions;
          } 
}
/** broadcast: end */
/** broadcast: begin */
import type { BroadcastBroadcast } from '../bean/broadcast.broadcast.ts';
import type { BroadcastSend } from '../bean/broadcast.send.ts';
export interface IModuleBroadcast {
  'broadcast': BroadcastBroadcast;
'send': BroadcastSend;
}
/** broadcast: end */
/** hmr: begin */
export * from '../bean/hmr.socketConnection.ts';
export * from '../bean/hmr.socketPacket.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-socket:socketConnection': never;
'a-socket:socketPacket': never;
    }

  
}
declare module 'vona-module-a-socket' {
  
        export interface HmrSocketConnection {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface HmrSocketConnection {
            get $beanFullName(): 'a-socket.hmr.socketConnection';
            get $onionName(): 'a-socket:socketConnection';
            
          }

        export interface HmrSocketPacket {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface HmrSocketPacket {
            get $beanFullName(): 'a-socket.hmr.socketPacket';
            get $onionName(): 'a-socket:socketPacket';
            
          } 
}
/** hmr: end */
/** socketConnection: begin */
export * from '../bean/socketConnection.alive.ts';
export * from '../bean/socketConnection.app.ts';
export * from '../bean/socketConnection.cors.ts';
export * from '../bean/socketConnection.event.ts';
export * from '../bean/socketConnection.instance.ts';
export * from '../bean/socketConnection.passport.ts';
export * from '../bean/socketConnection.ready.ts';
import type { ISocketConnectionOptionsAlive } from '../bean/socketConnection.alive.ts';
import type { ISocketConnectionOptionsApp } from '../bean/socketConnection.app.ts';
import type { ISocketConnectionOptionsCors } from '../bean/socketConnection.cors.ts';
import type { ISocketConnectionOptionsEvent } from '../bean/socketConnection.event.ts';
import type { ISocketConnectionOptionsInstance } from '../bean/socketConnection.instance.ts';
import type { ISocketConnectionOptionsPassport } from '../bean/socketConnection.passport.ts';
import type { ISocketConnectionOptionsReady } from '../bean/socketConnection.ready.ts';
import 'vona-module-a-socket';
declare module 'vona-module-a-socket' {
  
    export interface ISocketConnectionRecord {
      'a-socket:alive': ISocketConnectionOptionsAlive;
'a-socket:app': ISocketConnectionOptionsApp;
'a-socket:cors': ISocketConnectionOptionsCors;
'a-socket:event': ISocketConnectionOptionsEvent;
'a-socket:instance': ISocketConnectionOptionsInstance;
'a-socket:passport': ISocketConnectionOptionsPassport;
'a-socket:ready': ISocketConnectionOptionsReady;
    }

  
}
declare module 'vona-module-a-socket' {
  
        export interface SocketConnectionAlive {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface SocketConnectionAlive {
            get $beanFullName(): 'a-socket.socketConnection.alive';
            get $onionName(): 'a-socket:alive';
            get $onionOptions(): ISocketConnectionOptionsAlive;
          }

        export interface SocketConnectionApp {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface SocketConnectionApp {
            get $beanFullName(): 'a-socket.socketConnection.app';
            get $onionName(): 'a-socket:app';
            get $onionOptions(): ISocketConnectionOptionsApp;
          }

        export interface SocketConnectionCors {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface SocketConnectionCors {
            get $beanFullName(): 'a-socket.socketConnection.cors';
            get $onionName(): 'a-socket:cors';
            get $onionOptions(): ISocketConnectionOptionsCors;
          }

        export interface SocketConnectionEvent {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface SocketConnectionEvent {
            get $beanFullName(): 'a-socket.socketConnection.event';
            get $onionName(): 'a-socket:event';
            get $onionOptions(): ISocketConnectionOptionsEvent;
          }

        export interface SocketConnectionInstance {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface SocketConnectionInstance {
            get $beanFullName(): 'a-socket.socketConnection.instance';
            get $onionName(): 'a-socket:instance';
            get $onionOptions(): ISocketConnectionOptionsInstance;
          }

        export interface SocketConnectionPassport {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface SocketConnectionPassport {
            get $beanFullName(): 'a-socket.socketConnection.passport';
            get $onionName(): 'a-socket:passport';
            get $onionOptions(): ISocketConnectionOptionsPassport;
          }

        export interface SocketConnectionReady {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface SocketConnectionReady {
            get $beanFullName(): 'a-socket.socketConnection.ready';
            get $onionName(): 'a-socket:ready';
            get $onionOptions(): ISocketConnectionOptionsReady;
          } 
}
/** socketConnection: end */
/** socketPacket: begin */
export * from '../bean/socketPacket.event.ts';
export * from '../bean/socketPacket.performAction.ts';
import type { ISocketPacketOptionsEvent } from '../bean/socketPacket.event.ts';
import type { ISocketPacketOptionsPerformAction } from '../bean/socketPacket.performAction.ts';
import 'vona-module-a-socket';
declare module 'vona-module-a-socket' {
  
    export interface ISocketPacketRecord {
      'a-socket:event': ISocketPacketOptionsEvent;
'a-socket:performAction': ISocketPacketOptionsPerformAction;
    }

  
}
declare module 'vona-module-a-socket' {
  
        export interface SocketPacketEvent {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface SocketPacketEvent {
            get $beanFullName(): 'a-socket.socketPacket.event';
            get $onionName(): 'a-socket:event';
            get $onionOptions(): ISocketPacketOptionsEvent;
          }

        export interface SocketPacketPerformAction {
          /** @internal */
          get scope(): ScopeModuleASocket;
        }

          export interface SocketPacketPerformAction {
            get $beanFullName(): 'a-socket.socketPacket.performAction';
            get $onionName(): 'a-socket:performAction';
            get $onionOptions(): ISocketPacketOptionsPerformAction;
          } 
}
/** socketPacket: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleASocket extends BeanScopeBase {}

export interface ScopeModuleASocket {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
broadcast: IModuleBroadcast;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-socket': ScopeModuleASocket;
  }

  export interface IBeanScopeContainer {
    socket: ScopeModuleASocket;
  }
  
  export interface IBeanScopeConfig {
    'a-socket': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
