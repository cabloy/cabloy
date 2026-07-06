# Anonymous Token Route Pattern

This note records the backend pattern used when Vona issues a temporary token and then expects an anonymous HTTP route to consume that token directly.

Use it when future work adds or refactors flows such as:

- private file download URLs
- signed image delivery URLs
- direct-upload callback or upload entrypoints that rely on temporary route-bound tokens
- any route where the browser should succeed with a query token but without an authenticated session

## Purpose

This note exists to preserve a failure mode that is easy to reintroduce during otherwise-correct refactors.

The failure mode looks like this:

1. backend code issues a temporary token bound to a path
2. backend code returns a URL containing that token
3. tests only verify that the URL string contains the route and `token=`
4. real HTTP access still fails with `401`

This can happen even when the token itself is valid.

## Confirmed incidents

This pattern was confirmed in two production-facing module flows:

- `a-file` private download route
- `a-image` signed delivery route

Relevant files after the fix:

- `vona/src/suite-vendor/a-file/modules/a-file/src/controller/file.ts`
- `vona/src/suite-vendor/a-file/modules/a-file/src/bean/bean.fileUploadPolicy.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/controller/image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.imageUploadPolicy.ts`
- `vona/src/suite-vendor/a-test/modules/test-file/test/fileUpload.test.ts`
- `vona/src/suite-vendor/a-test/modules/test-image/test/imageNative.test.ts`

## The two invariants

An anonymous token route must satisfy both of these invariants.

### 1. The route itself must allow anonymous access

If the route is expected to work with a temporary token but without a user session, the route must be explicitly marked public:

- `@Passport.public()`

Without that, the global passport guard can reject the request before the controller gets a chance to verify the token.

Typical symptom:

- the request fails with `401`
- logs point at `GuardPassport.execute(...)`
- removing the token from the URL does not materially change the failure mode

### 2. The verify path must match the sign path exactly

Temporary JWT path verification is strict.

If token signing uses one path shape and token verification uses another, the request fails even if the token payload is otherwise correct.

The reliable rule is:

- if signing uses `this.scope.util.combineApiPath(...)`, verification should rebuild the same path with the same helper and the same arguments

Do not assume these are interchangeable:

- `this.ctx.route.routePathRaw`
- `this.ctx.path`
- `this.scope.util.combineApiPath(...)`
- absolute URLs later derived from those paths

They may look equivalent to a reader while still failing strict JWT path comparison at runtime.

## Recommended implementation pattern

### Token signing

When issuing a temporary token for a route-bound anonymous URL, bind the token to a canonical API path:

```ts
const path = this.scope.util.combineApiPath(`file/download/${data.fileId}`, false, true);
const token = await this.bean.jwt.createTempAuthToken(payload, {
  path,
  expiresIn: data.expiresIn,
});
```

### Route declaration

Mark the consuming route public when it is supposed to rely on the token instead of a session:

```ts
@Web.get('download/:fileId')
@Passport.public()
async download(...) {
  ...
}
```

### Token verification

Rebuild the same canonical path during verification instead of mixing in route metadata variants:

```ts
const payload = await this.bean.fileUploadPolicy.verifyDownloadToken(
  query.token,
  this.scope.util.combineApiPath(`file/download/${fileId}`, false, true),
);
```

The same pattern applies to image delivery and other tokenized anonymous routes.

## Testing rule

Do not stop at asserting that the generated URL contains:

- the expected route segment
- `token=`

That only proves URL composition, not that the HTTP route is actually consumable.

Every anonymous token URL should have HTTP-level coverage for at least these cases:

1. request without token -> `401`
2. request with token -> success
3. if applicable, a missing resource case -> `404`

Examples added during the fix:

- `test-file/test/fileUpload.test.ts` checks private file download route behavior
- `test-image/test/imageNative.test.ts` checks signed image delivery route behavior

## How to recognize the smell during code review

Be suspicious when all of the following are true:

1. code calls `createTempAuthToken(...)`
2. the token is bound to a path
3. the caller receives a URL meant for direct browser or client use
4. the receiving route manually verifies a token

Then immediately check:

- does the route have `@Passport.public()`?
- does verification reconstruct the same path shape used at signing time?
- does a test actually fetch the URL instead of only inspecting the string?

## Scope boundaries

Do not apply this note mechanically to every token in the repo.

It is specifically about routes where:

- the token is the primary access control boundary
- the request should succeed without a normal authenticated session
- the route is consumed as a real HTTP endpoint

This note is not automatically about:

- normal authenticated upload endpoints that also verify payload tokens
- OAuth callback/state flows with different guard semantics
- internal service-to-service token passing
- websocket flows unless they are also path-bound anonymous HTTP routes

## Verification expectations after future changes

When changing any anonymous token route:

1. run the narrowest focused tests for the affected module
2. if the route depends on SSR or generated assets, make sure the required build artifacts exist before diagnosing runtime failures
3. keep verification at the HTTP layer whenever the user-visible contract is an actual URL

For Cabloy module work, this pattern usually changes runtime access semantics, not DTO shape. That means contract-loop regeneration is not automatically required unless the public OpenAPI surface also changes.
