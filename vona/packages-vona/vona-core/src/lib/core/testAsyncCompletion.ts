import { AsyncLocalStorage } from 'node:async_hooks';
import cluster from 'node:cluster';
import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { isMainThread } from 'node:worker_threads';

import type { VonaApplication } from './application.ts';

import { useApp } from '../framework/useApp.ts';
import { assertIsolatedTestDatabaseClient } from './isolationGuard.ts';
import { assertTestClaimDatabaseClient, hasTestClaimTransport } from './testClaim.ts';
import {
  assertTestAppIdentity,
  assertTestRunOwner,
  resolveVonaLocalPaths,
} from './testIsolation.ts';

export interface TestAsyncCompletionOptions {
  instanceName: string;
  clientName: string;
}

export interface TestAsyncCompletionTicket {
  complete(error?: unknown): void;
}

export interface TestAsyncCompletionScopeOptions {
  instanceName?: string | null;
  dbInfo?: { clientName?: string };
}

const owners = new WeakMap<VonaApplication, Map<string, TestAsyncCompletion>>();
const ownerStorage = new AsyncLocalStorage<TestAsyncCompletion>();

export class TestAsyncCompletion {
  readonly id = randomUUID();
  readonly instanceName: string;
  readonly clientName: string;
  readonly app: VonaApplication;
  private readonly databaseIdentity: ReturnType<typeof getDatabaseIdentity>;
  private readonly pending = new Map<symbol, string>();
  private readonly failures: unknown[] = [];
  private readonly waiters = new Set<() => void>();
  private version = 0;
  private closed = false;

  constructor(app: VonaApplication, options: TestAsyncCompletionOptions) {
    if (
      !app.meta.isTest ||
      !app.meta.appReady ||
      !cluster.isPrimary ||
      !isMainThread ||
      process.env.NODE_UNIQUE_ID !== undefined ||
      useApp() !== app
    ) {
      throw new Error('Test async completion requires the ready in-process test application');
    }
    const env = app.meta.env;
    const runId = assertTestAppIdentity('test', env.VONA_TEST_RUN_ID, app.name);
    if (
      !runId ||
      env.META_MODE !== 'test' ||
      process.env.VONA_TEST_RUN_ID !== runId ||
      !hasTestClaimTransport()
    ) {
      throw new Error('Test async completion requires a managed test run');
    }
    const paths = resolveVonaLocalPaths(app.projectPath, 'test', runId);
    assertTestRunOwner(paths.dataRoot, runId);
    assertTestRunOwner(paths.generatedRoot, runId);
    if (!options.instanceName || !options.clientName || options.clientName.includes(':')) {
      throw new Error('Test async completion requires an instance and a database client name');
    }
    this.app = app;
    this.instanceName = options.instanceName;
    this.clientName = options.clientName;
    this.databaseIdentity = getDatabaseIdentity(app, this.clientName);
    let registry = owners.get(app);
    if (!registry) {
      registry = new Map();
      owners.set(app, registry);
    }
    registry.set(this.id, this);
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    const ticket = this.reserve('run');
    try {
      return await this.bind(fn);
    } finally {
      ticket.complete();
    }
  }

  reserve(label: string): TestAsyncCompletionTicket {
    this.assertOpen();
    const key = Symbol(label);
    this.pending.set(key, label);
    this.version++;
    return {
      complete: (error?: unknown) => {
        if (!this.pending.delete(key)) return;
        if (error !== undefined) this.failures.push(error);
        this.version++;
        for (const wake of this.waiters) wake();
        this.waiters.clear();
      },
    };
  }

  track<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const ticket = this.reserve(label);
    const result = this.bind(async () => {
      try {
        return await fn();
      } catch (error) {
        ticket.complete(
          error === undefined ? new Error(`Test async operation rejected: ${label}`) : error,
        );
        throw error;
      } finally {
        ticket.complete();
      }
    });
    void result.catch(() => {});
    return result;
  }

  bind<T>(fn: () => T): T {
    this.assertOpen();
    return ownerStorage.run(this, fn);
  }

  async settle({ timeout = 30_000 }: { timeout?: number } = {}): Promise<void> {
    if (ownerStorage.getStore()) {
      throw new Error('Test async completion cannot settle from an active owner context');
    }
    if (!Number.isFinite(timeout) || timeout < 0 || timeout > 2_147_483_647) {
      throw new Error('Test async completion timeout must be a valid nonnegative timer duration');
    }
    let timedOut = false;
    let wake: (() => void) | undefined;
    const timer = setTimeout(() => {
      timedOut = true;
      wake?.();
    }, timeout);
    try {
      while (true) {
        if (timedOut) {
          throw new Error(
            `Test async completion timed out; pending: ${[...this.pending.values()].join(', ')}`,
          );
        }
        if (this.pending.size) {
          await new Promise<void>(resolve => {
            wake = resolve;
            this.waiters.add(resolve);
          });
          continue;
        }
        const version = this.version;
        await Promise.resolve();
        if (this.pending.size || this.version !== version) continue;
        this.assertSettled();
        return;
      }
    } finally {
      clearTimeout(timer);
      if (wake) this.waiters.delete(wake);
    }
  }

  assertSettled(): void {
    if (this.pending.size) {
      throw new Error(`Test async completion is pending: ${[...this.pending.values()].join(', ')}`);
    }
    if (this.failures.length) {
      throw new AggregateError(this.failures, 'Test async completion failed');
    }
  }

  assertScope(options: TestAsyncCompletionScopeOptions | undefined): void {
    this.assertOpen();
    if (
      (options?.instanceName !== this.instanceName && options?.instanceName !== null) ||
      options?.dbInfo?.clientName !== this.clientName
    ) {
      throw new Error('Test async completion scope does not match its owner');
    }
    if (!isDeepStrictEqual(this.databaseIdentity, getDatabaseIdentity(this.app, this.clientName))) {
      throw new Error('Test async completion database identity changed');
    }
  }

  close(): void {
    this.assertSettled();
    owners.get(this.app)?.delete(this.id);
    this.closed = true;
  }

  private assertOpen(): void {
    if (this.closed) throw new Error('Test async completion is closed');
  }
}

export function createTestAsyncCompletion(
  app: VonaApplication,
  options: TestAsyncCompletionOptions,
): TestAsyncCompletion {
  return new TestAsyncCompletion(app, options);
}

export function getTestAsyncCompletion(app: VonaApplication): TestAsyncCompletion | undefined {
  const owner = ownerStorage.getStore();
  return owner && owners.get(app)?.get(owner.id) === owner ? owner : undefined;
}

export function withoutTestAsyncCompletion<T>(fn: () => T): T {
  return ownerStorage.exit(fn);
}

export function findTestAsyncCompletion(
  app: VonaApplication,
  id: string,
): TestAsyncCompletion | undefined {
  return owners.get(app)?.get(id);
}

function getDatabaseIdentity(app: VonaApplication, clientName: string) {
  const bean = app.bean as typeof app.bean & {
    database: {
      getClient(clientName: string): {
        clientName: string;
        clientConfig: Parameters<typeof assertIsolatedTestDatabaseClient>[2];
        getDatabaseName(): string;
      };
    };
  };
  const client = bean.database.getClient(clientName);
  if (client.clientName !== clientName) {
    throw new Error('Test async completion requires a resolved database client name');
  }
  const config = client.clientConfig;
  assertIsolatedTestDatabaseClient(app, clientName, config);
  assertTestClaimDatabaseClient(app, clientName, config);
  const connection = config.connection as {
    host?: string;
    port?: string | number;
    database?: string;
    filename?: string;
  };
  return {
    name: client.getDatabaseName(),
    client: config.client,
    host: connection.host,
    port: connection.port,
    database: connection.database,
    filename: connection.filename,
  };
}
