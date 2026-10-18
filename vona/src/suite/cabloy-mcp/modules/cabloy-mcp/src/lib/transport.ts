import type { IncomingMessage, ServerResponse } from 'node:http';

import { toNodeHandler } from '@modelcontextprotocol/node';
import {
  createMcpHandler,
  fromJsonSchema,
  MissingRequiredClientCapabilityError,
  ProtocolError,
  Server,
} from '@modelcontextprotocol/server';
import { EventEmitter } from 'node:events';
import { STATUS_CODES } from 'node:http';

// Test-only native core. Nothing in this file registers a route or owns a listener.
const BODY_BYTES = 16 * 1024;
const FRAME_BYTES = 2 * 1024;
const RESPONSE_BYTES = 16 * 1024;
const MODERN_VERSION = '2026-07-28';
const SERVER_INFO = { name: 'cabloy-mcp-fixture', version: '0.0.0' };
const ERROR_MESSAGES = new Map<number, string>([
  [-32700, 'Parse error'],
  [-32600, 'Invalid request'],
  [-32601, 'Method not found'],
  [-32602, 'Invalid params'],
  [-32603, 'Internal error'],
  [-32000, 'Request rejected'],
  [-32020, 'Invalid request headers'],
  [-32021, 'Missing required client capability'],
  [-32022, 'Unsupported protocol version'],
]);

export class FixtureTransportError extends Error {
  readonly status: number;
  readonly code: number;

  constructor(status: number, code = -32600) {
    super(ERROR_MESSAGES.get(code) ?? 'Internal error');
    this.name = 'FixtureTransportError';
    this.status = status;
    this.code = ERROR_MESSAGES.has(code) ? code : -32603;
  }
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parseJson(bytes: Uint8Array): unknown {
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new FixtureTransportError(400, -32700);
  }
}

// JSON.parse accepts duplicate member names. Reject that ambiguity as well as
// structural excess, without recursive traversal or an unbounded parser stack.
function rejectDuplicateKeys(text: string): void {
  const stack: Array<Set<string> | null> = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '{' || c === '[') {
      if (stack.length >= 8) throw new FixtureTransportError(400);
      stack.push(c === '{' ? new Set() : null);
    } else if (c === '}' || c === ']') {
      stack.pop();
    } else if (c === '"') {
      const start = i;
      for (i++; i < text.length; i++) {
        if (text[i] === '\\') i++;
        else if (text[i] === '"') break;
      }
      let next = i + 1;
      while (/\s/.test(text[next] ?? '') && next < text.length) next++;
      if (text[next] === ':') {
        const keys = stack[stack.length - 1];
        const key: string = JSON.parse(text.slice(start, i + 1));
        if (!keys || keys.has(key) || keys.size >= 32) throw new FixtureTransportError(400);
        keys.add(key);
      }
    }
  }
}

function validateBody(body: unknown): void {
  if (
    !record(body) ||
    Object.hasOwn(body, 'result') ||
    Object.hasOwn(body, 'error') ||
    typeof body.method !== 'string' ||
    body.jsonrpc !== '2.0'
  ) {
    throw new FixtureTransportError(400);
  }
  const pending: Array<{ value: unknown; depth: number }> = [{ value: body, depth: 1 }];
  let nodes = 0;
  while (pending.length) {
    const { value, depth } = pending.pop()!;
    if (++nodes > 256 || depth > 8) throw new FixtureTransportError(400);
    if (typeof value === 'string') {
      if (Buffer.byteLength(value) > 2048) throw new FixtureTransportError(400);
    } else if (Array.isArray(value)) {
      if (value.length > 32) throw new FixtureTransportError(400);
      for (const child of value) pending.push({ value: child, depth: depth + 1 });
    } else if (record(value)) {
      const keys = Object.keys(value);
      if (keys.length > 32) throw new FixtureTransportError(400);
      for (const key of keys) {
        if (key === '_method' || Buffer.byteLength(key) > 2048)
          throw new FixtureTransportError(400);
        pending.push({ value: value[key], depth: depth + 1 });
      }
    } else if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new FixtureTransportError(400);
    }
    // A wide final level cannot accumulate a larger work list than the node budget.
    if (nodes + pending.length > 256) throw new FixtureTransportError(400);
  }
}

/** One raw reader, stopped (not drained) on failure; the caller closes the connection. */
export async function readFixtureBody(req: IncomingMessage, signal: AbortSignal): Promise<unknown> {
  const encoding = req.headers['content-encoding'];
  if (encoding !== undefined && encoding !== 'identity') {
    req.pause();
    throw new FixtureTransportError(415, -32000);
  }
  const length = req.headers['content-length'];
  if (length !== undefined && (Array.isArray(length) || !/^\d+$/.test(length))) {
    req.pause();
    throw new FixtureTransportError(400);
  }
  const declared = length === undefined ? undefined : Number(length);
  if (declared !== undefined && (!Number.isSafeInteger(declared) || declared > BODY_BYTES)) {
    req.pause();
    throw new FixtureTransportError(413, -32000);
  }
  const bytes = await new Promise<Buffer>((resolve, reject) => {
    // Preallocate the complete accepted budget, not an attacker-sized chunk list.
    const buffer = Buffer.allocUnsafe(BODY_BYTES);
    let size = 0;
    let settled = false;
    const timer = setTimeout(() => finish(new FixtureTransportError(408, -32000)), 2000);
    function finish(error?: FixtureTransportError) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      req.removeListener('data', onData);
      req.removeListener('end', onEnd);
      req.removeListener('aborted', onAbort);
      req.removeListener('error', onError);
      req.removeListener('close', onClose);
      if (error) {
        req.pause();
        reject(error);
      } else {
        resolve(buffer.subarray(0, size));
      }
    }
    function onAbort() {
      finish(new FixtureTransportError(408, -32000));
    }
    function onError() {
      finish(new FixtureTransportError(400, -32700));
    }
    function onClose() {
      if (!req.complete) onError();
    }
    function onData(chunk: unknown) {
      if (!(chunk instanceof Uint8Array)) return finish(new FixtureTransportError(400, -32700));
      if (size + chunk.byteLength > BODY_BYTES)
        return finish(new FixtureTransportError(413, -32000));
      buffer.set(chunk, size);
      size += chunk.byteLength;
    }
    function onEnd() {
      if (declared !== undefined && declared !== size) finish(new FixtureTransportError(400));
      else finish();
    }
    signal.addEventListener('abort', onAbort, { once: true });
    req.on('data', onData);
    req.once('end', onEnd);
    req.once('aborted', onAbort);
    req.once('error', onError);
    req.once('close', onClose);
    if (signal.aborted || req.destroyed) onAbort();
    else if (req.readableEnded) onEnd();
  });
  const body = parseJson(bytes);
  // Fatal decoding already succeeded; the second decode cannot substitute U+FFFD.
  rejectDuplicateKeys(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  validateBody(body);
  return body;
}

function errorBody(code: number, id: unknown = null): Record<string, unknown> {
  const safeCode = ERROR_MESSAGES.has(code) ? code : -32603;
  return {
    jsonrpc: '2.0',
    id: typeof id === 'number' && Number.isSafeInteger(id) ? id : null,
    error: {
      code: safeCode,
      message: ERROR_MESSAGES.get(safeCode)!,
      ...(safeCode === -32022 ? { data: { supported: [MODERN_VERSION] } } : {}),
      // The only synthetic capability probe requires roots; never copy SDK data.
      ...(safeCode === -32021 ? { data: { requiredCapabilities: { roots: {} } } } : {}),
    },
  };
}

const FAILURE_STATUSES = new Set([
  400, 403, 404, 405, 408, 413, 414, 415, 429, 431, 499, 500, 503, 504,
]);

class NativeFailureGate {
  failed = false;
  cancel?: () => void;

  constructor(readonly res: ServerResponse) {}

  fail(status: number, code?: number): void {
    if (this.failed || this.res.writableEnded || this.res.destroyed) return;
    this.failed = true;
    try {
      if (this.res.headersSent) {
        this.res.destroy();
      } else {
        const safeStatus = FAILURE_STATUSES.has(status) ? status : 500;
        const body =
          safeStatus === 504 || safeStatus === 499
            ? Buffer.alloc(0)
            : Buffer.from(
                JSON.stringify(errorBody(code ?? (safeStatus === 500 ? -32603 : -32000))),
              );
        for (const name of this.res.getHeaderNames()) this.res.removeHeader(name);
        this.res.sendDate = false;
        this.res.writeHead(safeStatus, {
          'content-type': 'application/json',
          'content-length': String(body.byteLength),
          'connection': 'close',
        });
        this.res.end(body);
      }
    } catch {
      this.res.destroy();
    } finally {
      this.cancel?.();
    }
  }
}

const failureGates = new WeakMap<ServerResponse, NativeFailureGate>();
function failureGate(res: ServerResponse): NativeFailureGate {
  let gate = failureGates.get(res);
  if (!gate) {
    gate = new NativeFailureGate(res);
    failureGates.set(res, gate);
  }
  return gate;
}

/** Shared by the request-local error callback and the entire executor catch. */
export function writeFixtureFailure(res: ServerResponse, status: number, code?: number): void {
  failureGate(res).fail(status, code);
}

export type FixtureMode =
  | 'json'
  | 'sse'
  | 'hold'
  | 'throw'
  | 'postcommit'
  | 'large-json'
  | 'large-sse'
  | 'cleanup-hold';
export interface FixtureTransportOptions {
  mode: FixtureMode;
  signal: AbortSignal;
  workBarrier?: Promise<void>;
  cleanupBarrier?: Promise<void>;
  event?: (fixedEnum: string) => void;
}
export interface FixtureTransportState {
  adapterSettled: boolean;
  workSettled: boolean;
  cleanupSettled: boolean;
  cancelObserved: boolean;
}
export interface FixtureTransportOwner {
  run(): Promise<void>;
  cancel(): void;
  close(): Promise<void>;
  state: FixtureTransportState;
  fail(status: number, code?: number): void;
}

type FixtureEvent =
  | 'work_started'
  | 'work_settled'
  | 'adapter_settled'
  | 'cancel_observed'
  | 'cleanup_started'
  | 'cleanup_timeout'
  | 'cleanup_settled'
  | 'sdk_error'
  | 'output_rejected';

function waitForBarrierOrAbort(
  barrier: Promise<void> | undefined,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const finish = (failed = false) => {
      signal.removeEventListener('abort', onAbort);
      if (failed) reject(new FixtureTransportError(500, -32603));
      else resolve();
    };
    function onAbort() {
      finish();
    }
    signal.addEventListener('abort', onAbort, { once: true });
    // This is a synthetic latch, not an operation launched by the fixture.
    // Cancellation removes our wait; there is no abandoned producer/task.
    if (barrier) {
      void barrier.then(
        () => finish(),
        () => finish(true),
      );
    }
    if (signal.aborted) onAbort();
  });
}

/** The only response-instance face touched by node@2.1.1; not a native monkeypatch. */
class BoundedResponse extends EventEmitter {
  private status = 500;
  private kind: 'json' | 'sse' | 'empty' = 'empty';
  private headers: Record<string, string> = {};
  private json = Buffer.allocUnsafe(RESPONSE_BYTES);
  private jsonSize = 0;
  private frame = Buffer.allocUnsafe(FRAME_BYTES);
  private frameSize = 0;
  private wireBytes = 0;
  private frames = 0;
  private pending = false;
  private ended = false;
  private resolveCommit!: () => void;
  readonly committed = new Promise<void>(resolve => {
    this.resolveCommit = resolve;
  });

  private readonly nativeClose = () => {
    this.emit('close');
  };

  private readonly nativeError = () => {
    this.rejectOutput();
  };

  private readonly abort = () => {
    this.emit('close');
  };

  constructor(
    private readonly res: ServerResponse,
    private readonly gate: NativeFailureGate,
    private readonly signal: AbortSignal,
    private readonly track: (task: Promise<void>) => void,
    private readonly event: (name: FixtureEvent) => void,
  ) {
    super();
    res.on('close', this.nativeClose);
    res.on('error', this.nativeError);
    signal.addEventListener('abort', this.abort, { once: true });
  }

  get destroyed(): boolean {
    return this.res.destroyed || this.gate.failed || this.signal.aborted;
  }

  // Actual adapter overloads: writeHead(number, Record<string,string>),
  // write(string|Uint8Array), end(optional string|Uint8Array), on(close|drain).
  // Headers remain staged until a complete bounded payload/frame is approved.
  writeHead(status: number, headers: Record<string, string> = {}): this {
    if (this.ended || this.destroyed) return this;
    try {
      let size =
        Buffer.byteLength(`HTTP/1.1 ${status} ${STATUS_CODES[status] ?? 'unknown'}\r\n`) + 2;
      const fields = Object.entries(headers);
      const names = new Set<string>();
      if (!Number.isInteger(status) || status < 200 || status > 599 || fields.length > 32)
        throw new Error();
      for (const [name, value] of fields) {
        if (
          !/^[a-z0-9-]+$/i.test(name) ||
          typeof value !== 'string' ||
          /[\r\n\0]/.test(value) ||
          Buffer.byteLength(value) > 2048 ||
          names.has(name.toLowerCase())
        ) {
          throw new Error();
        }
        names.add(name.toLowerCase());
        size += Buffer.byteLength(name) + Buffer.byteLength(value) + 4;
      }
      if (size > 8192) throw new Error();
      const contentType = fields.find(([name]) => name.toLowerCase() === 'content-type')?.[1];
      this.kind =
        contentType === 'application/json'
          ? 'json'
          : contentType === 'text/event-stream'
            ? 'sse'
            : 'empty';
      this.status = status;
      // SDK-supplied arbitrary values never become native headers. These fixed
      // projections also bound Node's complete header block (Date is disabled).
      this.headers = { connection: 'close' };
      if (this.kind === 'json') this.headers['content-type'] = 'application/json';
      if (this.kind === 'sse') {
        Object.assign(this.headers, {
          'content-type': 'text/event-stream',
          'cache-control': 'no-cache, no-transform',
          'x-accel-buffering': 'no',
        });
      }
    } catch {
      this.rejectOutput();
    }
    return this;
  }

  write(chunk: string | Uint8Array): boolean {
    if (this.ended || this.destroyed) return false;
    const bytes = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
    if (this.kind === 'json') {
      if (this.jsonSize + bytes.byteLength > RESPONSE_BYTES) {
        this.rejectOutput();
        return false;
      }
      this.json.set(bytes, this.jsonSize);
      this.jsonSize += bytes.byteLength;
      return true;
    }
    if (this.kind !== 'sse' || this.pending || bytes.byteLength > RESPONSE_BYTES - this.wireBytes) {
      this.rejectOutput();
      return false;
    }
    // One adapter chunk in flight, no frame/task queue. The SDK's finite
    // producer emits at most two bounded synthetic messages plus its result.
    // Always report pending SSE work; notify drain only after all native drains.
    this.pending = true;
    const task = Promise.resolve()
      .then(() => this.consumeFrames(bytes))
      .catch(() => {
        this.rejectOutput();
      })
      .finally(() => {
        this.pending = false;
        if (!this.destroyed) this.emit('drain');
      });
    this.track(task);
    return false;
  }

  end(chunk?: string | Uint8Array): this {
    if (this.ended) return this;
    if (chunk !== undefined) this.write(chunk);
    this.ended = true;
    if (this.destroyed) return this;
    if (this.pending || this.frameSize) {
      this.rejectOutput();
      return this;
    }
    try {
      if (this.kind === 'json') {
        const original = parseJson(this.json.subarray(0, this.jsonSize));
        const safe = this.safeMessage(original);
        const bytes = Buffer.from(JSON.stringify(safe));
        if (bytes.byteLength > RESPONSE_BYTES) throw new Error();
        this.commit({ 'content-length': String(bytes.byteLength) });
        this.res.end(bytes);
      } else if (this.kind === 'empty' && this.jsonSize === 0) {
        // Only a bodyless acknowledgement/cancellation is valid without JSON/SSE.
        if (this.status !== 202 && this.status !== 499) throw new Error();
        this.commit({ 'content-length': '0' });
        this.res.end();
      } else {
        if (!this.frames) throw new Error();
        this.res.end();
      }
    } catch {
      this.rejectOutput();
    }
    return this;
  }

  private safeMessage(message: unknown): Record<string, unknown> {
    if (!record(message) || message.jsonrpc !== '2.0') throw new Error();
    if (Object.hasOwn(message, 'error')) {
      const code =
        record(message.error) && typeof message.error.code === 'number'
          ? message.error.code
          : -32603;
      return errorBody(code, message.id);
    }
    // No request-derived content is returned by the finite synthetic handler;
    // discovery is the SDK's built-in fixed capability/identity advertisement.
    if (Object.hasOwn(message, 'result') && record(message.result)) return message;
    if (
      message.method === 'notifications/fixture' &&
      record(message.params) &&
      (message.params.phase === 'started' || message.params.phase === 'x'.repeat(2049))
    ) {
      return message;
    }
    throw new Error();
  }

  private async consumeFrames(bytes: Uint8Array): Promise<void> {
    for (const byte of bytes) {
      if (this.destroyed) return;
      if (this.frameSize >= FRAME_BYTES) throw new Error();
      this.frame[this.frameSize++] = byte;
      if (this.frameSize >= 2 && this.frame[this.frameSize - 2] === 10 && byte === 10) {
        const text = new TextDecoder('utf-8', { fatal: true }).decode(
          this.frame.subarray(0, this.frameSize),
        );
        // Pinned SDK emits precisely this framing. Reject comments, IDs, retry,
        // extra fields and multiline data rather than guessing another dialect.
        if (!text.startsWith('event: message\ndata: ') || !text.endsWith('\n\n')) throw new Error();
        const raw = text.slice('event: message\ndata: '.length, -2);
        if (raw.includes('\n') || raw.includes('\r')) throw new Error();
        const safe = this.safeMessage(JSON.parse(raw));
        const frame = Buffer.from(`event: message\ndata: ${JSON.stringify(safe)}\n\n`);
        if (
          ++this.frames > 8 ||
          frame.byteLength > FRAME_BYTES ||
          this.wireBytes + frame.byteLength > RESPONSE_BYTES
        ) {
          throw new Error();
        }
        this.wireBytes += frame.byteLength;
        this.frameSize = 0;
        this.commit();
        if (!this.res.write(frame)) await this.drain();
      }
    }
  }

  private commit(extra: Record<string, string> = {}): void {
    if (this.destroyed || this.res.writableEnded) throw new Error();
    if (this.res.headersSent) return;
    for (const name of this.res.getHeaderNames()) this.res.removeHeader(name);
    this.res.sendDate = false;
    this.res.writeHead(this.status, { ...this.headers, ...extra });
    this.resolveCommit();
  }

  private drain(): Promise<void> {
    return new Promise((resolve, reject) => {
      let settled = false;
      let timer: ReturnType<typeof setTimeout>;
      const finish = (ok: boolean) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        this.res.removeListener('drain', onDrain);
        this.res.removeListener('close', onFailure);
        this.res.removeListener('error', onFailure);
        this.signal.removeEventListener('abort', onFailure);
        if (ok) resolve();
        else reject(new FixtureTransportError(500, -32603));
      };
      function onDrain() {
        finish(true);
      }
      function onFailure() {
        finish(false);
      }
      timer = setTimeout(onFailure, 1000);
      this.res.once('drain', onDrain);
      this.res.once('close', onFailure);
      this.res.once('error', onFailure);
      this.signal.addEventListener('abort', onFailure, { once: true });
      if (this.destroyed || this.res.writableEnded) onFailure();
      else if (!this.res.writableNeedDrain) onDrain();
    });
  }

  private rejectOutput(): void {
    this.event('output_rejected');
    this.gate.fail(500, -32603);
  }

  dispose(): void {
    this.res.removeListener('close', this.nativeClose);
    this.res.removeListener('error', this.nativeError);
    this.signal.removeEventListener('abort', this.abort);
    this.removeAllListeners();
  }
}

/** Direct finite-gate qualification without creating a listener or an SDK producer. */
export function createFixtureResponseGate(
  res: ServerResponse,
  signal: AbortSignal,
  event?: (fixedEnum: string) => void,
) {
  const controller = new AbortController();
  const linked = AbortSignal.any([signal, controller.signal]);
  const gate = failureGate(res);
  const tasks = new Set<Promise<void>>();
  gate.cancel = () => controller.abort();
  const response = new BoundedResponse(
    res,
    gate,
    linked,
    task => {
      tasks.add(task);
      void task.then(() => tasks.delete(task));
    },
    name => {
      try {
        event?.(name);
      } catch {}
    },
  );
  return {
    response,
    settle: async () => {
      while (tasks.size) await Promise.all([...tasks]);
    },
    dispose: () => {
      response.dispose();
      gate.cancel = undefined;
    },
  };
}

/** Fresh modern-only SDK handler and low-level Server for this one request. */
export function createFixtureTransport(
  req: IncomingMessage,
  res: ServerResponse,
  body: unknown,
  options: FixtureTransportOptions,
): FixtureTransportOwner {
  const state: FixtureTransportState = {
    adapterSettled: false,
    workSettled: false,
    cleanupSettled: false,
    cancelObserved: false,
  };
  const controller = new AbortController();
  const gate = failureGate(res);
  const work = new Set<Promise<void>>();
  const io = new Set<Promise<void>>();
  const servers = new Set<Server>();
  let execution: Promise<void> | undefined;
  let cleanupTimer: ReturnType<typeof setTimeout> | undefined;
  let cleanupStarted = false;
  let cleanupTimedOut = false;
  const event = (name: FixtureEvent) => {
    try {
      options.event?.(name);
    } catch {
      /* Never forward callback errors to a sink. */
    }
  };
  const track = (tasks: Set<Promise<void>>, task: Promise<unknown>) => {
    const settled = task.then(
      () => {},
      () => {},
    );
    tasks.add(settled);
    void settled.then(() => tasks.delete(settled));
  };
  const beginCleanup = () => {
    if (cleanupStarted) return;
    cleanupStarted = true;
    event('cleanup_started');
    cleanupTimer = setTimeout(() => {
      cleanupTimedOut = true;
      event('cleanup_timeout');
      gate.fail(500, -32603);
      cancel();
      // Deliberately leave cleanupSettled false and await all owned barriers.
    }, 1000);
  };
  function cancel() {
    if (controller.signal.aborted || state.cleanupSettled) return;
    state.cancelObserved = true;
    event('cancel_observed');
    beginCleanup();
    controller.abort();
    if (res.headersSent && !res.writableEnded && !res.destroyed) res.destroy();
  }
  gate.cancel = cancel;
  const onExternalAbort = () => {
    gate.fail(504);
    cancel();
  };
  const onNativeClose = () => {
    if (!res.writableFinished) cancel();
  };
  options.signal.addEventListener('abort', onExternalAbort, { once: true });
  res.on('close', onNativeClose);
  const shim = new BoundedResponse(res, gate, controller.signal, task => track(io, task), event);
  const handler = createMcpHandler(
    () => {
      const server = new Server(SERVER_INFO, { capabilities: {} });
      servers.add(server);
      server.onerror = () => event('sdk_error');
      server.setRequestHandler(
        'fixture/capability',
        {
          params: fromJsonSchema<Record<string, unknown>>({ type: 'object' }),
        },
        () => {
          throw new MissingRequiredClientCapabilityError({ requiredCapabilities: { roots: {} } });
        },
      );
      server.setRequestHandler(
        'fixture/probe',
        {
          params: fromJsonSchema<Record<string, unknown>>({ type: 'object' }),
        },
        (_params, ctx) => {
          const task = (async () => {
            event('work_started');
            const sdkAbort = () => cancel();
            ctx.mcpReq.signal.addEventListener('abort', sdkAbort, { once: true });
            try {
              if (ctx.mcpReq.signal.aborted) cancel();
              if (controller.signal.aborted) return { ok: false };
              if (options.mode === 'hold' || options.workBarrier) {
                await waitForBarrierOrAbort(options.workBarrier, controller.signal);
              }
              if (controller.signal.aborted) return { ok: false };
              if (options.mode === 'throw') throw new FixtureTransportError(500, -32603);
              if (
                options.mode === 'sse' ||
                options.mode === 'postcommit' ||
                options.mode === 'large-sse'
              ) {
                await ctx.mcpReq.notify({
                  method: 'notifications/fixture',
                  params: { phase: 'started' },
                });
                if (options.mode !== 'sse') {
                  // Notification enqueue alone is not proof of native commitment.
                  await waitForCommit(shim.committed, controller.signal);
                  if (controller.signal.aborted) return { ok: false };
                  if (options.mode === 'postcommit') throw new Error('Synthetic fixture failure');
                  await ctx.mcpReq.notify({
                    method: 'notifications/fixture',
                    params: { phase: 'x'.repeat(2049) },
                  });
                }
              }
              return options.mode === 'large-json'
                ? { value: 'x'.repeat(RESPONSE_BYTES + 1) }
                : { ok: true };
            } catch {
              // After commitment a thrown synthetic failure must not become another
              // SDK message/envelope; stop the owned producer and terminate instead.
              if (res.headersSent) {
                gate.fail(500, -32603);
                return { ok: false };
              }
              // SDK otherwise serializes the thrown message/data verbatim.
              throw new ProtocolError(-32603, 'Internal error');
            } finally {
              ctx.mcpReq.signal.removeEventListener('abort', sdkAbort);
              event('work_settled');
            }
          })();
          track(work, task);
          return task;
        },
      );
      return server;
    },
    {
      legacy: 'reject',
      responseMode: 'auto',
      keepAliveMs: 0,
      maxRequestBodySize: BODY_BYTES,
      onerror: () => event('sdk_error'),
    },
  );
  // toNodeHandler owns its native-close signal; the separate owner signal must
  // also reach the actual web Request, not only the synthetic handler's wait.
  const adapter = toNodeHandler(
    {
      fetch: (request, requestOptions) =>
        handler.fetch(
          new Request(request, {
            signal: AbortSignal.any([request.signal, controller.signal]),
          }),
          requestOptions,
        ),
    },
    { maxRequestBodySize: BODY_BYTES, onerror: () => event('sdk_error') },
  );

  const settle = async (tasks: Set<Promise<void>>) => {
    while (tasks.size) await Promise.all([...tasks]);
  };
  const run = () => {
    execution ??= (async () => {
      try {
        validateBody(body);
        // Do not permit the SDK's special listen router to create a producer.
        // Legacy notifications reach legacy:'reject' only to prove its 202/drop
        // behavior, not to dispatch a notification or enable an extension.
        if (record(body) && body.method === 'subscriptions/listen') {
          throw new FixtureTransportError(400, -32600);
        }
        if (options.signal.aborted) onExternalAbort();
        if (!controller.signal.aborted && !gate.failed) await adapter(req, shim, body);
      } catch (error) {
        if (error instanceof FixtureTransportError) gate.fail(error.status, error.code);
        else gate.fail(500, -32603);
      } finally {
        state.adapterSettled = true;
        event('adapter_settled');
        // Closing SDK instances is necessary but insufficient: its close() only
        // signals handler cancellation. Explicitly await the tasks we own too.
        beginCleanup();
        try {
          await handler.close();
          await Promise.all(Array.from(servers, server => server.close()));
        } catch {
          event('sdk_error');
          gate.fail(500, -32603);
        }
        await settle(work);
        state.workSettled = true;
        await settle(io);
        try {
          if (options.cleanupBarrier) await options.cleanupBarrier;
        } catch {
          gate.fail(500, -32603);
        }
        clearTimeout(cleanupTimer);
        state.cleanupSettled = true;
        event('cleanup_settled');
        options.signal.removeEventListener('abort', onExternalAbort);
        res.removeListener('close', onNativeClose);
        shim.dispose();
        gate.cancel = undefined;
      }
      if (cleanupTimedOut) throw new FixtureTransportError(500, -32603);
    })();
    return execution;
  };
  return {
    run,
    cancel,
    state,
    fail: (status, code) => gate.fail(status, code),
    close: async () => {
      if (!state.cleanupSettled) cancel();
      await run();
    },
  };
}

function waitForCommit(committed: Promise<void>, signal: AbortSignal): Promise<void> {
  return new Promise(resolve => {
    const finish = () => {
      signal.removeEventListener('abort', finish);
      resolve();
    };
    signal.addEventListener('abort', finish, { once: true });
    void committed.then(finish);
    if (signal.aborted) finish();
  });
}
