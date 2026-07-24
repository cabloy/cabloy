# Admin Resource and Web Self-Service

A business domain often has two valid audiences:

- **Admin** users perform permission-controlled operational work, usually through schema-driven resource pages.
- **Web** users perform self-service work on data that belongs to them, usually through purpose-built pages.

Those audiences should usually share the same domain, persistence model, and lifecycle rules. They should not automatically share one HTTP projection, one authorization rule, or one frontend page architecture.

This guide explains the reusable Cabloy pattern:

> Keep one business resource boundary, but expose separate Admin Resource and Web self-service contracts when their authority, scope, projection, or experience differs.

The pattern is Common-first and applies to both Cabloy Basic and Cabloy Start. The Commerce Order implementation used below is a **Cabloy Basic specimen**; detect the active edition before relying on its UI, site, or build details.

## Where this guide fits

This page connects several mechanisms that have their own deeper documentation:

- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain) explains backend resource layers.
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern) explains Admin resource-state ownership.
- [Contract Loop Playbook](/fullstack/contract-loop-playbook) explains generated contract direction and recovery.
- [SSR Review Checklist](/frontend/ssr-review-checklist) explains server-render and hydration review boundaries.

Use this page when the design question is broader:

> Should Admin operators and Web users consume one resource as one API/page, or as separate audience-specific surfaces?

## The shortest accurate model

Treat these as different decisions:

| Concern                         | Usually shared                                              | Usually audience-specific                                 |
| ------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| Business identity and lifecycle | Entity, model, domain service, state transitions            | —                                                         |
| Authorization                   | Common authentication infrastructure                        | Admin role/action guards; Web owner scope                 |
| HTTP contract                   | Controller/module ownership and generated-contract workflow | Operation names, request DTOs, response DTOs              |
| Query semantics                 | Instance scope and domain persistence                       | Operational query capability; customer-visible predicates |
| Frontend state                  | Generated API contract and domain terminology               | Admin resource owner; Web self-service model              |
| User interface                  | Shared frontend framework and routing system                | `presetResource` Admin page; purpose-built Web page       |

Do **not** duplicate a persistence model merely because Admin and Web read the domain differently. Conversely, do **not** force a customer experience through the Admin Resource contract merely because both consumers refer to the same rows.

A useful default is:

- **Admin:** preserve the conventional Resource actions `select` and `view`; add `create`, `update`, and `delete` only when the operators truly own those mutations.
- **Web:** use explicit self-service names such as `mine` and `viewMine`; the service derives ownership from the authenticated user.

This makes the contract self-describing. An unqualified `view` remains the operational Resource action, while `viewMine` communicates a different authority and query scope.

## Specimen: one Order domain, two read contracts

The Cabloy Basic Commerce Order controller is a read-only Admin Resource plus a customer self-service surface:

```text
Order domain
├── Admin Resource
│   ├── GET /order           → select
│   └── GET /order/:id       → view
└── Web self-service
    ├── GET /order/mine      → mine
    └── GET /order/viewMine/:id → viewMine
```

See the controller in [order.ts](https://github.com/cabloy/cabloy/blob/main/vona/src/suite/a-commerce/modules/commerce-trade/src/controller/order.ts).

The controller uses `@Resource()` so the ordinary `select` and `view` actions participate in the Admin Resource contract. They use `@Passport.systemAdmin()` because they are operational reads. The `mine` and `viewMine` actions remain separate customer-facing operations; they do not inherit the Admin action guard.

A read-only Resource is a first-class shape. Registering `select` and `view` does not require pretending that operators may create, update, or delete an immutable business record such as an Order.

### Navigation is not authorization

An Admin SSR menu can point to `presetResource` and declare a `systemAdmin` role. That controls navigation disclosure and selects the generic Resource UI. It does **not** authorize the API action.

Likewise, a protected Web route can provide browser admission and redirect behavior, but it does not replace backend owner scope or controller authorization.

Keep these boundaries separate:

1. menu and route metadata decide whether and how a user reaches a page;
2. controller guards decide whether a caller may invoke an operation;
3. service/model query scope decides which records that operation can observe.

For menu behavior, see [Menu Guide](/backend/menu-guide). For route admission, see [Navigation Guards Guide](/frontend/navigation-guards-guide).

## Make DTOs audience-specific projections

An entity is a persistence shape, not a promise to every API consumer. Use operation-specific DTOs for each audience.

In the Order specimen, the Admin Resource uses a query/list/view family:

- `DtoOrderSelectReq`
- `DtoOrderSelectResItem`
- `DtoOrderSelectRes`
- `DtoOrderView`

These contracts can expose the operational projection and the metadata that generic Admin list and entry pages require.

The customer surface uses a deliberately narrow family:

- `DtoOrderMineReq`
- `DtoOrderMineRes`
- `DtoOrderSummary`
- `DtoOrderDetail`

For example, the customer summary has only the stable list information needed by the customer experience: identity, customer-visible state, currency, payable total, and creation time. It does not expose `userId`, instance information, correlation identifiers, or Admin page metadata.

The detail projection can include customer-relevant immutable snapshots, such as the purchase address and order lines, without becoming an alias for the entire persisted row.

### Keep request authority on the server

A self-service request DTO may expose useful page controls such as a visible state filter, date filter, sort, `pageNo`, and `pageSize`. It must not let the caller supply the authoritative owner identity or tenant/instance boundary.

In the Order specimen, `DtoOrderMineReq` derives from `$Dto.queryPage(...)`, but it only permits customer-safe filters. The service obtains the user id from the current Passport and adds it to the query itself.

This distinction is essential:

```text
Web request:  permitted filter and paging intent
Service:      authoritative owner and visible-state predicates
Model/ORM:    normal active-instance scope
```

See [DTO Guide](/backend/dto-guide) for operation DTO design and [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution) for the normal instance boundary.

## Put ownership and visibility inside the paged query

Self-service visibility is a query rule, not a presentation cleanup step.

The Order service uses `selectAndCount(...)` to apply all of these before the database calculates the count or page:

- the owner derived from `currentUser`;
- the customer-visible order states;
- permitted caller filters;
- deterministic default ordering.

Conceptually:

```typescript
const result = await model.order.selectAndCount({
  ...params,
  where: {
    ...params?.where,
    userId: currentUser.id,
    state: customerVisibleStates,
  },
  orders: params?.orders ?? [['id', 'desc']],
});
```

The order of responsibility matters:

1. accept only the DTO's permitted filtering intent;
2. overwrite authoritative constraints such as owner and allowed states;
3. let the scoped model execute count, ordering, offset, and limit together;
4. map the result to the Web projection.

Do not load a broad result, paginate it, and then remove foreign or unavailable rows in memory. That produces incorrect `total` and `pageCount`, can make pages unexpectedly empty, and risks exposing data before filtering.

For a single record, include the owner in the lookup itself. A foreign record should normally be absent from the caller's scoped result; do not use a cross-instance probe merely to change absence into a distinguishable authorization response.

See [ORM Select Guide](/backend/orm-select-guide) for query and projection behavior.

### Pagination is one contract across layers

A list is not genuinely paginated until all of these agree:

1. the request DTO derives from `$Dto.queryPage(...)`;
2. the response DTO derives from `$Dto.listAndCount(...)`;
3. the service applies audience scope before `selectAndCount(...)`;
4. the generated SDK describes the list-and-count result;
5. the frontend model includes the varying query input in its query key;
6. the page consumes `list`, `pageNo`, `pageSize`, `total`, and `pageCount` consistently.

The Order Web page demonstrates the final step by requesting `{ pageNo, pageSize }`, rendering `data.list`, and changing pages from the returned `pageCount`.

## Admin frontend: let the Resource owner stay the owner

For an operational Admin surface, the generic Resource infrastructure is usually the right page architecture.

The Order specimen has an SSR menu entry whose `presetResource` target identifies `commerce-trade:order`. Generic Admin Resource pages then consume the backend's Resource metadata, permission surface, schemas, table behavior, and read actions.

The module-level `ModelOrder` is intentionally thin:

```typescript
@Use({ beanFullName: 'rest-resource.model.resource' })
protected get $$modelResource(): ModelResource {
  return usePrepareArg('commerce-trade:order', true);
}

select(query?: Record<string, unknown>) {
  return this.$$modelResource.select(query);
}
```

This is not a second Admin cache tree. `ModelResource` remains the selector-scoped owner of resource bootstrap, permissions, schemas, query state, and invalidation policy. The thin facade is useful only when it gives the module a clearer semantic boundary while preserving the generic Resource surface.

Use this path when the Admin experience is mainly:

- schema-driven list, filter, view, form, or action behavior;
- conventional Resource permissions and metadata;
- operational work that benefits from generic page infrastructure.

For the underlying owner pattern, read [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern), [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide), and [Resource Model Best Practices and Anti-Patterns](/frontend/model-resource-best-practices).

## Web frontend: use a dedicated self-service model when semantics diverge

A customer order page is not a smaller Admin table. It has different API names, customer-safe projections, owner scope, interaction flow, and presentation requirements.

The Order specimen therefore uses `ModelOrderMine` for `mine` and `viewMine`, alongside purpose-built orders-list and order-detail page controllers. The dedicated model owns query state for those self-service operations:

```typescript
mine(query) {
  return this.$useStateData({
    queryKey: ['mine', query],
    queryFn: () => this.scope.api.commerceTradeOrder.mine({ query }),
  });
}
```

This does not violate the Admin Resource owner rule. The two model boundaries own different state domains:

| Model                                | Owns                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------ |
| Admin `ModelOrder` → `ModelResource` | Admin Resource `select`/`view`, schemas, permissions, generic page state |
| Web `ModelOrderMine`                 | Customer `mine`/`viewMine` queries and customer-page state               |

Use a dedicated Web model and pages when the self-service contract is genuinely different. Do not create a parallel cache owner merely because an Admin endpoint needs a small domain-specific helper; keep such Admin helpers as thin facades over the existing Resource owner instead.

For model-owned remote state and query keys, see [Model State Guide](/frontend/model-state-guide).

## Private Web SSR needs explicit admission and hydration boundaries

Private customer data must not appear in server HTML when the SSR path cannot establish the customer's authenticated state. The Order specimen keeps a neutral shell through server render and hydration-time initial render, then begins private queries only at an explicit client-side boundary.

The required layers work together:

1. **Route admission** uses the appropriate protected-route metadata for browser navigation.
2. **Backend contract enforcement** uses controller guards and service-level owner scope as the authoritative data boundary.
3. **Model gating** avoids creating the private query until the browser runtime and authenticated Passport are available.
4. **Page gating** keeps the same neutral shell until the page reaches its post-hydration admission boundary.
5. **Query behavior** may use `disableSuspenseOnInit: true` where appropriate, but that flag only disables the initialization-time suspense kick.

Do not treat `disableSuspenseOnInit` as proof that a query cannot be created, fetched, or affect hydration. It is not an authorization mechanism or a substitute for an explicit hydration boundary.

For the full review criteria, see [SSR Review Checklist](/frontend/ssr-review-checklist), [SSR Init Data](/frontend/ssr-init-data), and [`$useStateData` Best Practices](/frontend/use-state-data-best-practices).

## Follow the forward contract loop

Changing audience-specific backend contracts is a forward-chain change.

Use this order:

1. change Vona controller and DTO contract truth first;
2. inspect the emitted OpenAPI surface, including every Admin and Web operation;
3. keep the Zova module's operation ownership explicit;
4. regenerate generated SDK, schema, and type consumers;
5. adapt thin Admin facades or dedicated Web models to the generated API;
6. do not hand-edit generated API clients or types.

The Order module owns its four operations—`select`, `view`, `mine`, and `viewMine`—through its OpenAPI configuration. That is the appropriate place to constrain the generated module contract slice.

Read [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) for the forward-chain bridge and [Contract Loop Playbook](/fullstack/contract-loop-playbook) for generation, consumer drift, reverse-chain, and local dependency-drift decisions.

## Verification checklist

Review this pattern at the boundaries where an accidental merge would matter:

- [ ] Admin Resource permissions expose exactly the operational actions intended; a read-only resource does not accidentally gain mutation actions.
- [ ] Admin `select` and `view` enforce their controller authorization independently of menu visibility.
- [ ] Web list and detail derive ownership server-side and treat foreign or cross-instance records as absent.
- [ ] Web visibility predicates are applied before count, ordering, and pagination.
- [ ] Web request and response projections contain no owner, tenant, or operational-only data.
- [ ] Generated contract output contains every intended Admin and Web operation, and frontend consumers use it without manual generated-file edits.
- [ ] The Admin menu reaches the intended `presetResource` entry and generic Resource page.
- [ ] Web SSR and hydration render the same neutral private-data shell until admission; post-hydration behavior is tested separately.
- [ ] Where the domain has a meaningful customer journey, targeted browser coverage proves the authenticated list/detail flow as well as access denial.

Use [Unit Testing](/backend/unit-testing) for backend test conventions and [SSR Review Checklist](/frontend/ssr-review-checklist) for SSR-specific checks.

## Anti-patterns

Avoid these shortcuts:

### One broad endpoint with role-dependent response shapes

Do not make `view(id)` return a full operational row for an Admin and a reduced customer row for someone else. The contract, authorization, cache semantics, and generated types become ambiguous. Use distinct operations and DTOs.

### Post-pagination ownership filtering

Do not query broad rows, page them, and then filter for owner or state in memory. Scope the database query first.

### Navigation as authorization

Do not rely on `@SsrMenu` roles or frontend `requiresAuth` to secure an API. They affect navigation and admission only; backend operations must enforce authority and data scope themselves.

### Generic Admin page as a customer experience

Do not use `presetResource` just because a customer page happens to list resource rows. Customer-oriented layout, detail, pagination, and actions often deserve purpose-built pages.

### Competing resource cache ownership

Do not create another Admin resource model/cache owner when the custom Admin operation still belongs to the same Resource boundary. Reuse `ModelResource` through a thin facade. Create a separate model only for a genuinely distinct self-service state domain.

### Hydration flags as privacy controls

Do not assume a suspense or rendering flag prevents private data loading. Use explicit server, browser, authentication, and post-hydration boundaries.

### Hand-patched generated contracts

Do not fix a changed backend operation by editing generated frontend API or type files. Repair contract truth and regenerate the owned SDK slice.

## Decision rule

When one business resource serves Admin and Web users:

> Share domain persistence and lifecycle logic. Split API contracts, DTO projections, query authority, frontend state ownership, and page architecture wherever the audiences have different authority or experience.

Use Admin `select`/`view` with the generic Resource owner for conventional operations. Use explicit Web self-service operations and dedicated Web state/pages when customer scope and UX diverge.

## Read next

- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
- [Menu Guide](/backend/menu-guide)
- [ORM Select Guide](/backend/orm-select-guide)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Resource Model Best Practices and Anti-Patterns](/frontend/model-resource-best-practices)
- [SSR Review Checklist](/frontend/ssr-review-checklist)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
