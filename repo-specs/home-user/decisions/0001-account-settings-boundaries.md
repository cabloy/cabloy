# ADR 0001: Establish Home User Account Settings Boundaries

## Status

Accepted.

## Context

Cabloy Basic's `home-user` and Passport provide the foundation for current identity, registration, login, and OAuth authentication. This ADR establishes separate boundaries for editing the current user's profile, changing the local password, setting the first local password for OAuth-only users, and recovering a password while logged out. The Admin avatar menu currently offers only logout, and the Web layout has no corresponding account entry point.

Account settings involve personal profile data, authentication credentials, the account email, one-time tokens, session invalidation, auditing, the authentication-protected session SSR Account route, and neutral SSR for the public token page. If implemented as a generic User Resource, temporary code in a layout, or a superficial extension of the existing incomplete password-reset callback, the domain boundary and security prerequisites would drift.

## Problem

A self-service account boundary is needed that Web and Admin can share without conflating Site composition, administrative resource management, and authentication security responsibilities. It must also prevent “setting the first password” from being conflated with the future “forgot password” recovery flow and its authorization model.

## Decision

### Self-service account domain

`home-user` owns the current user's self-service account use cases and their consumer-facing Account contract. The current Passport is the sole target-identity source for all self-service operations; the client cannot submit or select a target `userId`, authentication-record ID, or verification status as a basis for authorization. The explicit email in password-set is only a restricted recipient/candidate input and never selects the subject.

This is not an Admin `rest-resource` user-editing page. Administrators editing another person and users editing themselves must retain separate APIs/DTOs, authorization, server-side scope, frontend state ownership, and page experiences.

### Web and Admin composition

Web and Admin share the account domain, page capabilities, Model, and security rules, while retaining ownership of their respective entry points, navigation, layouts, and Site composition:

- `home-layoutadmin` integrates the account settings entry only into the Admin avatar menu;
- Web integrates the same capability into the appropriate logged-in-user entry point;
- the Web user workspace must not be moved to Admin merely because Admin has session SSR;
- Site admission and menu visibility never replace Vona API authorization.

### Three independent credential flows

Account settings retain the following mutually independent flows:

1. **Change password**: A logged-in user with existing `auth-simple` credentials changes the local password using the current session and current password.
2. **Set password**: An OAuth-only user explicitly enters an email through the current session. An existing `EntityUser.email` must match after normalization and remains authoritative; an empty field treats the input only as a short-lived token-bound candidate. The candidate is written atomically only when a valid, one-time `password-set` token successfully creates the first `auth-simple` credential.
3. **Forgot password**: The logged-out recovery flow uses a separate `password-reset` purpose, CAPTCHA request, enumeration protection, audit, and acceptance record. Current recipient eligibility is the existing `EntityUser.email` of a scoped active/activated user together with an existing canonical `auth-simple` credential; address-level verification provenance is a later hardening item.

`password-set` and `password-reset` do not share a token purpose or product semantics, even if email and one-time-token infrastructure is reusable. Reset may only replace an existing local credential; it must not become a path for an OAuth-only user to create a first password. Both one-time tokens must be passed through the public page URL's `token` query parameter; fragment/hash is neither supported nor relied upon.

### Password-set recipient constraints

An OAuth-only user must explicitly enter the recipient address in account settings, but the input cannot select the account subject or become a general email-edit permission. If the current scoped `EntityUser.email` is non-empty, the input must match after trim/lowercase normalization; delivery uses only the existing field and must not rewrite it. If the field is empty, the normalized input is stored only in short-lived password-set digest state and is written in the same transaction only when a valid/current/one-time token successfully creates the first credential. The candidate must not enter the API response, audit/log payload, SSR/model/browser persistent state; expiration, replay, supersession, conflict, eligibility invalidation, and transaction failure must not write it. An opaque candidate digest lock plus a scoped business lookup prevents cross-user contention; no database unique index or persistent pending field is added. The server must not obtain, validate, or derive the recipient from an auth provider record or provider config. Zova generates a token-free, complete absolute password-set consumer URL; Account accepts only HTTP(S) URLs without userinfo/query/fragment whose origin is strictly authorized through `checkOriginExact(...)`: either exact same-origin (protocol, host, and effective port all match) or an exact match for the server-side `a-security:cors` `whiteList`. In `dev/test`, different ports are allowed only when both API and consumer are loopback hostnames. Vona preserves the pathname supplied by the frontend and only Vona adds the `token` URL query; it does not read or validate SSR Site, `publicPath`, or `siteId`, nor does it provide module consumer-URL configuration. The request/proxy host can prove only exact same-origin and cannot authorize a lookalike, suffix, different-protocol, or different-port cross-origin destination; `SERVER_SERVE_*`, `Referer`, the pathname entered by the browser, and CORS wildcard/suffix rules cannot authorize the email destination. The page field starts empty, and an existing address may at most be shown as a masked hint.

### Registration activation and Site admission

Default simple self-registration follows the existing email-confirmation policy: a registration-generated inactive Passport does not have `registeredUser`, and that role is assigned only on the activation event. The registration page must not treat this result as a successful login that may enter a protected return destination, nor assign the role early or change the activation policy merely to eliminate a 403. It retains the safe return destination, displays the pending email-confirmation state, and returns to Login; only a registration result already admitted to the current Site writes Passport/JWT state and then performs normal return navigation.

### Credential and session security

Authorization, field validation, rate limiting, auditing, and sensitive-data redaction for password changes, first-password setup, and token sending and consumption are performed on the server. The frontend must not persist or record plaintext passwords, password hashes, raw one-time tokens, or internal authentication records.

The existing `a-user` all-token invalidation capability and `auth-simple` hashing/validation capability may be evaluated for reuse, but the precise session-invalidation policy, transaction boundaries, and authentication-adapter ownership must be implemented only after the SRS decision gate is closed.

## Rejected or deferred options

- Implementing account settings as a generic Resource page that lets administrators edit any user.
- Letting the OAuth-only flow's email input select a subject, bypass an existing email, persist the value at issuance, or evolve into a general email-edit feature.
- Disguising `password-set` as or merging it into `password-reset`.
- Determining account capability or authorization solely from frontend OAuth state, page routes, Site ID, or menu visibility.
- Moving the Web user workspace to Admin solely to reuse cookie-aware SSR.
- Treating the currently `Not Implemented` password-reset callback as a usable end-to-end recovery flow.
- Accepting arbitrary external avatar URLs before controlled media ownership and verification mechanisms are defined.
- Implicitly adding a migration for account/token/audit persistence changes before the `fileVersion` strategy is explicit.

## Decision gates before implementation

The subsequent SRS and WBS must clarify the following before corresponding code work begins:

1. Whether the Account API remains in the `HomeUserPassport` operation family or uses a separate controller/tag, and the corresponding update to the Home API OpenAPI matcher;
2. the final editable profile-field whitelist, avatar ownership proof, and Passport synchronization response;
3. the unified password policy, current-password validation, and handling of accounts without local credentials;
4. the `password-set` explicit email input, normalized matching against an existing `EntityUser.email`, the token-bound/persist-on-success boundary for an empty-field candidate, and eligibility invalidation after that field changes;
5. persistence, TTL, single consumption, competing consumption, revocation, and canonical-path binding for the `password-set` token; token transport is fixed as the URL query `token` and does not use fragment/hash;
6. the precise policy for retaining the current session, revoking other sessions, or revoking all sessions after changing or setting a password;
7. security-event auditing, rate limiting, and email delivery failure/retry policy;
8. whether persistent fields or data structures are introduced; if so, first decide `vonaModule.fileVersion` and the migration path.

## Consequences

- An independent self-service Account DTO/API projection must be established rather than exposing internal authentication records to the browser.
- Backend contract changes are defined and OpenAPI-validated in Vona first, then Zova consumers are generated; generated artifacts must not be edited by hand.
- The shared Account page and Model must handle the difference between logged-in Web/Admin session SSR and neutral SSR for public password-set/reset token pages.
- Delivery requires evidence for direct API authorization, token lifecycle/contention, session policy, SSR/hydration, Web/Admin navigation, and sensitive-data redaction.
- Forgot-password recovery is delivered as an independent product/security contract; reusable underlying capabilities do not change its authorization and credential-semantic boundary from password-set.

## Related records

- [Home User Account Settings PRD](../prd.md)
- [Home User Account Settings SRS](../srs.md)
- [Home User Account Settings PDP/WBS](../pdp-wbs.md)
- [Home User Account Settings Test Plan](../test-plan.md)
- [User Workspace SSR Strategy](../../../repo-docs-internal/architecture/user-workspace-ssr-strategy.md)
- [Anonymous Token Route Pattern](../../../repo-docs-internal/architecture/anonymous-token-route-pattern.md)
- [ADR 0006: SSR Site Access and Role Model](../../../repo-docs-internal/decisions/0006-ssr-site-access-and-role-model.md)
- [ADR 0010: Keep Internal Planning Documents Repository-Native](../../../repo-docs-internal/decisions/0010-repository-native-planning-documents.md)
