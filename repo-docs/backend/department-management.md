# Department Management

Department Management maintains an instance's organizational hierarchy and its user memberships. Departments are not roles and are not tenant boundaries. They are trusted organizational facts that can later participate in Department-scoped RBAC decisions.

> <Badge type="warning" text="Start specimen" /> The examples below are grounded in Cabloy Start's `admin-department` module. The Start tree/list page is one UI implementation; the hierarchy and membership invariants are the portable operational model.

## Department and membership model

A Department represents a node in an ordered hierarchy:

| Department fact | Meaning                                                          |
| --------------- | ---------------------------------------------------------------- |
| `parentId`      | The parent organizational unit, or the root                      |
| `sortOrder`     | Order among sibling Departments                                  |
| `enabled`       | Whether the Department is active for operations and policy scope |
| `managerId`     | The user currently designated as its manager                     |

A Department membership relates one user to one Department and carries its own facts:

| Membership fact | Meaning                                          |
| --------------- | ------------------------------------------------ |
| `position`      | Membership-specific organizational position      |
| `enabled`       | Whether this membership is active                |
| `primary`       | The user's primary enabled Department membership |

A user may hold more than one Department membership. This is intentionally different from role membership: roles describe access groupings, while Departments describe organizational placement.

## Tree administration

The Start management surface supports Department CRUD, parent moves, sibling reordering, activation changes, manager assignment, and membership management.

Keep these hierarchy invariants in the service layer:

1. moving a Department must not create a cycle;
2. a move must leave sibling ordering coherent;
3. names must satisfy the configured sibling uniqueness rule;
4. operations that would leave active children or invalid organizational relationships must be rejected; and
5. tree changes must be serialized where concurrent ordering updates could conflict.

The Start service uses a lock around ordered-sibling operations and verifies ancestry before a move. A frontend tree is useful for navigation, but it must not be the only place enforcing those rules.

## Membership and manager rules

Membership administration should preserve clear, durable facts:

- a duplicate membership for the same user and Department is invalid;
- at most one **enabled** membership is primary for a user;
- a Department manager must be an enabled membership of that Department; and
- before disabling or deleting a manager's membership, assign a replacement manager or clear the manager relationship according to the operation's explicit policy.

These constraints explain why Department membership is managed as its own record rather than as an array embedded casually in a user profile.

## Relationship to RBAC

Department data becomes authorization input only when a protected action uses a Department-based scope.

```text
Department tree and enabled memberships
  → RBAC policy resolution
  → server-derived Department/user terms
  → scoped query or entry check
```

For example, [RBAC Authorization](/backend/rbac-authorization) can use the current user's enabled primary Department, all enabled Department memberships, descendants of a Department, or explicit custom Departments. The Department service must invalidate relevant policy state after topology or membership changes so future requests do not evaluate a stale organizational scope.

> [!NOTE]
> The Vona instance remains the tenancy boundary. Department hierarchy is an organizational model inside that instance; it must not be used as a substitute for cross-instance isolation.

## Source specimen

Representative Start sources:

- `vona/src/suite/cabloy-admin/modules/admin-department/src/controller/department.ts` — protected tree, membership, manager, move, reorder, and lifecycle endpoints.
- `vona/src/suite/cabloy-admin/modules/admin-department/src/service/department.ts` — hierarchy/membership validation, manager constraints, ordering, and RBAC invalidation.
- `vona/src/suite/cabloy-admin/modules/admin-department/src/entity/department.tsx` and `entity/departmentMembership.tsx` — persisted Department and membership facts.

## Common mistakes

- **Using Departments as roles.** Use [Role Management](/backend/role-management) for access-group membership.
- **Trusting a client-supplied owner or Department in a scoped API.** RBAC must derive and check authoritative values on the server.
- **Allowing a manager membership to disappear silently.** Enforce replacement/clearance rules in the mutation service.
- **Using Department hierarchy as a tenant boundary.** Vona instance scoping remains mandatory.

## Verification checklist

1. Create root and child Departments, then verify ordering and parent relationships.
2. Attempt an ancestor/descendant cycle and confirm it is rejected.
3. Create multiple memberships for a user and verify the enabled-primary invariant.
4. Attempt to disable or remove a manager's membership and confirm the configured manager safeguard applies.
5. Change a Department/membership relevant to a scoped grant, then verify the next RBAC evaluation reflects the new topology.

## Read next

- [User Management](/backend/user-management)
- [Role Management](/backend/role-management)
- [RBAC Authorization](/backend/rbac-authorization)
- [ORM Guide](/backend/orm-guide)
- [Transaction Guide](/backend/transaction-guide)
