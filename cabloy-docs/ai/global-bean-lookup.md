# Global Bean Lookup

Use this page when AI or contributors need to identify which backend shorthand a bean name refers to, or decide where to continue searching after a shorthand lookup fails.

## Why this lookup rule matters

Backend work often starts from code such as:

- `this.bean.database`
- `ctx.bean.model`
- `app.bean.xxx`

If an agent treats every bean-like class as part of one flat container, it wastes time and often inspects the wrong scene first.

The goal of this rule is to make global bean lookup fast and structurally correct:

- use `IBeanRecordGlobal` for global shorthand lookup
- use `IBeanRecordGeneral` for general full-name lookup
- use service-scene metadata and `src/service` for runtime-anchor and service lookup
- use class placement, not metadata exceptions, to keep these surfaces clean

## The three lookup surfaces

### 1. `IBeanRecordGlobal`

Use `IBeanRecordGlobal` for the **global shorthand authoring surface**.

This is the first static lookup surface when backend code references:

- `this.bean.xxx`
- `ctx.bean.xxx`
- `app.bean.xxx`

Typical source of truth:

- module `src/.metadata/index.ts`
- corresponding `src/bean` source file

Examples:

- `database`
- `model`

### 2. `IBeanRecordGeneral`

Use `IBeanRecordGeneral` for the **general full-name bean surface**.

This is the right lookup surface when code references a bean by full name, such as:

- `bean._getBean('a-orm.service.database')`
- generated general bean registrations
- scene-qualified bean identities that are not global shorthand

Do not use `IBeanRecordGeneral` as the first lookup step for shorthand expressions like `this.bean.xxx`.

### 3. Service-scene and runtime-anchor lookup

Use `src/service`, service metadata, and class-token/selector call sites for classes that are not global shorthand but still rely on container-managed behavior.

This is the right path for:

- runtime-anchor bases
- selector-based services
- class-token lookup targets
- `src/service/*_.ts` classes that should not participate in `IBeanRecordGeneral`

Examples:

- `databaseDialectBase_.ts`
- cache/summer runtime-anchor bases in `src/service`

## The default lookup workflow

When backend code references `this.bean.xxx`, `ctx.bean.xxx`, or `app.bean.xxx`, prefer this sequence:

1. check `IBeanRecordGlobal` in the relevant module `src/.metadata/index.ts`
2. map the shorthand name to the generated bean type
3. jump from the generated type to the source file in `src/bean`
4. inspect neighboring bean-scene shorthand files only if needed for context
5. only if the shorthand is not found, re-evaluate whether the target is actually:
   - a general full-name bean
   - a service-scene runtime-anchor
   - a lib/helper class

This keeps shorthand lookup fast and avoids jumping into `src/service` or `src/lib` too early.

## What to do when the shorthand is not found

If `IBeanRecordGlobal` does not contain the target name, do not assume the metadata is incomplete.

Re-check the problem category:

1. **Is the code actually using a full-name bean?**
   - then inspect `IBeanRecordGeneral`
2. **Is the target really a service-scene runtime-anchor or selector target?**
   - then inspect `src/service`, service metadata, and selector/class-token call sites
3. **Is the target only a helper or superclass chain?**
   - then inspect `src/lib`

The absence of a name from `IBeanRecordGlobal` often means the target is not a global shorthand at all.

## Relationship to class placement

This lookup rule depends on correct backend class placement.

- `src/bean` defines the global shorthand surface
- classes that should not be global shorthand belong in `src/lib` or `src/service`
- `@Virtual()` does not remove a bean-scene class from `IBeanRecordGlobal`

That means lookup quality is improved structurally by placing classes correctly, not by adding more metadata exceptions.

For placement decisions, also read [Class Placement Rule](/ai/class-placement-rule).

## Practical examples

### Example: `this.bean.database`

1. inspect the owning module `src/.metadata/index.ts`
2. find `database` in `IBeanRecordGlobal`
3. map it to the generated bean type
4. jump to the corresponding `src/bean` source file

### Example: `ctx.bean.model`

1. inspect `IBeanRecordGlobal`
2. find `model`
3. jump to the bean-scene shorthand in `src/bean/bean.model.ts`
4. continue into `src/lib` only if deeper superclass logic is needed

### Example: database dialect runtime anchor

If the target is a dialect base or class-token runtime anchor and does not appear in `IBeanRecordGlobal`, that is expected.

Continue with:

- `src/service`
- service metadata
- class-token or selector call sites

## Anti-patterns to avoid

Avoid these mistakes:

- treating `IBeanRecordGlobal` as a full container inventory
- jumping to `src/service` first when the code clearly uses `this.bean.xxx`
- assuming a missing shorthand means metadata is broken before checking whether the target is actually global
- keeping non-global classes in `src/bean` and compensating with metadata patches
- using `@Virtual()` as a shorthand-registration filter

## Related guidance

Read these pages together:

- [Class Placement Rule](/ai/class-placement-rule)
- [Repo Guidance](/ai/repo-guidance)
- [Rules and Config](/ai/rules-and-config)
- [Verification](/ai/verification)
