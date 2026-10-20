import type { CompletedReadiness, ExistingReadyCapability } from 'vona';

import { captureRequestBoundary, resolveExistingReadyCapability } from 'vona';

export type ExistingReadyOutcome =
  | 'ready'
  | 'invalid_input'
  | 'boundary_required'
  | 'busy'
  | 'expired'
  | 'unavailable';
export type ExistingReadyResult = Readonly<
  | { outcome: 'ready'; capability: ExistingReadyCapability }
  | { outcome: Exclude<ExistingReadyOutcome, 'ready'> }
>;

interface AdmissionDependencies {
  readonly owner: CompletedReadiness;
  readonly registry: object;
  readonly route: object;
  readonly read: (name: string) => unknown | Promise<unknown>;
  readonly now: () => number;
  readonly getCompletedPublication: (
    owner: CompletedReadiness,
    name: string,
    registry: object,
    route: object,
  ) => object | undefined;
  readonly matchesCompletedRow: (publication: object, row: unknown) => boolean;
  readonly issueExistingReadyCapability: (
    owner: CompletedReadiness,
    publication: object,
    deadline: number,
    now: () => number,
  ) => ExistingReadyCapability;
}

// Deliberately unregistered and implementation-file-only. Production read-port provisioning
// and driver diagnostics require their own qualification, not adoption of caller handles.
export function createExistingReadyAdmissionForTest(dependencies: AdmissionDependencies) {
  if (captureRequestBoundary()) throw new Error('Provisioning requires lifecycle boundary');
  const {
    owner,
    registry,
    route,
    read,
    now,
    getCompletedPublication,
    matchesCompletedRow,
    issueExistingReadyCapability,
  } = dependencies;
  let active = false;
  const outcome = (value: Exclude<ExistingReadyOutcome, 'ready'>): ExistingReadyResult =>
    Object.freeze({ outcome: value });
  async function check(
    name: unknown,
    deadlineAt?: number,
    prior?: ExistingReadyCapability,
  ): Promise<ExistingReadyResult> {
    const boundary = captureRequestBoundary();
    if (!boundary || boundary.snapshot().portFault) return outcome('boundary_required');
    if (
      typeof name !== 'string' ||
      !name.isWellFormed() ||
      name.includes('\0') ||
      Buffer.byteLength(name) > 256
    ) {
      return outcome('invalid_input');
    }
    if (active) return outcome('busy');
    active = true;
    try {
      const started = now();
      if (!Number.isFinite(started) || (deadlineAt !== undefined && !Number.isFinite(deadlineAt)))
        return outcome('invalid_input');
      const deadline = Math.min(deadlineAt ?? started + 1_000, started + 1_000);
      if (started >= deadline) return outcome('expired');
      const publication = getCompletedPublication(owner, name, registry, route);
      const previous = prior && resolveExistingReadyCapability(owner, prior);
      if (!publication || (prior && previous?.publication !== publication))
        return outcome('unavailable');
      const result = await read(name);
      const ended = now();
      if (!Number.isFinite(ended) || ended < started || ended >= deadline)
        return outcome('expired');
      if (
        boundary.snapshot().portFault ||
        getCompletedPublication(owner, name, registry, route) !== publication ||
        (prior && resolveExistingReadyCapability(owner, prior)?.publication !== publication)
      ) {
        return outcome('unavailable');
      }
      if (!result || typeof result !== 'object') return outcome('unavailable');
      const descriptor = Object.getOwnPropertyDescriptor(result, 'outcome');
      const row = Object.getOwnPropertyDescriptor(result, 'row');
      if (
        !descriptor ||
        !('value' in descriptor) ||
        descriptor.value !== 'found' ||
        !row ||
        !('value' in row) ||
        !matchesCompletedRow(publication, row.value)
      ) {
        return outcome('unavailable');
      }
      return Object.freeze({
        outcome: 'ready',
        capability: prior ?? issueExistingReadyCapability(owner, publication, deadline, now),
      });
    } catch {
      return outcome('unavailable');
    } finally {
      active = false;
    }
  }
  return Object.freeze({
    admit: (name: string, deadlineAt?: number) => check(name, deadlineAt),
    recheck: (capability: ExistingReadyCapability, deadlineAt?: number) => {
      const resolved = resolveExistingReadyCapability(owner, capability);
      return resolved
        ? check(resolved.name, deadlineAt, capability)
        : Promise.resolve(outcome('unavailable'));
    },
  });
}
