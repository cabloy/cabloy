import z from 'zod';

import type {
  IAnalysisCapabilities,
  IAnalysisPolicy,
  IAnalysisSelection,
  IResolvedAnalysis,
  TypeAnalysisFunction,
  TypeAnalysisMode,
} from '../../types/analysis.ts';

export const analysisFunctions = ['count', 'sum', 'avg', 'min', 'max'] as const;
export const analysisReservedFields = new Set([
  'groups',
  'aggrs',
  'where',
  'joins',
  'having',
  'columns',
  'orders',
  'limit',
  'offset',
  'pageNo',
  'pageSize',
  'distinct',
  'include',
  'with',
]);

/** A deliberate validation/resource-bound error, also usable without an application context. */
export class AnalysisError extends Error {
  readonly code = 422;
  readonly status = 422;
}

export function analysisFailure(message: string): never {
  throw new AnalysisError(message);
}

function actionDefaults(policy: IAnalysisPolicy, mode: TypeAnalysisMode): IAnalysisSelection {
  if (mode !== 'group' && mode !== 'aggregate') analysisFailure('Unknown analysis action');
  const defaults = policy.defaults[mode];
  if (!defaults) analysisFailure(`Analysis ${mode} action is not enabled`);
  return defaults;
}

function columnArray(columns: readonly string[], max: number) {
  return z
    .array(z.enum([...columns]))
    .min(1)
    .max(max)
    .superRefine((value, ctx) => {
      if (new Set(value).size !== value.length) {
        ctx.addIssue({ code: 'custom', message: 'Duplicate analysis columns are not allowed' });
      }
    });
}

/** Native array/object schemas preserve finite enums for query coercion and OpenAPI. */
export function analysisControlSchemas(policy: IAnalysisPolicy, mode: TypeAnalysisMode) {
  const defaults = actionDefaults(policy, mode);
  const shape: Partial<Record<TypeAnalysisFunction, z.ZodType>> = {};
  for (const fn of analysisFunctions) {
    const columns = policy.aggrs[fn];
    if (columns) shape[fn] = columnArray(columns, policy.limits.maxMetrics).optional();
  }
  const aggrs = z
    .strictObject(shape)
    .superRefine((value, ctx) => {
      const count = Object.values(value).reduce<number>(
        (total, columns) => total + (Array.isArray(columns) ? columns.length : 0),
        0,
      );
      if (count === 0 || count > policy.limits.maxMetrics) {
        ctx.addIssue({
          code: 'custom',
          message: `Analysis requires 1 to ${policy.limits.maxMetrics} metrics`,
        });
      }
    })
    .default(() =>
      Object.fromEntries(
        Object.entries(defaults.aggrs).map(([fn, columns]) => [fn, [...columns!]]),
      ),
    );
  const groups =
    mode === 'group'
      ? columnArray(policy.groups, policy.limits.maxGroups).default(() => [...defaults.groups!])
      : undefined;
  const selection = z.strictObject({ groups: groups ?? z.never().optional(), aggrs });
  return { groups, aggrs, selection };
}

/** Validate controls independently of row filters and ignored list controls. */
export function resolveAnalysis(
  policy: IAnalysisPolicy,
  mode: TypeAnalysisMode,
  input?: unknown,
): IResolvedAnalysis {
  if (input !== undefined && (!input || typeof input !== 'object' || Array.isArray(input))) {
    analysisFailure('Analysis parameters must be an object');
  }
  const params = (input ?? {}) as Record<string, unknown>;
  for (const key of ['joins', 'having', 'distinct', 'include', 'with']) {
    if (Object.hasOwn(params, key) && params[key] !== undefined) {
      analysisFailure(`Analysis does not support ${key}`);
    }
  }
  if (mode === 'aggregate' && Object.hasOwn(params, 'groups')) {
    analysisFailure('Aggregate analysis does not support groups');
  }
  // The request context can enable generic query coercion. Direct service calls must
  // still supply native arrays/objects, never JSON strings or coerced scalar items.
  const assertNativeColumns = (columns: unknown) => {
    if (!Array.isArray(columns) || columns.some(column => typeof column !== 'string')) {
      analysisFailure('Analysis columns must be arrays of strings');
    }
  };
  if (params.groups !== undefined) assertNativeColumns(params.groups);
  if (params.aggrs !== undefined) {
    if (!params.aggrs || typeof params.aggrs !== 'object' || Array.isArray(params.aggrs)) {
      analysisFailure('Analysis metrics must be an object of column arrays');
    }
    for (const columns of Object.values(params.aggrs)) assertNativeColumns(columns);
  }
  const parsed = analysisControlSchemas(policy, mode).selection.safeParse({
    ...(mode === 'group' ? { groups: params.groups } : {}),
    aggrs: params.aggrs,
  });
  if (!parsed.success) analysisFailure(parsed.error.message);
  const result: IResolvedAnalysis = { aggrs: {} };
  if (mode === 'group') {
    // Canonical policy order also stabilizes SQL/cache keys for equivalent selections.
    const selected = parsed.data.groups as string[];
    result.groups = policy.groups.filter(column => selected.includes(column));
  }
  for (const fn of analysisFunctions) {
    const selected = parsed.data.aggrs[fn] as string[] | undefined;
    if (selected) result.aggrs[fn] = policy.aggrs[fn]!.filter(column => selected.includes(column));
  }
  return result;
}

export function analysisCapabilities(
  policy: IAnalysisPolicy,
  mode: TypeAnalysisMode,
): IAnalysisCapabilities {
  const defaults = actionDefaults(policy, mode);
  return {
    mode,
    groups: mode === 'group' ? [...policy.groups] : [],
    aggrs: Object.fromEntries(
      Object.entries(policy.aggrs).map(([fn, columns]) => [fn, [...columns!]]),
    ),
    defaults: {
      ...(mode === 'group' ? { groups: [...defaults.groups!] } : {}),
      aggrs: Object.fromEntries(
        Object.entries(defaults.aggrs).map(([fn, columns]) => [fn, [...columns!]]),
      ),
    },
    limits: { ...policy.limits },
  };
}
