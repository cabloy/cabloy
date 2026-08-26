# SSR Theme Persistence Across Profiles

Cabloy Basic uses different server authorities for the `public` and `session` SSR profiles.

## Profile-specific authorities

- `public` uses browser-local theme state. Public SSR cannot read `localStorage`, so it emits both dark/light theme markers and the browser bootstrap resolves the final value from `localStorage` or `prefers-color-scheme`. Public SSR remains cookie-blind and can remain cacheable.
- `session` uses the `themedark` cookie. Session SSR is private and can read the request cookie before rendering a concrete dark/light result.

The profile split is intentional. Making public SSR render from a theme cookie would make public HTML user-specific and would undermine the current cache/privacy boundary.

## Client replication

A Zova application keeps one reactive `BeanTheme` state. Its initial persistence backend is selected from the initial SSR profile, but that backend is not recreated when a SPA route changes profile. The effective dark boolean is therefore mirrored to the passive synchronous backend on the client:

```text
public initial state:  localStorage -> effective dark -> themedark cookie
session initial state: themedark cookie -> effective dark -> localStorage
```

This makes a later hard reload use the same visual preference in the other profile without making public SSR consume the cookie. The mirror is a browser persistence operation only; it does not alter `$ssr.profile`, route admission, public response caching, or server-side cookie policy.

`themedark` is mirrored as a resolved boolean. Public local state may retain `auto`, because the browser can evaluate `matchMedia`. A session SSR server cannot evaluate that browser media query; storing the resolved boolean in the cookie avoids falling back to a different server default on the next session render.

## Boundaries and invariants

- Public SSR must not read or serialize the theme cookie as rendering truth.
- Session SSR may use the theme cookie and remains `private, no-store`.
- Theme state is not recreated merely because client routing changes the SSR profile.
- Model persistence helpers retain the existing storage key, serialization, cookie options, and expiration behavior.
- Theme persistence failure must not turn into authentication or navigation failure; the in-memory theme remains usable.
- This note covers `themedark`. `themename` requires a separate decision because the current public/session bootstrap paths are asymmetric.

## Verification

Validate public and session cold loads, public-to-session and session-to-public navigation, the `auto` media case, `body[data-theme]`, and absence of Vue hydration warnings/page errors. Confirm public HTML remains cookie-independent and session production responses retain their private cache policy.
