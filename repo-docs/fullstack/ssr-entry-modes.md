# Vona Integrated SSR and Zova Standalone SSR

Cabloy has two ways to enter the same frontend SSR application during development. The difference is **which server receives the browser request and owns the response**, not whether the page uses SSR. Choose an entry based on the boundary you need to develop or verify.

## The two entry modes

**Vona integrated SSR** starts at the Vona server. Vona handles the incoming HTTP request, matches an SSR site, and uses the built frontend assets and Zova SSR runtime to render the response. The browser enters through Vona, so this is the path to check site dispatch and the fullstack HTTP boundary.

**Zova standalone SSR** starts at the Zova development server. It renders the selected frontend flavor directly for fast page, route, and hydration iteration with hot reload. Backend APIs still belong to Vona; opening the Zova server directly does not exercise Vona's SSR site dispatch or built-artifact handoff.

```text
Vona integrated SSR:    browser → Vona → SSR site → built Zova SSR output → browser
Zova standalone SSR:    browser → Zova development server → frontend SSR → browser
```

In the Cabloy Basic default environment, `SERVER_LISTEN_PORT=7102` is the Vona entry and `DEV_SERVER_PORT=9000` is the Zova development entry. These are separate listeners, not two ports for the same server. Zova's `API_BASE_URL` points to Vona, not to its own development port. Local environment overrides can change the ports; use the effective values in your checkout.

## Runtime API origins in Vona integrated SSR

Vona integrated SSR supplies API origins at runtime; this mechanism is not specific to an edition or frontend flavor. By default, Vona derives the origin from its effective protocol and host and passes:

- `envServer.SSR_API_BASE_URL` to the built Zova server bundle during initialization.
- `envClient.API_BASE_URL` through the SSR state to the browser during client initialization.

These runtime values override Zova's build-time environment defaults used by the normal API client. They do not rewrite hard-coded URLs or arbitrary build-time substitutions in application code.

For an isolated `npm run test:e2e` that enters through Vona integrated SSR, the runner's dynamic Vona origin is therefore sufficient: **do not edit Zova `.env` files or rebuild the flavor solely to match the test port**. A new listener address alone does not make the bundle stale.

Artifact preparation is a separate concern. When frontend code, routes, metadata, or other build inputs change, refresh the required SSR/REST artifacts and synchronize Vona dependencies as required. Resolve commands and flavors from the active repository's scripts; do not assume every edition's E2E command builds the frontend automatically. See [SSR Build and Deploy Guide](/frontend/ssr-build-deploy-guide) and [Repo Scripts](/reference/repo-scripts).

The injected origins are defaults, with these boundaries:

- Vona merges the default origins first, then the `a-ssr` module's `site.default` configuration, then the individual SSR Site options. An explicit `envServer.SSR_API_BASE_URL` or `envClient.API_BASE_URL` in those site settings overrides the corresponding default; a value only in Zova's build-time `.env` does not count as a site override.
- Generated OpenAPI clients prefer their module-specific `OPENAPI_BASE_URL_*`, then `OPENAPI_BASE_URL_DEFAULT`, before the server or browser API-origin fallback. Custom API configuration and hard-coded URLs also require separate inspection when requests reach the wrong origin.
- Zova standalone SSR and SPA do not automatically receive this Vona integrated SSR handoff. Keep their environment setup separate from this rule, including deliberate [parallel worktree development configuration](/fullstack/parallel-worktree-environment).

## Start and use them in Cabloy Basic

Start the Vona server from the repository root and visit a Vona-served site:

```bash
npm run dev
# Web:   http://localhost:7102/
# Admin: http://localhost:7102/admin/
```

For frontend iteration, start **one** Zova flavor in another terminal and open its development entry directly:

```bash
npm run dev:zova:web    # http://localhost:9000/
# or
npm run dev:zova:admin  # http://localhost:9000/admin/
```

For the other Cabloy Basic site URLs and the quick command comparison, see [Fullstack Quickstart](/fullstack/quickstart#3-start-vona-integrated-ssr). For Cabloy Start, keep the same entry-mode distinction but use the scripts, flavors, sites, and effective ports in the active Start checkout; do not copy Basic-specific flavor names or site paths blindly.

## Which entry should you use?

| Task                                                                  | Use                                                                           | What the result tells you                                                                     |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Iterate on a page, route, SSR render, or hydration                    | Zova standalone SSR (`9000` by default)                                       | The selected frontend flavor works through the Zova development entry.                        |
| Check Vona site matching, backend-owned routing, or the HTTP response | Vona integrated SSR (`7102` by default)                                       | The request enters through Vona and exercises the integrated HTTP response path.              |
| Verify release output or integrated browser acceptance                | Built SSR/REST artifacts, synchronized Vona dependencies, then the Vona entry | The intended built fullstack path is exercised, rather than just the Zova development server. |

Direct access to `9000` cannot replace validation at `7102`. Before acceptance or deployment checks, build the required SSR/REST artifacts and synchronize them with Vona. For build and deployment steps, follow [SSR Build and Deploy Guide](/frontend/ssr-build-deploy-guide); for the Basic browser acceptance workflow, see [Frontend Scripts](/frontend/scripts#vona-integrated-ssr-browser-acceptance).

## Do not confuse an entry mode with an SSR site

“Standalone” here describes **direct access to the Zova development server**. It does not mean an independently deployable SSR application. An **SSR Site/flavor** identifies an application surface that Vona can mount and serve, such as Web or Admin. Adding a new deployable site requires its own aligned flavor, SSR/REST output, and Vona registration; it is not accomplished by starting another standalone development listener. See [Independent SSR Site and Flavor Setup](/fullstack/ssr-site-and-flavor-setup).

For the cross-layer request flow, read [SSR Architecture Overview](/frontend/ssr-architecture-overview). For concise definitions, see the [Glossary](/reference/glossary#vona-integrated-ssr).
