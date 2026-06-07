# Upload Guide

## Why upload matters in Vona

Vona treats file upload as a request-path capability that should integrate cleanly with controller decorators, validation-style metadata, and automatic temporary-file handling.

That matters because upload flows often combine files, structured form fields, OpenAPI-facing request contracts, and cleanup responsibilities.

## Core upload model

Vona implements upload capabilities on top of Busboy.

The most important framework-facing pieces are:

- the upload interceptor enabled by `@Core.fileUpload()`
- file and field parameter decorators under `@Arg.*`
- automatic temporary-file lifecycle handling

## Upload interceptor

File upload is enabled through the upload interceptor.

Representative pattern:

```typescript
@Web.post('file')
@Core.fileUpload()
@Api.contentType('application/json')
async uploadFile(@Arg.file('file1', v.title('Upload Single File')) file1: IUploadFile) {
  return file1.file;
}
```

The upload interceptor:

- parses incoming upload data
- stores uploaded files in temporary files
- exposes those files to controller parameters
- automatically cleans up the temporary files after the business logic completes

## Single-file upload

Single-file upload usually uses `@Arg.file(...)`.

```typescript
@Arg.file('file1', v.title('Upload Single File')) file1: IUploadFile
```

`IUploadFile` includes fields such as:

- `name`
- `file`
- `info.filename`
- `info.encoding`
- `info.mimeType`

This gives controller code both the temporary file path and the original upload metadata.

## Multiple-file upload

Multiple-file upload uses `@Arg.files(...)`.

```typescript
@Arg.files('files', v.title('Upload Multiple Files')) files: IUploadFile[]
```

This is the preferred pattern when one field name represents an array of uploaded files.

## Form fields alongside files

Upload flows often include normal form fields in addition to file data.

Vona supports both:

- `@Arg.field(...)`
- `@Arg.fields(...)`

### `@Arg.field(...)`

Use this when the frontend sends one field value directly, or a serialized array-like value under a single form entry.

Representative frontend shape:

```typescript
const formData = new FormData();
formData.append('name', 'vona');
formData.append('tags', ['node', 'typescript']);
```

### `@Arg.fields(...)`

Use this when the frontend appends the same field key multiple times, for example multiple `tags` entries in `FormData`.

Representative frontend shape:

```typescript
const formData = new FormData();
formData.append('name', 'vona');
formData.append('tags', 'node');
formData.append('tags', 'typescript');
```

This distinction matters because frontend upload construction style affects how the backend should read field values.

## JSON content type note

When an upload endpoint returns JSON data, it is useful to set:

```typescript
@Api.contentType('application/json')
```

That helps keep the API contract explicit even when the client upload request is multipart-based.

## Relationship to controller design

Upload is best understood as a controller-facing request-path capability.

Read this guide together with:

- [Controller Guide](/backend/controller-guide)
- [Validation Guide](/backend/validation-guide)
- [OpenAPI Guide](/backend/openapi-guide)

These guides explain the broader request-decorator, validation, and contract-generation model that upload participates in.

A useful boundary is:

- the upload interceptor owns multipart parsing and temporary-file lifecycle
- controller decorators own request-shape declaration
- business logic should focus on what to do with the uploaded content once those two layers have normalized the input

## Typical backend workflow

A practical upload flow often looks like this:

1. enable the upload interceptor with `@Core.fileUpload()`
2. declare file and form-field parameters with `@Arg.file`, `@Arg.files`, `@Arg.field`, or `@Arg.fields`
3. apply titles or validation-oriented helpers where useful
4. process the temporary files inside the controller or delegated service logic
5. return the desired result while letting the interceptor handle cleanup

In the current repo, test upload controllers also demonstrate a broader shape with mixed usage such as:

- raw `@Arg.fields()` access to all parsed fields
- named `@Arg.field(...)` extraction
- named `@Arg.file(...)` and `@Arg.files(...)` extraction in the same endpoint

That is a good reminder that upload endpoints can stay declarative even when multipart payloads become fairly rich.

## Implementation checks for backend upload changes

When editing backend upload behavior, ask:

1. is the request-path correctly using `@Core.fileUpload()`?
2. should this parameter use `@Arg.file`, `@Arg.files`, `@Arg.field`, or `@Arg.fields`?
3. does the frontend upload construction style match the backend field decorators?
4. should the response contract explicitly declare JSON content type or related metadata?

That helps AI keep upload flows aligned with Vona’s real request and cleanup model.
