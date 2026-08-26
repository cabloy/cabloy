# Web Socket Usage Guide

This guide provides practical server-side authoring patterns for Web Socket features in Vona within the Cabloy monorepo.

Read this together with:

- [Web Socket Guide](/backend/websocket-guide)
- [Web Socket Protocol Guide](/backend/websocket-protocol-guide)
- [Web Socket Call Flow](/backend/websocket-call-flow)
- [Service Guide](/backend/service-guide)
- [Broadcast Guide](/backend/broadcast-guide)

Use the practical split:

- [Web Socket Guide](/backend/websocket-guide) for architecture
- this page for server-side authoring patterns
- [Web Socket Protocol Guide](/backend/websocket-protocol-guide) for the client-visible wire format
- [Web Socket Call Flow](/backend/websocket-call-flow) for source tracing

## Why this usage guide exists

The main Web Socket guide explains the architecture.

This page answers a more practical question:

- how should a normal backend module define a namespace, design events, and call `send(...)` or `broadcast(...)` in day-to-day code?

In practice, most application authors do not need to modify the built-in `a-socket` transport. They usually need to:

- define a namespace
- define namespace event types
- trigger point-to-point delivery or namespace-wide delivery

## Mental model before writing code

Use this split first:

- **socket namespace** is the normal API surface for application-level delivery
- **socket connection** is for connection lifecycle rules such as enter or exit behavior
- **socket packet** is for inbound message handling and packet transformation

A practical rule is:

- start with a namespace bean when your goal is server push or namespace-scoped signaling
- add a connection onion only when the behavior belongs to connection setup or teardown
- add a packet onion only when the behavior belongs to inbound packet handling

For most feature work, a namespace bean is the first and best fit.

## Recipe 1: create a socket namespace bean

Use the Vona CLI to create a namespace bean shell.

Example:

```bash
npm run vona :create:bean socketNamespace chat -- --module=training-student
```

The generated shape follows the `a-socket` boilerplate pattern.

Representative structure:

```typescript
import type { IDecoratorSocketNamespaceOptions } from 'vona-module-a-socket';
import { BeanSocketNamespaceBase, SocketNamespace } from 'vona-module-a-socket';

declare module 'vona-module-a-socket' {
  export interface ISocketNamespaceRecord {
    '/chat': never;
  }
}

export interface ISocketNamespaceOptionsChatEvents {
  messageCreated: {
    roomId: string;
    messageId: string;
    text: string;
  };
  typing: {
    roomId: string;
    userId: number;
  };
}

export interface ISocketNamespaceOptionsChat extends IDecoratorSocketNamespaceOptions<ISocketNamespaceOptionsChatEvents> {}

@SocketNamespace<ISocketNamespaceOptionsChat>({
  namespace: '/chat',
})
export class SocketNamespaceChat extends BeanSocketNamespaceBase<ISocketNamespaceOptionsChatEvents> {}
```

The key ideas are:

- extend `ISocketNamespaceRecord` so the namespace becomes part of the typed socket surface
- define one event interface for the namespace payloads
- declare the namespace path explicitly
- inherit `BeanSocketNamespaceBase` instead of reimplementing send and broadcast logic yourself

## Recipe 2: choose a stable namespace path

Namespace paths participate directly in runtime routing.

A practical rule is:

- if the connection URL is `/ws/chat`, the namespace should be `/chat`
- if the connection URL is `/ws/notifications`, the namespace should be `/notifications`
- the root path `/ws` maps to namespace `/`

That means namespace naming should be deliberate and stable.

Use a namespace when it represents a durable channel identity, such as:

- chat messages
- notifications
- presence
- build reload signals

Avoid treating namespace names as temporary one-off action names. Individual actions normally belong in namespace event names, not in the namespace path itself.

## Recipe 3: broadcast to everyone in a namespace

Once the namespace bean exists, ordinary backend code can trigger namespace-wide delivery through scope.

Representative pattern:

```typescript
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

@Bean()
export class BeanChat extends BeanBase {
  messageCreated(roomId: string, messageId: string, text: string) {
    this.scope.socketNamespace.chat.broadcast('messageCreated', {
      roomId,
      messageId,
      text,
    });
  }
}
```

What this means in practice:

- the current worker delivers immediately to local clients in `/chat`
- `a-socket` also emits the corresponding broadcast bean so other workers can fan out to their own local `/chat` clients

Use `broadcast(...)` when every connected client in one namespace should receive the event.

## Recipe 4: send to one known client id

`BeanSocketNamespaceBase` also exposes:

- `send(id, eventName, data, options)`

Representative pattern:

```typescript
@Bean()
export class BeanChat extends BeanBase {
  typingToOneClient(targetSocketId: string, roomId: string, userId: number) {
    this.scope.socketNamespace.chat.send(targetSocketId, 'typing', {
      roomId,
      userId,
    });
  }
}
```

Use `send(...)` when one specific connected client should receive the event.

A practical constraint is:

- your application must already know the target socket id

The socket transport assigns `ws.id` during connection setup. How your business logic remembers or maps that id is application-specific.

That is why `send(...)` is the right delivery primitive, but socket-id ownership is still part of your own feature design.

## Recipe 5: decide between `broadcast(...)` and `send(...)`

Use this split:

- use `broadcast(...)` when every client in the namespace should receive the same signal
- use `send(...)` when one specific client should receive the signal

Practical examples:

- new chat message in one shared room channel -> `broadcast(...)`
- private acknowledgement to one connected client -> `send(...)`
- HMR reload signal to all clients in `/ssrhmr` -> `broadcast(...)`
- one-user delivery after a server-side state transition -> `send(...)`

If you find yourself inventing many one-off namespaces just to avoid choosing between send and broadcast, that is usually a sign that the namespace boundary is too granular.

## Recipe 6: keep ordinary business logic outside the namespace bean

A useful default is:

- keep the namespace bean small and transport-focused
- place business orchestration in an ordinary bean or service
- trigger namespace delivery through `this.scope.socketNamespace...`

Representative shape:

```typescript
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceNotification extends BeanBase {
  async publishOrderCreated(orderId: number, userId: number) {
    // business logic first

    this.scope.socketNamespace.notifications.broadcast('orderCreated', {
      orderId,
      userId,
    });
  }
}
```

This keeps the transport surface reusable while leaving business rules in the ordinary service layer.

## Recipe 7: add a connection onion only for connection-time behavior

If the behavior belongs to connect or disconnect time, create a `socketConnection` bean.

Example:

```bash
npm run vona :create:bean socketConnection audit -- --module=training-student
```

Representative generated shape:

```typescript
import type { Next } from 'vona';
import type {
  IDecoratorSocketConnectionOptions,
  ISocketConnectionExecute,
} from 'vona-module-a-socket';
import type { WebSocket } from 'ws';
import { BeanBase } from 'vona';
import { SocketConnection } from 'vona-module-a-socket';

export interface ISocketConnectionOptionsAudit extends IDecoratorSocketConnectionOptions {}

@SocketConnection<ISocketConnectionOptionsAudit>()
export class SocketConnectionAudit extends BeanBase implements ISocketConnectionExecute {
  async enter(_ws: WebSocket, _options: ISocketConnectionOptionsAudit, next: Next): Promise<void> {
    return next();
  }

  async exit(_ws: WebSocket, _options: ISocketConnectionOptionsAudit, next: Next): Promise<void> {
    return next();
  }
}
```

Use this when you need behavior such as:

- connect-time auditing
- per-connection setup
- disconnect cleanup
- rules that must run before normal packet traffic begins

Do not use a connection onion merely to trigger business events that could have been ordinary namespace sends or broadcasts.

## Recipe 8: add a packet onion only for inbound packet handling

If the behavior belongs to inbound socket messages, create a `socketPacket` bean.

Example:

```bash
npm run vona :create:bean socketPacket chat -- --module=training-student
```

Representative generated shape:

```typescript
import type { Next } from 'vona';
import type { IDecoratorSocketPacketOptions, ISocketPacketExecute } from 'vona-module-a-socket';
import type { WebSocket } from 'ws';
import { BeanBase } from 'vona';
import { SocketPacket } from 'vona-module-a-socket';

export interface ISocketPacketOptionsChat extends IDecoratorSocketPacketOptions {}

@SocketPacket<ISocketPacketOptionsChat>()
export class SocketPacketChat extends BeanBase implements ISocketPacketExecute {
  async execute(
    _data: any,
    _ws: WebSocket,
    _options: ISocketPacketOptionsChat,
    next: Next,
  ): Promise<void> {
    return next();
  }
}
```

Use this when you need behavior such as:

- parsing a custom packet format
- recognizing application-specific event names
- validating or transforming inbound packet data before later handlers run

Do not use a packet onion when the real need is simply to push data from the server to connected clients.

## Recipe 9: reuse the `a-ssrhmr` pattern as a minimal reference

The built-in `a-ssrhmr` module is a compact example of the intended namespace usage pattern.

It does two things:

1. declares a namespace bean for `/ssrhmr`
2. calls `this.scope.socketNamespace.ssrHmr.broadcast('reload')` from ordinary backend code

That is the most important practical pattern to copy first:

- define namespace identity once
- define event names and payload shapes
- trigger delivery through scope from normal backend beans

## Common authoring mistakes to avoid

Avoid these mistakes:

- putting business orchestration into the namespace bean instead of a normal service or bean
- using a connection onion when the behavior is really a server push event
- using a packet onion when no inbound packet handling is needed
- inventing unstable namespace paths for one-off actions
- treating socket ids as globally meaningful business identifiers instead of transport identifiers

A useful rule is:

- namespace path identifies the channel
- event name identifies the action or signal
- payload identifies the data
- business services decide when delivery should happen

## Practical checklist before implementation

Before writing a Web Socket feature, ask:

1. what stable namespace should this feature use?
2. what event names and payload types belong in that namespace?
3. should the delivery go to one client or all clients in the namespace?
4. does the feature need only namespace delivery, or also custom connection or packet behavior?
5. where will the application remember any socket ids needed for targeted send?

If those answers are clear, the implementation usually stays small and aligned with the existing `a-socket` model.

## Related guides

If you need the broader context next, read:

- [Web Socket Guide](/backend/websocket-guide) for architecture
- [Web Socket Protocol Guide](/backend/websocket-protocol-guide) for the client-visible wire format
- [Web Socket Call Flow](/backend/websocket-call-flow) for source tracing and debugging
