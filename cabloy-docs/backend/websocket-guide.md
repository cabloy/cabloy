# Web Socket Guide

This guide explains how Web Socket support works in Vona within the Cabloy monorepo.

Read this together with:

- [Web Socket Usage Guide](/backend/websocket-usage-guide)
- [Web Socket Protocol Guide](/backend/websocket-protocol-guide)
- [Web Socket Call Flow](/backend/websocket-call-flow)

Use the practical split:

- this page for the architecture overview
- [Web Socket Usage Guide](/backend/websocket-usage-guide) for server-side authoring patterns
- [Web Socket Protocol Guide](/backend/websocket-protocol-guide) for the client-visible wire format
- [Web Socket Call Flow](/backend/websocket-call-flow) for source tracing and debugging

## Why Web Socket support matters

Vona provides a framework-native Web Socket runtime so backend modules can keep long-lived connections, push server-side events, and route request-like actions over a persistent channel.

That matters because some backend workflows are not well expressed as one HTTP request followed by one HTTP response. They need:

- server-initiated delivery
- namespace-scoped signaling
- connection-aware authentication and lifecycle control
- extension hooks that other modules can reuse without replacing the transport layer

## The `a-socket` module role

The built-in Web Socket runtime lives in `a-socket`.

At the module level, `a-socket` contributes three onion families:

- `socketNamespace`
- `socketConnection`
- `socketPacket`

A practical split is:

- use **socket namespace** beans to define namespace-scoped send and broadcast APIs
- use **socket connection** onions to control connection-time lifecycle behavior
- use **socket packet** onions to process inbound Web Socket messages

The module also enables the monkey lifecycle capability so Web Socket startup and shutdown can attach to the backend runtime automatically.

## Runtime entry and lifecycle

The runtime entry is straightforward:

- `src/monkey.ts` forwards `appReady()` and `appClose()` to `service.socket`
- `src/service/socket.ts` creates the `WebSocketServer` when the app server is ready
- on shutdown, the Web Socket server is closed and tracked clients are terminated

Representative shape:

```typescript
export class Monkey extends BeanSimple implements IMonkeyAppReady, IMonkeyAppClose {
  async appReady() {
    await this.app.scope(__ThisModule__).service.socket.appReady();
  }

  async appClose() {
    await this.app.scope(__ThisModule__).service.socket.appClose();
  }
}
```

This keeps the Web Socket transport aligned with ordinary backend startup instead of requiring a separate manual bootstrap path.

## Connection entry flow

The main connection flow is implemented in `src/service/socket.ts`.

A practical reading order is:

1. create `WebSocketServer` from `app.server`
2. accept a `connection`
3. parse request URL and query values
4. create a request-scoped backend context
5. assign Web Socket metadata such as `id` and `namespace`
6. register the client in the socket registry
7. execute the `socketConnection` onion chain with `enter`
8. install `close`, `message`, and `error` handlers
9. send the `sysReady` system event

The connection context carries useful protocol values from query parameters, including:

- passport code
- instance name
- locale
- timezone

Those keys come from the module config.

Representative config shape:

```typescript
return {
  eventPrefix: '_:',
  globalPrefix: '/ws',
  queryKey: {
    passportCode: $protocolKey('x-vona-passport-code'),
    instanceName: $protocolKey('x-vona-instance-name'),
    locale: $protocolKey('x-vona-locale'),
    tz: $protocolKey('x-vona-tz'),
  },
  timeout: {
    ping: 20000,
  },
};
```

## Namespace routing

`a-socket` derives the logical namespace from the request path.

The default global prefix is:

- `/ws`

A useful mental model is:

- `/ws` maps to the root namespace `/`
- `/ws/ssrhmr` maps to the namespace `/ssrhmr`

This happens through `ServiceSocket.getNamespace()`, which strips the global prefix from `ctx.path` and falls back to `/` when no additional path segment remains.

That means the URL path is not only a transport detail. It becomes the namespace identity used by namespace beans and namespace-scoped broadcasts.

## Client registry and connection tracking

Connected clients are tracked by `src/bean/bean.socket.ts`.

The registry keeps two coordinated views:

- client id -> `WebSocket`
- namespace -> array of client ids

This supports:

- direct send by client id
- namespace broadcast
- cleanup on disconnect
- full termination on app shutdown or bean disposal

That registry is the bridge between transport-level sockets and higher-level namespace delivery.

## Built-in connection onion chain

The connection pipeline is built from `socketConnection` onions. The built-in chain executes in this order:

1. `alive`
2. `app`
3. `instance`
4. `cors`
5. `event`
6. `passport`
7. `ready`

Each stage has a focused responsibility.

### `alive`

The `alive` stage sets up heartbeat tracking.

It:

- marks each new socket as alive
- listens for `pong`
- runs a periodic interval
- terminates stale sockets that stop responding

The interval uses the module `timeout.ping` config value.

### `app`

The `app` stage checks runtime readiness.

For ordinary external access, it prevents new connections when:

- the app is already closing, or
- the instance service reports that the app is not ready yet

This keeps Web Socket traffic aligned with the same backend readiness expectations as other runtime entry paths.

### `instance`

The `instance` stage initializes the effective instance before the connection proceeds.

This is important in multi-instance deployments because Web Socket work should resolve against the same backend instance model as the rest of the framework.

Read this together with [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution).

### `cors`

The `cors` stage validates the request origin.

If origin checking fails, the socket is terminated immediately.

That means Web Socket origin validation is part of the built-in connection chain rather than a separate ad hoc check.

### `event`

The `event` stage adds the transport send helper:

- `ws.sendEvent(...)`

This method:

- maps system event names to short wire codes when available
- prefixes event payloads with `'_:'`
- serializes the packet as JSON

Representative pattern:

```typescript
ws.send(`${this.scope.config.eventPrefix}${JSON.stringify([eventNameInner, data])}`);
```

This is the core server-to-client event encoding mechanism.

### `passport`

The `passport` stage handles authentication.

A practical rule is:

- if a current passport already exists, use it
- otherwise read the access token from the configured passport-code query key
- if no authenticated passport is established, sign in anonymously

This gives Web Socket connections the same backend identity model as other Vona runtime flows, while still allowing anonymous connections when that is the intended capability.

### `ready`

The `ready` stage is the terminal built-in stage in the default chain.

It does not add extra behavior by itself, but it completes the ordered dependency chain and marks the point after which the connection is considered ready for normal packet processing.

## System ready signal

After the connection chain finishes successfully, `a-socket` sends the system event:

- `sysReady`

This tells the client that:

- the connection was accepted
- the server-side connection pipeline completed
- the socket can begin ordinary packet traffic

## Packet processing flow

Inbound Web Socket messages move through the `socketPacket` onion chain.

The built-in packet order is:

1. `event`
2. `performAction`

### `event`

The `event` packet stage normalizes raw inbound data.

If a string payload starts with the configured event prefix `'_:'`, the stage:

- removes the prefix
- parses the JSON payload
- reverse-maps short wire codes such as `_a`, `_b`, and `_c`
- returns a structured packet `[eventName, data]`

If the payload is not an event-formatted string, the stage forwards:

- `[undefined, data]`

That makes later packet handlers operate on a normalized packet shape instead of raw transport data.

### `performAction`

The `performAction` stage implements the built-in request-like action channel.

It handles the system event:

- `sysPerformAction`

The payload contains compact request fields such as:

- request id
- method
- path
- query
- body
- headers

The stage forwards those values to:

- `this.$scope.executor.service.executor.performActionInner(...)`

If execution succeeds, the server sends:

- `sysPerformActionBack` with success code `0` and the result payload

If execution fails, the server sends:

- `sysPerformActionBack` with the backend error code and message

This gives Vona a built-in RPC-like path over Web Socket without replacing the ordinary backend action execution model.

## System event protocol

The canonical built-in system event mapping is:

- `sysReady -> _a`
- `sysPerformAction -> _b`
- `sysPerformActionBack -> _c`

A useful interpretation is:

- the human-readable names are the framework event identities
- the short codes are the compact wire-level transport forms

Because the mapping lives in `types/socketEvent.ts`, that file is the source-truth contract for built-in Web Socket system events.

## Sending and broadcasting messages

The delivery service is implemented in `src/service/socketEvent.ts`.

It provides two main patterns:

- `send(id, eventName, data, options)`
- `broadcast(namespace, eventName, data, options)`

### Direct send

`send(...)` delivers to one known client id.

A practical flow is:

- send immediately on the current worker through `sendWorker(...)`
- emit the matching broadcast bean so other workers can perform the same delivery check if needed

### Namespace broadcast

`broadcast(...)` delivers to all known clients in one namespace.

A practical flow is:

- send immediately to namespace members on the current worker through `broadcastWorker(...)`
- emit the matching broadcast bean so other workers can fan out to their local namespace members

This is why Web Socket delivery in Vona is closely related to distributed runtime primitives.

Read this together with:

- [Broadcast Guide](/backend/broadcast-guide)
- [Worker Guide](/backend/worker-guide)

## Defining a socket namespace

The main extension pattern for application modules is a socket namespace bean.

The pattern has three parts:

1. extend `ISocketNamespaceRecord`
2. declare a bean with `@SocketNamespace(...)`
3. inherit `BeanSocketNamespaceBase`

Representative shape:

```typescript
declare module 'vona-module-a-socket' {
  export interface ISocketNamespaceRecord {
    '/ssrhmr': never;
  }
}

@SocketNamespace({
  namespace: '/ssrhmr',
})
export class SocketNamespaceSsrHmr extends BeanSocketNamespaceBase {}
```

`BeanSocketNamespaceBase` gives namespace beans two useful helpers:

- `send(id, eventName, data, options)`
- `broadcast(eventName, data, options)`

That means downstream modules usually do not need to talk to the low-level socket registry directly.

## Example: `a-ssrhmr`

The `a-ssrhmr` module is a concrete example of extending `a-socket`.

Its namespace bean declares:

- namespace: `/ssrhmr`
- event: `reload`

Representative shape:

```typescript
@SocketNamespace<ISocketNamespaceOptionsSsrHmr>({
  namespace: '/ssrhmr',
})
export class SocketNamespaceSsrHmr extends BeanSocketNamespaceBase<ISocketNamespaceOptionsSsrHmrEvents> {}
```

Then a regular bean can trigger namespace broadcast through scope:

```typescript
@Bean()
export class BeanSsrHmr extends BeanBase {
  reload() {
    this.scope.socketNamespace.ssrHmr.broadcast('reload');
  }
}
```

This example shows the intended layering:

- `a-socket` owns the transport runtime
- application or framework modules define namespace semantics
- ordinary beans trigger namespace delivery through scope

## Relationship to other backend guides

Read this guide together with:

- [Web Socket Usage Guide](/backend/websocket-usage-guide)
- [Web Socket Protocol Guide](/backend/websocket-protocol-guide)
- [Web Socket Call Flow](/backend/websocket-call-flow)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Config Guide](/backend/config-guide)
- [Broadcast Guide](/backend/broadcast-guide)
- [Worker Guide](/backend/worker-guide)
- [Event Guide](/backend/event-guide)

A practical distinction is:

- use **Event** when backend code needs framework-native in-process event composition
- use **Broadcast** when many workers should all receive the same signal
- use **Web Socket** when the backend needs long-lived client connections, server push, or packet-based request flow over a persistent transport

## Implementation checks for Web Socket-related backend work

When extending or reviewing Web Socket behavior, ask:

1. does the work belong in a namespace bean, a connection onion, or a packet onion?
2. is the namespace path consistent with the `/ws/...` routing model?
3. does the connection flow need identity, instance, or origin checks?
4. should delivery be point-to-point or namespace-wide?
5. is the behavior local to one worker, or should it propagate through broadcast?

That helps backend extensions stay aligned with the existing `a-socket` architecture instead of bypassing the framework transport model.