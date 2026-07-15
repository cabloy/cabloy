# ADR 0008: Role Localization Seed and Display Contract

## Status

Accepted.

## Background

`homeRole.name` stores stable authorization identifiers, including `registeredUser` and `systemAdmin`. Permission checks, Passport helpers, Site admission, and SSR menu policies compare those identifiers directly. They cannot vary by request locale.

Roles still need display text for eventual role-management and user-interface consumers. Built-in roles also need an application-level configuration surface so deployments can extend or override their clean-install seed data.

## Decision

### Separate authorization codes from display metadata

Every role persists these independent values:

- `name`: stable, locale-neutral authorization code;
- `title`: required display title in the configured system default locale;
- `locales`: optional JSON map of non-default locale overrides; and
- `siteIds`: authorization policy data.

`title` is not duplicated in `locales`. A consumer that needs a display label selects:

```ts
role.locales?.[effectiveLocale] ?? role.title;
```

Database title values are final text, not compiled `$locale(...)` resource keys. `$locale(...)` remains for source-owned UI and schema metadata.

### Configure built-in roles as a keyed module map

`home-user/src/config/roles.ts` exports the default built-in roles. `home-user` module configuration exposes them through `builtinRoles`, keyed by the stable role name:

```ts
builtinRoles: {
  registeredUser: {
    title: 'Registered User',
    locales: { 'zh-cn': '注册用户' },
    siteIds: ['web'],
  },
}
```

Module configuration uses its existing deep-merge behavior. A deployment may add a role key or override individual fields below an existing role key through `config.modules['home-user'].builtinRoles`. The object key is always persisted as the role `name`.

### Preserve the clean version-1 installation boundary

The `homeRole` schema and seed insertion remain in `meta.version.ts` version 1. `vonaModule.fileVersion` remains `1` intentionally. Existing installations with the earlier schema are not supported by this change; no migration, backfill, legacy read fallback, or compatibility alias is provided.

Authorization continues to use only `name`, `id`, and `siteIds`. Localized titles must not be passed to role guards, menu role policies, or system-administrator checks.

### Propagate role fields through the normal forward contract loop

Passport DTOs already expose `EntityRole`, so `title` and `locales` flow through the backend OpenAPI contract into generated Zova consumers. The backend entity is the contract truth; generated metadata and frontend OpenAPI clients are regenerated rather than patched manually. The handwritten Passport development fake mirrors the new role shape.

## Alternatives Deferred

The following are intentionally not implemented yet:

- Presentation-oriented role APIs that return a server-resolved current-locale title.
- A Zova role-label helper or rendered role label: no current UI consumes role display text.
- Role-management CRUD, locale-map validation, and translation coverage/audit workflows.
- A normalized `homeRoleLocale` table. Adopt one if role translations require search, indexes, approval history, independent editing, multiple localized fields, or high-volume management.
- A generic persisted-JSON localization facility. It should be introduced only after multiple domains demonstrate the same semantics.

## Consequences

- Built-in and deployment-defined roles carry display data without weakening stable authorization semantics.
- New locales can be added to a role without a schema migration.
- Consumers have a deterministic display fallback but retain responsibility for obtaining the effective locale.
- The unchanged file version means this change is safe only for clean installations or environments that deliberately reset their database.
