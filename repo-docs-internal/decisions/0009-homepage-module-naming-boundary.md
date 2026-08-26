# ADR 0009: Preserve Homepage Module Naming Boundaries

## Status

Accepted.

## Background

[A-Commerce ADR 0001](../../repo-specs/a-commerce/decisions/0001-mvp-boundaries.md) establishes `commerce` and `commerceAdmin` as independent Commerce SSR applications, with `commerce-siteweb` and `commerce-siteadmin` as their site-composition modules. Those modules own Commerce-specific application concerns, including homepage or dashboard surfaces, routes, menus, SSR registration, flavors, bundles, and generated REST outputs where applicable.

The repository also provides `home-indexweb` and `home-indexadmin` in the reusable `a-home` suite. A flavor can select those general landing or entry pages as its root route, but the modules do not own every site that uses them.

Moving a Commerce-specific homepage into its Commerce site module is therefore consistent with the existing application boundary. It does not imply that the reusable A-Home modules should be renamed to `home-siteweb` or `home-siteadmin`.

## Decision

Retain `home-indexadmin` and `home-indexweb` as the reusable, general A-Home Admin and Web landing or entry modules.

Keep Commerce-specific homepage, dashboard, route, menu, and site-composition behavior in `commerce-siteadmin` and `commerce-siteweb`.

Within this boundary, `siteadmin` and `siteweb` identify ownership of an Admin or Web SSR application/site. They are not generic synonyms for an application's home page. Naming the A-Home modules `home-siteadmin` and `home-siteweb` would incorrectly imply that they own SSR site registration, bundles, menus, and application composition.

A flavor may map either a general A-Home entry page or a site-owned Commerce page to its root route. That selection does not transfer site ownership to the page module.

## Alternatives Deferred

- Renaming `home-indexadmin` and `home-indexweb` to `home-siteadmin` and `home-siteweb` is rejected because it blurs reusable entry-page ownership with SSR site ownership.
- Moving Commerce-specific homepage or dashboard behavior back into the A-Home modules is rejected because it would make a general suite own domain-specific application composition.
- Renaming the A-Home modules to another entry-page-oriented term is not part of this decision. Such a change must preserve the ownership boundary and be introduced through a superseding ADR with an explicit migration plan.

## Consequences

- Commerce-specific home surfaces remain suite-owned by `commerce-siteadmin` and `commerce-siteweb`.
- General landing and default-entry behavior remains reusable through `home-indexadmin` and `home-indexweb`.
- Future homepage work must first determine whether it changes reusable entry content or a specific SSR application's composition.
- A future module naming change must supersede this ADR instead of opportunistically renaming modules to match an individual site.

## Related Records

- [A-Commerce internal planning index](../../repo-specs/a-commerce/README.md)
- [A-Commerce ADR 0001: Establish A-Commerce MVP Boundaries](../../repo-specs/a-commerce/decisions/0001-mvp-boundaries.md)
- [A-Commerce ADR 0002: Preserve a Path to Multiple Merchants Within One Vona Instance](../../repo-specs/a-commerce/decisions/0002-multi-merchant-within-one-vona-instance.md)
- [Suite and module guidance](../../repo-docs/fullstack/suites-and-modules.md)
- [Frontend modules and suites](../../repo-docs/frontend/modules-and-suites.md)
- [ADR 0004: Preserve Fullstack SSR and Bidirectional Type-Flow Principles](./0004-fullstack-ssr-and-bidirectional-type-flow.md)
- [ADR 0006: SSR Site Access and Role Model](./0006-ssr-site-access-and-role-model.md)
