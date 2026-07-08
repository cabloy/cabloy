# ADR 0005: Current-Passport Guard Evaluation for Default API Permissions

## Status

Accepted and implemented.

## Background

Default API permission lookup in:

- `vona/src/suite-vendor/a-vona/modules/a-permission/src/bean/bean.permission.ts`

was previously redesigned in ADR 0002 to use conservative static projection from route metadata.

That design improved cache sharing compared with per-user default evaluation, but it still kept a second authorization model inside the permission bean:

- runtime requests used the real guard chain
- default permission lookup used a metadata interpreter

At the same time, the framework remained in an internal stage where guard surface simplification was still acceptable.

## Problem

The static projection model introduced three follow-up pressures:

1. **default permission results could diverge from runtime guard behavior**
   - runtime requests used the real current ctx and current passport
   - default permission lookup used a conservative metadata-only approximation

2. **permission logic was duplicated**
   - the permission bean had to understand built-in guard semantics itself
   - any future guard evolution would need parallel maintenance in the projection logic

3. **`@Passport.userName()` did not fit the desired cache model**
   - it was identity-based rather than role-based
   - it forced special handling in the projection path
   - it did not match the intended long-term simplification toward role-centered permission evaluation

## Decision

Default permission lookup now reuses the real guard chain for the current ctx and current passport, while still avoiding controller execution.

### 1. Keep the outer permission entry user-scoped and event-safe

`retrievePermissions(resource)` remains the outer permission entry.

It still:

- uses a user-scoped cache key
- emits the `retrievePermissions` event
- preserves safety for user-specific permission extensions

This boundary remains unchanged.

### 2. Move reusable default evaluation to the action level

Instead of caching a whole default permission object for a resource, the reusable unit is now a single action permission lookup.

The resource-level method still assembles:

- `actions[actionKey] = boolean`

but it delegates each action to a reusable action-level path.

The cache boundary is also now explicit in two layers:

- a user-scoped outer permission cache
- a role-scoped action permission cache

These use separate cache names and separate summerCache beans so capacity, TTL, and clearing strategy can be tuned independently.

### 3. Keep `public` / `activated` as a fast precheck

Before running the guard chain, default permission lookup still performs a fast precheck for:

- `public`
- `activated`

This precheck is read from route metadata and evaluated directly against the current passport state.

It remains outside the action-level cache because the cache key is intentionally centered on resource/action/roleIds rather than mixed user-state dimensions.

### 4. Reuse the real guard chain for the current ctx/passport

After the passport precheck passes, default permission lookup executes the guard chain for the target action using the current ctx and current passport.

Important boundaries:

- it executes only the guard chain
- it does not execute controller logic
- guard success maps to `true`
- returned `false` maps to `false`
- thrown `401` / `403` maps to `false`
- other errors still surface as real errors

This makes default permission results align more closely with actual runtime behavior.

### 5. Cache action permissions by resource/action/roleIds

The action-level cache key now includes:

- resource name
- action key
- sorted, deduplicated current role ids

The key intentionally does **not** include:

- authenticated flag
- activated flag

Those remain part of the fast precheck rather than the shared role-state cache.

### 6. Remove `@Passport.userName()`

`@Passport.userName()` and its guard support are removed.

Reasons:

- it is identity-based instead of role-centered
- it complicates shared action-level permission caching
- it forced special-case handling in the old projection model
- it was acceptable to remove directly during the current internal development stage

## Why this decision was chosen

### 1. It reduces divergence between permission lookup and runtime authorization

Using the real guard chain means default permission lookup follows the same current-passport evaluation path that runtime requests already use.

### 2. It removes the need for a second guard interpreter inside the permission bean

The permission bean no longer needs to manually emulate role guard behavior or maintain identity-specific projection exceptions.

### 3. It keeps caching aligned with the intended role-centered model

Resource/action/roleIds is the reusable dimension that the framework wants to share.

`public` and `activated` remain important, but they are treated as a fast current-passport gate rather than part of the shared role-state cache identity.

### 4. It simplifies the built-in guard surface

Removing `@Passport.userName()` narrows the default permission model toward:

- passport state
- role-centered guards

That is a better fit for the internal framework direction at this stage.

## Alternatives considered

### Alternative A: keep extending the static projection model

Rejected because:

- it preserves a second authorization model
- it keeps guard-specific duplication inside the permission bean
- it still needs special handling for non-role-centered guards

### Alternative B: keep resource-level default caching as the main reuse point

Rejected because:

- the reusable expensive unit is now single-action guard evaluation
- action-level caching is a better fit for the new guard-chain-based design
- keeping both layers as primary caches would add overlapping semantics without enough benefit

### Alternative C: keep `@Passport.userName()` and continue treating it specially

Rejected because:

- it does not fit the desired shared role-state cache model
- it keeps identity-based complexity in the built-in permission flow
- internal-stage cleanup made direct removal acceptable

## Consequences

### Benefits

- default permission lookup is closer to real runtime authorization
- permission logic is simpler and less duplicated
- action-level caching better matches the new evaluation unit
- user-scoped and role-scoped permission caches can now be tuned independently
- built-in permission semantics are more role-centered

### Trade-off

Default permission lookup is no longer a purely static metadata projection.

It now depends more directly on the current ctx and current passport, and built-in guard execution may perform small runtime-side behaviors that are consistent with normal request processing.

That trade-off is acceptable because closer runtime alignment is the primary goal of this redesign.

## Guidance for future work

When adding or changing built-in guards, keep these rules in mind:

1. default permission lookup should continue to reuse the real guard chain when practical
2. shared action-level permission caching should remain centered on resource/action/role-state semantics
3. user-state gates such as `public` / `activated` should stay explicit and easy to reason about
4. do not reintroduce identity-based built-in permission shortcuts unless the cache and evaluation model are deliberately redesigned for them

## Related records

- `.docs-internal/decisions/0002-guard-permission-projection.md`
- `vona/src/suite-vendor/a-vona/modules/a-permission/src/bean/bean.permission.ts`
- `vona/src/suite-vendor/a-vona/modules/a-user/src/lib/passport.ts`
