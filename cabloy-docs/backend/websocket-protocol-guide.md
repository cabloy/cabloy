# Web Socket Protocol Guide

This guide explains the built-in wire protocol used by `a-socket` in Vona within the Cabloy monorepo.

Read this together with:

- [Web Socket Guide](/backend/websocket-guide)
- [Web Socket Usage Guide](/backend/websocket-usage-guide)
- [Web Socket Call Flow](/backend/websocket-call-flow)

## Why this protocol guide exists

The architecture guide explains how the Web Socket runtime is structured, and the usage guide explains how backend modules should use it.

This page answers a narrower question:

- what bytes and payload shapes travel over the socket when the built-in protocol is used?

That matters when you are:

- writing a browser or non-browser client against the current server contract
- debugging why one side cannot parse an event
- understanding the `sysReady`, `sysPerformAction`, and `sysPerformActionBack` system events
- tracing how `ws.sendEvent(...)` encodes outbound data and how packet decoding restores it on inbound traffic

## Source-truth files

The protocol contract is grounded in these files:

- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/types/socketEvent.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/config/config.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/bean/socketConnection.event.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/bean/socketPacket.event.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-socket/src/bean/socketPacket.performAction.ts`

If this guide and source ever disagree, prefer the current source.

## The event transport model

The built-in protocol wraps event messages as:

- a string prefix
- followed by JSON

The default prefix is:

- `'_:'`

The JSON body is serialized as a two-element array:

- `[eventNameOrShortCode, data]`

So the wire model is:

```text
_:[eventNameOrShortCode, data]
```

More precisely, the server sends:

```typescript
`${eventPrefix}${JSON.stringify([eventNameInner, data])}`;
```

That means the Web Socket protocol is event-oriented rather than frame-schema-oriented.

## Prefix behavior

The event prefix comes from module config:

```typescript
return {
  eventPrefix: '_:',
};
```

A practical interpretation is:

- if an inbound string begins with `'_:'`, `a-socket` treats it as an event packet
- if it does not begin with `'_:'`, the built-in event decoder forwards it as ordinary raw data

This is why the prefix is the first protocol boundary.

## Outbound event encoding

The outbound helper is attached during the connection onion `event` stage through:

- `ws.sendEvent(...)`

Its behavior is:

1. take `eventName` and `data`
2. map the event name to a short code if one exists in `socketEventRecord`
3. serialize `[mappedName, data]` with `JSON.stringify(...)`
4. prepend the `eventPrefix`
5. send the final string with `ws.send(...)`

Representative shape:

```typescript
const eventNameInner = socketEventRecord[eventName] ?? eventName;
ws.send(`${this.scope.config.eventPrefix}${JSON.stringify([eventNameInner, data])}`);
```

This means custom namespace events usually travel with their original event names, while built-in system events may travel with compact short codes.

## Inbound event decoding

Inbound decoding happens in `socketPacket.event.ts`.

Its behavior is:

1. check whether the raw payload is a string
2. check whether the string starts with the configured event prefix
3. remove the prefix
4. parse the remaining JSON
5. reverse-map built-in short codes through `socketEventRecordReverse`
6. forward a normalized packet `[eventName, data]`

If the raw payload is not an event-formatted string, the decoder forwards:

- `[undefined, rawData]`

A practical interpretation is:

- event packets become normalized `(eventName, data)` packets
- non-event packets remain possible, but they do not participate in the built-in event-name protocol unless another packet handler interprets them

## Built-in system event names and short codes

The built-in system event mapping is:

- `sysReady -> _a`
- `sysPerformAction -> _b`
- `sysPerformActionBack -> _c`

Reverse mapping is:

- `_a -> sysReady`
- `_b -> sysPerformAction`
- `_c -> sysPerformActionBack`

A useful rule is:

- use the human-readable names when discussing the protocol logically
- expect the short forms on the wire for those built-in events

## Protocol frame examples

### Example 1: server ready signal

Logical event:

```text
sysReady
```

Wire packet:

```text
_: ["_a",null]
```

Because `sysReady` has payload type `never`, the built-in sender still serializes the packet as a two-slot array, so the second slot is `null` in the JSON wire form shown here.

The important contract point is:

- the first slot is `_a`
- the packet means the server-side connection setup completed

### Example 2: custom namespace event

Suppose a namespace event name is:

- `messageCreated`

and the payload is:

```json
{ "roomId": "r1", "messageId": "m8", "text": "hello" }
```

Then a representative wire packet is:

```text
_:["messageCreated",{"roomId":"r1","messageId":"m8","text":"hello"}]
```

Because this is not one of the built-in short-coded system events, the event name stays as `messageCreated`.

### Example 3: perform-action request

Logical event name:

- `sysPerformAction`

Representative logical payload:

```json
{
  "i": 1,
  "m": "get",
  "p": "/training/student/findOne",
  "q": { "id": 3 },
  "h": { "x-demo": "1" }
}
```

Representative wire packet:

```text
_:["_b",{"i":1,"m":"get","p":"/training/student/findOne","q":{"id":3},"h":{"x-demo":"1"}}]
```

## `sysReady`

`sysReady` is the built-in server-ready handshake event.

It is sent by the server after:

- the socket was accepted
- the connection onion `enter` chain completed successfully
- handlers for close, message, and error were installed

A client can interpret `sysReady` as:

- the connection is alive at the protocol level
- the backend-side startup for this socket completed
- request-like packet traffic can begin

## `sysPerformAction`

`sysPerformAction` is the built-in request-like event for invoking backend actions over Web Socket.

Its inner payload shape is:

```typescript
interface ISocketEventPerformActionOptionsInner {
  i: number;
  m: 'get' | 'post' | 'delete' | 'put' | 'patch';
  q?: object;
  p: string;
  b?: any;
  h?: object;
}
```

Field meanings:

- `i` -> request id chosen by the client
- `m` -> method
- `p` -> backend path
- `q` -> query object
- `b` -> body
- `h` -> headers object

A practical interpretation is:

- this is a compact RPC-like request envelope
- it reuses the backend action execution path rather than inventing a second business-dispatch model

## `sysPerformActionBack`

`sysPerformActionBack` is the reply event for `sysPerformAction`.

On success, the built-in server handler sends:

```json
{ "i": 1, "c": 0, "d": <result> }
```

On failure, it sends:

```json
{ "i": 1, "c": <errorCode>, "m": "error message" }
```

Field meanings in practice:

- `i` -> matches the original request id
- `c` -> status code, with `0` meaning success
- `d` -> result data on success
- `m` -> error message on failure

A client should therefore match replies to requests by `i`.

## Request-response pairing model

The built-in protocol does not create a separate reply channel name per action.

Instead, the pairing model is:

1. client sends one `sysPerformAction` packet with request id `i`
2. server executes the action
3. server sends one `sysPerformActionBack` packet with the same `i`
4. client resolves or rejects the in-flight request by matching that id

That means the request id is the essential correlation field.

## Custom event naming model

For application-defined namespace events, a practical rule is:

- choose stable event names such as `messageCreated`, `typing`, `reload`, or `orderCreated`
- keep the namespace path for channel identity
- keep the event name for action identity
- keep the payload object for data

This keeps the protocol understandable on both sides.

A useful split is:

- namespace path -> which channel
- event name -> which signal
- payload -> which data

## JSON compatibility considerations

Because the built-in protocol uses `JSON.stringify(...)`, payloads should stay JSON-friendly.

Prefer payloads such as:

- objects
- arrays
- strings
- numbers
- booleans
- null

Be careful with values such as:

- functions
- class instances that rely on prototype behavior
- circular objects
- non-JSON-native runtime values

A practical rule is:

- if you would not confidently send it through ordinary JSON serialization, do not assume it is a good socket event payload either

## Relationship to non-event packets

The built-in decoder only interprets the event protocol when:

- the inbound data is a string
- and the string starts with the configured event prefix

Otherwise the packet is forwarded as raw data through `[undefined, rawData]`.

This means:

- the built-in event protocol is the normal and preferred path
- custom packet behavior can still exist through additional `socketPacket` handlers
- but if you want interoperability with the built-in helpers, stay inside the prefixed JSON event format

## Practical client checklist

When implementing a client against the current server contract, ask:

1. does the connection URL use the correct `/ws/...` namespace path?
2. does the client wait for `sysReady` before assuming the socket is ready?
3. are outbound event packets prefixed with `'_:'`?
4. are built-in system event short codes handled correctly?
5. if using `sysPerformAction`, does each request carry a unique `i` and does the reply matcher use the same field?

If those answers are correct, the client-side protocol integration will usually align with the current `a-socket` implementation.

## Related guides

Read this page together with:

- [Web Socket Guide](/backend/websocket-guide)
- [Web Socket Usage Guide](/backend/websocket-usage-guide)
- [Web Socket Call Flow](/backend/websocket-call-flow)

Use the practical split:

- [Web Socket Guide](/backend/websocket-guide) for architecture
- [Web Socket Usage Guide](/backend/websocket-usage-guide) for server-side authoring patterns
- [Web Socket Call Flow](/backend/websocket-call-flow) for source tracing
- this page for client-visible wire format and built-in protocol fields
