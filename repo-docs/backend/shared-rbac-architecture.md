# Shared RBAC Architecture

This guide explains the shared RBAC foundation used by Cabloy Basic and Cabloy Start: the Vona `a-rbac` runtime, its extension boundary, and the Resource permission projection consumed by Zova.

Use this page when you need to author, extend, debug, or verify RBAC across the backend/frontend boundary. For Start's operational role, grant, Department, and policy-editor workflow, read [RBAC Authorization](/backend/rbac-authorization) after this guide.

> [!WARNING]
> RBAC authority is enforced on the backend. `ModelResource.permissions`, `$passport.checkPermission(...)`, table-action visibility, and SSR-rendered capability state are browser UX projections. None of them authorize a direct API request.

## The shortest accurate mental model

```text
@Passport.rbac route metadata
  → shared a-rbac action catalog and guard
  → edition/application policy resolver
  → request-local decision and typed scope access
  → protected backend action and persisted-data checks

same composed guards
  → Resource permission projection endpoint
  → OpenAPI permission DTO
  → ModelSdk / ModelResource
  → ModelPassport / action visibility
```

The two paths intentionally share a decision source, but they have different purposes:

| Path                            | Purpose                                       | Authority         |
| ------------------------------- | --------------------------------------------- | ----------------- |
| Guard + `rbacScope`             | Admit a request and constrain persisted data  | Backend authority |
| Permission projection + matcher | Avoid offering browser actions that will fail | Frontend UX only  |

## What is shared and what is application policy

The shared `a-rbac` module does **not** prescribe a role table, grant table, Department model, Admin UI, or `systemAdmin` convention. It provides a reusable runtime contract:

- catalog protected route actions;
- run the RBAC guard and validate a decision;
- bind that decision to the current request;
- expose typed data-scope operations to controllers;
- emit resolver and invalidation events; and
- derive a minimized browser permission matcher from an allowed scope.

An edition or application supplies the policy facts and resolver. Cabloy Start's `admin-rbac` module is one specimen: it resolves roles, grants, and Department facts, persists policy revisions, and provides an administration UI. Those are Start policy choices, not requirements of `a-rbac`.

## 1. Opt in explicitly and obtain a stable action identity

A controller action participates in dynamic RBAC only when it carries `@Passport.rbac(...)` metadata:

```typescript
@Web.get()
@Passport.rbac({ dataScope: true })
async select(...) {
  // consume the scope below
}
```

The shared RBAC catalog scans registered controller routes for this explicit metadata. An ordinary route does not become a policy action merely because a Resource or frontend UI exposes it.

Each catalogued action has a stable identity:

```text
<controllerBeanFullName>#<action>
```

This identity is policy-facing. It is more stable and precise than a displayed menu item, a Resource name, or an HTTP path that might be mounted differently.

### Action inheritance

An action can inherit another action's policy inside the same controller. The catalog resolves that relationship centrally and fails closed for:

- a missing target;
- a self-reference;
- an inheritance cycle; or
- an invalid cross-controller alias.

Backend policy inheritance is not the same operation as a frontend `permissionHint.actionInherit`. The former selects the action policy guarded on the server; the latter selects an emitted action key used by a UI renderer. Keep both metadata paths aligned, but do not assume their similar names make them equivalent automatically.

**Representative shared sources**

- `vona/src/suite-vendor/a-vona/modules/a-user/src/lib/passport.ts` — `Passport.rbac(...)` guard facade.
- `vona/src/suite-vendor/a-cabloy/modules/a-rbac/src/bean/bean.rbacCatalog.ts` — route discovery, canonical keys, and inheritance validation.
- `vona/src/suite-vendor/a-cabloy/modules/a-rbac/src/lib/rbac.ts` — action-key and request-decision helpers.

## 2. Guard execution and the policy-resolver boundary

`GuardRbac` executes for a protected route. Its job is not to query a particular role/grant schema; it orchestrates a valid decision:

1. clear a prior RBAC decision from the current request context;
2. find the current route in the shared catalog;
3. merge the catalog/decorator options for that action;
4. ask the configured scope adapter whether the subject is unrestricted;
5. if not unrestricted, emit `a-rbac:resolvePolicy` for application policy code;
6. validate that the returned decision is allowed, well formed, and bound to the expected action; and
7. store only that validated decision on the current context.

The decision is request-local capability state, stored through the `SymbolRbacDecision` helpers. It is not a process-global flag, a browser claim, or reusable state for another route.

```text
GuardRbac
  → catalog action
  → unrestricted adapter branch
       or
    a-rbac:resolvePolicy listener
  → validate action-bound decision
  → set request-local decision
```

### Extension contracts

The shared event contracts make policy implementation replaceable:

| Extension point            | Shared responsibility                                                 | Application responsibility                                                      |
| -------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `a-rbac:resolvePolicy`     | Ask for a decision for a catalog action                               | Resolve roles, grants, ownership, organizational facts, or another policy model |
| Scope adapter              | Ask whether the subject is unrestricted; derive trusted create values | Define unrestricted subjects and trusted business fields                        |
| `a-rbac:policyInvalidated` | Provide a common invalidation signal                                  | Advance/clear mutable policy state and dependent caches                         |

The shared role-membership listener bridges `a-user:roleMembershipChanged` to `a-rbac:policyInvalidated`. An application that mutates additional policy facts must emit invalidation through its normal durable mutation path.

## 3. A passing guard is not complete row authorization

After guard admission, a controller must consume the current typed scope. The common injection surface is `@Arg.rbacScopeCurrent()`; framework extraction obtains `app.bean.rbacScope.current()` for the exact request action.

| Operation          | Required scope operation | Why                                                                   |
| ------------------ | ------------------------ | --------------------------------------------------------------------- |
| List/select        | `where(callerWhere)`     | Preserve the caller filter while adding server scope                  |
| View/update/delete | `checkEntry(entry)`      | Check the persisted target, not a client claim                        |
| Bulk mutation      | `checkEntries(entries)`  | Ensure every intended target is inside scope                          |
| Create             | `ownerValues()`          | Derive trusted owner/scope fields instead of accepting widening input |

For an atomic multi-ID Resource command, have the command DTO validate its request-list maximum and use `a-rbac` to validate that the list is nonempty and has no duplicate normalized identities. Then load every requested record through the ordinary instance-scoped model boundary. Require complete one-for-one resolution before calling `checkEntries(entries)` and before any mutation. This treats missing, soft-deleted, and other-instance records uniformly as absent; do not use an unscoped query merely to distinguish them. Run the full preflight and mutation inside the domain transaction.

`a-rbac` exposes `this.bean.rbacResourceBulk.entries(...)` for the reusable integrity and authorization sequence. Pass the facade a fresh, ordinary instance-scoped loader (rather than a cache-backed lookup) from the domain transaction. It preserves the requested order, invokes `checkEntries(...)` only after complete normal-scoped loading, and emits localized `a-rbac` scoped errors for invalid ID lists and absent entries.

A representative list shape is:

```typescript
@Web.get()
@Passport.rbac({ dataScope: true })
async select(@Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess) {
  return await this.scope.service.record.select({
    where: rbacScopeCurrent.where(this.ctx.request.query.where),
  });
}
```

The details vary by Resource contract, but the security rules do not:

- caller filters are structurally **ANDed** with the server predicate;
- permitted scope terms are **OR** alternatives;
- unrestricted access still keeps the ordinary caller filter; and
- missing, denied, malformed, or action-mismatched request decisions fail closed.

For create operations, never trust a browser-supplied owner or organizational field merely because the browser previously displayed a matching action. Use `ownerValues()` and validate the persisted result through the same server policy model.

**Representative shared sources**

- `vona/src/suite-vendor/a-cabloy/modules/a-rbac/src/bean/guard.rbac.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-rbac/src/bean/bean.rbacScope.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-rbac/src/types/scope.ts`
- `vona/src/suite-vendor/a-vona/modules/a-web/src/lib/decorator/arguments.ts`

## 4. Resource permission projection reuses real guards

The frontend does not receive a parallel grant database. `BeanPermission` builds a Resource permission snapshot by evaluating the real route guards for the current Passport.

The endpoint path is owned by the Home Base permission controller/service. For a Resource name, `BeanPermission`:

1. maps the Resource to its controller and cached routes;
2. omits configured ignored actions (the default excludes `select`);
3. applies the Passport admission precheck: public/authenticated, account-active, and activation state;
4. runs the registered `retrievePermissionAction` extension point;
5. evaluates the actual composed guards for the target action; and
6. returns an ordinary boolean or an RBAC projection.

### Target-route guard simulation

To evaluate a target action without executing its controller, the permission bean temporarily:

- installs the target route as `ctx.route`;
- sets `ctx.innerAccess = false`;
- clears any existing request-local RBAC decision;
- calls the real `composeGuards(...)` chain;
- converts `false`, `401`, and `403` to a denied permission; and
- restores the previous route, inner-access value, and the prior decision's own-property state in `finally`.

Unexpected errors are not silently treated as authorization outcomes; they propagate. This isolation is essential: a permission query must not leak or corrupt a decision from the surrounding request action.

### Boolean actions and RBAC actions

A permitted ordinary guarded action becomes `true`; a denied action becomes `false`. A permitted RBAC action asks the current typed scope for a browser projection:

```text
boolean
  or
{
  key: string,
  allowed: boolean,
  matcher: { mode: 'all' }
         | { mode: 'any', rules: [{ field, values }] }
}
```

`permissionProjection()` returns `all` for unrestricted or non-data-scoped access. A restricted decision becomes normalized field/value rules, such as a trusted owner field or a configured organizational field. A restricted decision with no usable matcher rules fails with `403`; it does not become a permissive empty projection.

The contract deliberately excludes routes, guard options, raw grant expressions, and policy topology. It is still authorization-derived data: treat projected field names and values as a minimized UX contract, not as information that must remain secret from the current authorized browser.

**Representative shared sources**

- `vona/src/suite-vendor/a-vona/modules/a-permission/src/bean/bean.permission.ts`
- `vona/src/suite-vendor/a-vona/modules/a-permission/src/dto/permissions.tsx`
- `vona/src/suite-vendor/a-vona/modules/a-openapi/src/types/permissions.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-rbac/src/bean/bean.rbacScope.ts`

## 5. Cache topology and server freshness

Permission projection has three distinct backend cache shapes:

| Result            | Cache identity                                            | Why                                                                |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| Resource snapshot | Resource + current user                                   | The returned action map can be user-specific                       |
| Ordinary action   | Resource + action + sorted unique role IDs                | Non-RBAC guard results can be shared by role set                   |
| RBAC action       | Resource + action + current user + sorted unique role IDs | Resolved terms can include user-specific values, such as ownership |

`BeanPermission.clearAllCaches()` clears all three permission caches. Do not collapse an RBAC result to a role-only cache: two users can hold the same roles but receive different normalized owner/scope matcher values.

Server-side invalidation must follow durable policy mutation. The shared runtime provides `a-rbac:policyInvalidated`; Start's policy listener is one specimen that advances its policy revision and schedules permission-cache clearing after database commit. A Basic/custom policy implementation must provide equivalent resolver and invalidation wiring for its own mutable facts.

> [!NOTE]
> Server invalidation refreshes **future server permission evaluations**. It is not a push channel into already-open browsers.

## 6. DTO, SDK, and Resource ownership

The permission DTO is emitted through the backend/OpenAPI contract. Generated Home API code owns the generated operation surface, while the generic Resource runtime fetches permissions through `ModelSdk.getPermissions(resource)` so every Resource can use the same infrastructure.

```text
GET /permission/:resource
  → IOpenapiPermissions
  → ModelSdk.getPermissions(resource)
  → ModelResource.permissions
  → page/action render scope
```

`ModelResource` is selector-scoped by Resource name and owns Resource bootstrap, schemas, query/mutation state, and permissions. Pages, tables, and entry toolbars consume this resource-owned reactive surface instead of creating unrelated permission requests.

Read [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern) for ModelResource ownership and reuse. This guide owns the projection producer, transport, matcher, and freshness semantics.

## 7. Frontend permission decision order

`ModelPassport.checkPermission(...)` evaluates a permission hint and Resource snapshot in this order:

1. `permissionHint.public === true` allows immediately.
2. Resolve `permissionHint.actionInherit ?? actionName`.
3. With no resolved action, permit the action-based check.
4. Nil permissions or `permissions === false` deny; `permissions === true` allows.
5. If the resolved action exists in `permissions.actions`, use that entry:
   - boolean entries are final;
   - RBAC objects go to `matchPermissionAction(...)`.
6. Only when the selected action entry is absent, try legacy `roleIds` and `roleNames` fallback.
7. Otherwise deny.

An explicit denied action therefore wins over legacy role fallback. A public/actionless hint is UI metadata, not a backend bypass: the eventual API route still runs its own Passport/RBAC guards.

### Matcher semantics

`matchPermissionAction(...)` is deliberately fail closed:

| Projection/data condition                                                 | Frontend result                           |
| ------------------------------------------------------------------------- | ----------------------------------------- |
| `allowed !== true`, missing matcher, malformed rule, or empty `any` rules | Deny                                      |
| `{ mode: 'all' }`                                                         | Allow                                     |
| Valid `any` matcher, no `currentData`                                     | Allow coarse capability/preflight         |
| One record                                                                | At least one rule must match that record  |
| Multiple records                                                          | Every record must match at least one rule |
| Empty record array                                                        | Deny                                      |

Rules compare `String(record[field])` with string values. With no row data, a valid restricted projection means “some records may support this action”; it does **not** mean the current or later selected row is known to be authorized.

This explains a normal table pattern:

```text
operations-column preflight → no row data → retain a possible action container
row render                  → actual row → hide actions outside the projected scope
```

Bulk/action implementations that want selected-record semantics must pass those records to the matcher. Current generic UI surfaces may use a coarser no-row-data visibility decision; backend `checkEntries(...)` remains the final bulk authority.

**Representative shared sources**

- `zova/src/suite/a-home/modules/home-passport/src/model/passport.ts`
- `zova/src/suite/a-home/modules/home-passport/src/lib/permissionActionMatcher.ts`
- `zova/src/suite/a-home/modules/home-passport/test/lib/permissionActionMatcher.test.ts`

## 8. SSR, hydration, and active-tab freshness

With cookie-backed server identity, Resource bootstrap can load permission state during SSR and transfer it through the query-cache hydration path. The client can start from that request-confirmed projection without an immediate duplicate server render decision.

When SSR cannot use cookies for identity, `ModelResource.permissions` intentionally remains unavailable on the server. Private action visibility must retain a neutral or fail-closed shell through hydration, then obtain the client-side authoritative projection at an explicit client boundary.

### Current freshness limitation

`ModelSdk.getPermissions(resource)` uses `staleTime: Infinity`. The current architecture does not subscribe an already-open browser tab to server-side `a-rbac:policyInvalidated`, and it has no general targeted permission-query invalidation/refetch for an already-mounted page after an administrator changes policy.

Consequences:

- a removed permission can remain visible in an open tab until an explicit refresh boundary;
- a newly granted permission can remain hidden in an open tab until that boundary; and
- neither state bypasses the next backend guard or persisted-data scope check.

Use an application-appropriate refresh, reload, relogin, or explicit query invalidation/refetch boundary after live policy changes. Do not claim that clearing backend permission caches instantly updates a hydrated frontend query.

## 9. Authoring and debugging checklist

When extending shared RBAC:

1. Decorate only actions intended for dynamic RBAC.
2. Keep catalog/policy inheritance valid and test every alias.
3. Provide an `a-rbac:resolvePolicy` listener and scope adapter for the policy facts your application owns.
4. Consume the typed scope in every protected controller operation; a passing guard alone is not enough for row security.
5. Derive create-time ownership with `ownerValues()` instead of trusting client fields.
6. Emit policy invalidation through durable mutations and clear dependent server caches after successful commit.
7. Treat matcher fields/values as a minimized browser contract, and keep browser matcher semantics aligned with backend scope semantics.
8. Test direct requests separately from menus, buttons, or permission projections.
9. Test stale-tab behavior explicitly whenever a policy change must update a live interface.

## Verification checklist

- Run the shared `a-rbac` catalog/guard and scope-current tests.
- Run permission tests that cover route substitution, request-decision restoration, cache isolation, and denied guards.
- Run frontend matcher tests for malformed projections, `all`, restricted one-row checks, and multi-row checks.
- Verify anonymous, inactive, granted, ungranted, and scoped direct API requests.
- Verify both cookie-backed and cookie-disabled SSR paths preserve a hydration-safe private-action shell.
- After a policy mutation, verify future server evaluation is fresh and explicitly verify the intended browser refresh boundary.

## Read next

- [RBAC Authorization](/backend/rbac-authorization) — Start roles, grants, five data scopes, and operational policy management.
- [Controller AOP Guide](/backend/controller-aop-guide) — route guard authoring.
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern) — Resource-owned query and permission state.
- [Permission, formScene, and Action Visibility Guide](/frontend/permission-formscene-action-visibility-guide) — entry-page scene filtering and action rendering.
- [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide) — list-page action consumers.
- [Menu Authorization](/backend/menu-authorization) — navigation disclosure, a separate policy domain.
