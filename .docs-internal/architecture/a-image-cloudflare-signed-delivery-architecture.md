# a-image Cloudflare Integration and Signed Delivery Architecture

This note records the internal architecture and invariants introduced while implementing the `image-cloudflare` provider and promoting signed delivery to a shared `a-image` capability.

Use it when future work touches any of these areas:

- `a-image` provider contracts
- signed/private image delivery semantics
- `image-native` vs `image-cloudflare` delivery behavior
- direct creator upload or upload-via-URL flows
- image upload policy enforcement
- contract-loop verification after backend image API changes

## Purpose

This note exists to preserve the design boundaries behind the new image provider work.

Without these boundaries, future changes are likely to regress one of the following:

- private image delivery accidentally leaking a stable unsigned asset URL
- direct upload or upload-via-URL bypassing scene upload policy constraints
- provider-specific signing behavior leaking into the public `a-image` contract in an inconsistent way
- callers being allowed to downgrade a signed-only provider into a public delivery path through request payload overrides
- backend image API changes not being propagated through the Zova/Vona contract loop

## High-level outcome

The image work now has two layers of responsibility:

1. `a-image` owns the shared contract for:
   - upload and retrieval orchestration
   - signed-delivery request semantics
   - proxy-token delivery for providers that should not expose provider-native signed URLs directly
   - shared controller and upload-policy enforcement
2. each provider owns the storage and provider-native behavior for:
   - upload mechanics
   - delete mechanics
   - provider-native delivery URL composition
   - provider-native signing when that provider is configured to sign at the provider layer

This is implemented across:

- `vona/src/suite-vendor/a-image/modules/a-image/`
- `vona/src/suite-vendor/a-image/modules/image-native/`
- `vona/src/suite-vendor/a-image/modules/image-cloudflare/`

## Shared `a-image` contract additions

The public `a-image` surface was extended in these directions:

- shared delivery options in `types/image.ts`
- provider contract expansion in `types/imageProvider.ts`
- new controller entrypoints in `controller/image.ts`
- new upload-policy and delivery-token logic in `bean/bean.imageUploadPolicy.ts`
- shared orchestration in `bean/bean.image.ts`

### Shared delivery options

`a-image` now models delivery behavior explicitly instead of treating URL generation as a provider-only concern.

Important shared concepts:

- `expiresIn`
- `audience?: boolean`
- `responseMode`

These live in `IImageDeliveryOptions` and can influence both:

- `bean.image.getVariantUrl(...)`
- `bean.image.download(...)`

Protection is derived by the shared layer from resource visibility. `audience: true` binds the delivery token to the current user and forces Cabloy proxy delivery. Callers do not choose signing or proxy/provider strategy; provider client configuration decides the strategy for other private resources.

### Shared provider contract expansion

The provider execute contract now supports more than just file upload plus variant URL lookup.

New or expanded capabilities include:

- `uploadUrl(...)`
- `createDirectUpload(...)`
- delivery options flowing into `getVariantUrl(...)`
- delivery options flowing into `download(...)`

This was necessary because Cloudflare Images exposes first-class URL upload and direct creator upload flows that do not fit the older file-only upload contract.

## Signed delivery model

### Why signed delivery was promoted into `a-image`

The original Cloudflare implementation could have handled signing inside the provider only.

That was insufficient because the desired model was broader:

- `image-cloudflare` should support provider-native signed URLs
- `image-native` should also participate in signed/private delivery behavior
- callers should not need two unrelated APIs depending on provider

The result is a shared delivery request model at `a-image` level, with provider-specific implementation beneath it.

## `signedDeliveryKind`: proxy vs provider

The shared client option surface now includes:

- `signedDeliveryKind?: 'proxy' | 'provider'`

This value decides where the signed/private boundary is enforced.

### `proxy`

Use `proxy` when the provider should not hand the caller a stable provider-native private URL directly.

Current default:

- `image-native`

Behavior:

- private native images return a temporary `/image/delivery/:imageId?token=...` URL
- the backend validates that token before retrieving the provider result
- user-bound delivery (`audience: true`) uses the same proxy route regardless of provider configuration

Invariant:

- the proxy URL must be the only shareable URL the client sees
- the proxy route must not downgrade into a permanent publicly reusable asset path after token verification logic changes

### `provider`

Use `provider` when the storage provider already has a native signed delivery model that should be returned directly.

Current default:

- `image-cloudflare`

Behavior:

- private Cloudflare images return a provider-native signed URL
- `download(...)` returns a provider-native signed URL for private resources

Invariant:

- provider-native signing rules remain inside the provider module and are not duplicated in the shared controller

## Native provider boundary

`image-native` remains the reference local-storage provider.

Its core storage behavior is still:

- copy the uploaded file into public storage
- generate named variants locally
- derive custom variants lazily
- return `buffer` for original-file downloads when the request is local and unsigned

Signed delivery changes do **not** move native into provider-native URL signing.

Instead:

- `image-native` defaults to `signedDeliveryKind: 'proxy'`
- signed URLs for native flow through `bean.image` and `/image/delivery/:imageId`
- unsigned original-file download can still return `buffer`
- signed download returns a temporary URL rather than raw bytes

This preserves the local-provider behavior while still giving the framework one signed-delivery request model.

## Deferred native remote URL import boundary

Status: **deferred: security design and implementation required**

Native remote URL import is an accepted future capability, but `image-native` does not currently implement `uploadUrl(...)`. Its current contract accepts an already-local uploaded file and copies it into native storage. By contrast, `image-cloudflare` submits the requested remote URL to Cloudflare Images, so Cloudflare—not Cabloy—performs the remote retrieval.

Do not implement native URL import as a simple `fetch(url) → temporary file → native upload` path. That would create a server-side fetch boundary for attacker-controlled URLs without the protections needed to prevent SSRF, resource exhaustion, and incomplete-storage residue.

Before this capability is reopened, its design must define and verify all of the following:

- allowed scheme, hostname, port, proxy, DNS-resolution, and IP-address rules, including rejection of loopback, private, link-local, multicast, unspecified, and reserved IPv4/IPv6 destinations
- bounded redirects with fresh DNS/IP safety validation for every redirect target
- actual streamed-byte limits derived from the resolved scene policy, with safe transfer abort and cleanup when the limit is exceeded
- connection, response, idle/read, and total-transfer deadlines with cancellation behavior
- server-side content, decoded-image, and scene-policy validation; caller-declared filename, MIME type, extension, and size are hints rather than trusted proof
- deterministic cleanup of temporary downloads, partially stored native originals or variants, and any image records created before a failure

When implementation is approved, shared `a-image` orchestration must continue to own scene policy and resource persistence. `image-native` must own only the native retrieval staging and native-storage cleanup required by that approved design. Reopening requires the security design, focused negative-path tests, and cleanup semantics to be agreed before provider code changes. The standing implementation gates are tracked in [D3 of the a-image public-contract follow-up checklist](./a-image-public-contract-followup-checklist.md#d3-design-and-implement-native-remote-url-import).

## Cloudflare provider boundary

`image-cloudflare` is now a real provider instead of a mapping stub.

Its responsibilities are:

- upload local files to Cloudflare Images
- upload by remote URL
- create direct creator upload sessions
- delete hosted images
- build Cloudflare delivery URLs for named and custom variants
- build Cloudflare signed delivery URLs when delivery is signed at provider level

Implementation is split into:

- `src/bean/imageProvider.cloudflare.ts`
- `src/service/imageCloudflare.ts`
- `src/lib/cloudflareImageUrl.ts`
- `src/.metadata/index.ts`

This follows the repo preference that storage/provider mechanics with clear runtime-anchor behavior should live in `src/service`, while deterministic provider-only URL logic belongs in `src/lib`.

## Upload policy invariant

### Ordinary authenticated path

The ordinary authenticated multipart upload resolves scene-level upload policy from `imageScene` and the received file's actual metadata.

That policy includes constraints such as:

- max size
- allowed MIME types
- allowed extensions

### The new risk introduced by advanced upload flows

Direct creator upload and upload-via-URL introduce new backend entrypoints that are not backed by uploaded multipart file bytes at the same stage.

That makes it easy to accidentally do only:

- scene lookup
- provider selection
- direct upload session creation

and skip the actual upload-policy validation.

### Required invariant

All upload entrypoints that create real image resources or real upload sessions must still respect the same scene upload policy boundary.

Current rule:

- `direct-upload` must call `resolveUploadPolicy(...)`
- `upload-url` must call `resolveUploadPolicy(...)`
- request DTOs must include `size` and `mimeType` so those policy checks are possible before creating the provider action

This keeps advanced flows consistent with the ordinary authenticated multipart path.

## Privacy downgrade invariant

A critical rule of this implementation is:

- callers must not be able to weaken provider privacy policy through request payload overrides

That means user request DTOs may express intent, but they must not be allowed to downgrade a provider/client configured for signed delivery into public delivery by default.

Practical rule for current code:

- direct-upload and upload-url controller flows no longer pass caller-supplied `requireSignedURLs` into provider upload creation as authoritative override
- provider/client configuration remains the durable source of truth for whether delivery is signed by default

Future work should preserve this invariant unless a new explicit trusted-admin override model is intentionally designed and documented.

## Proxy delivery token invariant

The proxy delivery path uses a temporary JWT-backed token. Its current image payload includes:

- `imageId`
- normalized `request`
- optional `audienceUserId`

The controller verifies the route-bound token, image ID, and normalized request before it asks the provider for the underlying content. It does not contain a `targetUrl` claim. A provider can return a buffer or a URL; the controller streams the buffer or redirects to that provider URL.

`audienceUserId` is used only by the explicit Admin user-bound delivery mode. The browser supplies a second, short-lived passport-code JWT on the Cabloy URL. The normal passport guard restores the current user, and delivery compares that user to `audienceUserId`. The proxy route is therefore required for audience-bound Cloudflare delivery.

A redirect still exposes a short-lived provider URL after Cabloy authorization. A provider that requires strict identity enforcement for the complete content request must return/stream bytes through Cabloy instead of redirecting.

## Delivery expiry

The shared delivery surface accepts `expiresIn` only. The same relative TTL is forwarded to proxy JWT signing and provider-native signing so callers do not need to reconcile server, provider, and client clocks.

This does not change direct-upload draft or provider-upload expiry: those inputs remain absolute `expiry` values because they describe an upload deadline rather than a delivery credential.

## New backend API surface

The image controller exposes ordinary authenticated upload alongside direct and URL upload routes.

Representative routes:

- `POST /image/upload`
- `POST /image/direct-upload`
- `POST /image/upload-url`
- `GET /image/delivery/:imageId`

These are backend contract changes.

That means any future modifications to DTOs, route shapes, or response payloads must be treated as contract-loop work, not just local backend refactoring.

## Contract-loop verification rule for this subsystem

Because `a-image` controller DTOs are part of the backend contract surface, changes here must be followed by the normal contract-loop checks.

For the current Cabloy Basic admin path, the representative sequence is:

1. update backend contract source
2. run backend dependency refresh as needed
3. run `npm run build:zova:admin`
4. if Vona consumes refreshed frontend rest outputs, ensure dependency sync remains healthy
5. rerun targeted backend typecheck and tests

Current work validated this through:

- `npm run vona -- :tools:deps a-image`
- `npm run build:zova:admin`
- targeted image tests in `test-image`

Future changes in this area should preserve the same verification habit.

## Testing expectations for this subsystem

The provider work now expects coverage at four layers.

### 1. Shared contract behavior

Verify that `bean.image` correctly handles:

- unsigned getVariantUrl
- signed getVariantUrl
- unsigned download
- signed download
- provider differences hidden behind shared semantics

### 2. Native provider behavior

Verify that native still preserves:

- original buffer download when unsigned
- variant generation and caching behavior
- signed delivery via proxy URL

### 3. Cloudflare provider behavior

Verify that Cloudflare covers:

- local file upload
- URL upload
- direct creator upload session creation
- delete
- named variant URLs
- custom transform URLs
- provider-native signed URLs

### 4. API-level upload and delivery behavior

Verify controller-facing paths for:

- ordinary authenticated multipart upload
- direct-upload
- upload-url
- route auth behavior
- signed/public response metadata consistency

## Files that define the main design boundaries

### Shared `a-image`

- `vona/src/suite-vendor/a-image/modules/a-image/src/types/image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/types/imageProvider.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.imageUploadPolicy.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/controller/image.ts`

### Native provider

- `vona/src/suite-vendor/a-image/modules/image-native/src/bean/imageProvider.native.ts`
- `vona/src/suite-vendor/a-image/modules/image-native/src/service/imageNative.ts`

### Cloudflare provider

- `vona/src/suite-vendor/a-image/modules/image-cloudflare/src/bean/imageProvider.cloudflare.ts`
- `vona/src/suite-vendor/a-image/modules/image-cloudflare/src/service/imageCloudflare.ts`
- `vona/src/suite-vendor/a-image/modules/image-cloudflare/src/lib/cloudflareImageUrl.ts`

### Tests

- `vona/src/suite-vendor/a-test/modules/test-image/test/imageProvider.test.ts`
- `vona/src/suite-vendor/a-test/modules/test-image/test/imageNative.test.ts`
- `vona/src/suite-vendor/a-test/modules/test-image/test/imageCloudflareMapping.test.ts`
- `vona/src/suite-vendor/a-test/modules/test-image/test/imageUpload.test.ts`

## Invariants future contributors should preserve

When changing this subsystem later, preserve these rules:

- signed delivery is a shared `a-image` concept, not a Cloudflare-only trick
- `signedDeliveryKind` decides whether signing is enforced by the shared proxy layer or the provider layer
- proxy-signed delivery must never leak a stable unsigned provider URL
- advanced upload flows must still enforce scene upload policy
- request payloads must not silently downgrade provider/client privacy defaults
- contract-surface changes under `controller/image.ts` and related DTOs must be followed by the contract loop
- provider-specific mechanics belong in provider modules; shared orchestration belongs in `a-image`

## Related internal notes

- [Backend Resource Field Update Workflow](./backend-resource-field-workflow.md)
- [Resource-Bound Custom API State Ownership](./resource-custom-api-state-ownership.md)
- [Class placement A / B1 / B2](./class-placement-a-b1-b2.md)
