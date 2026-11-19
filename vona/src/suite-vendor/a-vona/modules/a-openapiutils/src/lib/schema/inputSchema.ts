import type { ISchemaObjectExtensionFieldRest, TypeSchemaScene } from 'vona-module-a-openapi';

import { ZodMetadata } from '@cabloy/zod-openapi';
import { Metadata } from '@cabloy/zod-to-openapi';
import { z } from 'zod';

type Purpose = 'execute' | 'transport';
type SchemaMetadata = Record<string, any> & { rest?: ISchemaObjectExtensionFieldRest };

const schemaCache = new WeakMap<z.ZodType, Map<string, z.ZodType>>();
const lazyTargets = new WeakMap<z.ZodType, z.ZodType>();
let nextRefId = 0;

/** Remove caller-owned readonly input at its object parser boundary, before validation. */
export function inputSchema(schema: z.ZodType, scene?: TypeSchemaScene): z.ZodType {
  return deriveSchema(schema, scene, 'execute');
}

/** Describe accepted transport input without running parsers, defaults or effects. */
export function inputSchemaTransport(schema: z.ZodType, scene?: TypeSchemaScene): z.ZodType {
  return deriveSchema(schema, scene, 'transport');
}

function deriveSchema(
  schema: z.ZodType,
  inheritedScene: TypeSchemaScene | undefined,
  purpose: Purpose,
): z.ZodType {
  const scene = getMetadata(schema).rest?.schemaScene ?? inheritedScene;
  return getDerived(schema, scene, purpose);
}

// A wrapper and its inner parser share the wrapper's effective scene. An object
// instead selects each child's admission with its own scene; the child's scene
// only takes over when deriving that child's descendants.
function getDerived(
  schema: z.ZodType,
  scene: TypeSchemaScene | undefined,
  purpose: Purpose,
): z.ZodType {
  const cacheKey = `${purpose}:${scene ?? ''}`;
  let variants = schemaCache.get(schema);
  if (!variants) {
    variants = new Map();
    schemaCache.set(schema, variants);
  }
  const cached = variants.get(cacheKey);
  if (cached) return cached;

  const def: any = schema._zod.def;
  // Copy descriptors so object shape and default getters remain deferred.
  const nextDef = Object.defineProperties({}, Object.getOwnPropertyDescriptors(def)) as any;
  const child = (item: z.ZodType) => deriveSchema(item, scene, purpose);
  let readonlyKeys: Set<string> | undefined;

  if (def.type === 'object') {
    let shape: Record<string, z.ZodType> | undefined;
    Object.defineProperty(nextDef, 'shape', {
      configurable: true,
      get() {
        if (shape) return shape;
        shape = {};
        readonlyKeys = new Set();
        for (const [key, field] of Object.entries(def.shape as Record<string, z.ZodType>)) {
          const metadata = getFieldMetadata(field, scene);
          if (resolveRest(metadata.rest, scene).readonly === true) {
            readonlyKeys.add(key);
            if (purpose === 'transport') shape[key] = readonlySlot(field, metadata);
          } else {
            shape[key] = getDerived(field, metadata.rest?.schemaScene ?? scene, purpose);
          }
        }
        return shape;
      },
    });
    if (def.catchall) nextDef.catchall = child(def.catchall);
  } else if (def.type === 'lazy') {
    let target: z.ZodType | undefined;
    nextDef.getter = () => {
      if (target) return target;
      const originalTarget = resolveLazy(schema);
      const targetScene = scene ?? getMetadata(originalTarget).rest?.schemaScene;
      return (target = getDerived(originalTarget, targetScene, purpose));
    };
  } else if (def.type === 'pipe') {
    // Preprocessing consumes raw input before the downstream schema boundary.
    // An ordinary output pipe consumes trusted output, not fresh caller input.
    const preprocess = def.in._zod.def.type === 'transform';
    nextDef.in = preprocess && purpose === 'execute' ? def.in : getDerived(def.in, scene, purpose);
    nextDef.out =
      preprocess || purpose === 'transport' ? getDerived(def.out, scene, purpose) : def.out;
  } else if (def.innerType) {
    // Includes optional/nullable/default/prefault/readonly/nonoptional and catch.
    nextDef.innerType = getDerived(def.innerType, scene, purpose);
  } else if (def.type === 'array') {
    nextDef.element = child(def.element);
  } else if (def.type === 'record') {
    nextDef.keyType = child(def.keyType);
    nextDef.valueType = child(def.valueType);
  } else if (def.type === 'tuple') {
    nextDef.items = def.items.map(child);
    if (def.rest) nextDef.rest = child(def.rest);
  } else if (def.type === 'union') {
    nextDef.options = def.options.map(child);
  } else if (def.type === 'intersection') {
    nextDef.left = child(def.left);
    nextDef.right = child(def.right);
  }

  const cloned = copyMetadata(schema, schema.clone(nextDef));
  let derived = cloned;
  if (def.type === 'object' && purpose === 'execute') {
    derived = copyMetadata(
      schema,
      z.preprocess(value => {
        // Resolve only this shape. Nested preprocessors must see their original
        // inputs, and neither discarded fields nor unknown keys are traversed.
        void nextDef.shape;
        if (
          !readonlyKeys?.size ||
          value === null ||
          typeof value !== 'object' ||
          Array.isArray(value)
        ) {
          return value;
        }
        const result: Record<string, unknown> = {};
        for (const key of Object.keys(value)) {
          if (!readonlyKeys.has(key)) {
            Object.defineProperty(result, key, {
              value: (value as Record<string, unknown>)[key],
              enumerable: true,
              configurable: true,
              writable: true,
            });
          }
        }
        return result;
      }, cloned),
    );
    // Zod dispatches discriminated unions using the input parser's propValues.
    // The preprocessor changes admission, not the remaining discriminator values.
    Object.defineProperty(derived._zod, 'propValues', {
      get: () => cloned._zod.propValues,
    });
  }
  // Store the final parser, never the intermediate object behind a preprocessor.
  // Shapes and lazy getters are still deferred, including recursive references.
  variants.set(cacheKey, derived);
  return derived;
}

function copyMetadata(
  original: z.ZodType,
  derived: z.ZodType,
  metadata = getMetadata(original),
): z.ZodType {
  const internal = ZodMetadata.getInternalMetadata(original);
  Metadata.setMetadataInRegistry(derived, {
    ...metadata,
    _internal: {
      ...internal,
      // Replace existing reference identities, but keep originally inline schemas
      // inline: query predicates and transport leaves depend on their direct shape.
      // Public .meta({ id }) cannot override an inherited adapter refId.
      refId: internal?.refId ? `inputSchema_${++nextRefId}` : undefined,
      extendedFrom: undefined,
    },
  });
  return derived;
}

function readonlySlot(original: z.ZodType, metadata: SchemaMetadata): z.ZodType {
  // Keep descriptions and UI metadata, not the discarded validator's type,
  // requiredness, default or constraints (including manually supplied OpenAPI).
  const descriptive: SchemaMetadata = {};
  for (const key of [
    'title',
    'description',
    'example',
    'examples',
    'deprecated',
    'readOnly',
    'writeOnly',
    'externalDocs',
    'rest',
  ]) {
    if (key in metadata) descriptive[key] = metadata[key];
  }
  for (const key of Object.keys(metadata)) {
    if (key.startsWith('x-')) descriptive[key] = metadata[key];
  }
  return copyMetadata(original, z.unknown().optional(), descriptive);
}

function getMetadata(schema: z.ZodType): SchemaMetadata {
  const def: any = schema._zod.def;
  const { _internal, ...own } = Metadata.getMetadataFromRegistry(schema) ?? {};
  // The adapter's normal chained lookup omits catch. Follow the same input-side
  // boundaries explicitly, without resolving lazy getters or executing schemas.
  const inner =
    def.innerType ??
    (def.type === 'pipe' ? (def.in._zod.def.type === 'transform' ? def.out : def.in) : undefined);
  return inner ? { ...getMetadata(inner), ...own } : own;
}

function resolveLazy(schema: z.ZodType): z.ZodType {
  let target = lazyTargets.get(schema);
  if (!target) {
    target = (schema as z.ZodLazy).def.getter() as z.ZodType;
    lazyTargets.set(schema, target);
  }
  return target;
}

function getFieldMetadata(
  schema: z.ZodType,
  scene: TypeSchemaScene | undefined,
  seen = new Set<z.ZodType>(),
): SchemaMetadata {
  const metadata = getMetadata(schema);
  // Explicit admission metadata is enough: do not invoke a discarded lazy
  // getter. Framework $schemaLazy can instead attach metadata to its target;
  // inspect that target only at the containing object's deferred shape boundary.
  if (resolveRest(metadata.rest, scene).readonly !== undefined || seen.has(schema)) return metadata;
  seen.add(schema);
  const def: any = schema._zod.def;
  const inner =
    def.type === 'lazy'
      ? resolveLazy(schema)
      : (def.innerType ??
        (def.type === 'pipe'
          ? def.in._zod.def.type === 'transform'
            ? def.out
            : def.in
          : undefined));
  return inner ? { ...getFieldMetadata(inner, scene, seen), ...metadata } : metadata;
}

function resolveRest(
  rest: ISchemaObjectExtensionFieldRest | undefined,
  scene: TypeSchemaScene | undefined,
): ISchemaObjectExtensionFieldRest {
  if (!rest) return {};
  const result = { ...rest };
  if (scene && ['form-view', 'form-create', 'filter'].includes(scene) && rest.form) {
    Object.assign(result, rest.form);
  }
  if (scene && rest[scene]) Object.assign(result, rest[scene]);
  return result;
}
