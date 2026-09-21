# Demonstration Mode Guide

<Badge type="tip" text="Common" />

Demonstration Mode is an application-wide write-admission policy for shared demonstration deployments. It is provided by the first-party `a-demo` suite and uses a global Vona Guard to prevent ordinary visitors from changing demo data.

It is disabled by default. When enabled, it protects selected HTTP write methods while leaving the rest of the application's authentication and authorization policies in force.

## What Demonstration Mode does—and does not do

Demonstration Mode is a safety rail for demo data. It is **not** a replacement for:

- Passport authentication
- RBAC or domain-specific authorization
- validation and business rules
- WAF, reverse-proxy, or network controls
- database and other data-access safeguards

Approval by this Guard only lets the request continue to the normal request pipeline; it does not grant the caller any additional permission.

The policy applies to HTTP requests only. It does not protect side-effecting `GET` handlers, background jobs, scheduled work, queues, CLI execution, or other non-HTTP code. Model state-changing HTTP APIs with the protected write methods and retain their ordinary authorization rules.

## Enable Demonstration Mode

Configure the backend environment and restart Vona:

```dotenv
DEMONSTRATION_ENABLED=true
DEMONSTRATION_USERNAME_WHITELIST=admin,demo-editor
```

`DEMONSTRATION_ENABLED` enables the Guard only when its value is the exact lowercase string `true`. An unset value, an empty value, `TRUE`, `True`, and `1` all leave Demonstration Mode disabled.

Use [Runtime and Flavors](/backend/runtime-and-flavors#env-file-resolution-and-precedence) to select the active environment files and understand precedence. In a local backend setup, an uncommitted `vona/env/.env.local` is a typical place for local overrides. Deployment-injected environment values may also take precedence. For the broader configuration model, see the [Config Guide](/backend/config-guide).

Environment values are evaluated while the backend initializes. Restart Vona after changing either Demonstration Mode variable.

## Configure exempt writers

`DEMONSTRATION_USERNAME_WHITELIST` is a comma-separated list of usernames that may perform protected writes:

```dotenv
DEMONSTRATION_USERNAME_WHITELIST=admin, demo-editor, content-manager
```

The list is normalized as follows:

- surrounding whitespace is removed from each entry
- empty entries are discarded
- repeated entries are deduplicated
- usernames match entries exactly and case-sensitively

Whitelist membership is necessary but not sufficient. A protected write is admitted only when the current user is all of the following:

- authenticated
- account-active
- non-anonymous
- present in the username whitelist

If the whitelist is absent or empty while Demonstration Mode is enabled, no user qualifies for protected writes.

## Request behavior

The Guard protects these HTTP methods:

- `POST`
- `PATCH`
- `DELETE`
- `PUT`

Other methods pass through this Guard unchanged. A protected request is allowed only for an eligible whitelisted user. All other protected requests are rejected with:

| Field                  | Value                                             |
| ---------------------- | ------------------------------------------------- |
| HTTP status            | `403 Forbidden`                                   |
| Application error code | `demo-demonstration:1001`                         |
| Meaning                | The operation is forbidden in demonstration mode. |

The Guard depends on Passport-resolved account state, so it makes this decision only after the current account information is available. Passing the Demonstration Mode check does not bypass later Passport, RBAC, or business-policy checks.

## Exempt authentication routes

Demonstration Mode deliberately does not apply to the standard authentication and OAuth routes below. This keeps sign-in, sign-out, registration, account association and migration, OAuth callbacks, and token flows available while the write policy is active.

```text
/home/user/passport/logout
/home/user/passport/register
/home/user/passport/login
/home/user/passport/login/:module/:providerName/:clientName?
/home/user/passport/associate/:module/:providerName/:clientName?
/home/user/passport/migrate/:module/:providerName/:clientName?
/home/user/passport/refreshAuthToken
/home/user/passport/createPassportJwtFromOauthCode
/home/user/passport/createTempAuthToken
/auth/passport/callback
```

These are route templates used by the built-in authentication flows. They are not a general mechanism for bypassing Demonstration Mode on arbitrary URLs.

## Deploy with the `a-demo` suite

The `demo-demonstration` module is included in the current project's `a-demo` suite; no separate package installation is required.

If an operator intentionally excludes the whole suite:

```dotenv
PROJECT_DISABLED_SUITES=a-demo
```

then `demo-demonstration` and its Guard are not loaded, regardless of `DEMONSTRATION_ENABLED` or the whitelist. This is expected when a deployment does not include demo capabilities.

For ordinary policy changes, use `DEMONSTRATION_ENABLED` rather than disabling the suite. Reserve `PROJECT_DISABLED_SUITES=a-demo` for deployments that intentionally exclude all `a-demo` functionality.

## Troubleshooting

| Symptom                                | Check                                                                                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The policy appears inactive            | Confirm `DEMONSTRATION_ENABLED=true` uses exact lowercase spelling, then restart Vona and check active environment-file and deployment-variable precedence.         |
| An intended demo editor receives `403` | Confirm that the user is authenticated, active, non-anonymous, and that their username exactly matches a whitelist entry, including case.                           |
| A request is unexpectedly allowed      | Confirm whether it uses a method other than `POST`, `PATCH`, `DELETE`, or `PUT`, or whether it belongs to an exempt built-in authentication route.                  |
| The policy never loads                 | Confirm that `a-demo` is not listed in `PROJECT_DISABLED_SUITES`.                                                                                                   |
| A non-HTTP mutation still runs         | Demonstration Mode only guards applicable HTTP requests; add the appropriate authorization and execution controls to the relevant job, queue, CLI, or service path. |

## Related guides

- [Runtime and Flavors](/backend/runtime-and-flavors#env-file-resolution-and-precedence)
- [Config Guide](/backend/config-guide)
- [Controller AOP Guide](/backend/controller-aop-guide#guard)
- [Auth Guide](/backend/auth-guide)
- [User Access Guide](/backend/user-access-guide)
