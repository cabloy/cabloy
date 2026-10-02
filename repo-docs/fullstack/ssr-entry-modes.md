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
