import type { IAnalysisPolicy, IQueryPolicy, TypeAnalysisMode } from 'vona-module-a-orm';

import { analysisCapabilities, queryCapabilities } from 'vona-module-a-orm';

import type { ToolSchema } from './controllerToolSchema.ts';

import { toolContractName } from './controllerToolContract.ts';
import { resolveSchema, toolSchema, UnsupportedActionContract } from './controllerToolSchema.ts';

export interface IControllerQueryBinding {
  type: string;
  field?: string;
  query: IQueryPolicy;
  analysis?: IAnalysisPolicy;
  analysisMode?: TypeAnalysisMode;
}

export interface IControllerQueryCapability {
  argumentPath: string[];
  mode: 'select' | TypeAnalysisMode;
  capabilities: {
    query: ReturnType<typeof queryCapabilities>;
    analysis?: ReturnType<typeof analysisCapabilities>;
  };
  querySchema: ToolSchema;
  predicates: ToolSchema;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// A finite operand/control schema may reference definitions, but must not bring
// the recursive predicate graph (or another recursive data contract) back in.
function assertFinite(
  value: any,
  schemas: Record<string, ToolSchema>,
  refs = new Set<string>(),
): void {
  if (!value || typeof value !== 'object') return;
  if (value.$ref) {
    if (refs.has(value.$ref)) throw new UnsupportedActionContract('Recursive query capability');
    const next = new Set(refs).add(value.$ref);
    assertFinite(resolveSchema(value, schemas), schemas, next);
    return;
  }
  for (const child of Object.values(value)) assertFinite(child, schemas, refs);
}

function withoutCapabilities(schema: ToolSchema): ToolSchema {
  const result = clone(schema);
  function visit(value: any): void {
    if (!value || typeof value !== 'object') return;
    if (value.filter?.capabilities) {
      delete value.filter.capabilities;
      if (!Object.keys(value.filter).length) delete value.filter;
    }
    for (const child of Object.values(value)) visit(child);
  }
  visit(result);
  return result;
}

function predicateLeaves(where: ToolSchema, schemas: Record<string, ToolSchema>): ToolSchema {
  const predicate = resolveSchema(where, schemas);
  const branches = predicate.anyOf;
  if (!Array.isArray(branches)) throw new UnsupportedActionContract('Unsupported query predicate');
  const leaves: ToolSchema[] = [];
  const booleans = new Set<string>();
  for (const branch of branches) {
    const resolved = resolveSchema(branch, schemas);
    const properties = resolved.properties ?? {};
    const names = Object.keys(properties);
    if (resolved.type !== 'object' || resolved.additionalProperties !== false) {
      throw new UnsupportedActionContract('Unsupported query predicate branch');
    }
    if (names.includes('field') && names.includes('op')) {
      if (
        names.some(name => !['field', 'op', 'value'].includes(name)) ||
        !resolved.required?.includes('field') ||
        !resolved.required?.includes('op') ||
        (!properties.field.const && !properties.field.enum) ||
        (!properties.op.const && !properties.op.enum)
      ) {
        throw new UnsupportedActionContract('Unsupported query predicate leaf');
      }
      assertFinite(resolved, schemas);
      leaves.push(resolved);
    } else if (names.length === 1 && ['and', 'or', 'not'].includes(names[0])) {
      booleans.add(names[0]);
    } else {
      throw new UnsupportedActionContract('Unsupported query predicate branch');
    }
  }
  if (!leaves.length || booleans.size !== 3) {
    throw new UnsupportedActionContract('Incomplete query predicate');
  }
  return toolSchema({ anyOf: leaves }, schemas);
}

/** Project only native filter bindings; never infer a policy from a property name. */
export function controllerToolQuery(
  input: ToolSchema,
  schemas: Record<string, ToolSchema>,
  bindings: readonly IControllerQueryBinding[],
  flat: boolean,
): { input: ToolSchema; bindings: IControllerQueryCapability[] } {
  let projected = clone(input);
  const capabilities: IControllerQueryCapability[] = [];
  for (const binding of bindings) {
    const argumentPath = [
      ...(flat ? [] : [binding.type]),
      ...(binding.field ? [binding.field] : []),
    ];
    let parent: ToolSchema | undefined;
    let key: string | undefined;
    let current = projected;
    for (const part of argumentPath) {
      const resolved = clone(resolveSchema(current, schemas));
      if (parent) parent.properties[key!] = resolved;
      else projected = resolved;
      current = resolved;
      if (!current.properties?.[part])
        throw new UnsupportedActionContract('Query binding unavailable');
      parent = current;
      key = part;
      current = current.properties[part];
    }
    const query = clone(resolveSchema(current, schemas));
    if (query.type !== 'object' || !query.properties?.where) {
      throw new UnsupportedActionContract('Query predicate unavailable');
    }
    const predicates = predicateLeaves(query.properties.where, schemas);
    const controls = withoutCapabilities(query);
    delete controls.properties.where;
    if (controls.required)
      controls.required = controls.required.filter((name: string) => name !== 'where');
    assertFinite(controls, schemas);
    const mode = binding.analysisMode ?? 'select';
    capabilities.push({
      argumentPath,
      mode,
      capabilities: clone({
        query: queryCapabilities(binding.query),
        ...(binding.analysis && binding.analysisMode
          ? { analysis: analysisCapabilities(binding.analysis, binding.analysisMode) }
          : {}),
      }),
      querySchema: toolSchema(controls, schemas),
      predicates,
    });
    const compact = withoutCapabilities(query);
    compact.properties.where = {
      type: 'object',
      additionalProperties: true,
      description:
        'Boolean query AST: explicit {field,op,value} leaves, {and:[...]}, {or:[...]} or {not:predicate}; no field-value shorthand. ' +
        `Call ${toolContractName} with this tool's exact server name and section "query" for admitted fields, operands and limits. Omit optional where for no added restriction; named filters combine by AND.`,
    };
    if (parent) parent.properties[key!] = compact;
    else projected = compact;
  }
  return { input: projected, bindings: capabilities };
}
