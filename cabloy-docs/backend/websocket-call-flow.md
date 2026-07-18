# Web Socket Call Flow

This guide is a source-oriented execution trace for the built-in `a-socket` module.

Read this together with:

- [Web Socket Guide](/backend/websocket-guide)
- [Web Socket Usage Guide](/backend/websocket-usage-guide)
- [Web Socket Protocol Guide](/backend/websocket-protocol-guide)

Use the practical split:

- [Web Socket Guide](/backend/websocket-guide) for architecture
- [Web Socket Usage Guide](/backend/websocket-usage-guide) for server-side authoring patterns
- [Web Socket Protocol Guide](/backend/websocket-protocol-guide) for the client-visible wire format
- this page for source tracing and debugging

## Why this call-flow view matters

The main Web Socket guide explains the architecture and extension model.

This page answers a different question:

- what methods actually run, and in what order, when a socket starts, receives a packet, sends a message, or closes?

That matters when you are:

- debugging connection lifecycle behavior
- deciding whether an extension belongs in `socketNamespace`, `socketConnection`, or `socketPacket`
- tracing authentication, origin checks, instance initialization, or packet execution from source
- verifying how local delivery and cross-worker broadcast fit together

## Key source files

Use these files as the primary trace surface:

- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/monkey.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/service/socket.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/service/socketEvent.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/bean/bean.socket.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/bean/socketConnection.*.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/bean/socketPacket.*.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/types/socketEvent.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/lib/const.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/bean/hmr.socketConnection.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/bean/hmr.socketPacket.ts`

## Startup call flow

At backend startup, the call path is:

1. `Monkey.appReady()`
2. `ServiceSocket.appReady()`
3. create `WebSocketServer`
4. register the `connection` listener

Representative shape:

```typescript
async appReady() {
  if (!this.app.server) return;
  this.app.wss = new WebSocketServer({ server: this.app.server });
  this.app.wss.on('connection', (ws, req) => {
    this._onConnection(ws, req);
  });
}
```

A practical interpretation is:

- monkey lifecycle integration connects `a-socket` to ordinary backend startup
- `a-socket` does not create a separate standalone server
- the Web Socket server is attached to the existing backend HTTP server

## Connection setup call flow

When a client connects, the main path is:

1. `WebSocketServer` emits `connection`
2. `ServiceSocket._onConnection(ws, req)` starts
3. reject immediately if the app is already closing
4. parse the request URL
5. read query values for instance, locale, and timezone
6. create a request-scoped backend context through `app.bean.executor.newCtx(...)`
7. define `ctx.ws`
8. derive `ws.namespace`
9. assign `ws.id`
10. add the client to `bean.socket`
11. execute the connection onion chain with `{ method: 'enter', ws }`
12. install `onclose`, `onmessage`, and `onerror`
13. send `sysReady`

## Connection setup as a source trace

A compact trace looks like this:

```text
Monkey.appReady()
  -> ServiceSocket.appReady()
    -> new WebSocketServer({ server: app.server })
    -> wss.on('connection', (ws, req) => _onConnection(ws, req))

connection
  -> ServiceSocket._onConnection(ws, req)
    -> URL.parse(req.url, ...)
    -> app.bean.executor.newCtx(...)
      -> define ctx.ws getter
      -> ws.namespace = getNamespace()
      -> ws.id = uuidv4()
      -> bean.socket.addClient(ws)
      -> _getComposeSocketConnections(ws.namespace)({ method: 'enter', ws })
      -> install ws.onclose / ws.onmessage / ws.onerror
      -> ws.sendEvent('sysReady')
```

This is the first source path to read when a connection is accepted but later behavior is not what you expect.

## Namespace resolution call flow

Namespace identity is derived inside `ServiceSocket.getNamespace()`.

The flow is:

1. read `this.ctx.path`
2. remove the configured global prefix
3. if the remaining path is empty, use `/`
4. cast the result to a namespace key

A useful interpretation is:

- transport path and logical namespace are intentionally coupled
- namespace selection happens before packet handling
- namespace-specific socket behavior is therefore determined at connection time

Representative mapping:

- `/ws` -> `/`
- `/ws/ssrhmr` -> `/ssrhmr`

## Connection onion composition flow

The connection chain is not hardcoded as a manual list in `service/socket.ts`.

Instead, the flow is:

1. `ServiceSocket._getComposeSocketConnections(namespace)`
2. fetch the namespace cache from `getCacheSocketConnections(app)`
3. if the namespace is not cached:
   - ask `this.bean.onion.socketConnection.getOnionsEnabledWrapped(...)` for enabled onion slices
   - wrap each slice through `_wrapOnionConnection(...)`
   - compose the wrapped handlers through `compose(...)`
4. execute the composed chain

Representative shape:

```typescript
const connections = this.bean.onion.socketConnection.getOnionsEnabledWrapped(item => {
  return this._wrapOnionConnection(item);
});
cacheSocketConnections[namespace] = compose(connections);
```

This matters because the runtime chain is framework-driven:

- enabled onion metadata determines what participates
- wrappers resolve the real bean instance from the container
- the composed result is cached per namespace

## Built-in connection onion execution order

The default built-in connection path is:

```text
alive -> app -> instance -> cors -> event -> passport -> ready
```

The runtime enters each bean through:

- `beanInstance.enter(ws, options, next)` on connection setup
- `beanInstance.exit(ws, options, next)` on connection teardown

A practical responsibility map is:

- `alive` -> heartbeat and stale-socket detection
- `app` -> app-ready and closing checks
- `instance` -> instance initialization
- `cors` -> origin validation
- `event` -> attach `ws.sendEvent(...)`
- `passport` -> token or anonymous sign-in
- `ready` -> terminal ordered stage

## Packet composition flow

Inbound messages follow the same overall pattern as connection onions.

The runtime path is:

1. `ws.onmessage`
2. `ServiceSocket._getComposeSocketPackets(ws.namespace)`
3. fetch the namespace cache from `getCacheSocketPackets(app)`
4. if missing, load enabled packet onions, wrap them, and compose them
5. execute the composed chain with `{ data: event.data, ws }`

The packet wrapper calls:

- `beanInstance.execute(data.data, data.ws, options, _patchPacketNext(...))`

That patching step lets packet handlers pass a transformed packet onward while the composed chain keeps the socket attached.

## Built-in packet execution order

The default built-in packet path is:

```text
event -> performAction
```

### Step 1: event decoding

`SocketPacketEvent.execute(...)` checks whether the payload is an event-formatted string.

If so, it:

1. strips the configured prefix `'_:'`
2. parses JSON
3. reverse-maps short codes such as `_a`, `_b`, `_c`
4. forwards `[eventName, data]`

Otherwise it forwards:

- `[undefined, rawData]`

This is the source transition from raw transport data into normalized packet data.

### Step 2: perform-action handling

`SocketPacketPerformAction.execute(...)` checks whether the normalized event name is:

- `sysPerformAction`

If not, it calls `next()`.

If yes, it:

1. extracts compact request fields from the packet
2. calls `this.$scope.executor.service.executor.performActionInner(...)`
3. sends `sysPerformActionBack` on success or failure

A compact trace looks like this:

```text
ws.onmessage
  -> composed socketPacket chain
    -> SocketPacketEvent.execute(raw)
      -> normalized packet [eventName, data]
    -> SocketPacketPerformAction.execute(packet)
      -> performActionInner(method, path, { query, body, headers })
      -> ws.sendEvent('sysPerformActionBack', resultOrError)
```

## Outbound send call flow

The simplest server-to-client path is direct send by client id.

The runtime path is:

1. some backend code calls `scope.socket.service.socketEvent.send(...)`
2. `ServiceSocketEvent.send(...)` calls `sendWorker(...)` locally
3. `sendWorker(...)` looks up the socket in `bean.socket.clients`
4. `ws.sendEvent(...)` serializes and sends the packet
5. `ServiceSocketEvent.send(...)` also emits the `send` broadcast bean for cross-worker propagation

A compact trace looks like this:

```text
caller
  -> ServiceSocketEvent.send(id, eventName, data, options)
    -> sendWorker(id, ...)
      -> bean.socket.clients[id]?.sendEvent(...)
        -> ws.send('_:' + JSON.stringify([eventNameInner, data]))
    -> scope.broadcast.send.emit(...)
```

This is why even a targeted send is not only a local socket write. It also has a distributed propagation path.

## Outbound broadcast call flow

Namespace broadcast follows the same two-level model.

The runtime path is:

1. some backend code calls `broadcast(namespace, eventName, data, options)`
2. `ServiceSocketEvent.broadcast(...)` calls `broadcastWorker(...)` locally
3. `broadcastWorker(...)` reads client ids from `bean.socket.clientsNamespace[namespace]`
4. each local client sends through `ws.sendEvent(...)`
5. `ServiceSocketEvent.broadcast(...)` emits the `broadcast` bean for other workers

A compact trace looks like this:

```text
caller
  -> ServiceSocketEvent.broadcast(namespace, eventName, data, options)
    -> broadcastWorker(namespace, ...)
      -> ids = bean.socket.clientsNamespace[namespace]
      -> for each id: bean.socket.clients[id]?.sendEvent(...)
    -> scope.broadcast.broadcast.emit(...)
```

A practical interpretation is:

- local clients receive the event immediately
- other workers replay the same delivery logic for their local namespace members
- `a-socket` reuses the distributed broadcast layer instead of inventing a separate cross-worker socket bus

## Namespace-bean call flow

Most application code should not call low-level socket registries directly.

The usual path is a namespace bean extending `BeanSocketNamespaceBase`.

That path is:

1. define a namespace bean with `@SocketNamespace(...)`
2. call `send(...)` or `broadcast(...)` on that bean
3. `BeanSocketNamespaceBase` forwards to `ServiceSocketEvent`
4. `ServiceSocketEvent` performs local delivery and broadcast propagation

Representative trace:

```text
BeanSsrHmr.reload()
  -> this.scope.socketNamespace.ssrHmr.broadcast('reload')
    -> BeanSocketNamespaceBase.broadcast(...)
      -> this.$scope.socket.service.socketEvent.broadcast(namespace, ...)
        -> local namespace delivery
        -> broadcast fan-out to other workers
```

This is the normal extension path for feature modules.

## Disconnect call flow

When a connection closes, the runtime path is:

1. `ws.onclose`
2. run the connection onion chain again with `{ method: 'exit', ws }`
3. remove the client from the registry in `bean.socket.removeClient(ws)`
4. resolve the connection promise

Representative trace:

```text
ws.onclose
  -> _getComposeSocketConnections(ws.namespace)({ method: 'exit', ws })
  -> bean.socket.removeClient(ws)
  -> resolve()
```

This matters because cleanup is not only a transport event. It also reuses the onion lifecycle so custom connection beans can attach exit-time behavior.

## Shutdown call flow

At backend shutdown, the path is:

1. `Monkey.appClose()`
2. `ServiceSocket.appClose()`
3. `app.wss.close()`
4. `bean.socket.close()`
5. terminate all tracked clients

A compact trace looks like this:

```text
Monkey.appClose()
  -> ServiceSocket.appClose()
    -> app.wss.close()
    -> bean.socket.close()
      -> for each client: terminate()
```

This keeps runtime shutdown and socket cleanup aligned.

## HMR and cache invalidation flow

`a-socket` caches composed connection and packet chains in `app.meta` through:

- `SymbolCacheSocketConnections`
- `SymbolCacheSocketPackets`

The related flow is:

1. first connection or packet execution composes and caches the chain
2. later traffic reuses the cached composed function
3. HMR reload triggers `HmrSocketConnection.reload(...)` or `HmrSocketPacket.reload(...)`
4. those HMR beans clear the corresponding cache from `app.meta`
5. the next execution rebuilds the composed chain from current metadata

A compact trace looks like this:

```text
first use
  -> _getComposeSocketConnections(namespace)
    -> getCacheSocketConnections(app)
    -> compose(...) and cache

HMR reload
  -> HmrSocketConnection.reload(...)
    -> clearAllCacheSocketConnections(app)

next use
  -> rebuild composed chain
```

This is the important source path when onion changes appear stale during development.

## When to trace which path

Use these call paths depending on the problem you are investigating:

- startup problem -> `monkey.ts` and `ServiceSocket.appReady()`
- connection rejected too early -> `_onConnection(...)` plus `app`, `instance`, `cors`, and `passport`
- client never receives ready -> `event` connection onion plus `sysReady`
- inbound action fails -> `socketPacket.event.ts`, `socketPacket.performAction.ts`, and `performActionInner(...)`
- targeted delivery fails -> `ServiceSocketEvent.send(...)` and `bean.socket.clients`
- namespace broadcast fails -> `ServiceSocketEvent.broadcast(...)` and `clientsNamespace`
- development reload seems stale -> `lib/const.ts` and the HMR beans

## Related guides

If you need the broader context next, read:

- [Web Socket Guide](/backend/websocket-guide) for the architecture and extension model
- [Web Socket Usage Guide](/backend/websocket-usage-guide) for server-side authoring patterns
- [Web Socket Protocol Guide](/backend/websocket-protocol-guide) for the client-visible wire format
- [Broadcast Guide](/backend/broadcast-guide) and [Worker Guide](/backend/worker-guide) for cross-worker delivery context
