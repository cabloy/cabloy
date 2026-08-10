# Theme Guide

This guide explains how themes work in Zova within the Cabloy monorepo.

## Why Zova themes matter

Zova provides a theme system that is independent of any one UI library and supports theme switching out of the box.

This matters because Cabloy needs a frontend architecture that can survive across different edition-specific UI stacks.

## Two theme dimensions

Two major dimensions of theme switching are:

- **light/dark mode** with `light`, `dark`, and `auto`
- **brand style** changes, often centered on brand colors but not limited to them

This is an important design point: theming is not only dark-mode toggling. It is also a broader token and branding system.

## `$theme`

Zova injects `$theme` into `BeanBase`, so any bean instance can access theme state through `this.$theme`.

Important properties include:

- `name`
- `darkMode`
- `dark`
- `token`

Representative method:

- `toggleDark`

This is also why `$theme` and `$token` should be read together rather than as unrelated APIs.

## Tokens as the contract between style and theme

A token is the design-value layer that sits between CSS-in-JS styles and the active theme.

A practical split is:

- styles decide where values are consumed
- tokens define the reusable design vocabulary
- themes provide the concrete active token values

That is why token-driven styling scales better than scattering hardcoded values across many pages and components.

## Why token shape is shared in architecture but not fixed across UI libraries

The token architecture is shared across Cabloy Basic and Cabloy Start, but the exact token shape can still vary.

A practical distinction is:

- the idea of token-driven styling is shared
- the concrete token fields can still reflect the active UI library, component conventions, or project theme design

This matters because edition-sensitive UI differences should not be mistaken for a different styling architecture.

## Theme beans

Each UI library provides a default theme bean, and theme beans are responsible for returning token values and deeper theme customizations.

A practical lifecycle is:

- theme bean code defines the concrete token payload
- the active theme exposes that payload through `$theme.token`
- pages and components consume those values through `$token`
- runtime theme switching swaps the active token set without changing the broader styling architecture

Representative pattern:

```typescript
@Theme()
export class ThemeDefault implements IThemeBase {
  async apply({ dark }: IThemeApplyParams) {
    const token: ThemeToken = {
      color: {
        primary: '#1976d2',
      },
      var: {
        borderColor: '#297acc',
      },
      component: {
        page: {
          background: dark ? '#121212' : '#fff',
          color: dark ? '#fff' : '#000',
        },
      },
    };
    return { token };
  }
}
```

## Custom themes

Custom theme beans can also be created by following the same pattern.

That makes the theme system programmable rather than locked to a small fixed set of predefined skins.

## Consume tokens in pages and components

In practice, pages and components usually should not hardcode design values when those values belong to the theme vocabulary.

A practical rule is:

- use `$token` when a page or component is consuming theme-defined design values
- use `$theme` when code needs to inspect or switch the current theme state itself

This keeps token consumption separate from theme-state control while still letting both surfaces work together.

## Runtime theme switching

Representative usage pattern:

```typescript
this.$theme.name =
  this.$theme.name === 'home-theme:default' ? 'home-theme:orange' : 'home-theme:default';
```

This illustrates that theme switching is an ordinary part of the application model and can be driven directly from code.

A useful distinction is:

- dark-mode switching changes the light/dark state of the active theme flow
- brand-theme switching changes which named theme provides the token set
- both still work through the same `$theme` and token architecture

## Edition and UI-library decision gate

Before applying SSR theme rules, identify the active edition and UI library first.

In the current Cabloy monorepo context:

- Cabloy Basic currently means DaisyUI + Tailwind CSS assumptions
- Cabloy Start currently means Vuetify assumptions

The shared Zova theme architecture stays the same, but token shape, SSR output strategy, and hydration integration can vary by adapter.

That means a rule that is safe for one edition or UI library is not automatically portable to another.

## What stays shared across editions

Across Cabloy Basic and Cabloy Start, the core theme architecture remains shared:

- theme beans provide token values
- pages and components consume those values through `$token`
- runtime code can inspect or switch theme state through `$theme`
- dark mode and brand-theme switching stay part of the same model

What may still vary by edition or UI library is:

- the exact token shape
- concrete default token values
- SSR server output strategy
- client hydration and theme-finalization behavior
- integration details for a specific component library or visual system

## SSR flavor capability gate

After identifying the edition and UI library, identify the SSR flavor capability level.

A practical split is:

- Web SSR is usually the lower-authority path for final browser theme when cookie-backed SSR resolution is unavailable
- Admin SSR is the stronger path for SSR-stable theme-sensitive rendering when cookie-backed SSR resolution is available

In practice, check the request-local `$ssr.profile` and the active adapter behavior before assuming that server-rendered theme-sensitive output can exactly match the hydrated client state.

With a `public` profile, server reads of `$theme.dark`, `$theme.darkMode`, and `$token` should be treated as non-authoritative for the browser's final theme unless the active adapter explicitly documents a stronger guarantee.

With a `session` profile, SSR theme-sensitive branching can use cookie-backed state and rely on a stronger server/client match guarantee, but should still stay inside the established theme handler and hydration pipeline.

For the env-side explanation of `SSR_PROFILE`, see [SSR Environment Variables](/frontend/ssr-env). For the flavor/runtime selection model, see [Environment and Config Guide](/frontend/environment-config-guide).

## Shared development rules

Apply these rules before writing adapter-specific logic:

1. keep concrete theme values in theme beans instead of scattering them across pages or components
2. use `$token` when code consumes theme-defined design values
3. use `$theme` when code needs to inspect or switch theme state itself
4. keep adapter-specific DOM/theme application inside the active theme handler or client boot path rather than duplicating it in feature code
5. do not assume token fields are portable across UI libraries without checking the active adapter contract

## Cabloy Basic checklist: DaisyUI + Tailwind CSS

In the current `__CABLOY_BASIC__` frontend setup:

- DaisyUI + Tailwind CSS is the active UI layer
- theme beans and `$token` remain the shared architectural contract
- Web SSR emits dual dark/light SSR markers and the browser selects the final theme during bootstrap
- the active theme handler owns `data-theme` and CSS variable application

Apply these rules:

- In Web SSR, treat server-rendered reads of `$theme.dark`, `$theme.darkMode`, and theme-derived `$token` values as non-authoritative for the browser's final theme.
- Keep theme-sensitive SSR output fallback-safe or hydration-tolerant when exact browser theme matching matters.
- Defer final theme-sensitive decisions to the client when an exact browser theme match is required.
- Let the theme handler own `data-theme` and CSS variable application instead of duplicating that logic in pages or components.
- In Admin SSR, cookie-backed theme resolution is the stronger path for SSR-stable theme-sensitive branching.

## Cabloy Start comparison checklist: Vuetify

In `__CABLOY_START__`, the theme architecture is still shared, but the adapter behavior is deeper:

- Vuetify-oriented token payloads are part of the active theme contract
- the SSR adapter writes theme name, dark-variant theme data, and token payloads for hydration
- client boot reconstructs the active Vuetify theme from SSR state

Apply these comparison rules:

- Do not collapse Cabloy Start behavior into the simpler Cabloy Basic `data-theme` mental model.
- Treat Vuetify adapter state handoff and client boot hydration as part of the theme contract.
- When documenting or changing SSR theme rules, verify both the server handoff payload and the client reconstruction path.
- Web SSR still needs lower-authority assumptions when cookie-backed SSR resolution is unavailable, even though the adapter handoff is richer than in Cabloy Basic.

## Quick comparison table

| Edition      | UI library             | SSR server handoff                                                                   | Client hydration/finalization                                       | Safe Web SSR rule                                                                                                                     |
| ------------ | ---------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Cabloy Basic | DaisyUI + Tailwind CSS | Dual dark/light SSR markers plus handler-owned DOM theme output                      | Browser bootstrap resolves the final theme and applies `data-theme` | Do not treat server theme-sensitive reads as final browser truth                                                                      |
| Cabloy Start | Vuetify                | Adapter-driven SSR state including theme name, dark variant data, and token payloads | Client boot reconstructs the active Vuetify theme from SSR state    | Do not reduce Start to a Basic-style `data-theme`-only model; still treat Web SSR as lower-authority without cookie-backed resolution |

## SSR theme review checklist

Use this short review checklist when editing SSR theme behavior or reviewing AI-generated changes.

Do:

- identify the active edition marker before applying SSR theme rules
- identify the active UI library before assuming token shape or hydration behavior
- keep concrete theme values in theme beans and consume them through `$token`
- use `$theme` for theme-state control and `$token` for theme-value consumption
- verify whether the active flavor provides cookie-backed SSR theme resolution before trusting server theme reads
- keep adapter-specific theme finalization inside the existing theme handler or client boot path
- verify both server handoff and client hydration behavior when documenting or changing adapter-specific SSR theme logic
- treat Web SSR as the stricter path unless the active adapter and cookie capability clearly provide a stronger guarantee

Don't:

- do not assume Cabloy Basic and Cabloy Start use the same adapter-level SSR theme handoff
- do not assume a Basic `data-theme` pattern fully describes Vuetify-based Start behavior
- do not treat server reads of `$theme.dark`, `$theme.darkMode`, or `$token` as final browser truth in cookie-disabled Web SSR
- do not duplicate theme-finalization logic in pages or components when the active adapter already owns that responsibility

## Reviewer template

Use this short template in PR review, code review, or AI review when a change touches SSR theme behavior.

- [ ] I identified the active edition marker before reviewing SSR theme behavior.
- [ ] I identified the active UI library before assuming token shape or hydration behavior.
- [ ] I verified whether the active flavor provides cookie-backed SSR theme resolution.
- [ ] I checked whether the change treats server reads of `$theme.dark`, `$theme.darkMode`, or `$token` as lower-authority in cookie-disabled Web SSR.
- [ ] I verified that adapter-specific theme finalization stays inside the existing theme handler or client boot path.
- [ ] I checked whether the rule or behavior is shared across editions or adapter-specific.
- [ ] For Cabloy Basic, I verified the change does not over-assume a final browser theme from server-side theme-sensitive reads.
- [ ] For Cabloy Start, I verified the change respects Vuetify SSR state handoff and client reconstruction rather than reducing it to a Basic-style `data-theme`-only model.
- [ ] I verified both server handoff and client hydration behavior for the active adapter.

## Prompt-ready reviewer snippet

Use this block directly in a reviewer-agent or code-review prompt when a change touches SSR theme behavior:

```text
Review this change with the Cabloy SSR theme rules in mind.

1. Detect the active edition marker and UI library before assuming SSR theme behavior.
2. Do not assume Cabloy Basic and Cabloy Start use the same adapter-level SSR theme handoff.
3. In cookie-disabled Web SSR, do not treat server reads of $theme.dark, $theme.darkMode, or $token as final browser truth.
4. Verify that adapter-specific theme finalization stays inside the existing theme handler or client boot path.
5. Verify both server handoff and client hydration behavior for the active adapter.
6. Flag any change that collapses Vuetify-based Start behavior into a Basic-style data-theme-only mental model.
```

## Verification checklist

When changing theme behavior or writing theme-sensitive SSR code, ask:

1. which edition marker is active, and which UI library contract does that imply?
2. is the change about token design, theme state control, SSR output, or client hydration?
3. does the active flavor provide cookie-backed SSR theme resolution?
4. is this rule shared across editions, or adapter-specific?
5. does the implementation follow the existing handler and hydration path for the active UI library?

That keeps theme work scalable, edition-aware, and aligned with the real SSR capability boundary.
