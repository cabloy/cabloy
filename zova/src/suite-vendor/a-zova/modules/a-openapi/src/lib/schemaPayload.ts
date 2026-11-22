import type { SchemaObject } from 'openapi3-ts/oas31';

import { deepEqual, deepExtend } from 'zova';

import type { ISchemaObjectExtensionField, TypeSchemaScene } from '../types/rest.ts';

import { schemaToZodSchema } from './schema.ts';

const omitted = Symbol('omitted');
const unsafeKeys = new Set(['__proto__', 'prototype', 'constructor']);

/** Project form values onto a request contract without changing form state or coercing values. */
export function projectSchemaPayload<T>(
  schema: SchemaObject,
  value: T,
  resolveSchema: (reference: string) => SchemaObject | undefined,
  schemaScene: TypeSchemaScene = 'form',
): T {
  const ancestors = new Set<object>();

  function resolve(reference: string): SchemaObject | undefined {
    if (reference.startsWith('#/')) {
      let target: any = schema;
      for (const part of reference.slice(2).split('/')) {
        const key = part.replace(/~1/g, '/').replace(/~0/g, '~');
        if (unsafeKeys.has(key) || !target || !Object.hasOwn(target, key)) {
          target = undefined;
          break;
        }
        target = target[key];
      }
      if (target) return target;
    }
    return resolveSchema(reference);
  }

  function expand(input: SchemaObject, references = new Set<string>()): SchemaObject {
    if (input.$ref) {
      if (references.has(input.$ref)) throw new Error(`Cyclic schema reference: ${input.$ref}`);
      const target = resolve(input.$ref);
      if (!target) throw new Error(`Unresolved schema reference: ${input.$ref}`);
      const { $ref, ...siblings } = input;
      return merge(expand(target, new Set(references).add($ref)), siblings);
    }
    if (input.allOf) {
      const { allOf, ...siblings } = input;
      return allOf.reduce<SchemaObject>(
        (result, member) => merge(result, expand(member as SchemaObject, references)),
        siblings,
      );
    }
    return input;
  }

  function merge(
    left: ISchemaObjectExtensionField,
    right: ISchemaObjectExtensionField,
  ): ISchemaObjectExtensionField {
    return {
      ...left,
      ...right,
      ...(left.properties || right.properties
        ? { properties: { ...left.properties, ...right.properties } }
        : {}),
      ...(left.required || right.required
        ? { required: [...new Set([...(left.required ?? []), ...(right.required ?? [])])] }
        : {}),
      rest: deepExtend({}, left.rest, right.rest),
    };
  }

  function readonly(input: SchemaObject, scene: TypeSchemaScene) {
    const rest = (input as ISchemaObjectExtensionField).rest;
    const effective = {
      ...rest,
      ...(['form-view', 'form-create', 'filter'].includes(scene) ? rest?.form : undefined),
      ...rest?.[scene],
    };
    return input.readOnly === true || effective.readonly === true;
  }

  function clone(input: any): any {
    if (input === null || typeof input !== 'object') return input;
    if (ancestors.has(input)) throw new Error('Cyclic form payload');
    if (input instanceof Date) return new Date(input.getTime());
    ancestors.add(input);
    try {
      if (Array.isArray(input)) return input.map(clone);
      return Object.fromEntries(
        Object.entries(input)
          .filter(([key]) => !unsafeKeys.has(key))
          .map(([key, child]) => [key, clone(child)]),
      );
    } finally {
      ancestors.delete(input);
    }
  }

  function project(
    input: SchemaObject | boolean,
    current: any,
    inheritedScene: TypeSchemaScene,
  ): any {
    if (input === false) return omitted;
    if (input === true) return clone(current);
    const resolved = expand(input);
    const scene = (resolved as ISchemaObjectExtensionField).rest?.schemaScene ?? inheritedScene;
    if (readonly(input, scene) || readonly(resolved, scene)) return omitted;
    if (current === null || current === undefined) return current;

    const union = resolved.oneOf ?? resolved.anyOf;
    if (union) {
      const { oneOf: _oneOf, anyOf: _anyOf, ...base } = resolved;
      const candidates = union.map(member => merge(base, expand(member as SchemaObject)));
      // Select using the contract, never by combining unrelated union branch fields.
      const matches = candidates.filter(
        candidate => schemaToZodSchema(candidate, resolve).safeParse(current).success,
      );
      if (!matches.length) throw new Error('Form payload does not match a request schema branch');
      const results = matches.map(candidate => project(candidate, current, scene));
      if (results.some(result => !deepEqual(result, results[0]))) {
        throw new Error('Ambiguous request schema projection');
      }
      return results[0];
    }

    if (Array.isArray(current)) {
      if (!resolved.items) return clone(current);
      if (ancestors.has(current)) throw new Error('Cyclic form payload');
      ancestors.add(current);
      try {
        return current.map(item => {
          const result = project(resolved.items as SchemaObject, item, scene);
          if (result === omitted) throw new Error('Readonly request schema array item');
          return result;
        });
      } finally {
        ancestors.delete(current);
      }
    }
    if (typeof current !== 'object' || current instanceof Date) return clone(current);
    if (!resolved.properties && resolved.type !== 'object' && !resolved.additionalProperties) {
      return clone(current);
    }
    if (ancestors.has(current)) throw new Error('Cyclic form payload');
    ancestors.add(current);
    try {
      const result: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(current)) {
        if (unsafeKeys.has(key)) continue;
        const property = resolved.properties?.[key];
        const childSchema = property ?? resolved.additionalProperties;
        if (!childSchema) continue;
        if (property && typeof property === 'object') {
          const resolvedProperty = expand(property as SchemaObject) as ISchemaObjectExtensionField;
          const rest = resolvedProperty.rest;
          const fieldSource = rest?.[scene]?.fieldSource ?? rest?.fieldSource;
          // fieldSource aliases render another field; they are not independent request data.
          if (fieldSource && fieldSource.split('.')[0] !== key) continue;
        }
        const projected = project(childSchema as SchemaObject | boolean, child, scene);
        if (projected !== omitted) result[key] = projected;
      }
      return result;
    } finally {
      ancestors.delete(current);
    }
  }

  if (!schema) throw new Error('Request schema is not loaded');
  const result = project(schema, value, schemaScene);
  if (result === omitted) throw new Error('Request schema is readonly');
  return result;
}
