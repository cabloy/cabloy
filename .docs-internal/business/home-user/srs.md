# Home User Account Settings Software Requirements Specification

## Purpose and Authority

This document translates the [Account Settings PRD](./prd.md) into implementable, verifiable system contracts. It owns the self-service Account API/DTO, authentication and tokens, sessions, audit, SSR, frontend state, and technical acceptance requirements; the PRD continues to own product objectives, scope, and business acceptance, the [PDP/WBS](./pdp-wbs.md) owns delivery sequencing, and the [test plan](./test-plan.md) owns executable `ATP-HUA-*` scenarios and evidence.

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

Unless explicitly identified in this document as a confirmed fact of the current source code, this document specifies target contracts rather than describing existing implementations.

## System Context and Existing Ownership

| Concern                      | Current source-code fact                                                                             | Requirement of this specification                                                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Backend identity entry point | `home-user` provides Passport-oriented current, login, register, OAuth, logout, and other interfaces | Self-service accounts must form an explicit Account contract; internal adapter capabilities must not be exposed directly to browsers                         |
| Current identity state       | Zova `home-passport` owns Passport/JWT state and locale/tz synchronization                           | A successful Account profile change must refresh or replace the Passport projection under an explicit contract                                               |
| Admin entry point            | The identity menu in `home-layoutadmin` currently offers only logout                                 | The layout must only integrate navigation and must not own the Account domain or Account API                                                                 |
| Web entry point              | `home-layoutweb` currently has no identity/account entry point                                       | Web must independently decide and implement its entry point; it must not inherit layout assumptions from Admin                                               |
| Local-password primitives    | `auth-simple` provides hashing and password-verification capabilities                                | Password updates should reuse approved primitives, but a delivered password-change use case does not yet exist                                               |
| Token invalidation           | `a-user` provides a server-side primitive to remove all authentication tokens for a user             | The exact policy for invalidating the current and other sessions after password change/set must be explicitly determined                                     |
| Legacy reset callback        | The `home-user` password-reset listener is currently `Not Implemented`                               | Current recovery uses a separate Account reset contract; the legacy listener does not participate, and `password-reset` remains separate from `password-set` |
| Home API generation          | `home-api` currently matches `HomeUserPassport` operations                                           | New Account operations must explicitly choose controller/tag/matcher ownership to prevent generation drift                                                   |

## Capability and Module Ownership

| Responsibility                                                                         | Ownership                                                                                                                                |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Self-service account semantics, DTOs, server-side scope, and APIs for the current user | Vona `home-user`                                                                                                                         |
| Credential hashing, verification, and provider primitives                              | Existing authentication modules such as `auth-simple`; ownership for new use cases is determined by the pre-implementation decision gate |
| Current Passport/JWT session state                                                     | Zova `home-passport`                                                                                                                     |
| Asynchronous query/mutation state for account profile and security capabilities        | Shared Account Model, using `$useStateData(...)` to establish model-level state that affects rendering                                   |
| Account settings pages, form drafts, and local interactions                            | Frontend `home-user` page/Controller/Render boundaries                                                                                   |
| Admin/Web navigation entry points and Site composition                                 | Their respective layout modules; they do not acquire Account domain ownership                                                            |
| Email, one-time tokens, and audit infrastructure                                       | Reuse or extension of existing generic capabilities; both `password-set` and `password-reset` contracts are defined by `home-user`       |

The shared Account Model does not replace `$passport`: the former owns account-settings data and mutation lifecycles, while the latter continues to own login state and the current identity snapshot.

## Identity, Authorization, and Audience Boundaries

### SRS-ACC-01: The current Passport is the sole source of target identity

Every protected Account read, profile update, password change, and password-set-link issue operation must derive the subject user from the current Passport/request context. Request bodies, query parameters, route params, client state other than cookies, `SITE_ID`, authentication-record IDs, and user-entered email must not specify or expand the target account scope.

### SRS-ACC-02: Site admission is not API authorization

Zova Router Guards, menu visibility, and Web/Admin Site-role admission are responsible only for navigation experience. Every private API must still enforce identity, account state, and required business authorization server-side through Vona Passport/resource guards. Having Admin Site admission does not grant permission to edit another user's self-service account.

### SRS-ACC-03: Account capability is a consumer projection

The page-initialization response must provide product-required capabilities, such as the profile permitted for display, `hasSimpleAuth`, `canSendSetPasswordLink`, and the masked account email. It must not directly return an auth row, provider profile, password hash, token, internal authentication ID, or unnecessary fields from which a browser could infer security state.

### SRS-ACC-04: Web and Admin use one Account domain with distinct Site composition

Web and Admin may share Account DTOs, domain rules, page capabilities, the Account Model, and locale, while having distinct entry points, layouts, and SSR presentation. If audience, response projection, server-side authorization, or frontend-state boundaries truly differ, the API/DTO/Model/Page must be split; visual grouping alone must not conceal the differences.

## Profile Contract

### SRS-PRO-01: Self-service profile allowlist

The Account profile update must use a dedicated DTO and a server-side allowlist. The first version permits only the display name, controlled avatar reference, language, and time zone specified by the PRD; email, mobile, username, authentication-provider identifiers, account status, activation status, roles, and other login identifiers must be rejected or ignored and must not produce a partial update.

Before implementation, each permitted field must define its requiredness, clearability, normalization, length/enum validation, and error codes. Unknown, read-only, or privileged fields must not affect the persisted result.

### SRS-PRO-02: Controlled avatar ownership

The avatar field may accept only references verified through the project media/file mechanism. The server must validate type, size, ownership/availability scope, and reference validity; regardless of browser submission, an arbitrary external URL must not be treated as a valid first-version avatar.

If the existing media mechanism is insufficient, the delivery item must first select and record an avatar-ownership solution rather than substitute weak URL validation.

### SRS-PRO-03: Passport consistency after profile changes

After a successful profile update, the Account side and `$passport` must receive the same new public user projection, or the Account Model must explicitly invalidate and refetch the `current` Passport. Header name, avatar, language, and time zone must not depend on a full-page refresh to update.

### SRS-PRO-04: Runtime preference synchronization

After locale/tz is successfully saved, the existing Passport preference-synchronization mechanism should be reused so runtime locale/tz agrees with the persisted profile. On update failure, an unpersisted draft must not be treated as successfully applied global preferences.

## Password-Change Contract for Existing Local Credentials

### SRS-PWD-01: Eligibility and inputs

Only when the current account has a valid `auth-simple` credential may the page display “Change password” and allow the request fields `currentPassword`, `newPassword`, and `passwordConfirm`. OAuth-only users without local credentials must not be required to enter a current password and must not bypass the password-set flow through this operation.

### SRS-PWD-02: Server-side validation

The server must verify the current password against the account belonging to the current Passport, enforce the unified new-password policy and confirmation-match check, and verify account state. No failure may change the hash, token, session, or successful-audit state.

The source of the password policy, error classification, and localizable messages must be explicit before implementation; current rules of a registration DTO must not be assumed automatically to constitute the password-change rules.

### SRS-PWD-03: Atomic security result

A successful password change must be a definable atomic result covering at least credential-hash replacement, the prescribed session/token invalidation action, and a successful security-audit event. If any persistence step fails, the operation must not report success or leave unexplained partial security state.

The implementation should prefer existing `@Core.transaction(...)` transaction semantics. If email, notification, or other external side effects are introduced, they must not be retried unconditionally, and their retry/delivery boundaries must be separately defined.

### SRS-SES-01: Session-invalidation policy

The target policy for this delivery is: after a successful password change or first-password set, retain the session in which the current request occurs and revoke all other sessions/tokens that can continue authentication. If the authentication infrastructure does not support provable “retain current, revoke others” semantics, the first version must revoke all authentication tokens for the user and require login again.

Before implementation, it must be verified whether available token keys/adapters can express this policy precisely. Clearing only frontend local state while retaining old server-side tokens is prohibited. The user-facing success message must agree with the actual policy.

### SRS-PWD-04: Sensitive-data exclusion surface

Plaintext passwords, password confirmations, hashes, raw tokens, and unapproved authentication internals must not enter Passport DTOs, Account responses, client-persisted state, logs, error details, screenshots, or retained test evidence.

## OAuth-only First Local Password-Set Contract

### SRS-SET-01: Server-side eligibility determination

A `password-set` link may be requested only by the logged-in current account that does not yet have an `auth-simple` credential, and the subject must always be derived solely from the current Passport. The browser must submit an email with a validated format, but it must not select a user, provider, authentication record, or verified flag. If the current scoped `EntityUser.email` is nonempty, the submitted value must match after trim/lowercase normalization; the server delivers only to the existing field and must not rewrite it. If that field is empty, the server may deliver to the normalized input and retain that candidate only in short-lived password-set token state; the recipient must not be derived from auth-provider records.

Zova generates a complete absolute token-free consumer URL. Account accepts only HTTP(S), without userinfo/query/fragment, and whose origin is strictly authorized by `this.bean.security.checkOriginExact(...)`: exact same-origin (scheme, host, and effective port all match) or an exact match to server-configured `a-security:cors` `whiteList`. In `dev/test`, distinct ports are allowed when both the API request host and consumer origin are loopback hostnames. A request or proxy host can prove only exact same-origin; it cannot authorize lookalike, suffix, cross-scheme, or cross-port cross-origin destinations. Vona does not read SSR Site, `publicPath`, or `siteId`, preserves the frontend-supplied pathname, and adds the `token` URL query itself. `SERVER_SERVE_*`, `Referer`, browser-input pathname, CORS wildcard, and suffix rules must not authorize this mail destination. An account that already has `auth-simple` must not reset or overwrite its password in parallel through this flow; it must return to the password-change flow.

### SRS-SET-02: Account email and masked presentation

Account capability returns only the masked display value of the existing `EntityUser.email` and indicates eligibility for the password-set issue flow by the absence of `auth-simple`; it never returns the complete existing address or candidate. The page must explicitly input email, with an empty initial value in both SSR and hydration; an existing address may only be a masked hint. The input, success/failure feedback, API response, SSR/model/browser-persistent state, and audit must not echo the complete address.

Issue state retains a recipient snapshot; an issue against an empty field also retains `pendingEmail`. At consumption, the token/current pointer and scoped subject are revalidated first: if an existing account email no longer matches the snapshot, consumption fails; if `pendingEmail` exists, a current-instance case-insensitive lookup under an opaque candidate-email lock rejects an address already owned by another user. Only when a valid/current/one-time token successfully creates the first credential may the still-empty `EntityUser.email` be written as that candidate in the same transaction. Issue failure, expiry, replay, supersession, conflict, eligibility loss, or transaction failure must not persist the candidate; no general email edit, pending persisted field, or database unique constraint is introduced.

### SRS-SET-03: Link-issuance limits and audit

Requesting a password-set link must have server-side rate limiting and audit. Rate-limit dimensions, windows, success/rejection/retry records, and the policy for observable errors must be explicit before implementation. External mail delivery must not become a replayable transactional side effect; the boundaries for send and token persistence failure, retry, and idempotence must be auditable.

## Login Registration and Unauthenticated Password-Recovery Contract

### SRS-REG-01: Passport-owned registration

The `home-login` registration page must load the generated Passport registration schema and invoke the public register operation through the `home-passport` mutation (with the auth token disabled); it must not duplicate or create a parallel registration backend contract. If the registration result has current-Site admission, Passport JWT persistence and safe return navigation may be reused. By default, when `autoActivate: false` and simple registration has not declared confirmed, the page must not persist that inactive Passport/JWT or navigate to a protected return destination; it must preserve the validated `returnTo`, display the activation-email-pending confirmation state, and return to Login for login after confirmation. Roles are assigned only at activation and cannot grant Site admission to this page in advance.

### SRS-RST-01: Anonymous request and enumeration protection

`POST /home/user/account/password-reset/request` is a public operation using the existing CAPTCHA scene, IP enforce rate limit, and normalized-recipient digest cooldown. After CAPTCHA succeeds, it returns `{ accepted: true }` regardless of whether the account exists, is active/activated, has a canonical local credential, is in cooldown, mail is queued, or the submitted consumer URL is usable. An invalid, untrusted, or unavailable consumer URL must fail neutrally before recipient lookup: it sends no mail, creates no reset state, and may only record an approved redacted audit reason; the audit must not record a complete email, raw token, or usable link.

### SRS-RST-02: Recipient, link, and token state

The server resolves email only within the current instance scope and issues only for users who are active, activated, have nonempty `EntityUser.email`, and already have a canonical `auth-simple` credential. The current product recognizes that email and activation status as the basis for recipient eligibility; address-level verification provenance, verification time/source, and legacy-data migration are outside this delivery. Zova submits a complete absolute token-free consumer URL; Account accepts only HTTP(S), without userinfo/query/fragment, whose origin is strictly authorized through `this.bean.security.checkOriginExact(...)`: exact same-origin (scheme, host, and effective port all match) or an exact match to the server `a-security:cors` `whiteList` value. Vona does not read or validate SSR Site, `publicPath`, or `siteId`, preserves the submitted pathname, and adds the `token` URL query itself. An invalid consumer URL must fail neutrally before recipient lookup and must not send mail, create state, or cooldown. A request or proxy host can prove only exact same-origin; it cannot authorize lookalike, suffix, cross-scheme, or cross-port cross-origin destinations. `SERVER_SERVE_*`, `Referer`, browser-input pathname, CORS wildcard, and suffix rules must not authorize a mail destination. Production must explicitly configure an HTTPS consumer origin; in `dev/test`, the `checkOriginExact` policy also permits different ports when both the API request host and consumer-origin hostname are loopback (`localhost`, `127.0.0.1`, or `::1`). State uses a purpose-specific Redis cache: raw UUID v4 is used only to construct the link, while Redis stores only its SHA-256 digest, `purpose: 'password-reset'`, user ID, and logical consumer path; a current pointer supersedes old tokens, and the TTL is 15 minutes.

### SRS-RST-03: Public consumption, concurrency, and session result

`POST /home/user/account/password-reset/consume` is a public operation. After acquiring the digest lock, it acquires the shared per-user password-mutation lock and, while holding that lock, revalidates state, purpose, path, current pointer, scoped-user eligibility, and local credential; the transaction contains only durable password replacement. After transaction commit, while the lock remains held, it performs session revocation and token cleanup. Consumption may call only `replacePassword()` and must not call `createForUser()`; invalid, expired, replayed, superseded, or eligibility-lost cases all return the same non-diagnostic failure. Password change and reset share the mutation lock to prevent credential races caused by releasing the lock before commit.

### SRS-RST-04: Public page and client state

`/home/user/password-reset` uses `public` SSR and an empty layout. SSR HTML and the hydration-time initial tree must remain a token-free neutral shell; the token must not enter SSR state, local/session storage, model state, or retainable browser evidence. Only after hydration does the controller read `token` from the route query, immediately restores the token-free canonical URL through router replacement, and retains it only in controller memory; on success it clears the transient token, the Passport model clears local login state, and the user proceeds to Login. The URL query reaches the initial request and potentially logs or referrer layers; Referrer-Policy and Vona, edge, and APM log redaction are out of scope for this migration.

## One-Time Token and Public-Consumption Contract

### SRS-TOK-01: Purpose isolation

A `password-set` token must have an irreplaceable `password-set` purpose and must be isolated from `password-reset`. Token consumption must validate purpose, subject, validity period, unconsumed state, and necessary eligibility state; a token of either purpose must not be used for the other flow.

### SRS-TOK-02: Short-lived, one-time, and race-safe

Every `password-set` token must be short-lived, successfully consumable only once, and support secure handling of malformed, expired, revoked, superseded, replayed, and concurrent consumption. In a concurrent race, at most one request creates the first `auth-simple` credential and writes a successful audit event; all other requests receive a safe failure result and cannot cause duplicate credentials or undefined session state.

TTL, storage/hash representation, revocation/supersession rules, and atomic-consumption implementation must be explicit before implementation. The legacy mail-confirm callback's read-then-delete token behavior is only historical input and cannot replace this purpose-specific contract.

### SRS-TOK-03: Public token page

The public password-set page may declare `requiresAuth: false`, because the token rather than a browser session is the authorization proof. The route and consumption API must:

- Read the token from the `token` query parameter of the public page URL; they must not support or depend on URL fragment/hash transport and must avoid writing the token into long-lived client state, browser analytics, screenshots, or retained evidence;
- Bind the token to its canonical path/purpose to prevent acceptance on an incorrect page or URL;
- Provide valid, expired, invalid, and used error UI that does not disclose internal diagnostics;
- Handle authentication state after successful password setting in accordance with `SRS-SES-01`;
- Not bypass backend token validation, password policy, or audit because the route is public.

## API and Contract-Loop Contract

### SRS-API-01: Vona is the Account contract truth

Account controllers, DTOs, validation, OpenAPI schemas, and authorization annotations must be established in Vona first. Implementers must inspect emitted OpenAPI and subsequently generate Zova API/schema consumers. They must not handwrite parallel request/response types or hand-edit generated `.zova-rest`/API artifacts.

### SRS-API-02: Operation-family and OpenAPI-matcher decision

Before first generation, one of the following approaches must be selected explicitly, and the module OpenAPI configuration must include only expected operations:

1. Keep Account operations in the `HomeUserPassport` family and deliberately extend the matcher;
2. Establish a dedicated Account controller/tag and explicitly update `home-api` `operations.match`/`ignore`;
3. Establish separate operation families and consumer projections when audience or contracts genuinely diverge.

Unexpected omissions from generation, overmatching, or remediation through manual generated-file changes do not comply with this specification.

### SRS-API-03: Reverse chain and dual-flavor artifacts

When shared Account pages, routes, metadata, or frontend resources change, affected Basic artifacts must be refreshed in the following order:

```bash
npm run build:zova:web
npm run build:zova:admin
npm run deps:vona
```

Performing only a REST build is insufficient to prove that SSR bundles and REST output are synchronized. If `.zova-rest` already contains expected changes but Vona types remain stale, it must be handled under this repository's local dependency drift rule; dependency links must not be hand-edited.

## Zova Page, State, Navigation, and SSR Contract

### SRS-UI-01: Shared page and isolated state

The account-settings page belongs to frontend `home-user`. The Page Controller owns only page-local drafts, interactions, and route behavior; Render composes the profile and account-security sections in TSX; the shared asynchronous Account data/mutation state is owned by the Account Model through `$useStateData(...)`.

Profile and account security must have independent query/mutation/form state. A profile failure, password-change failure, or set-link failure must not contaminate the other section's draft, loading, success, or error state.

### SRS-UI-02: Navigation and routes

The Admin avatar menu adds an Account Settings entry before logout; Web adds an equivalent entry through the Web layout or user-workspace entry point. Navigation targets the shared capability from both sides, but the Web entry point must not be implemented as an Admin Resource or by duplicating a second Account page.

The account-settings route is protected by authentication by default. If dynamic params exist in the future, the route must define `route.name` and regenerate page metadata; the current Account route must not introduce dynamic params that can specify another person's identity for convenience.

### SRS-SSR-01: Web Account session SSR

Account is a logged-in-user capability. The static `/home/user/account` route must declare `requiresAuth: true` and `ssrProfile: 'session'`; if it has no dynamic params, it must not add a route name merely for type or alias purposes. Server-side Passport/Site admission handles anonymous access; this route provides no `/account` alias.

Confirmed Account session SSR and the browser hydration-time initial tree must be equivalent and may render the necessary private Account UI. Anonymous requests must proceed to Login and retain only a safe return destination; Site admission does not replace Vona API authorization. Anonymous `password-set`/`password-reset` token routes explicitly declare `requiresAuth: false`, use a token-free neutral shell under public SSR, and capture and scrub the token after hydration; lack of locale params itself must not change their public profile.

### SRS-SSR-02: Admin session SSR

Admin retains the actual Passport/Site admission behavior of the `session` SSR profile. Pages may render necessary private UI under a confirmed session, but successful SSR or Admin-menu visibility must not relax Account API server-side authorization, cache control, or sensitive-profile exclusion surface.

### SRS-SSR-03: Public password-set/reset pages

Public token pages keep an equivalent structure free of token disclosure between server rendering and the hydration initial render. Password fields are never SSR-prefilled; token validation and private success information must not form a hydration branch that differs from server HTML. `password-set` and `password-reset` capture the token from the `token` query only after hydration, promptly scrub the URL with router replacement, and do not share token purpose or consumer state.

## Error, Privacy, and Audit Contract

### SRS-AUD-01: Security audit

At minimum, auditable events must be recorded for password change, password-set issue/consume, password-reset request/consume, and security-related rejection results. Events should contain approved actor/subject, action, result, time, and necessary correlation/security context; they must not contain passwords, hashes, raw tokens, complete sensitive email, or unapproved authentication internals.

### SRS-AUD-02: Client security errors

Errors received by the client must be localizable and support user remediation while not disclosing token internal state, provider details, the existence of other accounts, or diagnostic stacks. Internal audit/operational reasons and user-visible messages must be separated.

### SRS-NFR-01: Concurrency and failure safety

Credential-, token-, and session-coupled operations must define their transaction and race behavior. Each independent caller in backend tests uses `app.bean.executor.mockCtx(...)`; deliberately competing calls launch concurrently in separate contexts and assert the combined persisted outcome rather than relying on runner scheduling.

### SRS-NFR-02: Test-data and evidence minimization

Tests, logs, screenshots, and retained evidence may use only synthetic or redacted account data; they must not retain plaintext passwords, hashes, raw tokens, usable email links, or real identity data. Every test-owned persisted resource must be precisely deleted in `finally` in reverse dependency order.

## Nonfunctional and Technical Acceptance

- Every Account API must behave consistently with its explicitly defined server-side boundary under no authentication, a cross-user forged target, a disabled/ineligible account state, and ordinary valid calls.
- Every password/token operation must cover invalid input, expiry/replay, concurrency, and failure paths that produce no partial persisted state.
- Web, Admin, and public token pages must separately verify SSR, hydration, navigation admission, and direct API authorization; no UI-admission test can replace an API test.
- Every change involving DTOs/controllers must verify OpenAPI and generated consumers; every change involving Web/Admin frontend reverse inputs must verify paired SSR/REST builds and dependency synchronization.
- If implementation must change `meta.version.ts` or add a field to an existing persisted module, it must first ask whether to increment `vonaModule.fileVersion`; after any `meta.version.ts` change, it must run `npm run test`.

## Acceptance Mapping

| SRS Contract              | PRD Requirement           | WBS                                               | ATP                                                  |
| ------------------------- | ------------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| `SRS-ACC-*`               | `PRD-ACC-*`               | `WBS-HUA-20-01`                                   | `ATP-HUA-ACC-01`, `ATP-HUA-CTR-01`                   |
| `SRS-PRO-*`               | `PRD-PRO-*`               | `WBS-HUA-20-02`                                   | `ATP-HUA-PRO-01`, `ATP-HUA-PRO-02`, `ATP-HUA-PAS-01` |
| `SRS-PWD-*`, `SRS-SES-01` | `PRD-PWD-*`               | `WBS-HUA-30-01`, `WBS-HUA-30-02`                  | `ATP-HUA-PWD-01`, `ATP-HUA-SES-01`                   |
| `SRS-SET-*`, `SRS-TOK-*`  | `PRD-SET-*`, `PRD-SEC-02` | `WBS-HUA-40-01`–`WBS-HUA-50-02`                   | `ATP-HUA-SET-01`, `ATP-HUA-SET-02`, `ATP-HUA-TOK-01` |
| `SRS-UI-*`, `SRS-SSR-*`   | `PRD-ACC-02`, `PRD-UX-*`  | `WBS-HUA-60-01`–`WBS-HUA-60-03`                   | `ATP-HUA-SSR-01`, `ATP-HUA-SSR-02`, `ATP-HUA-UI-01`  |
| `SRS-AUD-*`, `SRS-NFR-*`  | `PRD-SEC-*`               | `WBS-HUA-30-02`, `WBS-HUA-40-02`, `WBS-HUA-70-01` | `ATP-HUA-AUD-01`, `ATP-HUA-RATE-01`                  |
| `SRS-API-*`               | `PRD-ACC-03`, `PRD-UX-03` | `WBS-HUA-20-03`, `WBS-HUA-70-01`                  | `ATP-HUA-CTR-01`                                     |
| `SRS-REG-01`              | `PRD-REG-01`              | `WBS-HUA-80-01`                                   | `ATP-HUA-REG-01`                                     |
| `SRS-RST-01`–`SRS-RST-02` | `PRD-RST-01`–`PRD-RST-02` | `WBS-HUA-80-02`, `WBS-HUA-80-03`                  | `ATP-HUA-RST-01`, `ATP-HUA-RST-02`                   |
| `SRS-RST-03`–`SRS-RST-04` | `PRD-RST-03`–`PRD-RST-04` | `WBS-HUA-80-03`, `WBS-HUA-80-04`                  | `ATP-HUA-RST-02`, `ATP-HUA-RST-03`                   |

## Related Records

- [Home User Account Settings PRD](./prd.md)
- [Home User Account Settings PDP/WBS](./pdp-wbs.md)
- [Home User Account Settings Test Plan](./test-plan.md)
- [ADR 0001: Establish Home User Account Settings Boundaries](./decisions/0001-account-settings-boundaries.md)
- [User Workspace SSR Strategy](../../architecture/user-workspace-ssr-strategy.md)
- [Anonymous Token Route Pattern](../../architecture/anonymous-token-route-pattern.md)
- [Backend Test Resource Lifecycle](../../architecture/backend-test-resource-lifecycle.md)
