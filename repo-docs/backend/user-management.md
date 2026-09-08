# User Management

User Management is the administrative façade for the canonical user records of an instance. It is for system operators who need to inspect and maintain accounts; it is not a second identity store, an authentication-provider guide, or a self-service registration flow.

> <Badge type="warning" text="Start specimen" /> This guide uses the Cabloy Start `admin-user` module to make the operational model concrete. An edition can compose the administration UI differently while keeping the same boundary between user facts, roles, departments, and backend authorization.

## What User Management owns

A typical administrative User Resource lets a system administrator:

- list and search user accounts;
- view profile and account state;
- update permitted profile fields;
- activate accounts;
- change account status; and
- inspect the user's role and Department memberships.

The Start controller exposes this resource surface in `vona/src/suite/cabloy-admin/modules/admin-user/src/controller/user.ts`. Its management actions are individually protected with `@Passport.systemAdmin()`:

```typescript
@Web.put('account-status/:id')
@Passport.systemAdmin()
async setAccountStatus(...) {
  return await this.scope.service.user.setAccountStatus(...);
}
```

This guard is the authority boundary. A visible Admin menu or UI action does not authorize a direct request by itself.

## User facts, role memberships, and Department memberships

A user record is one kind of fact. Role membership and Department membership are related but separate facts:

| Fact                  | Answers                                             | Owning administration flow                              |
| --------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| User profile          | Who is this account?                                | User Management                                         |
| Role membership       | Which access groups does the user hold?             | [Role Management](/backend/role-management)             |
| Department membership | Which organizational units does the user belong to? | [Department Management](/backend/department-management) |

The Start user-detail service deliberately projects all three so an operator can understand the account in one place. It does not make the User Resource the owner of every membership mutation.

A practical rule is: update account lifecycle in User Management; update an access grouping through Role Management; update organizational placement through Department Management.

## Account lifecycle safeguards

Activation and account status are different concerns. Activation is generally part of bringing a registered account into service; account status controls whether an existing account can continue to use the system.

In the Start specimen, disabling an account has operational consequences beyond changing a field:

1. the service refuses an unsafe system-administrator transition;
2. permission state is cleared; and
3. active Passport sessions for the disabled user are evicted.

This protects against a stale signed-in session continuing with an old permission projection. It also illustrates why account-status changes belong in the backend service, rather than in a frontend-only switch.

## Recommended operator workflow

```text
Find user
  → inspect account, roles, and Departments
  → update profile or account lifecycle when appropriate
  → change role memberships in Role Management
  → change organizational memberships in Department Management
  → verify the affected user's refreshed access
```

When an operator changes a current user's access-related state, the relevant client should reacquire authoritative Passport, menu, and permission data. That refresh improves UX; the backend guards still enforce every request independently.

## Boundaries to keep clear

- User Management is not an authentication-provider implementation. Read [Auth Guide](/backend/auth-guide) for sign-in providers and authentication flows.
- A user having a role does not automatically grant every API action. Action and data authorization are configured through [RBAC Authorization](/backend/rbac-authorization).
- Seeing a menu does not authorize an API request. See [Menu Authorization](/backend/menu-authorization).
- User records are scoped to the active Vona instance; do not treat an administrative view as a cross-instance lookup surface.

## Verification checklist

When implementing or adapting User Management, verify that:

1. every account-management endpoint has an explicit backend guard;
2. user detail can accurately distinguish account fields from role and Department memberships;
3. disabling a user invalidates permission/session state according to the active edition's policy;
4. protected administrator transitions cannot remove the final usable administrator; and
5. role and Department changes are made through their respective owners rather than duplicated in a user form.

## Read next

- [User Access Guide](/backend/user-access-guide)
- [Auth Guide](/backend/auth-guide)
- [Role Management](/backend/role-management)
- [Department Management](/backend/department-management)
- [RBAC Authorization](/backend/rbac-authorization)
