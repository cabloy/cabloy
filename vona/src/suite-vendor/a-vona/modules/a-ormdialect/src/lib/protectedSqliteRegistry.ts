import { createRequire } from 'node:module';
import path from 'node:path';
import { getRequestBoundary } from 'vona';

const MAX_NAME_BYTES = 256;
const MAX_CONFIG_BYTES = 65_536;
const LOOKUP_BUDGET_MS = 1_000;
const PRIVATE_TIMEOUT_MS = 100;

export const PROTECTED_SQLITE_REGISTRY_SQL = `SELECT
  CASE WHEN typeof(id) = 'integer' AND id > 0 AND id <= 9007199254740991 THEN id ELSE NULL END AS id,
  CASE WHEN typeof(name) = 'text' AND length(CAST(name AS BLOB)) <= 256 THEN name ELSE NULL END AS name,
  CASE WHEN typeof(disabled) = 'integer' AND disabled IN (0, 1) THEN disabled ELSE NULL END AS disabled,
  CASE WHEN typeof(isolate) = 'integer' AND isolate IN (0, 1) THEN isolate ELSE NULL END AS isolate,
  CASE
    WHEN config IS NULL THEN NULL
    WHEN typeof(config) = 'text' AND length(CAST(config AS BLOB)) <= 65536 THEN config
    ELSE NULL
  END AS config,
  CASE
    WHEN typeof(id) = 'integer' AND id > 0 AND id <= 9007199254740991
      AND typeof(name) = 'text' AND length(CAST(name AS BLOB)) <= 256
      AND typeof(disabled) = 'integer' AND disabled IN (0, 1)
      AND typeof(isolate) = 'integer' AND isolate IN (0, 1)
      AND (config IS NULL OR (typeof(config) = 'text' AND length(CAST(config AS BLOB)) <= 65536))
    THEN 1
    ELSE 0
  END AS __protected_valid
FROM aInstance
WHERE name COLLATE BINARY = ?
  AND deleted = 0
LIMIT 2`;

type ProtectedSqliteState = 'new' | 'ready' | 'faulted' | 'closed';

type ProtectedSqlitePrepareOutcome =
  | 'ready'
  | 'already_prepared'
  | 'boundary_required'
  | 'unsupported'
  | 'unavailable';

export interface ProtectedSqliteRegistryOptions {
  readonly filename: string;
}

export interface ProtectedSqliteRegistryRow {
  readonly id: number;
  readonly name: string;
  readonly disabled: boolean;
  readonly isolate: boolean;
  readonly config: string | null;
}

export interface ProtectedSqliteRegistryPrepareResult {
  readonly outcome: ProtectedSqlitePrepareOutcome;
}

export type ProtectedSqliteRegistryLookupOutcome =
  | 'found'
  | 'missing'
  | 'duplicate'
  | 'disabled'
  | 'invalid_input'
  | 'expired'
  | 'boundary_required'
  | 'reentrant'
  | 'unavailable';

export type ProtectedSqliteRegistryLookupResult =
  | Readonly<{
      readonly outcome: 'found';
      readonly row: ProtectedSqliteRegistryRow;
    }>
  | Readonly<{ readonly outcome: Exclude<ProtectedSqliteRegistryLookupOutcome, 'found'> }>;

export interface ProtectedSqliteRegistryCloseResult {
  readonly outcome: 'closed' | 'close_failed';
}

export interface ProtectedSqliteRegistrySnapshot {
  readonly state: ProtectedSqliteState;
  readonly active: boolean;
  readonly closing: boolean;
}

export interface ProtectedSqliteRegistry {
  readonly prepare: () => ProtectedSqliteRegistryPrepareResult;
  readonly lookup: (name: string, deadlineAt?: number) => ProtectedSqliteRegistryLookupResult;
  readonly close: () => Promise<ProtectedSqliteRegistryCloseResult>;
  readonly snapshot: () => ProtectedSqliteRegistrySnapshot;
}

interface ProtectedSqliteStatement {
  all(name: string): readonly unknown[];
}

interface ProtectedSqliteDatabase {
  pragma(sql: string, options?: Readonly<{ readonly simple: true }>): unknown;
  prepare(sql: string): ProtectedSqliteStatement;
  close(): void;
}

interface ProtectedSqliteOpenOptions {
  readonly readonly: true;
  readonly fileMustExist: true;
  readonly timeout: 100;
}

type ProtectedSqliteOpen = (
  filename: string,
  options: ProtectedSqliteOpenOptions,
) => ProtectedSqliteDatabase;

interface ProtectedSqliteDependencies {
  readonly open: ProtectedSqliteOpen;
  readonly now: () => number;
  readonly hasRequestBoundary: () => boolean;
}

const productionDependencies: ProtectedSqliteDependencies = Object.freeze({
  open: openNativeSqlite,
  now: () => performance.now(),
  hasRequestBoundary: () => getRequestBoundary() !== undefined,
});

export function createProtectedSqliteRegistry(
  options: ProtectedSqliteRegistryOptions,
): ProtectedSqliteRegistry {
  return createProtectedSqliteRegistryInternal(options, productionDependencies);
}

// This seam is intentionally not exported by the package barrel. It makes lifecycle and
// diagnostic-containment tests deterministic without accepting an alternate production driver.
export function createProtectedSqliteRegistryForTest(
  options: unknown,
  dependencies: Readonly<
    Partial<ProtectedSqliteDependencies> & { readonly open: ProtectedSqliteOpen }
  >,
): ProtectedSqliteRegistry {
  return createProtectedSqliteRegistryInternal(options, {
    open: dependencies.open,
    now: dependencies.now ?? (() => performance.now()),
    hasRequestBoundary:
      dependencies.hasRequestBoundary ?? (() => getRequestBoundary() !== undefined),
  });
}

export function createProtectedSqliteRegistryInternal(
  options: unknown,
  dependencies: ProtectedSqliteDependencies,
): ProtectedSqliteRegistry {
  const filename = readSupportedFilename(options);
  let state: ProtectedSqliteState = 'new';
  let attempted = false;
  let active = false;
  let closing = false;
  let database: ProtectedSqliteDatabase | undefined;
  let statement: ProtectedSqliteStatement | undefined;
  let closePromise: Promise<ProtectedSqliteRegistryCloseResult> | undefined;
  let closeResolve: ((result: ProtectedSqliteRegistryCloseResult) => void) | undefined;

  const unavailable = (outcome: Exclude<ProtectedSqliteRegistryLookupOutcome, 'found'>) =>
    Object.freeze({ outcome }) as ProtectedSqliteRegistryLookupResult;

  const finalizeClose = (): ProtectedSqliteRegistryCloseResult => {
    if (!database) {
      state = 'closed';
      return Object.freeze({ outcome: 'closed' });
    }
    try {
      database.close();
    } catch {
      state = 'faulted';
      return Object.freeze({ outcome: 'close_failed' });
    }
    database = undefined;
    statement = undefined;
    state = 'closed';
    return Object.freeze({ outcome: 'closed' });
  };

  const settleDeferredClose = () => {
    if (!closeResolve) return;
    const resolve = closeResolve;
    closeResolve = undefined;
    resolve(finalizeClose());
  };

  const prepare = (): ProtectedSqliteRegistryPrepareResult => {
    if (dependencies.hasRequestBoundary()) return Object.freeze({ outcome: 'boundary_required' });
    if (closing || state === 'closed') return Object.freeze({ outcome: 'unavailable' });
    if (attempted) return Object.freeze({ outcome: 'already_prepared' });
    attempted = true;
    if (!filename) {
      state = 'faulted';
      return Object.freeze({ outcome: 'unsupported' });
    }
    try {
      database = dependencies.open(filename, {
        readonly: true,
        fileMustExist: true,
        timeout: PRIVATE_TIMEOUT_MS,
      });
      const journalMode = database.pragma('journal_mode', { simple: true });
      const busyTimeout = database.pragma('busy_timeout', { simple: true });
      if (journalMode !== 'wal' || busyTimeout !== PRIVATE_TIMEOUT_MS) throw new Error();
      statement = database.prepare(PROTECTED_SQLITE_REGISTRY_SQL);
      const probe = statement.all('');
      if (
        !Array.isArray(probe) ||
        probe.length > 2 ||
        probe.some(row => !isValidProjectionRow(row))
      ) {
        throw new Error();
      }
      state = 'ready';
      return Object.freeze({ outcome: 'ready' });
    } catch {
      state = 'faulted';
      return Object.freeze({ outcome: 'unavailable' });
    }
  };

  const lookup = (name: string, deadlineAt = dependencies.now() + LOOKUP_BUDGET_MS) => {
    if (!dependencies.hasRequestBoundary()) return unavailable('boundary_required');
    if (state !== 'ready' || closing || !database || !statement) return unavailable('unavailable');
    if (!isBoundedText(name, MAX_NAME_BYTES)) {
      return unavailable('invalid_input');
    }
    if (!Number.isFinite(deadlineAt) || dependencies.now() >= deadlineAt) {
      return unavailable('expired');
    }
    if (active) return unavailable('reentrant');
    active = true;
    try {
      const rows = statement.all(name);
      if (closing || dependencies.now() >= deadlineAt) return unavailable('expired');
      if (!Array.isArray(rows)) {
        state = 'faulted';
        return unavailable('unavailable');
      }
      if (rows.length > 2) {
        state = 'faulted';
        return unavailable('unavailable');
      }
      if (rows.length === 0) return unavailable('missing');
      if (rows.length === 2) return unavailable('duplicate');
      const row = rows[0];
      if (!isValidProjectionRow(row)) {
        state = 'faulted';
        return unavailable('unavailable');
      }
      const projected = row as Record<string, unknown>;
      if (projected.disabled === 1) return unavailable('disabled');
      const result = Object.freeze({
        outcome: 'found' as const,
        row: Object.freeze({
          id: projected.id as number,
          name: projected.name as string,
          disabled: projected.disabled === 1,
          isolate: projected.isolate === 1,
          config: projected.config as string | null,
        }),
      });
      return result;
    } catch {
      state = 'faulted';
      return unavailable('unavailable');
    } finally {
      active = false;
      if (closing) settleDeferredClose();
    }
  };

  const close = () => {
    if (closePromise) return closePromise;
    closing = true;
    if (active) {
      closePromise = new Promise<ProtectedSqliteRegistryCloseResult>(resolve => {
        closeResolve = resolve;
      });
    } else {
      closePromise = Promise.resolve(finalizeClose());
    }
    return closePromise;
  };

  return Object.freeze({
    prepare,
    lookup,
    close,
    snapshot: () => Object.freeze({ state, active, closing }),
  });
}

function readSupportedFilename(options: unknown): string | undefined {
  try {
    if (!options || typeof options !== 'object' || Array.isArray(options)) return undefined;
    const prototype = Object.getPrototypeOf(options);
    if (prototype !== Object.prototype && prototype !== null) return undefined;
    const keys = Reflect.ownKeys(options);
    if (keys.length !== 1 || keys[0] !== 'filename') return undefined;
    const descriptor = Object.getOwnPropertyDescriptor(options, 'filename');
    if (!descriptor || !Object.hasOwn(descriptor, 'value')) return undefined;
    const filename: unknown = descriptor.value;
    if (
      typeof filename !== 'string' ||
      !filename.isWellFormed() ||
      !path.isAbsolute(filename) ||
      filename.includes('\0')
    ) {
      return undefined;
    }
    return filename;
  } catch {
    return undefined;
  }
}

function isBoundedText(value: unknown, maxBytes: number): value is string {
  return (
    typeof value === 'string' &&
    value.isWellFormed() &&
    Buffer.byteLength(value, 'utf8') <= maxBytes
  );
}

function isValidProjectionRow(row: unknown): boolean {
  if (!row || typeof row !== 'object') return false;
  const projected = row as Record<string, unknown>;
  if (projected.__protected_valid !== 1) return false;
  if (
    typeof projected.id !== 'number' ||
    !Number.isSafeInteger(projected.id) ||
    projected.id <= 0
  ) {
    return false;
  }
  if (!isBoundedText(projected.name, MAX_NAME_BYTES)) return false;
  if (projected.disabled !== 0 && projected.disabled !== 1) return false;
  if (projected.isolate !== 0 && projected.isolate !== 1) return false;
  return projected.config === null || isBoundedText(projected.config, MAX_CONFIG_BYTES);
}

function openNativeSqlite(
  filename: string,
  options: ProtectedSqliteOpenOptions,
): ProtectedSqliteDatabase {
  const require = createRequire(import.meta.url);
  const BetterSqlite3 = require('better-sqlite3') as new (
    filename: string,
    options: ProtectedSqliteOpenOptions,
  ) => ProtectedSqliteDatabase;
  return new BetterSqlite3(filename, options);
}
