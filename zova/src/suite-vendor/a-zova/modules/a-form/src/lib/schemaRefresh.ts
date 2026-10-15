export interface ISchemaRefreshField {
  raw: string;
  compatible: string;
  eligible: boolean;
}

export interface ISchemaRefreshContract {
  ready: boolean;
  validation?: string;
  validationRaw?: string;
  fields: Record<string, ISchemaRefreshField>;
  behavior?: string;
  behaviorRaw?: string;
}

export interface ISchemaRefreshContext {
  locale: string;
  identity: string | undefined;
  epoch: number;
  scene: string;
  contract: ISchemaRefreshContract;
  configuration: string;
  enabled: boolean;
  eligible: boolean;
}

export interface ISchemaRefreshResult {
  changed: boolean;
  preserve: boolean;
}

const schemaMaps = new Set([
  'properties',
  'patternProperties',
  '$defs',
  'definitions',
  'dependentSchemas',
]);
const schemaArrays = new Set(['allOf', 'anyOf', 'oneOf', 'prefixItems']);
const schemaSingles = new Set([
  'items',
  'additionalItems',
  'additionalProperties',
  'unevaluatedItems',
  'unevaluatedProperties',
  'contains',
  'propertyNames',
  'not',
  'if',
  'then',
  'else',
  'contentSchema',
]);
const restScenes = new Set(['table', 'form', 'form-view', 'form-create', 'filter']);
const restKeys = new Set([
  'schemaScene',
  'fieldSource',
  'visible',
  'disableNotifyChanged',
  'readonly',
  'required',
  'draft',
  'order',
  'align',
  'width',
  'fixed',
  'enableSorting',
  'sortDescFirst',
  'render',
  'options',
  'class',
  'style',
  'placeholder',
  'blocks',
  'columnProps',
]);
const renderProps = new Set([
  'items',
  'placeholder',
  'readonly',
  'required',
  'name',
  'type',
  'options',
  'class',
  'style',
  'relationName',
  'imageScene',
  'enableCrop',
  'cropAspectRatio',
  'resize',
  'itemValue',
  'itemTitle',
]);
const unsafeKeys = new Set(['__proto__', 'prototype', 'constructor']);
const opaqueSnapshots = new WeakSet<object>();
const opaqueIds = new WeakMap<object, number>();
const symbolIds = new Map<symbol, number>();
let nextOpaqueId = 0;

function opaqueId(value: object): number {
  let id = opaqueIds.get(value);
  if (id === undefined) opaqueIds.set(value, (id = ++nextOpaqueId));
  return id;
}

/** Stable configuration signature without invoking getters or retaining caller values. */
export function schemaRefreshFingerprint(value: unknown): string {
  function encode(item: unknown, ancestors = new Set<object>()): unknown {
    if (typeof item === 'symbol') {
      let id = symbolIds.get(item);
      if (id === undefined) symbolIds.set(item, (id = ++nextOpaqueId));
      return ['symbol', id];
    }
    if (typeof item === 'function') return ['opaque', opaqueId(item)];
    if (typeof item === 'bigint') return ['bigint', String(item)];
    if (typeof item === 'number' && !Number.isFinite(item)) return ['number', String(item)];
    if (item === null || typeof item !== 'object') return data(item);
    if (ancestors.has(item)) return ['cycle', opaqueId(item)];
    if (!Array.isArray(item) && !isRecord(item)) return ['opaque', opaqueId(item)];
    const next = new Set(ancestors).add(item);
    const descriptors = Object.getOwnPropertyDescriptors(item);
    return [
      Array.isArray(item) ? 'array' : 'object',
      Object.keys(descriptors)
        .sort()
        .map(key => {
          const descriptor = descriptors[key];
          return [
            key,
            descriptor.enumerable,
            'value' in descriptor
              ? encode(descriptor.value, next)
              : [
                  'accessor',
                  descriptor.get && opaqueId(descriptor.get),
                  descriptor.set && opaqueId(descriptor.set),
                ],
          ];
        }),
      Object.getOwnPropertySymbols(item).map(key => [
        encode(key),
        encode(Object.getOwnPropertyDescriptor(item, key)?.value, next),
      ]),
    ];
  }
  return JSON.stringify(encode(value));
}

class UnresolvedSchemaError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

// Reject opaque runtime values instead of letting JSON.stringify silently discard them.
function snapshot(value: unknown, ancestors = new Set<object>()): unknown {
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'function') {
    const marker = { $opaqueRuntime: opaqueId(value) };
    opaqueSnapshots.add(marker);
    return marker;
  }
  if (typeof value !== 'object' || ancestors.has(value)) throw new Error('Opaque metadata');
  if (!Array.isArray(value) && !isRecord(value)) throw new Error('Opaque metadata');
  if (Object.getOwnPropertySymbols(value).length) throw new Error('Opaque metadata');
  const next = new Set(ancestors).add(value);
  const descriptors = Object.getOwnPropertyDescriptors(value);
  if (Array.isArray(value)) {
    if (Object.keys(descriptors).length !== value.length + 1) throw new Error('Opaque array');
    return Array.from({ length: value.length }, (_, index) => {
      const descriptor = descriptors[index];
      if (!descriptor || !descriptor.enumerable || !('value' in descriptor))
        throw new Error('Opaque array');
      return snapshot(descriptor.value, next);
    });
  }
  const result: Record<string, unknown> = Object.create(null);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (!descriptor.enumerable || !('value' in descriptor)) throw new Error('Opaque metadata');
    result[key] = snapshot(descriptor.value, next);
  }
  return result;
}

// Tagged JSON keeps undefined distinct from missing, null, and literal marker strings.
function data(value: unknown): unknown {
  if (value === undefined) return ['undefined'];
  if (value === null) return ['null'];
  if (typeof value === 'number') return ['number', Object.is(value, -0) ? '-0' : value];
  if (typeof value === 'string' || typeof value === 'boolean') return [typeof value, value];
  if (Array.isArray(value)) return ['array', value.map(data)];
  if (isRecord(value)) {
    return [
      'object',
      Object.keys(value)
        .sort()
        .map(key => [key, data(value[key])]),
    ];
  }
  throw new Error('Opaque metadata');
}

function containsOpaque(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  if (opaqueSnapshots.has(value)) return true;
  return Array.isArray(value)
    ? value.some(containsOpaque)
    : isRecord(value) && Object.values(value).some(containsOpaque);
}

function opaqueBehavior(value: unknown): boolean {
  if (typeof value === 'string') return value.startsWith('cel://');
  if (Array.isArray(value)) return value.some(opaqueBehavior);
  if (!isRecord(value)) return false;
  return Object.entries(value).some(
    ([key, item]) =>
      (key === '$$typeof'
        ? ![
            'zova-jsx:component',
            'zova-jsx:block',
            'zova-jsx:actionRow',
            'zova-jsx:actionBulk',
          ].includes(String(item))
        : /^(?:on[A-Z]|effect|evaluate|expression|command|behavior|validator|slot|v-|\$)/i.test(
            key,
          )) || opaqueBehavior(item),
  );
}

const blockOptions: Record<string, string[]> = {
  'basic-pageentry:blockPageEntry': [
    'blocks',
    'resource',
    'id',
    'formScene',
    'pageTitleKey',
    'draft',
  ],
  'basic-pageentry:blockForm': ['blocks'],
  'basic-form:blockFormLayout': ['formLayout'],
  'basic-pageentry:blockToolbarRow': ['actions'],
};

function safeLayoutNode(value: unknown): boolean {
  if (!isRecord(value) || typeof value.type !== 'string') return false;
  const keys: Record<string, string[]> = {
    tabs: ['type', 'id', 'children'],
    tab: ['type', 'id', 'title', 'children'],
    group: ['type', 'id', 'title', 'description', 'children'],
    section: ['type', 'id', 'title', 'description', 'layout', 'columns', 'children'],
    field: ['type', 'name', 'span'],
  };
  const allowed = keys[value.type];
  if (!allowed || Object.keys(value).some(key => !allowed.includes(key))) return false;
  if (value.title !== undefined && typeof value.title !== 'string') return false;
  if (value.type === 'field') return safeName(value.name);
  return Array.isArray(value.children) && value.children.every(safeLayoutNode);
}

function safeLayout(value: unknown): boolean {
  return (
    isRecord(value) &&
    Object.keys(value).every(key => key === 'children') &&
    Array.isArray(value.children) &&
    value.children.every(safeLayoutNode)
  );
}

function safeActions(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(action => {
      if (!isRecord(action) || typeof action.render !== 'string') return false;
      if (Object.keys(action).some(key => !['$$typeof', 'name', 'render', 'options'].includes(key)))
        return false;
      if (action.$$typeof !== undefined && action.$$typeof !== 'zova-jsx:actionRow') return false;
      return (
        action.options === undefined ||
        (isRecord(action.options) &&
          Object.keys(action.options).every(key => ['permission', 'class', 'style'].includes(key)))
      );
    })
  );
}

function safeBlocks(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(block => {
      if (!isRecord(block) || typeof block.render !== 'string') return false;
      if (Object.keys(block).some(key => !['$$typeof', 'render', 'options'].includes(key)))
        return false;
      if (block.$$typeof !== undefined && block.$$typeof !== 'zova-jsx:block') return false;
      const allowed = blockOptions[block.render];
      if (!allowed) return false;
      if (block.options === undefined) return true;
      if (!isRecord(block.options)) return false;
      return Object.entries(block.options).every(([key, item]) => {
        if (!allowed.includes(key) && !['class', 'style'].includes(key)) return false;
        if (key === 'blocks') return safeBlocks(item);
        if (key === 'formLayout') return safeLayout(item);
        if (key === 'actions') return safeActions(item);
        return true;
      });
    })
  );
}

// Only Basic's declared layout grammar owns these title strings. Rest data/options,
// action metadata, descriptions, field names, and unknown structures stay strict.
function normalizeLayoutNode(value: unknown): unknown {
  if (!isRecord(value)) return value;
  const result: Record<string, unknown> = { ...value };
  if (['tab', 'group', 'section'].includes(String(value.type)) && typeof value.title === 'string')
    result.title = '';
  if (Array.isArray(value.children)) result.children = value.children.map(normalizeLayoutNode);
  return result;
}

function normalizeBlocks(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.map(block => {
    if (!isRecord(block) || !isRecord(block.options)) return block;
    const options = { ...block.options };
    if (Object.hasOwn(options, 'blocks')) options.blocks = normalizeBlocks(options.blocks);
    if (block.render === 'basic-form:blockFormLayout' && safeLayout(options.formLayout)) {
      const layout = options.formLayout as Record<string, unknown>;
      options.formLayout = { children: (layout.children as unknown[]).map(normalizeLayoutNode) };
    }
    return { ...block, options };
  });
}

function normalizeAncestorRest(value: unknown): unknown {
  if (!isRecord(value)) return value;
  const result = { ...value };
  for (const [key, item] of Object.entries(value)) {
    if (key === 'blocks' && safeBlocks(item)) result[key] = normalizeBlocks(item);
    else if (restScenes.has(key)) result[key] = normalizeAncestorRest(item);
  }
  return result;
}

function safeRest(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (!isRecord(value) || opaqueBehavior(value)) return false;
  return Object.entries(value).every(([key, item]) => {
    if (restScenes.has(key)) return safeRest(item);
    if (!restKeys.has(key)) return false;
    if (item === undefined || item === null) return true;
    if (
      [
        'visible',
        'disableNotifyChanged',
        'readonly',
        'required',
        'draft',
        'enableSorting',
        'sortDescFirst',
      ].includes(key)
    ) {
      return typeof item === 'boolean';
    }
    if (['order', 'width'].includes(key)) return typeof item === 'number';
    if (['schemaScene', 'fieldSource', 'align', 'fixed', 'placeholder', 'class'].includes(key))
      return typeof item === 'string';
    if (key === 'style') return isRecord(item);
    if (key === 'blocks') return safeBlocks(item);
    if (key === 'options' || key === 'columnProps')
      return isRecord(item) && Object.keys(item).every(part => renderProps.has(part));
    if (key !== 'render' || typeof item === 'string') return true;
    if (!isRecord(item) || typeof item.type !== 'string') return false;
    if (
      Object.keys(item).some(
        part => !['$$typeof', 'type', 'props', 'key', 'children'].includes(part),
      )
    ) {
      return false;
    }
    return (
      item.props === undefined ||
      (isRecord(item.props) && Object.keys(item.props).every(part => renderProps.has(part)))
    );
  });
}

function safeName(value: unknown): value is string {
  return (
    typeof value === 'string' && value.split('.').every(part => !!part && !unsafeKeys.has(part))
  );
}

/** Compile detached comparison facts from schema truth and SDK-canonical effective fields. */
export function createSchemaRefreshContract(
  schema: unknown,
  properties: readonly unknown[] | undefined,
  resolveSchema: (ref: string) => unknown,
): ISchemaRefreshContract {
  if (schema === undefined || schema === null || properties === undefined)
    return { ready: false, fields: {} };
  const resolvedInputs = new Map<string, unknown>();
  try {
    const root = snapshot(schema);
    const effective = snapshot(properties);
    if (!isRecord(root) || !Array.isArray(effective)) throw new Error('Schema unavailable');
    const targets = new Map<string, unknown>();
    let eligible = true;
    const ancestorsRest: unknown[] = [];
    const ancestorsRestRaw: unknown[] = [];
    const detailNames = new Set<string>();
    for (const property of effective) {
      if (!isRecord(property) || !isRecord(property.rest)) continue;
      const rest = property.rest;
      const form = isRecord(rest.form) ? rest.form : undefined;
      const render = rest.render ?? form?.render;
      const renderType = isRecord(render) ? render.type : render;
      if (renderType !== 'basic-details:formFieldDetails') continue;
      for (const name of [
        property.key,
        property.schemaKey,
        ...(Array.isArray(property.schemaKeys) ? property.schemaKeys : []),
      ]) {
        if (typeof name === 'string') detailNames.add(name);
      }
    }
    // Basic Details resolves its row schema through the exact hidden `_name` auxiliary.
    // It belongs to that nested form, not to an unrelated parent field's behavior scope.
    const auxiliaryDetails = new Set<string>();
    for (const property of effective) {
      if (
        !isRecord(property) ||
        typeof property.key !== 'string' ||
        !property.key.startsWith('_') ||
        !detailNames.has(property.key.slice(1)) ||
        !isRecord(property.rest) ||
        property.rest.visible !== false ||
        !(
          property.type === 'array' ||
          (Array.isArray(property.type) &&
            property.type.length === 2 &&
            property.type.includes('array') &&
            property.type.includes('null'))
        ) ||
        !isRecord(property.items) ||
        typeof property.items.$ref !== 'string'
      ) {
        continue;
      }
      auxiliaryDetails.add(property.key);
    }
    for (const name of auxiliaryDetails) detailNames.add(name);
    let localEligible = true;

    function insideDetails(path: string[]): boolean {
      return path[0] === 'fields'
        ? detailNames.has(path[1]) &&
            path
              .slice(2)
              .some(
                part => schemaMaps.has(part) || schemaSingles.has(part) || schemaArrays.has(part),
              )
        : path[0] === 'properties' &&
            detailNames.has(path[1]) &&
            path
              .slice(2)
              .some(
                part => schemaMaps.has(part) || schemaSingles.has(part) || schemaArrays.has(part),
              );
    }

    function target(ref: string): unknown {
      if (targets.has(ref)) return targets.get(ref);
      let resolved = resolveSchema(ref);
      if (resolved === undefined && ref.startsWith('#/')) {
        resolved = root;
        for (const part of ref.slice(2).split('/')) {
          const key = decodeURIComponent(part).replace(/~1/g, '/').replace(/~0/g, '~');
          resolved = isRecord(resolved) && Object.hasOwn(resolved, key) ? resolved[key] : undefined;
        }
      }
      if (resolved === undefined) throw new UnresolvedSchemaError('Unresolved reference');
      resolvedInputs.set(ref, resolved);
      const detached = snapshot(resolved);
      targets.set(ref, detached);
      return detached;
    }

    function project(
      node: unknown,
      normalized: boolean,
      includeRest: boolean,
      refs = new Set<string>(),
      path: string[] = [],
      collect = false,
    ): unknown {
      if (typeof node === 'boolean') return ['schema', data(node)];
      if (!isRecord(node)) throw new Error('Invalid schema node');
      if (collect && Object.hasOwn(node, 'rest')) {
        const safe = safeRest(node.rest);
        if (insideDetails(path)) {
          if (path[0] === 'fields') localEligible &&= safe;
        } else {
          eligible &&= safe;
        }
        // Known details fields own a nested form; their descendants cannot mutate siblings.
        if (
          !insideDetails(path) &&
          (path.length === 0 ||
            (path[0] !== 'fields' &&
              [
                'properties',
                'patternProperties',
                'items',
                'prefixItems',
                'additionalProperties',
              ].some(key => Object.hasOwn(node, key))))
        ) {
          ancestorsRestRaw.push([path, data(node.rest)]);
          ancestorsRest.push([path, data(normalizeAncestorRest(node.rest))]);
        }
      }
      const entries: unknown[] = [];
      for (const key of Object.keys(node).sort()) {
        const value = node[key];
        if (key === 'rest' && !includeRest) continue;
        let projected: unknown;
        if (key === '$ref') {
          if (typeof value !== 'string' || refs.has(value)) throw new Error('Cyclic reference');
          projected = [
            'reference',
            value,
            project(
              target(value),
              normalized,
              includeRest,
              new Set(refs).add(value),
              [...path, key],
              collect,
            ),
          ];
        } else if (
          normalized &&
          (key === 'title' || key === 'description') &&
          typeof value === 'string'
        ) {
          projected = ['display'];
        } else if (normalized && key === 'errorMessage' && isRecord(value)) {
          projected = [
            'messages',
            Object.keys(value)
              .sort()
              .map(part => [
                part,
                typeof value[part] === 'string' ? ['display'] : data(value[part]),
              ]),
          ];
        } else if (schemaMaps.has(key)) {
          if (!isRecord(value)) throw new Error('Invalid schema map');
          projected = [
            'map',
            Object.keys(value)
              .sort()
              .map(part => [
                part,
                project(value[part], normalized, includeRest, refs, [...path, key, part], collect),
              ]),
          ];
        } else if (schemaArrays.has(key) || (key === 'items' && Array.isArray(value))) {
          if (!Array.isArray(value)) throw new Error('Invalid schema array');
          projected = [
            'schemas',
            value.map((item, index) =>
              project(item, normalized, includeRest, refs, [...path, key, String(index)], collect),
            ),
          ];
        } else if (schemaSingles.has(key)) {
          projected = project(value, normalized, includeRest, refs, [...path, key], collect);
        } else if (key === 'dependencies') {
          if (!isRecord(value)) throw new Error('Invalid dependencies');
          projected = [
            'dependencies',
            Object.keys(value)
              .sort()
              .map(part => [
                part,
                Array.isArray(value[part])
                  ? data(value[part])
                  : project(
                      value[part],
                      normalized,
                      includeRest,
                      refs,
                      [...path, key, part],
                      collect,
                    ),
              ]),
          ];
        } else {
          if (collect && key !== 'rest' && containsOpaque(value)) {
            if (insideDetails(path)) {
              if (path[0] === 'fields') localEligible = false;
            } else {
              eligible = false;
            }
          }
          projected = data(value);
        }
        entries.push([key, projected]);
      }
      return ['schema', entries];
    }

    const validationRaw = JSON.stringify(project(root, false, false, new Set(), [], true));
    const validation = JSON.stringify(project(root, true, false));
    const fields: Record<string, ISchemaRefreshField> = {};
    for (const property of effective) {
      if (!isRecord(property) || !safeName(property.key) || Object.hasOwn(fields, property.key))
        throw new Error('Invalid canonical field');
      if (
        (property.schemaKey !== undefined && !safeName(property.schemaKey)) ||
        (property.schemaKeys !== undefined &&
          (!Array.isArray(property.schemaKeys) || !property.schemaKeys.every(safeName)))
      ) {
        throw new Error('Invalid field alias');
      }
      localEligible = true;
      const raw = JSON.stringify(
        project(property, false, true, new Set(), ['fields', property.key], true),
      );
      const compatible = JSON.stringify(project(property, true, true));
      fields[property.key] = { raw, compatible, eligible: localEligible };
    }
    for (const field of Object.values(fields)) field.eligible &&= eligible;
    return {
      ready: true,
      validation,
      validationRaw,
      fields,
      behavior: JSON.stringify([eligible, ancestorsRest]),
      behaviorRaw: JSON.stringify([eligible, ancestorsRestRaw]),
    };
  } catch (error) {
    if (error instanceof UnresolvedSchemaError) return { ready: false, fields: {} };
    // Unsupported metadata remains observable, but can never authorize state replay.
    const raw = schemaRefreshFingerprint([schema, [...resolvedInputs.entries()]]);
    const fields: Record<string, ISchemaRefreshField> = {};
    if (Array.isArray(properties)) {
      for (const property of properties) {
        if (!isRecord(property)) continue;
        const descriptor = Object.getOwnPropertyDescriptor(property, 'key');
        if (!descriptor || !('value' in descriptor) || !safeName(descriptor.value)) continue;
        const fieldRaw = schemaRefreshFingerprint(property);
        fields[descriptor.value] = { raw: fieldRaw, compatible: fieldRaw, eligible: false };
      }
    }
    return { ready: true, validation: raw, validationRaw: raw, fields, behavior: raw };
  }
}

interface ISchemaRefreshFacts extends Omit<ISchemaRefreshContext, 'contract'> {
  validation: string | undefined;
  validationRaw: string | undefined;
  behavior: string | undefined;
  behaviorRaw: string | undefined;
  fieldRaw: string | undefined;
  fieldCompatible: string | undefined;
  fieldEligible: boolean;
}

/** Owns comparison facts only, never form values, errors, or schema facade references. */
export class SchemaRefreshTracker {
  private readonly facts = new Map<string, ISchemaRefreshFacts>();

  has(name: string): boolean {
    return this.facts.has(name);
  }

  clear(): void {
    this.facts.clear();
  }

  prune(contract: ISchemaRefreshContract): void {
    if (!contract.ready) return;
    for (const [name, facts] of this.facts) {
      if (facts.fieldRaw !== undefined && !Object.hasOwn(contract.fields, name))
        this.facts.delete(name);
    }
  }

  consume(name: string, context: ISchemaRefreshContext): ISchemaRefreshResult {
    if (!context.contract.ready) return { changed: false, preserve: false };
    const { contract, ...scope } = context;
    const field = contract.fields[name];
    const next: ISchemaRefreshFacts = {
      ...scope,
      validation: contract.validation,
      validationRaw: contract.validationRaw ?? contract.validation,
      behavior: contract.behavior,
      behaviorRaw: contract.behaviorRaw ?? contract.behavior,
      fieldRaw: field?.raw,
      fieldCompatible: field?.compatible,
      fieldEligible: field?.eligible === true,
    };
    const previous = this.facts.get(name);
    this.facts.set(name, next);
    if (!previous) return { changed: false, preserve: false };
    const changed = (
      [
        'locale',
        'identity',
        'scene',
        'configuration',
        'enabled',
        'eligible',
        'validationRaw',
        'behaviorRaw',
        'fieldRaw',
        'fieldEligible',
      ] as const
    ).some(key => previous[key] !== next[key]);
    const preserve =
      changed &&
      previous.locale !== next.locale &&
      next.identity !== undefined &&
      previous.identity === next.identity &&
      previous.epoch === next.epoch &&
      previous.scene === next.scene &&
      previous.configuration === next.configuration &&
      previous.enabled &&
      next.enabled &&
      previous.eligible &&
      next.eligible &&
      previous.fieldEligible &&
      next.fieldEligible &&
      previous.validation === next.validation &&
      previous.behavior === next.behavior &&
      previous.fieldCompatible === next.fieldCompatible;
    return { changed, preserve };
  }
}
