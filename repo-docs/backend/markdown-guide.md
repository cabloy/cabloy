# Backend Markdown Guide

This guide documents the Vona `a-markdown` module in Cabloy Basic. It is a small server-side rendering and sanitization module, not a content-management product or an HTTP API by itself.

Use this page together with:

- [Frontend Markdown Guide](/frontend/markdown-guide)
- [Validation Guide](/backend/validation-guide)
- [Serialization Guide](/backend/serialization-guide)

## What `a-markdown` provides

The module registers one global Vona bean:

```typescript
this.bean.markdown.renderHtml(markdown);
```

The public method is:

```typescript
renderHtml(markdown?: string): string
```

Its behavior is intentionally narrow:

- execution is synchronous;
- the return type is always `string`;
- missing, empty, or whitespace-only input returns `''`;
- non-empty input is parsed, rendered to HTML, and sanitized;
- parsing and rendering errors are not swallowed by a local fallback.

The module itself has no HTTP routes, controllers, DTOs, entities, database tables, migrations, locale resources, runtime configuration, or business persistence policy. A business module decides whether to store Markdown, store a derived HTML projection, return one of those values to each consumer, or delete an empty content record.

For example, Commerce Catalog treats blank Markdown as absent product content and deletes its content record. That is a catalog service decision; `renderHtml()` only returns an empty string for blank input.

## Rendering pipeline

`BeanMarkdown.renderHtml()` follows this sequence:

```text
Markdown input
  → MarkdownManager.parse(...)
  → Tiptap static renderer
  → sanitize-html with the module policy
  → sanitized HTML string
```

The parser and static renderer are initialized once at module load. The configured extension set is:

- `Markdown`
- `StarterKit`
- server-side Lowlight rendering with the common language set for fenced code blocks
- `TaskList`
- nested `TaskItem`
- `Image`
- `TableKit`
- `Highlight`

The Markdown manager enables GitHub-flavored Markdown and uses two-space indentation:

```typescript
const markdownManager = new MarkdownManager({
  extensions,
  markedOptions: { gfm: true },
  indentation: { style: 'space', size: 2 },
});
```

The module therefore supports the configured rich-text structures—such as headings, emphasis, lists, task lists, code, images, and tables—but it should not be documented as preserving arbitrary raw HTML or every feature of a general Markdown product. The extension list and sanitizer allowlist are the current contract.

## Sanitization is part of the API contract

The rendered HTML is always passed through a fixed `sanitize-html` policy. The policy is defined in source and is not a runtime configuration option that callers can replace or extend.

### Allowed document structures

The allowlist retains the structures needed by the configured rich-text output:

- document blocks: `p`, `br`, `hr`, `div`;
- headings: `h1` through `h6`;
- text marks: `em`, `strong`, `del`, `s`, `mark`;
- links: `a`;
- lists and quotes: `ol`, `ul`, `li`, `blockquote`;
- code: `code`, `pre`;
- images: `img`;
- task-list support: `input`, `label`, `span`;
- tables: `table`, `thead`, `tbody`, `tr`, `th`, `td`.

Scripts, iframes, style attributes, event-handler attributes, and other non-allowlisted elements are removed rather than preserved as arbitrary HTML.

### Allowed attributes and classes

Only the following attribute groups are retained:

- links: `href`, `rel`, `target`, `title`;
- code: `class`;
- images: `alt`, `height`, `src`, `title`, `width`;
- task inputs: `checked`, `disabled`, `type`;
- task list items: `data-type`, `data-checked`;
- task list containers: `data-type`;
- spans: `class`.

Class values are restricted by tag:

- code classes must match `language-*`;
- span classes must match `hljs-*`.

Highlight Markdown such as `==text==` renders as a bare `<mark>text</mark>` element. The renderer emits `hljs-*` token spans for supported fenced code blocks, and the narrow class policy preserves those generated syntax-highlighting tokens. `mark` has no allowed attributes; arbitrary classes, event handlers, and inline CSS do not become part of the output contract.

### URL policy

The sanitizer applies scheme checks to `href` and `src`:

- links allow `http`, `https`, and `mailto`;
- images allow only `http` and `https`;
- protocol-relative URLs are disabled;
- unsupported schemes such as `javascript:` do not survive as active link or image attributes.

This is a content-safety rule, not an authorization rule. It does not decide whether a user may publish content, whether an external image is acceptable for privacy or availability reasons, or which CSP a consuming application should deploy.

### Transformations

The sanitizer also normalizes selected rendered elements:

- every surviving anchor receives `rel="noopener noreferrer"`;
- a checkbox input keeps its checked state when present but is always forced to `disabled="disabled"`;
- a non-checkbox `input` is converted to an attribute-free `span`;
- a task `li` keeps `data-type="taskItem"` only when valid, and keeps `data-checked` only when it is exactly `true` or `false`;
- a task `ul` keeps `data-type="taskList"` only when valid;
- unrelated attributes on task list elements are discarded.

Task checkboxes are therefore presentation elements, not interactive controls.

## The authoritative server projection pattern

Commerce Catalog demonstrates the recommended source/projection boundary for a business resource:

1. An Admin form submits `descriptionMarkdown`.
2. The product service trims the Markdown.
3. The service calls `this.bean.markdown.renderHtml(markdown)`.
4. The service persists the Markdown source and generated HTML projection together.
5. The Admin DTO returns the editable Markdown to the editor.
6. The public detail DTO returns `descriptionHtml` without the editable Markdown.
7. The Web page passes that server-derived HTML to `ZMarkdownHtml`.

The core service operation is equivalent to:

```typescript
const markdown = descriptionMarkdown?.trim();
if (!markdown) {
  // The business module decides whether to remove empty content.
  return;
}

const descriptionHtml = this.bean.markdown.renderHtml(markdown);
await productContent.save({
  descriptionMarkdown: markdown,
  descriptionHtml,
});
```

The actual Commerce Catalog service uses a row-locking lookup and either updates or inserts its content record. Its important security property is that it does not trust a caller-supplied `descriptionHtml`; it derives the value from Markdown on the server.

The integration tests verify that:

- headings, strong text, tables, code, images, and nested task lists are rendered;
- task inputs are disabled;
- `javascript:` links are not retained;
- a submitted forged value such as `<script>forged</script>` is ignored in favor of newly rendered HTML;
- blank Markdown removes the product content record in that business module;
- the public detail exposes HTML while the Admin form receives Markdown.

Every create, update, import, migration/backfill, or other write path that can change Markdown must apply the same server-side projection rule. Rendering only in one Admin endpoint leaves other write paths able to create stale or unsafe derived HTML.

## Adopting Markdown in another module

Use this checklist when adding Markdown-backed content:

1. Decide whether the resource needs only Markdown or both Markdown and a derived HTML projection.
2. Keep Markdown as the editable/source field.
3. Call `this.bean.markdown.renderHtml(...)` on every authoritative write path.
4. Define a business policy for blank Markdown; do not assume `renderHtml('')` deletes records.
5. Expose the source and projection separately according to the consumer's authority.
6. Use the edition-specific Markdown form field: `basic-markdown:formFieldMarkdown` in Cabloy Basic or `start-markdown:formFieldMarkdown` in Cabloy Start.
7. Use `ZMarkdownHtml` only for HTML produced by the trusted server rendering path.
8. Add tests for blank values, invalid URL schemes, task-list output, derived HTML consistency, and forged output fields.
9. Treat external-image policy, CSP, authorization, and content lifecycle cleanup as application concerns beyond this renderer.

The matching frontend component and SSR behavior are documented in [Frontend Markdown Guide](/frontend/markdown-guide).
