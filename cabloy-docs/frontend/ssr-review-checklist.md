# SSR Review Checklist

This checklist helps contributors and AI workflows review SSR-related changes in Zova within the Cabloy monorepo.

## Why this page exists

The other SSR pages explain architecture, build/deploy flow, and troubleshooting.

This page answers a narrower review question:

- what should you verify before accepting an SSR-related change?

That matters because SSR changes can look correct in one narrow path while still being wrong at a framework boundary.

Common review failures include:

- checking only client behavior and skipping server-render behavior
- checking only dev behavior and skipping built behavior
- reviewing page logic without checking the SSR layer it depends on
- assuming a theme or UI rule is shared across editions when it is not

## Use this checklist with the layer model

Use the [SSR Architecture Overview](/frontend/ssr-architecture-overview) as the base model.

For review, the practical layers are:

1. **Vona SSR orchestration**
2. **frontend build output**
3. **Zova SSR server render**
4. **client hydration**

A good SSR review starts by asking which of these layers the change touches.

## Fast review checklist

Use this short checklist for PR review, AI review, or self-review.

- [ ] I identified which SSR layer the change touches first.
- [ ] I checked whether the change affects server render, client hydration, or both.
- [ ] I verified that the change uses existing SSR abstractions rather than inventing a parallel workaround.
- [ ] I checked whether the change needs verification in built mode rather than only in dev mode.
- [ ] I reviewed whether the change depends on edition-specific UI or theme assumptions.
- [ ] For each new or changed route, I resolved static-versus-dynamic `route.name`, ordinary no-locale alias, the rendering-contract-driven SSR profile, and independent `requiresAuth` decisions.

## Layer-by-layer review checklist

### 1. Vona SSR orchestration

Review these questions when the change affects SSR site routing, backend-side SSR integration, or request entry behavior.

- [ ] Does the request still enter the correct SSR site?
- [ ] Does the change preserve the intended SSR site/path assumptions?
- [ ] If route-to-page handoff changed, is it still using the intended SSR render/redirect boundary?
- [ ] If the issue is dev-only or prod-only, did I verify whether the failure belongs to orchestration rather than page logic?

Read together:

- [SSR Architecture Overview](/frontend/ssr-architecture-overview)
- [SSR Troubleshooting Guide](/frontend/ssr-troubleshooting-guide)

### 2. Frontend build output

Review these questions when the change affects scripts, flavors, generated assets, or deploy packaging.

- [ ] Did I verify the correct edition and target flavor first?
- [ ] Did I verify whether the change needs the root wrapper or a flavor-specific script path?
- [ ] Did I check whether built SSR output, client assets, or related generated artifacts need regeneration?
- [ ] If the change crosses the fullstack SSR boundary, did I verify the aligned build workflow rather than a frontend-only build assumption?

Read together:

- [SSR Build and Deploy Guide](/frontend/ssr-build-deploy-guide)
- [Frontend Scripts](/frontend/scripts)
- [Fullstack Vona + Zova Integration](/fullstack/vona-zova-integration)

### 3. Zova SSR server render

Review these questions when the change affects route resolution, server-side data, or server-generated HTML/meta.

- [ ] Is the initial server-rendered HTML still correct before hydration begins?
- [ ] If data is involved, is it prepared through the intended SSR/model/controller flow?
- [ ] Does the server HTML match the client's hydration-time initial render in structure, visible state, and render-driving data?
- [ ] For SSR-required data, does the client reuse the transferred state through the same effective query key instead of producing a separate first-screen result?
- [ ] For private, cookie-unavailable, or browser-only data intentionally omitted by SSR, does the server and hydration-time client render keep the same neutral shell or placeholder?
- [ ] If metadata is involved, is it still produced through the intended SSR-aware meta path?
- [ ] If the change touches SSR-only behavior, did I verify it at the server-render stage rather than only after client boot?

Read together:

- [SSR Init Data](/frontend/ssr-init-data)
- [SSR SEO Meta](/frontend/ssr-seo-meta)
- [SSR Troubleshooting Guide](/frontend/ssr-troubleshooting-guide)

### 4. Client hydration

Review these questions when the change affects browser-only behavior, first paint, or client takeover after SSR.

- [ ] Is the client reusing server-provided state rather than recomputing a different hydration-time initial result?
- [ ] If state was intentionally omitted by SSR, is its query/load/render branch deferred until an explicit post-hydration, admission, mounted, or interaction boundary?
- [ ] If browser-only behavior is involved, should part of the UI be isolated with `ClientOnly` and a hydration-equivalent placeholder?
- [ ] Is `disableSuspenseOnInit` being used only to skip its init-time suspense kick, rather than as an assumed no-fetch or hydration-deferral mechanism?
- [ ] Did I separate a hydration issue from a server-render issue before changing code?
- [ ] If the browser UI later differs from the server output, does that change begin after hydration through an expected framework-supported boundary?

Read together:

- [SSR ClientOnly](/frontend/ssr-client-only)
- [SSR Troubleshooting Guide](/frontend/ssr-troubleshooting-guide)

## Theme and edition-sensitive review gate

Use this gate whenever a change touches theme, tokens, first paint, or dark/light behavior.

- [ ] I identified the active edition before reviewing SSR theme behavior.
- [ ] I identified the active UI layer before assuming token or hydration behavior.
- [ ] I checked whether the active SSR path provides cookie-backed theme resolution.
- [ ] I did not treat server-side theme-sensitive reads as final browser truth when the active SSR path does not guarantee that.
- [ ] I verified whether the rule is shared across editions or adapter-specific.

Read together:

- [Theme Guide](/frontend/theme-guide)
- [SSR Environment Variables](/frontend/ssr-env)

## Build/deploy review gate

Use this gate whenever a change may pass in dev but fail in built SSR output.

- [ ] I checked whether the change must be verified in built mode.
- [ ] I verified the relevant build path instead of assuming dev success is enough.
- [ ] I checked whether client assets and SSR output stay aligned for the target flavor.
- [ ] If the change crosses the frontend/backend SSR boundary, I reviewed the fullstack build path too.

## What a reviewer should flag immediately

Flag the change for follow-up when any of these are true:

- the review checked only client behavior and skipped server-render behavior
- the fix adds a parallel SSR-specific workaround instead of using an existing framework abstraction
- the change assumes one edition's theme/UI behavior applies universally
- the change was validated only in dev even though the failure is deploy- or build-sensitive
- the review never identified which SSR layer was actually changing
- private or browser-only state omitted by SSR appears or starts loading during the client's hydration-time initial render
- `disableSuspenseOnInit` is presented as proof that a query cannot fetch or affect hydration

## Reviewer template

Use this short template in PR review, AI review, or self-review when a change touches SSR behavior.

- [ ] I identified the SSR layer first.
- [ ] I separated server-render checks from hydration checks.
- [ ] I verified whether the change needs built-mode validation.
- [ ] I checked whether the change reuses existing SSR abstractions.
- [ ] I reviewed edition/theme assumptions where relevant.
- [ ] I verified the most relevant neighboring guide for this change category.

## Prompt-ready reviewer snippet

Use this block directly in a reviewer-agent or code-review prompt when a change touches SSR behavior:

```text
Review this change with the Cabloy SSR checklist in mind.

1. Identify which SSR layer the change touches: Vona SSR orchestration, frontend build output, Zova SSR server render, or client hydration.
2. Separate server-render correctness from hydration correctness.
3. Compare server HTML with the client's hydration-time initial render, not with later post-hydration browser state.
4. Verify whether SSR-required state reuses the intended transferred query state and whether deliberately omitted private/browser-only state remains absent until an explicit client boundary.
5. Do not accept `disableSuspenseOnInit` as evidence that a query cannot fetch or change hydration behavior.
6. Verify whether the change reuses the intended framework abstraction instead of adding a parallel workaround.
7. Check whether the change needs built-mode validation rather than only dev-mode validation.
8. Review edition-sensitive UI/theme assumptions when the change touches first paint, tokens, dark mode, or SSR env behavior.
9. Flag any change whose review never identifies the failing or affected SSR layer.
```

## Read together

Use this page together with:

- [SSR Architecture Overview](/frontend/ssr-architecture-overview)
- [SSR Build and Deploy Guide](/frontend/ssr-build-deploy-guide)
- [SSR Troubleshooting Guide](/frontend/ssr-troubleshooting-guide)
- [Theme Guide](/frontend/theme-guide)
- [Verification](/ai/verification)

## Verification checklist

Before accepting an SSR-related change, ask:

1. did the review identify the affected SSR layer clearly?
2. did the review cover both the relevant runtime stage and the relevant workflow stage?
3. did the review verify edition/theme assumptions when the change was SSR-UI-sensitive?
4. did the review use the smallest correct checklist rather than relying on intuition alone?

That keeps SSR reviews consistent across human contributors and AI-assisted workflows.
