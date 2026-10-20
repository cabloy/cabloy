import { getRequestBoundary } from './requestBoundary.ts';

declare const capabilityBrand: unique symbol;
export interface ExistingReadyCapability {
  readonly [capabilityBrand]: true;
}

export interface CompletedReadiness {
  snapshot(): Readonly<{ application: 'starting' | 'ready' | 'failed' | 'closing' }>;
}

interface RegistryRow {
  readonly id: number;
  readonly name: string;
  readonly disabled: boolean;
  readonly isolate: boolean;
  readonly config: string | null;
}

interface Provision {
  readonly registry: object;
  readonly route: object;
  readonly handle: object;
  readonly isolate: boolean;
  readonly functions: ReadonlySet<Function>;
}

interface Publication {
  readonly attempt: object;
  readonly provision: Provision;
  readonly row: RegistryRow;
  readonly config: object;
}

interface Owner {
  readonly app: object;
  application: 'starting' | 'ready' | 'failed' | 'closing';
  applicationAttempt: object;
  readonly attempts: Map<string, object>;
  readonly provisions: Map<string, Provision>;
  readonly publications: Map<string, Publication>;
}

const owners = new WeakMap<CompletedReadiness, Owner>();
const capabilities = new WeakMap<
  ExistingReadyCapability,
  { owner: CompletedReadiness; publication: Publication; deadline: number; now: () => number }
>();
const captures = new WeakSet<object>();
const pins = new WeakMap<object, Publication>();

export function createCompletedReadiness(appIdentity: object): CompletedReadiness {
  const state: Owner = {
    app: appIdentity,
    application: 'starting',
    applicationAttempt: Object.freeze({}),
    attempts: new Map(),
    provisions: new Map(),
    publications: new Map(),
  };
  const facade = Object.freeze({
    snapshot: () => Object.freeze({ application: state.application }),
  });
  owners.set(facade, state);
  return facade;
}

// Internal framework integration only. None of the issuance/provisioning helpers are barrel exports.
export function beginCompletedApplication(owner: CompletedReadiness): object {
  const state = owners.get(owner)!;
  state.publications.clear();
  state.attempts.clear();
  state.applicationAttempt = Object.freeze({});
  if (state.application !== 'closing') state.application = 'starting';
  return state.applicationAttempt;
}

export function finishCompletedApplication(
  owner: CompletedReadiness,
  attempt: object,
  success: boolean,
): void {
  const state = owners.get(owner)!;
  if (state.application === 'closing' || state.applicationAttempt !== attempt) return;
  state.application = success ? 'ready' : 'failed';
  if (!success) state.publications.clear();
}

export function closeCompletedReadiness(owner: CompletedReadiness): void {
  const state = owners.get(owner)!;
  state.application = 'closing';
  state.publications.clear();
  state.attempts.clear();
}

export function invalidateCompletedInstance(
  owner: CompletedReadiness | undefined,
  name: string,
): void {
  if (!owner) return;
  const state = owners.get(owner)!;
  state.attempts.set(name, Object.freeze({}));
  state.publications.delete(name);
}

export function beginCompletedInstance(
  owner: CompletedReadiness | undefined,
  name: string,
): object | undefined {
  if (!owner) return;
  invalidateCompletedInstance(owner, name);
  return owners.get(owner)!.attempts.get(name);
}

function rowCopy(value: unknown): RegistryRow | undefined {
  if (!value || typeof value !== 'object') return;
  const fields = ['id', 'name', 'disabled', 'isolate', 'config'];
  const data: Record<string, unknown> = Object.create(null);
  for (const key of fields) {
    const desc = Object.getOwnPropertyDescriptor(value, key);
    if (!desc || !('value' in desc)) return;
    data[key] = desc.value;
  }
  if (
    typeof data.id !== 'number' ||
    !Number.isSafeInteger(data.id) ||
    data.id <= 0 ||
    typeof data.name !== 'string' ||
    !data.name.isWellFormed() ||
    data.name.includes('\0') ||
    Buffer.byteLength(data.name) > 256 ||
    data.disabled !== false ||
    typeof data.isolate !== 'boolean' ||
    !(
      data.config === null ||
      (typeof data.config === 'string' &&
        data.config.isWellFormed() &&
        Buffer.byteLength(data.config) <= 65_536)
    )
  ) {
    return;
  }
  return Object.freeze(data) as unknown as RegistryRow;
}

function detach(
  value: unknown,
  functions: ReadonlySet<Function>,
  active = new Set<object>(),
  depth = 0,
  budget = { nodes: 0 },
): unknown {
  if (++budget.nodes > 100_000 || depth > 64)
    throw new Error('Unsupported completed configuration');
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value))
  ) {
    return value;
  }
  if (typeof value === 'function') {
    if (!functions.has(value) || !Object.isFrozen(value))
      throw new Error('Unsupported completed configuration');
    for (const key of Reflect.ownKeys(value)) {
      const desc = Object.getOwnPropertyDescriptor(value, key)!;
      if (
        !('value' in desc) ||
        desc.writable ||
        (desc.value && (typeof desc.value === 'object' || typeof desc.value === 'function'))
      ) {
        throw new Error('Unsupported completed configuration');
      }
    }
    return value;
  }
  if (typeof value !== 'object' || !value || active.has(value))
    throw new Error('Unsupported completed configuration');
  const array = Array.isArray(value);
  const proto = Object.getPrototypeOf(value);
  if (
    (!array && proto !== Object.prototype && proto !== null) ||
    (array && proto !== Array.prototype)
  ) {
    throw new Error('Unsupported completed configuration');
  }
  active.add(value);
  const result = array ? [] : Object.create(null);
  for (const key of Reflect.ownKeys(value)) {
    if (array && key === 'length') continue;
    if (typeof key !== 'string') throw new Error('Unsupported completed configuration');
    const desc = Object.getOwnPropertyDescriptor(value, key)!;
    if (!('value' in desc)) throw new Error('Unsupported completed configuration');
    Object.defineProperty(result, key, {
      value: detach(desc.value, functions, active, depth + 1, budget),
      enumerable: desc.enumerable,
      configurable: false,
      writable: false,
    });
  }
  if (array) Object.defineProperty(result, 'length', { value: (value as unknown[]).length });
  active.delete(value);
  return Object.freeze(result);
}

// Controlled inert qualification seam. Production provisioning is intentionally not supplied.
export function provisionCompletedInstanceForTest(
  owner: CompletedReadiness,
  name: string,
  input: {
    readonly registry: object;
    readonly route: object;
    readonly handle: object;
    readonly isolate: boolean;
    readonly functions?: readonly Function[];
  },
): void {
  if (getRequestBoundary()) throw new Error('Provisioning requires lifecycle boundary');
  const state = owners.get(owner)!;
  invalidateCompletedInstance(owner, name);
  state.provisions.set(
    name,
    Object.freeze({ ...input, functions: new Set(input.functions ?? []) }),
  );
}

export function captureCompletedInstance(
  owner: CompletedReadiness | undefined,
  name: string,
  attempt: object | undefined,
  row: unknown,
  config: unknown,
): object | undefined {
  if (!owner || !attempt) return;
  const state = owners.get(owner)!;
  const provision = state.provisions.get(name);
  if (!provision || state.application === 'closing' || state.attempts.get(name) !== attempt) return;
  try {
    const capturedRow = rowCopy(row);
    if (!capturedRow || capturedRow.name !== name || capturedRow.isolate !== provision.isolate)
      return;
    const snapshot = detach(config, provision.functions);
    if (!snapshot || typeof snapshot !== 'object') return;
    const captured = Object.freeze({ attempt, provision, row: capturedRow, config: snapshot });
    captures.add(captured);
    return captured;
  } catch {
    // Unsupported snapshots leave admission unavailable without inspecting the failure.
  }
}

export function finishCompletedInstance(
  owner: CompletedReadiness | undefined,
  name: string,
  attempt: object | undefined,
  captured: object | undefined,
): void {
  if (!owner || !attempt || !captured || !captures.has(captured)) return;
  const state = owners.get(owner)!;
  const publication = captured as Publication;
  if (
    state.application !== 'closing' &&
    state.application !== 'failed' &&
    state.attempts.get(name) === attempt &&
    publication.attempt === attempt &&
    state.provisions.get(name) === publication.provision
  ) {
    state.publications.set(name, publication);
  }
}

export function getCompletedPublication(
  owner: CompletedReadiness,
  name: string,
  registry: object,
  route: object,
): object | undefined {
  const state = owners.get(owner);
  const publication = state?.publications.get(name);
  if (
    state?.application !== 'ready' ||
    !publication ||
    publication.provision.registry !== registry ||
    publication.provision.route !== route
  ) {
    return;
  }
  return publication;
}

export function matchesCompletedRow(publication: object, row: unknown): boolean {
  try {
    const next = rowCopy(row),
      prior = (publication as Publication).row;
    return (
      !!next &&
      next.id === prior.id &&
      next.name === prior.name &&
      next.isolate === prior.isolate &&
      next.config === prior.config
    );
  } catch {
    return false;
  }
}

export function issueExistingReadyCapability(
  owner: CompletedReadiness,
  publication: object,
  deadline: number,
  now: () => number,
): ExistingReadyCapability {
  if (!captures.has(publication)) throw new Error('Existing-ready unavailable');
  const capability = Object.freeze({}) as ExistingReadyCapability;
  capabilities.set(capability, { owner, publication: publication as Publication, deadline, now });
  return capability;
}

export function resolveExistingReadyCapability(
  owner: CompletedReadiness,
  capability: ExistingReadyCapability,
  app?: object,
): { readonly publication: object; readonly name: string; readonly handle: object } | undefined {
  const issued = capabilities.get(capability),
    state = owners.get(owner);
  if (
    !issued ||
    issued.owner !== owner ||
    !state ||
    state.application !== 'ready' ||
    (app && app !== state.app)
  ) {
    return;
  }
  try {
    const current = issued.now();
    if (!Number.isFinite(current) || current >= issued.deadline) return;
  } catch {
    return;
  }
  const publication = issued.publication;
  if (
    state.publications.get(publication.row.name) !== publication ||
    state.attempts.get(publication.row.name) !== publication.attempt
  ) {
    return;
  }
  return Object.freeze({
    publication,
    name: publication.row.name,
    handle: publication.provision.handle,
  });
}

export function pinExistingReadyContext(
  owner: CompletedReadiness,
  capability: ExistingReadyCapability,
  app: object,
  context: object,
): boolean {
  const resolved = resolveExistingReadyCapability(owner, capability, app);
  if (!resolved || pins.has(context)) return false;
  const publication = resolved.publication as Publication;
  pins.set(context, publication);
  for (const [key, value] of [
    ['config', publication.config],
    ['instance', publication.row],
    ['instanceName', publication.row.name],
    ['innerAccess', false],
  ] as const) {
    Object.defineProperty(context, key, {
      value,
      enumerable: true,
      configurable: false,
      writable: false,
    });
  }
  return true;
}

export function getExistingReadyContextConfig(context: object): object | undefined {
  return pins.get(context)?.config;
}

export function isExistingReadyContext(context: object | undefined | null): boolean {
  return !!context && pins.has(context);
}
