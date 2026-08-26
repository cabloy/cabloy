# Home User Account Settings Product Delivery Plan and Work Breakdown Structure

## Delivery Objective

Deliver an end-to-end vertical increment of account capabilities with security first and traceability: account settings and profile for logged-in Web/Admin users, self-service local password change, initial local password setting for OAuth-only users, and Login registration and unauthenticated password recovery.

This plan strictly follows the eight-step sequence in the [PRD](./prd.md): first establish the Account contract and profile boundaries, then complete credential/token security paths, then create shared pages and entry points, and finally close the Login capability loop with independent registration/reset contracts. `password-set` and `password-reset` remain separate at all times. This document owns delivery sequencing and completion checks; the [SRS](./srs.md) owns technical contracts, and the [test plan](./test-plan.md) owns executable acceptance and evidence.

## Delivery Principles

- The current Passport is the sole subject authority for every self-service operation; browsers cannot specify a target user, authentication record, Site, or verified state.
- Vona defines DTO/controller/OpenAPI truth first, then generates Zova consumers; generated REST/API artifacts must not be hand-edited.
- Shared account pages do not incorrectly move the Web user workspace into Admin. Account is a logged-in-user capability using actual Passport/Site admission under session SSR; Admin retains its session-SSR baseline, and public Login/registration/reset pages retain a public neutral SSR shell.
- `password-set` and `password-reset` must be separate in purpose, initial authorization, tokens, and audit.
- Profile and account-security sections each own their drafts, loading, success, and error state.
- Every security assertion must have direct backend/API proof; menus, Route Guards, SSR, or browser UI cannot replace server-side authorization proof.
- If existing persisted resources need new fields or `meta.version.ts` changes, first obtain a decision on whether to increment `vonaModule.fileVersion`; after every `meta.version.ts` change, run `npm run test`.

## Work Breakdown Structure

### Phase 10: Documentation and Security-Decision Baseline

Dependency: none.

#### WBS-HUA-10-01: Freeze planning authority and pre-implementation decision gate

Primary documents:

- `.docs-internal/business/home-user/prd.md`
- `.docs-internal/business/home-user/srs.md`
- `.docs-internal/business/home-user/test-plan.md`
- `.docs-internal/business/home-user/decisions/0001-account-settings-boundaries.md`

Tasks:

- Keep the identity, password, token, SSR, registration, and reset scope consistent among the PRD, SRS, WBS, ATP, and ADR;
- Decide ownership of the Account controller/tag and Home API OpenAPI matcher;
- Decide the editable-profile allowlist, source of the account email for the first password, password policy, session-invalidation precision, token lifetime, audit/rate limiting, and whether schema/fileVersion is involved;
- Make explicit that `password-reset` must not have its purpose, initial authorization, or replacement/enrollment semantics confused by reusable `password-set` infrastructure.

Acceptance checks:

- No open policy question leaves identity target, password, token, session, audit, or SSR behavior indeterminate;
- Every `PRD-*` requirement maps to at least one `SRS-*`, future `WBS-HUA-*`, and `ATP-HUA-*`;
- No document describes an unimplemented reset callback as an available feature.

### Phase 20: Self-Service Account Contract and Profile Boundary

Dependency: `WBS-HUA-10-01`.

#### WBS-HUA-20-01: Establish the current-account capability/read contract

Primary areas:

- `vona/src/suite/a-home/modules/home-user/`
- `zova/src/suite/a-home/modules/home-api/`
- `zova/src/suite/a-home/modules/home-passport/`

Tasks:

- Define current/capability DTOs and protected APIs for Account, with the subject derived only from the current Passport;
- Provide the necessary profile projection, `hasSimpleAuth`, capability to issue a set link, and masked email without exposing internal auth data;
- Select and implement the Account controller/tag/OpenAPI matcher strategy;
- Inspect emitted OpenAPI and generate Zova API/schema consumers through the normal forward chain.

Acceptance checks:

- Unauthenticated, forged `userId`, cross-user, and account-state-ineligible calls cannot read or alter another account;
- Generated consumers cover the expected operations, with no manual generated-file modifications;
- `SRS-ACC-01`–`SRS-ACC-04`, `SRS-API-01`–`SRS-API-02`, and `ATP-HUA-ACC-01`, `ATP-HUA-CTR-01` are traceable.

#### WBS-HUA-20-02: Lock down the profile-update boundary and Passport synchronization

Primary areas:

- Vona `home-user` Account DTO/controller/service
- Existing user/media ownership services
- Zova Account Model and `home-passport`

Tasks:

- Define a dedicated update DTO, server-side allowlist, validation, and error semantics for display name, controlled avatar, locale, and tz;
- Determine type, size, and ownership validation for avatar media references;
- Exclude email, mobile, login identifiers, roles, account status, and internal authentication fields;
- Define the Passport refresh/replacement and locale/tz synchronization path after profile success.

Acceptance checks:

- Disallowed fields and invalid/external/unowned avatars do not produce a partial update;
- After save, identity profile and preferences in the same running `$passport` are consistent;
- `SRS-PRO-*` and `ATP-HUA-PRO-01`, `ATP-HUA-PRO-02`, `ATP-HUA-PAS-01` are traceable.

#### WBS-HUA-20-03: Establish Account contract-loop checks

Primary areas:

- `zova/src/suite/a-home/modules/home-api/cli/openapi.config.ts`
- Vona OpenAPI output and generated Zova consumers
- Root `package.json`

Tasks:

- Record and verify the Account forward contract chain: Vona DTO/controller/OpenAPI → emitted-contract inspection → Zova generation;
- Record reverse-chain requirements for Account frontend routes/metadata;
- Confirm artifact names/synchronization paths for paired Web/Admin SSR/REST outputs and Vona dependency discovery.

Acceptance checks:

- Backend Account contract changes reach generated frontend consumers;
- Frontend changes affecting Web/Admin run `npm run build:zova:web`, `npm run build:zova:admin`, and `npm run deps:vona` in sequence;
- No REST-only or hand-edited generated artifact is used as a substitute.

### Phase 30: Secure Change of an Existing Local Password

Dependency: `WBS-HUA-20-*`.

#### WBS-HUA-30-01: Implement the authenticated password-change contract

Primary areas:

- `vona/src/suite/a-home/modules/home-user/`
- `vona/src/suite-vendor/a-auth/modules/auth-simple/`
- `vona/src/suite-vendor/a-vona/modules/a-user/`

Tasks:

- Implement current/new/confirm password DTOs and a protected action for the current account with existing `auth-simple`;
- Reuse verified hash/verify primitives, enforce password policy, current-password verification, account-state validation, and localized errors;
- Define a failure path in which errors do not change the hash, session, or successful audit;
- Record and test that the OAuth-only/no-local-credential branch cannot use this operation.

Acceptance checks:

- Only the correct current password and a compliant new password can complete the change; an incorrect current password, weak password, confirmation mismatch, and absent local credential all leave no partial state;
- The new credential takes effect and the old credential is invalidated according to policy;
- `SRS-PWD-*` and `ATP-HUA-PWD-01` are traceable.

#### WBS-HUA-30-02: Implement an atomic result for session invalidation and audit

Primary areas:

- Authentication token adapter/Passport services
- Account credential service
- Audit and rate-limit infrastructure

Tasks:

- Implement and prove the selected “retain current, revoke others” semantics of `SRS-SES-01`, or its approved all-token fallback;
- Combine hash change, session handling, and security audit into a defined atomic persisted result;
- Define security events, redacted fields, rate limiting, and concurrency behavior;
- Prefer `@Core.transaction(...)` for database operations that require a single commit boundary; do not perform unbounded retries of external side effects.

Acceptance checks:

- Authentication-continuation behavior exactly matches user messaging and the SRS;
- Concurrent password changes and injected failures leave no partial credential/token/audit state;
- Logs, responses, Passport, and test evidence disclose no password/hash/token;
- `SRS-SES-01`, `SRS-AUD-*`, `SRS-NFR-*`, and `ATP-HUA-SES-01`, `ATP-HUA-AUD-01`, `ATP-HUA-RATE-01` are traceable.

### Phase 40: OAuth-only Password-Set Link Issuance

Dependency: `WBS-HUA-20-*`, `WBS-HUA-30-02`.

#### WBS-HUA-40-01: Implement Passport eligibility and frontend consumer-URL set-link issue

Primary areas:

- Vona `home-user` Account capability/service/controller
- Email, token, audit, and rate-limit infrastructure

Tasks:

- Determine whether the current account lacks `auth-simple`; the browser explicitly submits email, but the subject is always derived only from Passport;
- Provide a masked hint of the existing account email and the capability to enter the flow in the capability projection, without exposing provider-internal records or complete email;
- Implement a protected set-link issue action: existing `EntityUser.email` must match after normalization and remains authoritative; an empty field uses the input only as a short-lived token-bound candidate;
- Enforce rate limiting, audit, mail-delivery failure/retry, candidate-conflict, and eligibility-state-change rules.

Acceptance checks:

- Existing `auth-simple`, invalid input, an existing-address mismatch, and client-forged user/provider/verified state cannot issue an improper link;
- An existing `EntityUser.email` can receive a link only when it matches after normalization; an empty field may use a short-lived candidate, but it must not persist at issuance, and the server does not inspect auth-provider records to derive the recipient;
- `SRS-SET-01`–`SRS-SET-03` and `ATP-HUA-SET-01`, `ATP-HUA-SET-02`, `ATP-HUA-RATE-01` are traceable.

#### WBS-HUA-40-02: Establish a purpose-bound password-set token lifecycle

Primary areas:

- Account token service/storage
- Mail callback/link construction
- Audit and rate-limit infrastructure

Tasks:

- Design and implement `password-set` TTL, purpose, subject binding, one-time consumption, revocation, supersession, canonical path, and mail-link `token` URL-query transport rules; fragment/hash transport is prohibited;
- Connect token issuance to an auditable mail-delivery strategy to avoid undefined replay or external side effects;
- Isolate it from independent `password-reset`; neither flow may be disguised as the other through a legacy reset listener.

Acceptance checks:

- Wrong purpose, expiry, revocation, replay, supersession, and competing consumption do not obtain successful eligibility;
- At most one consumer can proceed to create the first local credential;
- `SRS-TOK-01`–`SRS-TOK-02` and `ATP-HUA-TOK-01` are traceable.

### Phase 50: Public Token Consumption and First Local Credential

Dependency: `WBS-HUA-40-*`.

#### WBS-HUA-50-01: Implement the public password-set page and consumption action

Primary areas:

- Frontend `home-user` public page/route
- Vona Account token-consume action
- Zova router/public-route composition

Tasks:

- Create a token-authorized public route that explicitly declares `requiresAuth: false`;
- Present the password-set form and valid/invalid/expired states in an equivalent server/hydration shell; after hydration, capture the token from the `token` URL query and immediately restore the token-free canonical URL through router replacement; fragment/hash is unsupported;
- Authorize the consumption action with the token rather than the browser session and enforce new-password/password-confirmation validation;
- Prevent the token from appearing in long-lived state, logs, analytics, screenshots, or retained test evidence.

Acceptance checks:

- No token, malformed, expired, replayed, wrong-purpose, and wrong-path tokens safely fail;
- Publicness of the page does not bypass backend token/password/audit validation;
- `SRS-TOK-03`, `SRS-SSR-03`, and `ATP-HUA-TOK-01`, `ATP-HUA-SSR-03` are traceable.

#### WBS-HUA-50-02: Create the first auth-simple credential and handle the session result

Primary areas:

- `auth-simple` and Account credential service
- Passport/token adapter
- Audit service

Tasks:

- On successful valid-token consumption, create the first `auth-simple` credential; a token for an account with an empty email must write the token-bound candidate in the same transaction;
- Use an opaque email-digest lock and scoped business-ownership lookup for the candidate; do not add a unique index or persisted pending field;
- Apply the `SRS-SES-01` session/token policy, record a security audit, and return a safe success result;
- Prove that concurrent consumption, an already-created credential, failure, and retry do not duplicate credentials, bind an incorrect email, or leave ambiguous state.

Acceptance checks:

- A valid token succeeds only once, and the user can subsequently authenticate with the new local password;
- Every race/failure path has no duplicate credential or undefined token/session state;
- `SRS-SET-04`–`SRS-SET-06`, `SRS-SES-01`, and `ATP-HUA-TOK-01`, `ATP-HUA-SES-01`, `ATP-HUA-AUD-01` are traceable.

### Phase 60: Shared Account Experience and Site Entry Points

Dependency: `WBS-HUA-20-*`, `WBS-HUA-30-*`, `WBS-HUA-50-*`.

#### WBS-HUA-60-01: Create the shared Account page, Model, and locale

Primary areas:

- New frontend `home-user` module
- `home-passport`
- Generated Home API consumers

Tasks:

- Establish the `home-user` page structure using the module/page/model workflow supported by the Zova CLI;
- Create an Account Model and use `$useStateData(...)` for all profile/capability and independent mutation state;
- Compose two independent sections, Profile and Account Security, rendering Change Password or Set Password based on `hasSimpleAuth`;
- Add labels, errors, explicit email input, masked existing-address hints, and session-impact copy in the currently supported languages;
- Update/refresh `$passport` after a successful profile save.

Acceptance checks:

- The two sections do not contaminate each other's state;
- OAuth-only users do not see the current-password field, and users with existing local credentials do not take the set-link flow;
- No manual copy of generated APIs/types exists;
- `SRS-UI-01` and `ATP-HUA-UI-01`, `ATP-HUA-PAS-01` are traceable.

#### WBS-HUA-60-02: Implement the Web Account session-SSR route

Primary areas:

- Web Account route/page
- Web router guard / SSR composition
- Account Model initialization boundary

Tasks:

- Mark the static canonical `/home/user/account` route as `requiresAuth: true` and `ssrProfile: 'session'`; do not add a route name or alias for a route without params;
- Have server-side Passport/Site admission reject anonymous requests, and have confirmed-session SSR and the hydration initial render present equivalent private Account structures;
- Continue to validate Passport/account ownership independently in direct APIs, without treating route admission or menu visibility as authorization.

Acceptance checks:

- Anonymous requests proceed to Login in server/browser route admission and preserve a validated canonical return destination;
- A logged-in hard refresh renders Account at first paint through session SSR, with no structural hydration mismatch;
- Site denial and direct API denial are separately provable;
- `SRS-SSR-01` and `ATP-HUA-SSR-01` are traceable.

#### WBS-HUA-60-03: Integrate Account Settings entry points in Admin and Web

Primary areas:

- `home-layoutadmin`
- `home-layoutweb` or the confirmed Web user-workspace entry point
- Shared `home-user` route

Tasks:

- Insert Account Settings navigation before logout in the Admin user menu and preserve the existing behavior that closes details;
- Select and integrate an equivalent entry point in Web's logged-in-user experience;
- Do not duplicate the Account page, expose an Admin Resource to Web, or change the layout's domain ownership;
- Complete browser verification of locale, admission, and failure paths on both sides.

Acceptance checks:

- Both Web and Admin reach the shared Account capability while retaining their respective layouts;
- Admin and Web session SSR, and the neutral SSR of public token/reset pages, each comply with requirements;
- `SRS-UI-02`, `SRS-SSR-02`, and `ATP-HUA-SSR-02`, `ATP-HUA-UI-01` are traceable.

### Phase 70: Integration, Evidence, and Release Closure

Dependency: `WBS-HUA-60-*`.

#### WBS-HUA-70-01: Complete contract, security, SSR, and Playwright browser acceptance

Primary areas:

- Home User/backend/auth module-local tests
- Basic Web/Admin Playwright browser acceptance
- OpenAPI/generated consumers and paired artifacts

Tasks:

- Run defined service/action/transaction/token-race tests;
- Verify emitted OpenAPI and Home API generation;
- Run `npm run build:zova:web`, `npm run build:zova:admin`, and `npm run deps:vona` in sequence;
- Complete Web/Admin SSR, hydration, navigation, direct API, locale, and Playwright browser-acceptance journeys;
- Record the command, environment, result, and redacted evidence for every `ATP-HUA-*` according to the test plan.

Acceptance checks:

- Every PRD/SRS requirement in scope for this delivery has `ATP-HUA-*` evidence;
- No temporary waiver is expired;
- All generation, SSR, token, session, and direct-authorization paths comply with the specification;
- WBS status may be marked `verified` only when evidence is complete.

### Phase 80: Login Registration and Unauthenticated Password-Reset Closure

Dependency: `WBS-HUA-20-03`, `WBS-HUA-30-02`, `WBS-HUA-40-02`, `WBS-HUA-50-*`.

#### WBS-HUA-80-01: Integrate the Passport registration entry point

Primary areas:

- Frontend `home-login`
- Zova `home-passport`
- Existing Passport registration contract

Tasks:

- Provide a registration entry point on the Login page and a separate public registration page;
- Load the generated registration schema and reuse username, email, password, confirmation, and CAPTCHA contracts;
- Reuse the generated register mutation in the Passport Model; reuse normal JWT persistence and return navigation only when the returned Passport has current-Site admission. The default activation-pending result preserves the safe return destination, displays a confirmation-email prompt, and returns to Login; it must not duplicate a parallel registration API or state, nor grant `registeredUser` prematurely.

Acceptance checks:

- The registration page uses the generated contract and completes the public call with the bearer token disabled;
- After successful registration, a result with current-Site admission establishes Passport state and navigates only to a validated return destination; the default activation-pending result retains public confirmation state, does not show an Access denied page, and returns a safe return destination for login after confirmation;
- `SRS-REG-01`, `PRD-REG-01`, and `ATP-HUA-REG-01` are traceable.

#### WBS-HUA-80-02: Implement anonymous reset request and neutral feedback

Primary areas:

- Vona `home-user` Account DTO/controller/service
- `home-login` reset-request page
- CAPTCHA, rate-limit, mail, and Redis cooldown infrastructure

Tasks:

- Establish a public email + CAPTCHA reset-request contract;
- Use active, activated, nonempty `EntityUser.email`, and canonical `auth-simple` as current server-side recipient eligibility;
- Enforce IP rate limiting, normalized-recipient-digest cooldown, redacted audit, and mail-failure cleanup;
- Return the same `{ accepted: true }` for every eligible/suppressed/unavailable result after successful CAPTCHA, and show only generic feedback on the page.

Acceptance checks:

- The browser must not submit a user, auth record, provider, verified state, or recipient eligibility;
- Ineligible accounts, unknown addresses, cooldown, and mail/configuration failures do not issue usable reset state or alter the external response;
- `SRS-RST-01`–`SRS-RST-02`, `PRD-RST-01`–`PRD-RST-02`, and `ATP-HUA-RST-01` are traceable.

#### WBS-HUA-80-03: Implement purpose-isolated reset tokens and replacement

Primary areas:

- Vona `home-user` Account service/cache beans
- `auth-simple`, Passport token adapter, and mail infrastructure

Tasks:

- Use separate `password-reset` digest-only state, a 15-minute TTL, current pointer, and recipient cooldown; Zova submits a complete absolute token-free consumer URL, and Vona accepts only HTTP(S), without userinfo/query/fragment, where `checkOriginExact(...)` permits exact same-origin (scheme, host, effective port) or an exact match to existing `a-security:cors` `whiteList`; Vona preserves the frontend-supplied pathname, does not read or validate SSR Site, `publicPath`, or `siteId`, and adds only the `token` URL query. Request/proxy hosts cannot authorize lookalike, suffix, cross-scheme, or cross-port cross-origin destinations; production explicitly configures an HTTPS consumer origin; `dev/test` permits different ports only when both API and consumer are loopback hostnames;
- Place the raw UUID only in the mail `token` URL query added by Vona, binding it strictly to the logical `/home/user/password-reset` leaf; request/proxy headers may participate only in exact same-origin (scheme, host, effective port) determination and must not authorize lookalike, suffix, cross-scheme, or cross-port cross-origin targets; neither `SERVER_SERVE_*`, `Referer`, a client-supplied mount path, nor CORS wildcard/suffix semantics may authorize a consumer URL; do not persist the raw token; protections for query arrival at request, log, or referrer layers are handled by subsequent Referrer-Policy and log-redaction work;
- After the digest lock, acquire the shared per-user password-mutation lock, revalidate state/current pointer/eligibility while holding the lock, and call only `replacePassword()` in the transaction;
- After transaction commit, while the lock remains held, revoke server-side sessions and clean up reset state; reset must not create the first local credential for an OAuth-only user.

Acceptance checks:

- Supersession, expiry, replay, malformed payload, eligibility change, same-token concurrency, and interleaved reissue/consume safely fail;
- Only the new password is usable after successful token replacement, and old sessions are revoked;
- `SRS-RST-02`–`SRS-RST-03`, `PRD-RST-03`, and `ATP-HUA-RST-02` are traceable.

#### WBS-HUA-80-04: Implement the public reset page and Login-loop acceptance

Primary areas:

- Frontend `home-user` public reset page/route
- Canonical route and Playwright browser acceptance

Tasks:

- Provide a public, empty-layout `/home/user/password-reset` page;
- After hydration, read `token` from the route query, immediately restore the token-free canonical URL through router replacement, and retain the transient token only in controller memory;
- On success, clear browser Passport state and explicitly return to Login;
- Cover Login navigation, registration, neutral request, SSR/hydration, query scrub, invalid/reused token, and forced re-login with redacted browser evidence.

Acceptance checks:

- The SSR and hydration initial trees contain no token, private identity, or prefilled password;
- The reset page only transiently captures the token from the route query and then router-scrubs it; it must not write it to storage, Model state, or retainable artifacts;
- `SRS-RST-04`, `PRD-RST-03`–`PRD-RST-04`, and `ATP-HUA-RST-03` are traceable.

## Dependency and Contract-Loop Rules

### Vona forward chain

When adding or changing an Account DTO/controller:

1. Change contract truth in Vona;
2. Inspect emitted OpenAPI operations, schemas, authorization, and responses;
3. Generate Zova consumers through the decided Home API matcher;
4. Consume the generated `$api`/`$apiSchema` through a thin Account Model;
5. Do not hand-edit generated files.

### Zova reverse chain

When shared Account routes, metadata, pages, or resources affect Web/Admin:

```bash
npm run build:zova:web
npm run build:zova:admin
npm run deps:vona
```

The corresponding SSR bundle and REST output must be built first; running `build:rest:*` alone is not sufficient validation. If artifacts are already correct but Vona still sees stale types, reinstall `vona/node_modules` under the local dependency drift rule rather than modifying dependency links.

## Traceability Matrix

| WBS Scope                      | PRD                                                 | SRS                                    | ATP                                                                                      |
| ------------------------------ | --------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------- |
| `WBS-HUA-10-01`                | All in-scope `PRD-*`                                | All in-scope `SRS-*`                   | All planned `ATP-HUA-*`                                                                  |
| `WBS-HUA-20-*`                 | `PRD-ACC-*`, `PRD-PRO-*`                            | `SRS-ACC-*`, `SRS-PRO-*`, `SRS-API-*`  | `ATP-HUA-ACC-01`, `ATP-HUA-PRO-01`, `ATP-HUA-PRO-02`, `ATP-HUA-PAS-01`, `ATP-HUA-CTR-01` |
| `WBS-HUA-30-*`                 | `PRD-PWD-*`, `PRD-SEC-*`                            | `SRS-PWD-*`, `SRS-SES-01`, `SRS-AUD-*` | `ATP-HUA-PWD-01`, `ATP-HUA-SES-01`, `ATP-HUA-AUD-01`, `ATP-HUA-RATE-01`                  |
| `WBS-HUA-40-*`, `WBS-HUA-50-*` | `PRD-SET-*`, `PRD-SEC-02`–`PRD-SEC-03`              | `SRS-SET-*`, `SRS-TOK-*`, `SRS-SES-01` | `ATP-HUA-SET-01`, `ATP-HUA-SET-02`, `ATP-HUA-TOK-01`, `ATP-HUA-SSR-03`                   |
| `WBS-HUA-60-*`                 | `PRD-ACC-02`, `PRD-PRO-04`–`PRD-PRO-05`, `PRD-UX-*` | `SRS-UI-*`, `SRS-SSR-*`                | `ATP-HUA-UI-01`, `ATP-HUA-SSR-01`, `ATP-HUA-SSR-02`, `ATP-HUA-PAS-01`                    |
| `WBS-HUA-70-01`                | All in-scope `PRD-*`                                | All in-scope `SRS-*`                   | All applicable `ATP-HUA-*`                                                               |
| `WBS-HUA-80-01`                | `PRD-REG-01`                                        | `SRS-REG-01`                           | `ATP-HUA-REG-01`                                                                         |
| `WBS-HUA-80-02`                | `PRD-RST-01`–`PRD-RST-02`                           | `SRS-RST-01`–`SRS-RST-02`              | `ATP-HUA-RST-01`                                                                         |
| `WBS-HUA-80-03`                | `PRD-RST-03`                                        | `SRS-RST-02`–`SRS-RST-03`              | `ATP-HUA-RST-02`                                                                         |
| `WBS-HUA-80-04`                | `PRD-RST-03`–`PRD-RST-04`                           | `SRS-RST-04`                           | `ATP-HUA-RST-03`                                                                         |

## Completion and Evidence Rules

- `implementation-complete` means the code task is complete; it does not mean acceptance has passed.
- `verified` requires the ATP, command, environment, result, and redacted evidence defined by the test plan.
- Every waiver must state its owner, reason, and expiration time; when expired, it automatically becomes a blocker.
- Change the authoritative PRD or SRS record first for a requirement change, then update the WBS, test plan, ADR, and progress register.

## Related Records

- [Home User Account Settings PRD](./prd.md)
- [Home User Account Settings SRS](./srs.md)
- [Home User Account Settings Test Plan](./test-plan.md)
- [Home User Account Settings Delivery Progress](./progress.md)
- [ADR 0001: Establish Home User Account Settings Boundaries](./decisions/0001-account-settings-boundaries.md)
