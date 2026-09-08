# Menu Authorization

Menu Authorization controls **navigation disclosure**: which SSR menu leaves are returned to a caller for the active site. It does not grant controller, API, page, Resource, action, or data-scope access.

> [!WARNING]
> A menu association is never an authorization grant. Keep backend guards and RBAC policy on the protected route even when the menu is visible. See [RBAC Authorization](/backend/rbac-authorization) for action/data authority and [Menu Guide](/backend/menu-guide) for the shared SSR retrieval model.

> <Badge type="warning" text="Start specimen" /> The dynamic role-menu administration examples below come from Cabloy Start's `admin-menu` module. Its SSR-site names, role editor, and refresh behavior are implementation details, not Basic UI guarantees.

## Static menu eligibility

An SSR menu item can declare `roles` metadata:

```typescript
@SsrMenu({
  item: {
    title: $locale('Operations'),
    link: 'presetResource',
    roles: ['systemAdmin'],
  },
})
```

The declaration determines whether a leaf participates in role-aware disclosure:

| `roles` declaration | Static visibility                               | Dynamic role-menu configuration                      |
| ------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| omitted             | Public to the menu audience                     | Not configurable                                     |
| `[]`                | No static role makes it visible                 | Required for role-based visibility                   |
| nonempty names      | Visible to a caller with any matching role name | Can additionally be disclosed through an association |

The `roles` declaration is server-only metadata. It is removed from the public menu DTO and is not a frontend substitute for route authorization.

## Role-to-menu associations

A persisted association identifies a configurable SSR menu leaf for a role:

```text
roleId + ssrSiteName + ssrMenuName
```

The management service must validate all three parts against live menu metadata:

- the role exists;
- the target is a real site-bound leaf, not a group; and
- the leaf declares `roles`, making it eligible for dynamic configuration.

Public leaves and structural groups are intentionally not configurable. For keyed items, the runtime derives a stable menu-leaf identity from the menu declaration and item key.

## Effective request-time visibility

At retrieval time, Cabloy prepares menu structure for the current SSR site and locale, then filters it for the caller. The effective result is additive:

```text
static role-name visibility
  OR
persisted association held by any current role
  → visible leaf in the SSR menu response
```

The system removes empty groups after leaf filtering and does not expose the private declaration metadata to the consumer.

This union is about discoverability only. It must not be confused with frontend site admission or with Vona controller policy:

```text
siteIds            → may enter a frontend site
menu authorization → may discover a navigation destination
RBAC / Passport    → may execute a backend action
RBAC data scope    → may affect this persisted row
```

## Administration workflow

Role Management is normally the operator's entry point for configuring both action policy and navigation disclosure:

```text
choose a role
  → configure RBAC grants for API/resource authority
  → configure eligible SSR menu leaves for disclosure
  → refresh affected current subjects
  → verify direct API access independently
```

> <Badge type="warning" text="Start specimen" /> Cabloy Start registers the System Management group as `start-siteadmin:systemManagement` and presents a role-menu tree editor in the role detail. These names and layout are not a cross-edition contract. The stable contract is an SSR menu group with independently authorized backend operations.

## Freshness after a menu-policy change

Start records a separate menu-visibility revision when associations change. Its frontend model invalidates role-menu state and refreshes the application when the edited role belongs to the current Passport subject.

This refresh matters because the frontend menu query is intentionally keyed by stable site/public-path/locale inputs, not by every role identity detail. It remains a UX freshness concern: route, Resource, controller, and API guards must still re-evaluate independently.

## Source specimen

Representative Start sources:

- `vona/src/suite/cabloy-admin/modules/admin-menu/src/service/roleMenu.ts` — target validation, serialized role updates, association mutation, and revision changes.
- `vona/src/suite/cabloy-admin/modules/admin-menu/src/bean/eventListener.menuVisibilityResolver.ts` — merging static visibility with current-role associations.
- `vona/src/suite/cabloy-start/modules/start-siteadmin/src/bean/ssrMenuGroup.systemManagement.ts` — Start-specific System Management group registration.
- `zova/src/suite/cabloy-admin/modules/admin-menu/src/model/roleMenu.ts` — Start client freshness behavior.

The current Start role-menu editor protects `systemAdmin` from ordinary editing. Treat that as a Start UI safeguard and resolve any edition-specific policy rule from the active implementation/specification; do not infer an implicit administrative-menu bypass.

## Common mistakes

- **Using menu visibility to secure an API.** Always use a backend Passport/RBAC guard.
- **Making public menu leaves configurable.** Only leaves that explicitly declare `roles` have dynamic role-menu eligibility.
- **Expecting menu association to admit a role to a site.** Site admission is a separate `siteIds` decision.
- **Assuming a menu refresh proves authorization.** Exercise the actual protected request and data-scope path.

## Verification checklist

1. Verify omitted, empty, and nonempty `roles` declarations produce the expected static/dynamic eligibility.
2. Associate an eligible leaf with a role and verify a current holder receives the menu after refresh.
3. Remove the association and verify the leaf disappears when no static role rule still exposes it.
4. Attempt to configure a group or public leaf and confirm server validation rejects it.
5. Attempt the destination's protected API with and without the appropriate backend grant; menu visibility must not change the result.

## Read next

- [Menu Guide](/backend/menu-guide)
- [Role Management](/backend/role-management)
- [RBAC Authorization](/backend/rbac-authorization)
- [Navigation Guards Guide](/frontend/navigation-guards-guide)
- [Admin Resource and Web Self-Service](/fullstack/admin-resource-and-web-self-service)
