import type { WebSocket, WebSocketServer } from 'ws';

import type { ISocketNamespaceRecord } from './socketNamespace.ts';

declare module 'vona' {
  export interface VonaApplication {
    wss: WebSocketServer;
  }

  export interface VonaContext {
    get ws(): WebSocket;
  }
}

declare module 'ws' {
  export interface WebSocket {
    namespace: keyof ISocketNamespaceRecord;
    id: string;
    isAlive: boolean;
  }
}
