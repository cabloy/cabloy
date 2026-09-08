# Role Management

Role Management defines reusable access groupings and assigns them to users. A role is the common subject for several access-related systems, but those systems remain independent:

| Role relationship      | What it controls                            | Does not control         |
| ---------------------- | ------------------------------------------- | ------------------------ |
| `siteIds`              | Admission to a frontend SSR site            | Individual API actions   |
| RBAC grants            | Backend action and data-scope authorization | Menu disclosure          |
| Role-menu associations | Navigation disclosure                       | Controller or API access |

> <Badge type="warning" text="Start specimen" /> The Cabloy Start `admin-role` module is the source specimen. Its role-detail tabs are an edition-specific UI composition; the three policy domains above are the durable model.

## Role lifecycle

The Start role controller supports role CRUD and user-role membership management. The role service validates role names and validates configured `siteIds` against enabled SSR sites.

A role should therefore be created with a clear operational purpose:

```text
Role name and title
  → eligible frontend sites
  → users who hold the role
  → action/data grants, when needed
  → navigation disclosure, when needed
```

Creating a role or assigning it to a user does not automatically create RBAC grants or menu assignments. Configure those policy domains deliberately after the role exists.

## Assign roles to users

A user can hold multiple roles. Ordinary membership replacement belongs to Role Management because it changes an access grouping, even though the affected user is visible in User Management.

The Start specimen preserves an existing `systemAdmin` membership during ordinary replacement and excludes it from the usual candidate flow. Dedicated protected operations handle system-administrator transitions instead.

> [!WARNING]
> Treat built-in and administrator roles as protected operational identities. Do not implement a generic role form that can rename or delete them, and do not make the last usable system administrator removable or disableable.

## Site admission is a coarse boundary

A role's `siteIds` determines whether a current role may enter a frontend site. It is a coarse admission check, not proof that the role may execute every action once it is inside.

```text
site admission
  → menu disclosure
  → frontend action visibility
  → backend API guard
  → data-scope enforcement
```

Each later layer remains responsible for its own decision. In particular, a role admitted to an Admin site still needs a passing backend guard for every protected request.

## Role as the configuration hub

The Start Role Resource embeds two separate editors in its entry view:

- **Resource Permissions** configures action/data policy through `admin-rbac`.
- **Menu Authorization** configures SSR navigation disclosure through `admin-menu`.

This is a useful operator workflow, but not a claim that every Cabloy edition must use the same route, tabs, component identifiers, or UI library. The important design is that the editors update different persistence and runtime-policy paths.

## Source specimen

Representative Start sources:

- `vona/src/suite/cabloy-admin/modules/admin-role/src/controller/role.ts` — protected role and membership endpoints.
- `vona/src/suite/cabloy-admin/modules/admin-role/src/service/role.ts` — name/site validation, built-in-role safeguards, membership replacement, and policy invalidation.
- `vona/src/suite/cabloy-admin/modules/admin-role/src/dto/roleView.tsx` — edition-specific composition of the two authorization editors.

Role changes that affect memberships must invalidate dependent RBAC policy state. The next request must resolve current roles and policy rather than relying on an old browser projection.

## Common mistakes

- **Using a role name as a substitute for every action grant.** Use [RBAC Authorization](/backend/rbac-authorization) for protected resource/API actions.
- **Treating menu assignment as API authorization.** A role-menu association only changes discoverability; see [Menu Authorization](/backend/menu-authorization).
- **Putting Department facts on a role.** Departments describe organizational membership and supply some RBAC scopes; see [Department Management](/backend/department-management).
- **Changing role membership from a client-only cache.** Membership mutation must pass through backend validation and invalidation.

## Verification checklist

1. Confirm built-in roles cannot be deleted or renamed.
2. Confirm only valid enabled SSR sites may be assigned to a role.
3. Assign and remove an ordinary role, then verify the user's next access evaluation uses the new membership.
4. Verify system-administrator changes use the edition's dedicated safeguards.
5. Verify RBAC and menu assignments remain separate before and after role edits.

## Read next

- [User Management](/backend/user-management)
- [RBAC Authorization](/backend/rbac-authorization)
- [Menu Authorization](/backend/menu-authorization)
- [Menu Guide](/backend/menu-guide)
- [User Access Guide](/backend/user-access-guide)
