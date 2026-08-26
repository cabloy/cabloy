# Home User Account Settings Product Requirements Document

## Purpose

`home-user` account settings provide all logged-in Cabloy users with unified self-service account capabilities: maintaining personal profile data that can be safely changed directly, and, depending on whether an `auth-simple` local credential already exists, changing the password or setting the first local password.

This capability must serve both Web and Admin sites, but self-service account settings must not be incorrectly modeled as administrator editing arbitrary users through Resource CRUD. The target of account settings is always determined by the current Passport session; the client must not specify a target `userId`.

This document defines the product outcome, scope, business rules, acceptance requirements, and implementation sequence. The subsequent SRS should define the technical contracts for DTOs, APIs, authentication providers, one-time tokens, session revocation, auditing, SSR, and testing.

## Product goals

- Let every logged-in user access the same account settings capability in Web and Admin.
- Let users save personal profile data and account security settings independently, so loading, failure, or draft state in one operation does not affect the other.
- Provide users with existing `auth-simple` local credentials a secure path to change their password.
- Provide OAuth-only users without an `auth-simple` credential a restricted “set password” path: the existing account email remains authoritative; an empty field may bind an explicitly entered candidate only when a short-lived token is successfully consumed.
- Provide logged-out users with an independent “forgot password / reset password” recovery loop, keeping its semantics, authorization, and token purpose isolated from logged-in account operations.
- Synchronize the current Passport user snapshot promptly after profile saving so that the name and avatar remain consistent across the page and the Web/Admin layouts.

## Background and current state

Currently, the Cabloy Basic Admin avatar menu offers only “Log out”; `$passport.user` already contains user identity data, but the repository has no current-user profile-editing page, self-service account API, change-password API, or usable password-recovery loop. The underlying email password-recovery capability and callback route already exist, but the `home-user` callback listener is still unimplemented and must not be considered a delivered reset-password feature.

Therefore, this requirement is not about adding a form to an existing profile page. It establishes a new self-service account product boundary.

## Users and scenarios

### Logged-in users

All logged-in Web or Admin users admitted through their respective sites. Users can view and maintain their own profile and, according to their authentication capabilities, maintain a local password; Site visibility does not replace server-side authorization.

### Users with an existing local password

The account already has an `auth-simple` credential. In the account security area, the user changes the local password with “current password, new password, confirm new password.”

### OAuth-only users

Users can log in through OAuth but do not yet have an `auth-simple` credential. In the “set password” operation for the currently authenticated account, the user explicitly enters an email, but this input never selects the subject. If `EntityUser.email` already exists, the input must match after normalization and may be delivered only to the existing field; if that field is empty, the server delivers the input only as a short-lived token-bound candidate, which is written to the field only after the first local password is successfully created on the public page. The recipient is not derived from the auth provider record.

### OAuth-only users without an account email

If the account has no non-empty `EntityUser.email`, the user may still enter a candidate email during the authenticated “set password” operation. This value is not persisted at issuance; it is atomically written to `EntityUser.email` only after the user holding the email link successfully consumes the current token and creates the first local password.

## Scope

### In scope for this release

- Provide an account settings page, account-state Model, and localized copy in the frontend `home-user` module for reuse by Web and Admin.
- Add an “Account settings” navigation item to the logged-in user's Web/Admin entry points; retain “Log out” in the Admin avatar menu and place “Account settings” before it.
- Provide two independent sections on the same page: **Personal profile** and **Account security**.
- Let users view and update the personal profile fields allowed for self-service: display name, avatar, language, and time zone.
- Determine the self-service operation's target user through the current Passport session and provide current-account reading and profile-update capabilities.
- Support secure password changes for users with an existing `auth-simple` credential.
- Support OAuth-only users in explicitly entering an email to issue a “set password” link: an existing account email must match; an empty field uses a short-lived candidate and binds it when the first local password is successfully set on the public one-time-token page.
- Provide a registration entry point in Login and establish the login state by reusing the Passport registration contract.
- Provide a CAPTCHA-protected logged-out password reset request, email link, and public new-password setup page.
- Distinguish the token purposes `password-set` and `password-reset` for first-password setup and forgot-password recovery.
- Provide understandable success, failure, and unavailable states for security actions including password changes, password setup, link sending, and password recovery.

### Out of scope for this release

- Selecting an account subject or reset target, or bypassing an existing account email, through a browser-supplied address; the restricted password-set candidate is valid only within the current Passport subject, empty account email, short-lived token state, and successful-consumption boundary.
- Email binding, recording email verification provenance, and compatibility migration for old data; current reset eligibility is based only on active, activated, existing `EntityUser.email`, and canonical `auth-simple` credentials.
- General email changes, email-verification provenance, phone-number binding, or phone-number verification; only restricted candidate-email binding on successful password-set is provided.
- MFA, login-device management, a session-management UI, OAuth-account management, renaming login identifiers, account deletion, and a security-notification center.
- Allowing administrators to edit another user's profile or authentication method through this feature.
- Implementing account settings as an Admin `rest-resource` user-editing page.
- Arbitrary external avatar URLs without the support of an existing controlled media/file ownership mechanism.

## Information architecture and entry points

### Entry points

The avatar menu for a logged-in Admin user should present:

```text
[Avatar] Username ▼
├── Account settings
└── Log out
```

Web should provide the same destination through its appropriate logged-in-user menu or personal-center entry point. The entry point may vary by site layout, but the target page, account domain, and self-service APIs must be shared.

### Page

The page is named **Account settings** and belongs to the frontend `home-user` module, not `home-layoutadmin` or another layout module. The first release uses one page with two independent Card/sections; Tabs or child routes are not required:

```text
Account settings

┌─────────────────────────────────────┐
│ Personal profile                    │
│ Avatar / Display name / Language /  │
│ Time zone                           │
│                         [Save profile] │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Account security                    │
│ With auth-simple:                   │
│ Current password / New password /   │
│ Confirm new password                │
│                         [Change password] │
│                                     │
│ Without auth-simple:                │
│ Email (explicit input; existing     │
│ email shown only as a masked hint)  │
│             [Send set-password link]│
└─────────────────────────────────────┘
```

Personal profile and account security must each own their submit, loading, success, failure, and form-draft states. Failure in either section must not block, roll back, or contaminate the other section.

## Product requirements

### Self-service account boundary

- **PRD-ACC-01**: Users may read and modify only the account represented by the current Passport; neither requests nor interfaces may provide a `userId` for specifying another target user.
- **PRD-ACC-02**: The self-service account capability must be available to logged-in users of Web and Admin; both sides reuse the same account domain, page capability, and security rules, while each may have its own navigation entry point and layout presentation.
- **PRD-ACC-03**: Self-service account APIs, DTOs, pages, and state ownership must be separate from the generic User Resource APIs/DTOs/pages used by administrators to manage other users.
- **PRD-ACC-04**: Page initialization should return product-facing account capabilities, such as whether a local password already exists, whether a set-password link can be sent, and the masked account email; the frontend must not determine the interface by exposing or inferring internal authentication records.

### Personal profile

- **PRD-PRO-01**: Users can view the current account's personal profile and independently save the display name, avatar, language, and time zone.
- **PRD-PRO-02**: The server determines editable profile fields through a whitelist; email, mobile, username, and other login identifiers must not be freely changed by this profile save.
- **PRD-PRO-03**: Avatars must use the project's controlled upload, media-reference, or file-ownership flow, with validation of file type, size, and resource ownership; an arbitrary external URL must not be the default self-service update method.
- **PRD-PRO-04**: After a successful profile save, the current Passport user snapshot must be updated or refetched so that the Web/Admin header name and avatar reflect the new values without a manual refresh.
- **PRD-PRO-05**: After language and time-zone saving succeeds, runtime preferences should synchronize through the existing Passport preference mechanism, preventing the account profile and actual interface preferences from remaining inconsistent over time.

### Changing the password with an existing local password

- **PRD-PWD-01**: When the account has an `auth-simple` credential, the account security section displays “Change password” and requires the current password, new password, and confirm-new-password fields.
- **PRD-PWD-02**: The server must confirm the user's identity and account status from the current session, verify the current password, and apply the unified password policy before updating the password hash.
- **PRD-PWD-03**: A password change must atomically complete the credential update and any required authentication-state handling; it must not report success while the password has changed but session handling or security records remain indeterminate.
- **PRD-PWD-04**: After a password change, the old authentication state must be invalidated. Prefer retaining the session for the current request while revoking other login sessions, refresh tokens, or JWT renewal capability; if the existing authentication foundation cannot yet support this policy, the first release may revoke all sessions and guide the user to log in again, but must clearly inform the user.
- **PRD-PWD-05**: After success, the user should be told about session effects, for example, “Password changed; other devices must log in again.” Passwords, password hashes, confirmation passwords, and sensitive authentication material must not appear in Passport DTOs, client-persisted state, logs, or error details.

### Login registration and logged-out password recovery

- **PRD-REG-01**: The login page must provide a registration entry point; the registration form reuses Passport's username, email, password, confirmation, and CAPTCHA contract. After successful registration, follow the existing activation policy: if the returned result has current Site admission, establish Passport/JWT state and enter the validated return destination; under the default email-confirmation policy, the registration page must retain the return destination, tell the user to check the activation email, and must not navigate an inactive user to a protected Account page.
- **PRD-RST-01**: The login page must provide a “Forgot password” entry point. The request form submits only email and CAPTCHA; whenever CAPTCHA is valid, an unknown address, disabled or inactive account, account without local credentials, recipient cooldown, email failure, or deployment unavailability must all return the same generic accepted result, and the interface must not distinguish account eligibility based on that result.
- **PRD-RST-02**: Current reset-recipient eligibility is jointly determined server-side by the scoped user's active status, activated status, non-empty `EntityUser.email`, and existing canonical `auth-simple` credential. The browser must not submit or assert the user, authentication record, verification status, or recipient eligibility. Address-level verification provenance, timing, and old-data compatibility strategy are later hardening items.
- **PRD-RST-03**: Reset uses a short-lived, single-use, digest-only `password-reset` token that is independent of `password-set` and strictly bound to the logical public `/home/user/password-reset` leaf. Zova generates a token-free complete absolute consumer URL; Account accepts only HTTP(S), without userinfo/query/fragment, whose origin is strictly authorized through `checkOriginExact(...)`: exact same-origin (protocol, host, and effective port all match) or an exact match for the server-side `a-security:cors` `whiteList`. In `dev/test`, different ports are allowed when both the API request host and consumer origin are loopback hostnames. Vona preserves the pathname supplied by the frontend and only adds the `token` URL query; it does not read or validate SSR Site, `publicPath`, or `siteId`. The request or proxy host can prove only exact same-origin and cannot authorize a lookalike, suffix, different-protocol, or different-port cross-origin destination; `SERVER_SERVE_*`, `Referer`, the pathname entered by the browser, and CORS wildcard/suffix semantics also cannot authorize the email destination. The raw token may appear only briefly in the email-link query and controller memory; production deployments should explicitly configure an HTTPS consumer origin. Consumption only replaces an existing local password; it must not create a first credential, and after revoking the server-side Passport session it must explicitly return the user to Login.
- **PRD-RST-04**: The public reset page must contain no token, private identity, or prefilled password during SSR and the initial hydration render. After hydration, the client reads the `token` URL query, immediately restores the token-free canonical URL through the router, and retains the token briefly only in controller memory.

### Setting the first local password for OAuth-only users

- **PRD-SET-01**: When the account has no `auth-simple` credential, the account security section displays “Set password,” not “Change password,” and must not display a current-password field.
- **PRD-SET-02**: When initiating password setup, the user must explicitly enter an email, and the subject must always be derived only from the current Passport. If the current scoped `EntityUser.email` is non-empty, the input must match after trim/lowercase normalization; the server delivers only to the existing field and must not rewrite it. It must not read or derive the recipient from an auth provider record.
- **PRD-SET-03**: If the current `EntityUser.email` is empty, the server may deliver to the normalized input candidate, but may bind it only to short-lived password-set token state; issuance, expiration, failure, replay, or superseded tokens must not persist the value. The page field starts empty, an existing address may at most be shown as a masked hint, and success/failure feedback must not echo the complete address.
- **PRD-SET-04**: The user enters the public page through the link and uses a still-valid, unconsumed one-time token to set a new password and confirmation password; after success, the server creates the user's first `auth-simple` credential. If the token carries a candidate issued when the field was empty, credential creation and writing that candidate to `EntityUser.email` must complete in the same transaction.
- **PRD-SET-05**: The first-password setup token must have the `password-set` purpose and must not be mixed with the logged-out password-recovery `password-reset` token.
- **PRD-SET-06**: The session refresh or revocation policy after successful password setup must be explicit, auditable, and must not reduce the OAuth-only account's existing authentication security.

### Copy and experience

- **PRD-UX-01**: Password operations for logged-in users are consistently called “Change password” or “Set password”; “Reset password / Forgot password” is used only for logged-out recovery.
- **PRD-UX-02**: The account settings page and entry points must provide localized copy in all currently supported languages, including loading, successful save, incorrect password, password-policy failure, explicit email input, link sent, and link invalid or expired states.
- **PRD-UX-03**: Account settings is an authentication-protected page. The initial SSR and client hydration UI must match, password fields must never be prefilled, and private account information must not be exposed or rendered incorrectly because of SSR, unavailable cookies, or hydration differences.

### Security and auditing

- **PRD-SEC-01**: The server performs authorization, field validation, rate limiting, and sensitive-operation auditing for profile updates, password changes, set-password link sending, and set-password token consumption; frontend Site admission and hidden buttons do not constitute authorization.
- **PRD-SEC-02**: One-time links must be short-lived and consumable only once, with safe and understandable failure results when expired, reused, invalid, or used for the wrong purpose.
- **PRD-SEC-03**: Password-related security events must at minimum record the event type, user identity, result, and necessary context needed for auditing and issue tracking, and must not record plaintext passwords or tokens.

## Key business rules

| Account capability state                   | Page action     | Required authorization basis                                                        | Result                                                                                                             |
| ------------------------------------------ | --------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `auth-simple` exists                       | Change password | Current session + current password                                                  | Update local credential and revoke old authentication state according to policy                                    |
| No `auth-simple`, but account email exists | Set password    | Current session + normalized match of explicit input to existing `EntityUser.email` | Send a `password-set` link to the existing email; create the first local credential on the public page             |
| No `auth-simple`, no account email         | Set password    | Current session + explicit input candidate                                          | Send a short-lived token-bound candidate link; create the credential and write the email on successful consumption |
| OAuth and `auth-simple` both exist         | Change password | Current session + current password                                                  | OAuth binding does not change the local-password change path                                                       |
| Logged out and forgot password             | Reset password  | CAPTCHA + currently accepted email/activation-status basis                          | Replace the existing local password through the independent `password-reset` flow                                  |

## Phased implementation sequence

The following sequence is a delivery dependency for this requirement. Subsequent implementation plans, the SRS, and task breakdowns must not invert its security prerequisites.

1. **Establish the Account self-service contract**: Define self-service APIs and DTOs for the current account, profile updates, and password-capability reads in `home-user`; make the current Passport the sole target-identity source.
2. **Lock down the profile boundary**: Determine editable profile fields and the controlled upload/media-ownership solution for avatars, and complete the Passport synchronization requirement after profile updates.
3. **Complete the change path for existing local passwords**: Implement current-password validation, password policy, atomic update, session revocation, and auditing in `auth-simple` and the related authentication layers.
4. **Complete the OAuth-only set-link path**: Require the current Passport subject to explicitly enter an email; an existing field must match after normalization and remain authoritative, while an empty field uses only a short-lived token-bound candidate that is atomically written on successful consumption; the recipient must not be derived from an auth provider record.
5. **Complete the public set-password page and token consumption**: Implement first local-password creation, one-time token validation/consumption, and authentication-state handling after success.
6. **Implement the shared account settings experience**: Create the Web/Admin shared account settings page, Account Model, and localized copy in `home-user`; implement the independent profile and account-security sections.
7. **Connect site entry points**: Add “Account settings” navigation separately to the Admin avatar menu and the logged-in Web user entry point without changing layout ownership.
8. **Complete logged-out forgot-password recovery**: Add registration to the login page, and implement the public `password-reset` request, link, and new-password setup flows; keep their purpose, initial authorization, and audit semantics separate from `password-set`.

## Acceptance criteria

This release is acceptable when all of the following conditions are met:

- Logged-in Web and Admin users can enter account settings from an appropriate entry point for each site; the Admin avatar menu retains both Account settings and Log out.
- The page presents personal profile and account security as two isolated sections; loading or failure in either operation does not affect the other.
- Users can read and update only their own permitted profile fields; after a successful profile save, the Passport name, avatar, and preferences in the same running instance are synchronized.
- Users with an existing `auth-simple` credential must provide the correct current password to change the password; password policy, confirmation password, authentication-state invalidation, and security auditing all take effect.
- OAuth-only users do not see an incorrect current-password form; when an account email exists, the input must match after normalization and delivery uses only the existing address; when the account email is empty, only a short-lived token-bound candidate may be used and it is bound only on successful consumption.
- A `password-set` link can be consumed only once within its validity period and creates the first local password on success; expired, invalid, repeated, or wrong-purpose links fail safely.
- Login provides the Passport registration entry point; successful registration preserves the normal logged-in state and safe return navigation.
- A reset request after successful CAPTCHA always provides the same generic feedback; a valid reset can only replace an existing local password, the public page does not expose the token, and success requires logging in again.
- Profile updates, password changes, password setup, and reset flows do not expose plaintext passwords, password hashes, one-time tokens, or internal authentication records.
- All supported languages contain complete copy for key pages and error states, and authentication-protected SSR and hydration do not disclose private information or produce an obvious inconsistency.

## Follow-up records

- The SRS must map every `PRD-ACC-*`, `PRD-PRO-*`, `PRD-PWD-*`, `PRD-SET-*`, `PRD-REG-*`, `PRD-RST-*`, `PRD-UX-*`, and `PRD-SEC-*` item to concrete DTOs, APIs, authentication adapters, token lifecycle, transaction and session policies, SSR constraints, and automated tests.
- Subsequent implementation plans should derive dependencies and completion checks from this PRD's “Phased implementation sequence,” rather than moving the entry page ahead of the security contract.
- Forgot-password recovery remains an independent product/security contract; even when email and one-time-token infrastructure is reused, it must not share the authorization semantics of logged-in password setup or password change.

## Traceability and supporting records

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

| PRD requirement family | Primary SRS contract                   | Primary WBS                                       | ATP                                                                    |
| ---------------------- | -------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| `PRD-ACC-*`            | `SRS-ACC-*`, `SRS-API-*`               | `WBS-HUA-20-01`, `WBS-HUA-20-03`                  | `ATP-HUA-ACC-01`, `ATP-HUA-CTR-01`                                     |
| `PRD-PRO-*`            | `SRS-PRO-*`                            | `WBS-HUA-20-02`, `WBS-HUA-60-01`                  | `ATP-HUA-PRO-01`, `ATP-HUA-PRO-02`, `ATP-HUA-PAS-01`                   |
| `PRD-PWD-*`            | `SRS-PWD-*`, `SRS-SES-01`, `SRS-AUD-*` | `WBS-HUA-30-01`, `WBS-HUA-30-02`                  | `ATP-HUA-PWD-01`, `ATP-HUA-SES-01`, `ATP-HUA-AUD-01`                   |
| `PRD-SET-*`            | `SRS-SET-*`, `SRS-TOK-*`, `SRS-SES-01` | `WBS-HUA-40-01`–`WBS-HUA-50-02`                   | `ATP-HUA-SET-01`, `ATP-HUA-SET-02`, `ATP-HUA-TOK-01`, `ATP-HUA-SSR-03` |
| `PRD-UX-*`             | `SRS-UI-*`, `SRS-SSR-*`                | `WBS-HUA-60-01`–`WBS-HUA-60-03`                   | `ATP-HUA-UI-01`, `ATP-HUA-SSR-01`, `ATP-HUA-SSR-02`                    |
| `PRD-SEC-*`            | `SRS-AUD-*`, `SRS-NFR-*`, `SRS-TOK-*`  | `WBS-HUA-30-02`, `WBS-HUA-40-02`, `WBS-HUA-70-01` | `ATP-HUA-AUD-01`, `ATP-HUA-RATE-01`, `ATP-HUA-TOK-01`                  |
| `PRD-REG-01`           | `SRS-REG-01`                           | `WBS-HUA-80-01`                                   | `ATP-HUA-REG-01`                                                       |
| `PRD-RST-*`            | `SRS-RST-*`, `SRS-AUD-*`, `SRS-NFR-*`  | `WBS-HUA-80-02`–`WBS-HUA-80-04`                   | `ATP-HUA-RST-01`, `ATP-HUA-RST-02`, `ATP-HUA-RST-03`                   |

- [Home User Account Settings Internal Planning Index](./README.md)
- [Home User Account Settings SRS](./srs.md)
- [Home User Account Settings PDP/WBS](./pdp-wbs.md)
- [Home User Account Settings Test Plan](./test-plan.md)
- [Home User Account Settings Delivery Progress](./progress.md)
- [ADR 0001: Establish Home User Account Settings Boundaries](./decisions/0001-account-settings-boundaries.md)
