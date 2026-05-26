import type { IDecoratorSocketNamespaceOptions } from 'vona-module-a-socket';

import { BeanSocketNamespaceBase, SocketNamespace } from 'vona-module-a-socket';

declare module 'vona-module-a-socket' {
  export interface ISocketNamespaceRecord {
    '/ssrhmr': never;
  }
}

export interface ISocketNamespaceOptionsSsrHmrEvents {
  reload: never;
}

export interface ISocketNamespaceOptionsSsrHmr extends IDecoratorSocketNamespaceOptions<ISocketNamespaceOptionsSsrHmrEvents> {}

@SocketNamespace<ISocketNamespaceOptionsSsrHmr>({
  namespace: '/ssrhmr',
})
export class SocketNamespaceSsrHmr extends BeanSocketNamespaceBase<ISocketNamespaceOptionsSsrHmrEvents> {}
