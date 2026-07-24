# Commerce Address Admin/Web Remediation Checklist

This planned note records the required remediation for the A-Commerce Address boundary.

Use it before changing Address controller contracts, DTOs, state owners, Admin menus, customer pages, or their generated consumers. It is derived maintainer-facing implementation guidance, not a product or system-contract authority: the [PRD](../business/a-commerce/prd.md) owns outcomes, the [SRS](../business/a-commerce/srs.md) owns the approved contract, the [PDP/WBS](../business/a-commerce/pdp-wbs.md) owns delivery, the [test plan](../business/a-commerce/test-plan.md) owns proof, and [progress](../business/a-commerce/progress.md) records derived status. The durable cross-stack rule is [Admin Resource and Web Self-Service](../../cabloy-docs/fullstack/admin-resource-and-web-self-service.md).

Traceability: `PRD-ADR-01`–`PRD-ADR-03`; `SRS-ADR-01`–`SRS-ADR-07`; `WBS-40-04`; `ATP-ADDR-01`.

## Problem recorded by the resource audit

`commerce-member:address` currently mixes an Admin Resource-shaped contract with a customer self-service implementation:

- `ControllerAddress` registers `@Resource()` and exposes the unqualified CRUD actions `create`, `select`, `view`, `update`, and `delete`.
- `ServiceAddress` derives `userId` from the current Passport for every action, so every operation is actually customer-owner scoped.
- Address DTOs contain generic Admin Resource render metadata.
- The purpose-built customer Address page calls a thin `ModelAddress` facade that delegates all state and mutations to `rest-resource.model.resource`.
- There is no Admin Address `presetResource` menu or dedicated Admin Address consumer.

This is not an acceptable long-term dual-audience shape. A customer address book has a distinct authority model, query scope, interaction flow, and SSR admission boundary. The planned outcome is **one Address persistence domain with separate Admin Resource and Web self-service contracts**.

## Target architecture

Keep one `commerce-member:address` entity, model, active-instance persistence boundary, and lifecycle rules. Split everything that is audience-specific:

```text
Address domain / persistence
├── Admin Resource
│   ├── independently authorized, read-only systemAdmin select/view scope
│   ├── Admin request and response DTO family
│   ├── read-only presetResource menu and generic Resource page
│   └── selector-scoped ModelResource (optional thin Admin facade)
└── Web self-service
    ├── explicit mine/viewMine/createMine/updateMine/deleteMine operations
    ├── customer request and response DTO family
    ├── owner derived from the authenticated Passport in every service path
    ├── dedicated ModelAddressMine query/mutation state
    └── protected, purpose-built Address page with hydration-safe private-data handling
```

The required split follows the same boundary applied by Commerce Order:

- one shared business/persistence boundary;
- separate API names and projections;
- Admin role/action authorization versus Web server-derived owner scope;
- generic Admin Resource state versus dedicated customer state;
- schema-driven Admin UI versus customer-oriented page architecture.

The Admin custom-state rule in [Resource-Bound Custom API State Ownership](./resource-custom-api-state-ownership.md) still applies inside the Admin branch: Admin extensions must reuse `rest-resource.model.resource`, not create a competing Admin cache tree. A dedicated Web owner is correct here because it owns a different customer self-service state domain.

## Non-goals

This remediation must not:

- duplicate Address persistence, schema, or business lifecycle solely to support two consumers;
- treat an Address id, a menu entry, or a protected route as authorization;
- let the browser provide authoritative user, owner, tenant/instance, or cross-customer scope;
- weaken normal active-instance resource isolation or distinguish foreign records through raw cross-instance probes;
- reuse an Admin DTO as an alias for a customer response projection;
- hand-edit generated Zova API, schema, or OpenAPI types;
- make a customer page a `presetResource` page merely because it lists Address rows.

## Implementation checklist

### 1. Confirm the audience contracts before coding

- [ ] Keep the approved Admin action surface read-only: expose only `select` and `view`; do not register Admin `create`, `update`, or `delete` actions, metadata, or UI controls.
- [ ] Define the Web self-service surface with the approved unambiguous names: `mine`, `viewMine`, `createMine`, `updateMine`, and `deleteMine`.
- [ ] Confirm whether each audience needs list paging, filtering, sorting, or detail retrieval; do not carry Admin table/filter semantics into the customer contract by default.
- [ ] List each field that Admin may see but Web must not receive; ensure the customer contract contains only customer-needed Address data.
- [ ] Keep `userId`, tenant/instance authority, and Admin-only metadata out of Web request and response DTOs.

### 2. Split Vona contract truth and service boundaries

Primary areas:

- `vona/src/suite/a-commerce/modules/commerce-member/src/controller/address.ts`
- `vona/src/suite/a-commerce/modules/commerce-member/src/service/address.ts`
- `vona/src/suite/a-commerce/modules/commerce-member/src/dto/`

- [ ] Make only the approved Admin `select` and `view` actions independently `@Passport.systemAdmin()`-protected; this action-level authorization remains separate from Commerce site admission and menu visibility.
- [ ] Make Admin service methods operate under the intended active-instance operational scope rather than the current customer-only predicate, and do not add Admin mutation service paths.
- [ ] Move customer operations to their explicit self-service routes and DTOs; do not rely on role-dependent response shapes for an unqualified action.
- [ ] Derive the Web owner only from `this.bean.passport.currentUser` in the service path.
- [ ] Apply Web owner and any customer-visible predicates inside the database query before `selectAndCount(...)` calculates totals, ordering, offsets, or limits.
- [ ] Include the current owner in every Web detail/update/delete lookup; foreign or cross-instance records must be absent from the scoped result.
- [ ] Keep public API response builders and emitted OpenAPI schemas aligned with their audience DTOs.

### 3. Establish the Admin Resource surface

- [ ] Add the approved Admin `presetResource` menu entry under the appropriate Commerce Admin group, with `systemAdmin` navigation disclosure.
- [ ] Confirm that Admin menu visibility remains independent from Admin controller authorization.
- [ ] Preserve generic Resource metadata, schemas, permissions, invalidation, and form behavior under selector-scoped `rest-resource.model.resource`.
- [ ] If Commerce Member needs an Admin model facade, keep it thin and delegate each Admin operation to `ModelResource`.
- [ ] Ensure the Admin list and entry describe the approved read-only operational contract; do not expose standard mutation actions merely because DTO files exist.

### 4. Establish the Web self-service state and page boundary

Primary areas:

- `zova/src/suite/a-commerce/modules/commerce-member/src/model/`
- `zova/src/suite/a-commerce/modules/commerce-member/src/page/address/controller.tsx`
- `zova/src/suite/a-commerce/modules/commerce-member/src/routes.ts`

- [ ] Replace the Web page's generic `ModelResource` facade usage with a dedicated Web self-service model, for example `ModelAddressMine`.
- [ ] Give that model its own `$useStateData(...)` query keys for `mine` and `viewMine`, including every varying customer query input.
- [ ] Keep Web create/update/delete mutation state and invalidation in the dedicated Web model; invalidate only the relevant customer list/detail keys after success.
- [ ] Keep generated SDK calls typed and module-owned; do not move Commerce Member API knowledge into generic `ModelResource`.
- [ ] Retain a purpose-built customer Address page and its local draft/edit UI state.
- [ ] Preserve `requiresAuth: true` route admission, but do not treat it as the API data boundary.
- [ ] Ensure anonymous server rendering and hydration-time initial rendering retain an equivalent neutral shell; only create private Address queries after the explicit browser/authentication/admission boundary.

### 5. Follow the forward contract loop

- [ ] Change Vona controller and DTO source truth first.
- [ ] Update the Commerce Member OpenAPI ownership/configuration so it exposes every intended Admin and Web operation.
- [ ] Regenerate Zova API clients, schemas, and types; do not patch generated files.
- [ ] Update the thin Admin facade or generic Resource integration only for Admin operations.
- [ ] Update the dedicated Web model and customer page only for Web self-service operations.
- [ ] Build both affected Commerce flavors before syncing frontend output to Vona:
  - [ ] `npm run build:zova:commerce:web`
  - [ ] `npm run build:zova:commerce:admin`
  - [ ] `npm run deps:vona`
- [ ] If Vona still resolves stale generated types after the correct flavor builds and dependency sync, diagnose local dependency drift before hand-patching types.

### 6. Test and acceptance checklist

Backend ownership and authorization, extending `vona/src/suite/a-commerce/modules/commerce-member/test/addressOwnership.test.ts`:

- [ ] anonymous callers cannot invoke any customer or Admin Address operation;
- [ ] a customer creates an address without supplying an owner identity;
- [ ] a customer list/detail/update/delete path can observe or mutate only that customer's addresses in the active instance;
- [ ] a foreign customer and a caller in another instance observe target rows as absent and leave no mutation behind;
- [ ] an unauthorized authenticated caller cannot use Admin operations;
- [ ] a `systemAdmin` can use exactly the approved read-only Admin `select`/`view` surface in the active instance;
- [ ] Admin create/update/delete operations and mutation controls are absent;
- [ ] an Admin operation never silently inherits customer-owner scope;
- [ ] every test-owned persisted Address is deleted in `finally` using exact owned identities.

Frontend and browser acceptance:

- [ ] Admin navigation reaches the intended `presetResource` Address surface only for authorized operators.
- [ ] The customer Address route redirects anonymous browser navigation to login and retains the correct return target.
- [ ] Raw anonymous Commerce SSR HTML contains no Address data or hydration-complete marker.
- [ ] The hydration-time customer page remains equivalent to the server neutral shell until admission completes.
- [ ] An authenticated customer can list, create, edit, and delete only their own addresses through the dedicated Web model/page.
- [ ] Admin and Web mutations refresh their own consumers without crossing cache ownership boundaries.

### 7. Required verification evidence

Run the narrowest checks first, then the shared checks required by the changed contract and frontend flavors:

- [ ] focused Commerce Member ownership/action tests;
- [ ] focused Commerce browser flow covering customer Address management and Admin Address entry;
- [ ] `npm run build:zova:commerce:web`;
- [ ] `npm run build:zova:commerce:admin`;
- [ ] `npm run deps:vona`;
- [ ] `npm run tsc`;
- [ ] `npm run test` when the final change touches `meta.version.ts` or requires the shared test database to be recreated;
- [ ] `npm run test:e2e:commerce:clean` after paired Commerce artifacts are current;
- [ ] record durable acceptance evidence in the A-Commerce test plan/progress records only after the owning WBS and ATP checks actually pass.

## Reference implementation anchors

Read these before implementing:

- current mixed Address source: `vona/src/suite/a-commerce/modules/commerce-member/src/controller/address.ts`, `service/address.ts`, `zova/src/suite/a-commerce/modules/commerce-member/src/model/address.ts`, and `page/address/controller.tsx`;
- current Address ownership proof: `vona/src/suite/a-commerce/modules/commerce-member/test/addressOwnership.test.ts`;
- compliant private Web pattern: `vona/src/suite/a-commerce/modules/commerce-trade/src/controller/order.ts`, `service/order.ts`, `zova/src/suite/a-commerce/modules/commerce-trade/src/model/orderMine.ts`, and the Orders/Order page controllers;
- compliant public-Web split: `vona/src/suite/a-commerce/modules/commerce-catalog/src/controller/product.ts`, `service/product.ts`, and `zova/src/suite/a-commerce/modules/commerce-catalog/src/model/catalogue.ts`;
- public architecture rule: [Admin Resource and Web Self-Service](../../cabloy-docs/fullstack/admin-resource-and-web-self-service.md).
