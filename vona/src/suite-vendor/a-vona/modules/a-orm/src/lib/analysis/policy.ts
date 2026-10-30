import { ZodMetadata } from '@cabloy/zod-openapi';
import { getTargetDecoratorRules } from 'vona-module-a-openapiutils';

import type {
  IAnalysisConfig,
  IAnalysisPolicy,
  TypeAnalysisAggrs,
  TypeAnalysisAllowedAggrs,
  TypeAnalysisEntity,
  TypeAnalysisField,
  TypeAnalysisFunction,
  TypeAnalysisModelLike,
  TypeAnalysisPolicy,
} from '../../types/analysis.ts';

import { getClassEntityFromClassModel, prepareClassModel } from '../../common/utils.ts';
import { analysisFunctions, analysisReservedFields, resolveAnalysis } from './controls.ts';

function invalid(message: string): never {
  throw new TypeError(`Invalid analysis policy: ${message}`);
}

function assertColumns(
  columns: unknown,
  label: string,
  allowEmpty = false,
): asserts columns is string[] {
  if (!Array.isArray(columns) || (!allowEmpty && columns.length === 0))
    invalid(`${label} must be a nonempty column array`);
  if (columns.some(column => typeof column !== 'string'))
    invalid(`${label} columns must be strings`);
  if (new Set(columns).size !== columns.length) invalid(`${label} contains duplicate columns`);
}

function copyAggrs(aggrs: TypeAnalysisAggrs): TypeAnalysisAggrs {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(aggrs).map(([fn, columns]) => [fn, Object.freeze([...columns!])]),
    ),
  );
}

/** Static model/entity metadata only: safe while DTO classes are being evaluated. */
export function $defineAnalysis<
  ModelLike extends TypeAnalysisModelLike,
  const Groups extends readonly TypeAnalysisField<TypeAnalysisEntity<ModelLike>>[],
  const Aggrs extends TypeAnalysisAllowedAggrs<TypeAnalysisEntity<ModelLike>>,
>(
  modelLike: ModelLike,
  config: IAnalysisConfig<Groups, Aggrs> & {
    aggrs: Aggrs & Record<Exclude<keyof Aggrs, TypeAnalysisFunction>, never>;
  },
): TypeAnalysisPolicy<ModelLike, Groups, Aggrs> {
  const modelClass = prepareClassModel(modelLike as any);
  const entityClass = getClassEntityFromClassModel(modelClass);
  const rules = getTargetDecoratorRules(entityClass.prototype, true);
  assertColumns(config.groups, 'groups', true);
  const validateField = (column: string, numeric: boolean) => {
    if (!/^[A-Z_]\w*$/i.test(column) || analysisReservedFields.has(column))
      invalid(`unsupported column ${column}`);
    if (!Object.hasOwn(rules, column)) invalid(`unknown entity column ${column}`);
    const schema = ZodMetadata.unwrapChained(ZodMetadata.resolveLazySchema(rules[column]!));
    if (numeric && (column === 'id' || column === 'iid' || schema.def.type !== 'number'))
      invalid(`non-count metrics require numeric columns: ${column}`);
  };
  for (const column of config.groups) validateField(column, false);
  if (!config.aggrs || typeof config.aggrs !== 'object' || Array.isArray(config.aggrs))
    invalid('aggrs must be an object');
  const aliases = new Set<string>(config.groups);
  let metricCount = 0;
  for (const [fn, columns] of Object.entries(config.aggrs)) {
    if (!analysisFunctions.includes(fn as TypeAnalysisFunction))
      invalid(`unsupported function ${fn}`);
    assertColumns(columns, fn);
    for (const column of columns) {
      if (column !== '*' || fn !== 'count') validateField(column, fn !== 'count');
      const alias = `${fn}_${column === '*' ? 'all' : column}`;
      if (aliases.has(alias) || analysisReservedFields.has(alias))
        invalid(`alias collision: ${alias}`);
      aliases.add(alias);
      metricCount++;
    }
  }
  if (metricCount === 0) invalid('at least one allowed metric is required');
  const limits = { maxGroups: 3, maxMetrics: 10, maxGroupRows: 1000, ...config.limits };
  for (const [key, value] of Object.entries(limits)) {
    if (
      !['maxGroups', 'maxMetrics', 'maxGroupRows'].includes(key) ||
      !Number.isSafeInteger(value) ||
      value < 1 ||
      value >= Number.MAX_SAFE_INTEGER
    ) {
      invalid(`invalid limit ${key}`);
    }
  }
  if (
    !config.defaults ||
    Object.keys(config.defaults).some(key => key !== 'group' && key !== 'aggregate')
  ) {
    invalid('unknown or missing action defaults');
  }
  if (!config.defaults.group && !config.defaults.aggregate)
    invalid('at least one action default is required');
  const policy: IAnalysisPolicy = {
    modelLike,
    modelClass,
    groups: Object.freeze([...config.groups]),
    aggrs: copyAggrs(config.aggrs),
    defaults: {},
    limits: Object.freeze(limits),
  };
  const defaults: {
    group?: IAnalysisPolicy['defaults']['group'];
    aggregate?: IAnalysisPolicy['defaults']['aggregate'];
  } = {};
  for (const mode of ['group', 'aggregate'] as const) {
    const input = config.defaults[mode];
    if (!input) continue;
    // Do not allow omitted defaults to expand authorization implicitly.
    if (!Object.hasOwn(input, 'aggrs') || (mode === 'group' && !Object.hasOwn(input, 'groups')))
      invalid(`incomplete ${mode} defaults`);
    if (Object.keys(input).some(key => key !== 'aggrs' && !(mode === 'group' && key === 'groups')))
      invalid(`unsupported ${mode} default control`);
    const forValidation = { ...policy, defaults: { [mode]: input } } as IAnalysisPolicy;
    try {
      const resolved = resolveAnalysis(forValidation, mode, input);
      const aggrs = copyAggrs(resolved.aggrs);
      if (mode === 'group')
        defaults.group = Object.freeze({ groups: Object.freeze(resolved.groups!), aggrs });
      else defaults.aggregate = Object.freeze({ aggrs });
    } catch (error) {
      invalid(`${mode} defaults: ${(error as Error).message}`);
    }
  }
  return Object.freeze({ ...policy, defaults: Object.freeze(defaults) }) as TypeAnalysisPolicy<
    ModelLike,
    Groups,
    Aggrs
  >;
}
