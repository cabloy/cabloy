# File Guide

This guide explains the Zova file contract in Cabloy Basic. Use it with [Backend File Guide](/backend/file-guide) and [Fullstack File Workflow](/fullstack/file-workflow).

## Persisted IDs and resolved relations

`basic-file:formFieldFile` writes file IDs into the form value. A matching DTO-resolved `IFileView` relation supplies filename, size, content type, upload time, and delivery URL for rendering.

For a plural field, the usual pair is:

```text
dossierFileIds: persisted IDs
dossierFiles: resolved IFileView[] relation
```

The standard relation convention maps `fooId` to `foo` and `fooIds` to `foos`. Specify `relationName` when the business name is different.

## Built-in resources

- `basic-file:formFieldFile` manages picker interaction, upload, completed-file cards, relation synchronization, and removal.
- `basic-file:file` renders a relation-backed file value in tables.

The field controller owns interaction; it does not own persistent query caching.

## Model-owned policy state

`ModelFile` owns scene-keyed upload-policy state using `$useStateData(...)`. Rendering establishes the policy query; the field controller waits for strict policy readiness only when the user chooses files.

The policy gives the controller semantic transport information. The controller does not inspect a provider name or client configuration.

## Upload behavior

### Ordinary scenes

For an ordinary scene, the field sends one authenticated multipart request:

```text
POST /file/upload
multipart: fileScene + file
```

The completed response represents a ready file, so the controller updates the persisted ID and resolved relation together.

### Direct-capable R2 scenes

For a scene whose policy publishes `directUpload: true`, the field performs:

```text
create direct target
→ raw File request using returned method and headers
→ finalize through Cabloy
→ update form state from finalized response
```

The returned R2 target currently expects raw bytes (`PUT`) rather than the image provider’s multipart form shape. The controller applies returned headers and never forwards Cabloy credentials or cookies to the provider URL.

A direct draft ID must not enter form state, a resource mutation payload, or the resolved relation. Provider-transfer and finalization failures leave the form unchanged; backend pruning cleans abandoned drafts.

## File UI remains file-specific

The file field keeps its filename, content type, human-readable size, upload time, download action, and remove action. It intentionally does not inherit image crop, resize, thumbnail, gallery, or transform UX.

`basic-file:file` uses the resolved relation rather than constructing a provider URL from an ID. The supplied `downloadUrl` may be a Cabloy proxy URL, an R2 signed URL, or a public URL.

## Remote URL import

A browser field must not fetch an attacker-controlled URL and forward it to Cabloy. Remote URL import is a backend provider capability; Native remains unsupported. When an application exposes an authorized URL-import action, it must rely on the backend’s HTTPS-only, policy-validated remote-fetch boundary.

## Frontend checklist

1. use `basic-file:formFieldFile` with a backend-defined `fileScene`;
2. pair persisted IDs with a DTO-resolved file relation;
3. let `ModelFile` own upload-policy state;
4. branch only on policy capability, not provider identity;
5. update IDs and relations only from ready/finalized responses;
6. render delivery links from resolved file views.
