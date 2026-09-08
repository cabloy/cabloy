# Independent SSR Site and Flavor Setup

Use this guide when adding a new deployable Zova SSR surface that Vona must dispatch and serve. It covers a new **site + flavor** pair, not merely a page or route inside an existing site.

The durable outcome is one aligned identity tuple:

```text
Zova flavor
  ↕
flavor env/config + Zova SSR/REST scripts
  ↕
root paired build wrapper
  ↕
SSR release directory + generated REST package
  ↕
Vona @SsrSite registration
```

Do not substitute identifiers from an existing Admin, Web, or business site. Select and verify every member of the tuple together.

## Before you start

### Detect the active edition

Read the repository marker first:

- `__CABLOY_BASIC__` → use the current Basic scripts, flavors, UI baselines, site modules, and paths.
- `__CABLOY_START__` → inspect the active Start repository before naming a flavor, wrapper, generated package, or site module.
- both markers → stop: the checkout is ambiguous.

The framework model is shared, but the exact flavor names, site baselines, UI layer, assets, scripts, and generated output paths can differ by edition. See [Edition Detection](/editions/detection) and [Edition Collaboration Differences](/fullstack/edition-collaboration-differences).

### Confirm that a new site is needed

| Change                                                                                      | Normal boundary                                                                                   |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| New page or route inside an existing SSR site                                               | Page, route, model, and existing site verification; normally no new flavor or `@SsrSite`.         |
| Frontend metadata/resource handoff to an existing backend consumer                          | Reverse contract loop; rebuild every affected existing flavor pair, then run `npm run deps:vona`. |
| New deployable URL mount, SSR admission policy, assets, or independent frontend composition | New independent flavor and Vona SSR site; continue with this guide.                               |

A new site is an ownership decision, not a convenient alias for an existing Admin or Web surface.

## Define the identity tuple

Choose these values before editing source. Keep their spelling and ownership consistent:

| Identity               | Role                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| `<site-flavor>`        | Exact Zova flavor identifier used in env/config, lower-level scripts, build output, and generated REST package. |
| `<site-id>`            | Vona SSR site identity and Zova `SITE_ID`; unique among enabled sites.                                          |
| `<public-path>`        | External mount path; aligned between Zova `APP_PUBLIC_PATH` and Vona `publicPath`; unique among enabled sites.  |
| `<site-module>`        | Vona module that owns the site bean and copied SSR assets.                                                      |
| `<bundle-path>`        | Copied SSR release directory under `<site-module>/assets/site`; exactly matches Vona `bundlePath`.              |
| `<zova-rest-package>`  | Flavor-specific generated REST/type package imported by the Vona site bean.                                     |
| `<root-build-wrapper>` | Root command that produces the selected SSR bundle **and** REST/type package.                                   |

Only one enabled SSR site may own the empty/root public path. A non-root site’s route aliases are relative to the router mount base; do not repeat `<public-path>` inside those aliases.

## Configure Zova

### 1. Add a tracked flavor environment

Keep shared defaults in `zova/env/.env`; add the site’s tracked flavor override at:

```text
zova/env/.env.<site-flavor>
```

The override must select a non-empty `SITE_ID`, the matching `APP_PUBLIC_PATH`, an SSR rendering profile, and the build-copy targets. For a Vona-integrated SSR site, set `SSR_WITH_VONA=true`.

Choose `SSR_PROFILE` from the rendering contract:

- use a public profile for cookie-free, cache-safe first paint;
- choose a session/private profile deliberately for cookie-backed admission, personalized first paint, or private SSR data.

Point the build destinations to the selected Vona site module and generated package workspace:

```text
BUILD_COPY_RELEASE = ../vona/src/.../modules/<site-module>/assets/site
BUILD_REST_COPY_DIST = ../vona/.zova-rest
```

Do not change ports or worktree-local environment overrides to make a new site work. Follow the normal worktree-environment workflow only when that separate setup is explicitly required.

### 2. Add flavor-specific frontend configuration only where necessary

Use `zova/src/front/config/config/config.<site-flavor>.ts` for site-specific route aliases, route exclusions, layouts, or app configuration. Keep shared API, locale, theme, SSR, and app assembly in base `config.ts`.

For mounted routing:

- configure an unnamed canonical route through `config.routes.path`;
- configure a named dynamic route through `config.routes.name`;
- generate a named alias with `$router.getAliasPath(...)` rather than assuming `$router.getPagePath(...)` selects an alias;
- do not duplicate the external mount prefix in an alias because `APP_PUBLIC_PATH` supplies that boundary.

Choose layouts, title, locales, assets, route exclusions, `requiresAuth`, and redirects from the new site’s contract. Existing Admin and Web sites are specimens, not defaults to copy blindly.

### 3. Add durable scripts and root wrappers

Inspect the active root `package.json` and `zova/package.json` first. Add lower-level Zova scripts in the durable source manifest, normally including:

```text
dev:ssr:<site-flavor>
build:ssr:<site-flavor>
build:rest:<site-flavor>
preview:ssr:<site-flavor>
```

The SSR and REST scripts must pass the same flavor. Add a paired batch and an explicit root build wrapper that runs both outputs in order:

```bash
npm run build:ssr:<site-flavor>
npm run build:rest:<site-flavor>
```

Use the root wrapper for normal site-level builds and in Vona diagnostics. Add the flavor to an aggregate build only when it belongs to that edition’s default shipped artifact set.

Edit durable manifests such as root `package.json` and `zova/package.original.json`; do not hand-edit generated `zova/package.json`, generated REST output, copied bundles, or generated dependency state. Do not run `npm run init` merely to synchronize a manifest.

## Register the Vona SSR site

Create or refine an independently packaged Vona site module. It must expose its assets, source entry point, locale metadata, and an SSR-site bean.

The site bean should:

1. import `IPagePathRecord` and `IIconRecord` from `<zova-rest-package>`;
2. augment the SSR site-ID and public-path type records;
3. define typed page/page-data options around the generated route record;
4. extend `BeanSsrSiteBase` and register `@SsrSite(...)`;
5. provide a localized title, `<site-id>`, `<public-path>`, `<bundle-path>`, and `<root-build-wrapper>` diagnostics command.

Conceptually:

```ts
@SsrSite({
  siteId: '<site-id>',
  publicPath: '<public-path>',
  bundlePath: '<bundle-path>',
  diagnostics: { buildCommand: 'npm run <root-build-wrapper>' },
})
export class SsrSiteExample extends BeanSsrSiteBase<...> {}
```

The default release identity is normally `ssr-<site-flavor>-<app-version>`. Unless you intentionally override it, use that exact copied directory as `<bundle-path>`. Vona resolves the bundle from the owning site module’s `assets/site/<bundle-path>` directory.

Ensure the site module is discoverable through its durable suite/module manifest. Let normal tooling generate metadata and dependency closures; do not hand-edit generated metadata.

## Build the artifact pair and sync Vona

For every Vona-consumed independent SSR site, this sequence is required:

```bash
npm run <root-build-wrapper>
npm run deps:vona
```

The wrapper must create both:

```text
SSR bundle and client assets
+ generated flavor REST/type package
```

`build:rest:<site-flavor>` alone is not a valid Vona SSR handoff: Vona needs the bundle, assets, and typed REST package to move together. Likewise, a default Admin or Web wrapper does not prove an independently named site was rebuilt.

After generation, verify that:

- the copied release directory matches `<bundle-path>`;
- the generated package name and Vona import match `<zova-rest-package>`;
- the Vona local workspace can discover the package after `npm run deps:vona`;
- the site bean’s diagnostics command names the same root wrapper that produced the artifacts.

If the generated artifacts are correct and `npm run deps:vona` completed but Vona still sees stale local types, diagnose [local dependency drift](/fullstack/contract-loop-playbook#recovery-path-for-local-dependency-drift) only then.

## Verify through the Vona boundary

A Zova standalone SSR development server (the default `9000` entry) can help with page iteration, but it does not prove copied artifacts, Vona site matching, generated type handoff, or production-like hydration. An independent SSR Site/flavor remains a separately deployable application boundary; it is not another name for Zova standalone SSR.

Run the narrowest meaningful checks first:

```bash
npm run tsc:zova
npm run <root-build-wrapper>
npm run deps:vona
pnpm --dir vona run tsc
```

Then prove the Vona-served site:

1. request the exact public mount path and assert the intended Vona SSR site handled it;
2. inspect raw HTML for server-rendered content and the correct cache/admission behavior;
3. verify client assets load from the mounted site;
4. open the same route in a browser and assert hydration completes without errors or SSR/client mismatch;
5. verify canonical and alias route behavior, including no duplicated mount path;
6. exercise the site’s public/private admission or redirect contract;
7. retain focused browser/E2E evidence for the new site rather than relying only on compilation.

For more detail, read [SSR Architecture Overview](/frontend/ssr-architecture-overview), [SSR Build and Deploy Guide](/frontend/ssr-build-deploy-guide), [Vona + Zova Integration](/fullstack/vona-zova-integration), and [Contract Loop Playbook](/fullstack/contract-loop-playbook).
