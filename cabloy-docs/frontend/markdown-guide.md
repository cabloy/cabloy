# Markdown Guide

This guide explains how Markdown works across the Cabloy Basic frontend and backend. The practical contract is deliberately split into two values:

- **Markdown** is the editable source value.
- **HTML** is a server-generated presentation projection.

The Zova frontend provides the editor and the trusted-HTML display component. The Vona backend owns Markdown parsing, HTML rendering, and sanitization.

> [!NOTE]
> The module identity is edition-specific: Cabloy Basic uses `basic-markdown` and `zova-module-basic-markdown`; Cabloy Start uses `start-markdown` and `zova-module-start-markdown`. Substitute the matching renderer ID and import path in every example below.

Use this page together with:

- [Form Guide](/frontend/form-guide)
- [Component Guide](/frontend/component-guide)
- [SSR ClientOnly](/frontend/ssr-client-only)
- [Backend Markdown Guide](/backend/markdown-guide)
- [Image Guide](/frontend/image-guide)

> [!TIP]
> **Choose the component by data contract**
>
> - Use `basic-markdown:formFieldMarkdown` or `ZFormFieldMarkdown` to edit a Markdown string in a schema-driven form.
> - Use `basic-markdown:markdownHtml` or `ZMarkdownHtml` to display HTML that was generated and sanitized by the server.
> - Do not pass arbitrary user HTML, browser-generated HTML, or HTML from an unknown pipeline to `ZMarkdownHtml`.

## The Markdown data contract

A typical business resource keeps the authoring value and the rendered value separate:

| Surface               | Owner                             | Purpose                        | Public use                                       |
| --------------------- | --------------------------------- | ------------------------------ | ------------------------------------------------ |
| `descriptionMarkdown` | Form and backend business service | Editable source text           | Returned to an authorized editor                 |
| `descriptionHtml`     | Backend business service          | Server-derived HTML projection | Returned to a public read model when appropriate |
| `ZMarkdownHtml`       | Zova presentation layer           | Displays the HTML projection   | Receives trusted HTML only                       |

The frontend editor never needs to submit HTML. On every relevant write path, the backend should derive HTML again from the submitted Markdown. This prevents a caller from choosing a different HTML representation than the server's rendering and sanitization policy.

The Commerce Catalog product content flow is the reference implementation:

```text
Admin Markdown field
  → descriptionMarkdown
  → Vona service calls bean.markdown.renderHtml(...)
  → descriptionMarkdown + descriptionHtml are persisted
  → public detail exposes descriptionHtml
  → ZMarkdownHtml displays the server projection
```

The backend companion page documents the rendering and sanitizer contract in detail: [Backend Markdown Guide](/backend/markdown-guide).

## Configure the Markdown form field

The schema-driven renderer is selected with `ZovaRender.field`:

```typescript
import { Api, v } from 'vona-module-a-openapiutils';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

export class EntityArticleContent {
  @Api.field(v.optional(), ZovaRender.field('basic-markdown:formFieldMarkdown'))
  bodyMarkdown?: string;
}
```

The field accepts an optional `imageScene` option. When it is omitted, the editor uploads through the public `a-markdown:markdown` scene supplied by the `a-markdown` module:

```typescript
ZovaRender.field('basic-markdown:formFieldMarkdown');
```

A business module can override that default when its images need resource-specific authorization, ownership metadata, delivery behavior, or upload limits:

```typescript
ZovaRender.field('basic-markdown:formFieldMarkdown', {
  imageScene: 'article:bodyImage',
});
```

The configured scene must be registered by the backend and must return a durable `http` or `https` URL. Define scene policy, authentication, provider, and upload constraints through the image contract described in the [Image Guide](/frontend/image-guide); do not construct storage URLs in the editor.

The field value remains Markdown. It is not the editor's HTML output, and it should not be replaced with `innerHTML` or a browser DOM serialization.

A field can keep the derived HTML hidden from the editor-facing form while still exposing it in a separate public DTO. The Commerce Catalog entity follows this shape:

```typescript
@Api.field(
  v.optional(),
  ZovaRender.field('basic-markdown:formFieldMarkdown'),
)
descriptionMarkdown?: string;

@Api.field(v.optional(), ZovaRender.visible(false))
descriptionHtml?: string;
```

The exact persistence and DTO design belongs to the business module. Markdown does not require a paired HTML column, but a persisted projection can avoid repeating rendering work for public reads.

## What `ZFormFieldMarkdown` does

`ZFormFieldMarkdown` is a Zova component with the normal Controller/Render/Style split.

| Zova role  | Responsibility in this component                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Controller | Owns the TipTap `Editor`, Markdown `value`, `readonly` state, toolbar commands/state, form callbacks, and lifecycle |
| Render     | Composes the standard `ZFormField`, field shell, client-only toolbar, and `EditorContent`                           |
| Style      | Creates the shared rich-text CSS class used by the editor and HTML display component                                |

This is a Markdown editor integrated with `ZFormField`; it is not a generic HTML editor API.

### Editor initialization

The Controller creates the browser-dependent TipTap editor in `$controllerMounted`. Its extension set includes:

- Markdown
- StarterKit, with its plain code-block node replaced by `CodeBlockLowlight`
- nested `TaskList` and `TaskItem`
- Image
- TableKit
- Highlight

The initial value is interpreted as Markdown through:

```typescript
content: this.value,
contentType: 'markdown',
editable: !this.readonly,
```

The editor DOM receives the current component style class and a minimum-height/padding class. The outer field shell uses Cabloy Basic's DaisyUI-oriented classes and adds an error border when the host form field is invalid.

### Toolbar

When the field is editable, the same `ClientOnly` boundary renders a toolbar above the editor. It provides controls for:

- undo and redo;
- paragraph and heading levels 1–6;
- bold, italic, strike-through, inline code, and highlight;
- bullet, ordered, and task lists;
- blockquotes, code blocks, and horizontal rules;
- applying, updating, and removing links on the current text selection through a URL prompt;
- uploading one image through the configured image scene and inserting the finalized image at the preserved selection;
- inserting a table through an 8 × 8 floating size picker. Moving over a cell previews the rectangle from the top-left cell to that cell (for example, 2 × 3); clicking inserts that many rows and columns. Inserted tables retain a header row.

The toolbar uses native buttons and a labelled block-style select, preserves the current editor selection while buttons are clicked, exposes active and unavailable states accessibly, and runs commands on the existing TipTap editor. Image upload delegates policy loading, validation, ordinary/direct transfer, and finalization to `basic-image`. Only a finalized URL using `http` or `https` is inserted, with the source filename as image alt text when available. The image node serializes through `getMarkdown()` just like every other editor command; it does not introduce an HTML value path. To add a link, select text and enter a URL; when the cursor is in an existing link, the same action edits its URL. Submitting an empty URL removes an existing link, while cancelling leaves the document unchanged. TipTap validates the URL before applying it, but backend Markdown rendering and sanitization remain the authoritative display security boundary. The table picker also supports keyboard navigation, Enter/Space to insert, and Escape to cancel. In readonly mode, TipTap remains visible but the toolbar and picker are omitted.

When the selection is inside an editable table, a separate contextual toolbar appears above that table. It adds and deletes rows or columns around the current cell, and can delete the table. The menu shares the same `ClientOnly`, selection-preservation, accessibility, readonly, and Markdown-serialization guarantees as the persistent toolbar. Column resizing remains out of scope.

When the cursor is inside an editable code block, a floating code-block toolbar appears above the block's `<pre>` element. It contains the language selector and supports Bash, CSS, C++, C#, Go, HTML, Java, JavaScript, JSON, Markdown, PHP, Python, Rust, Shell, SQL, and TypeScript, plus Plain text. The selector remains usable while focused and disappears after leaving the code block or entering readonly mode. Changing a language updates the fenced-code information string through TipTap's document attribute and persists as Markdown; lowlight token spans are an editor-only presentation detail and are never submitted as HTML. Existing unknown fence languages remain unchanged until the author explicitly selects a supported language or Plain text.

The toolbars intentionally do not include remote image import, a color picker, or a configurable plugin registry. Use the configured image scene for uploads; remote-image import needs its own explicit authorization and persistence contract. Link editing uses the existing Markdown link and backend sanitization contracts.

### Editor-to-form flow

When TipTap emits an update, the controller calls:

```typescript
editor.getMarkdown();
```

and forwards the Markdown string to the host form field's `setValue()` method. When the editor loses focus, the controller forwards the event to the host form field's `handleBlur()` method, so the normal form validation and touched-state path remains in control.

There are no component-specific Vue `emit()` events. The effective interaction boundary is the standard form-field contract plus the editor's update and blur callbacks.

### Form-to-editor flow

The render bean binds the current `propsBucket.value` and `propsBucket.readonly` values from `ZFormField`. If the form value changes externally, the controller updates the editor with:

```typescript
this.editor.commands.setContent(value, { contentType: 'markdown' });
```

A private syncing flag prevents that programmatic update from immediately writing the same value back to the form. When `readonly` changes, the controller calls `editor.setEditable(!readonly)`.

When the component is disposed, the controller calls `editor.destroy()` so TipTap's DOM and event resources are released.

### SSR and `ClientOnly`

TipTap's `EditorContent` is browser-dependent. The editor is therefore inside Zova's `ClientOnly` component:

- SSR renders a minimum-height placeholder;
- the browser creates the toolbar and editor after mounting;
- the editor and toolbar should not be described as SSR-rendered interactive controls.

The read-only HTML display path is different: it does not need TipTap or `ClientOnly` because it receives already-generated HTML.

## Display server-generated HTML with `ZMarkdownHtml`

Use `ZMarkdownHtml` when a page has an HTML projection from a trusted backend rendering path:

```tsx
import { ZMarkdownHtml } from 'zova-module-basic-markdown';

export class ControllerArticlePage {
  public render() {
    const html = this.article?.bodyHtml;
    if (!html) return null;

    return <ZMarkdownHtml class="article-content" html={html} />;
  }
}
```

`ZMarkdownHtml` accepts `class?: string` and `html?: string`. Its render bean produces one `div`, applies the shared rich-text class, and assigns the `html` prop through `innerHTML`.

> [!WARNING]
> `ZMarkdownHtml` does **not** sanitize its input. It does not parse Markdown. Its caller is responsible for providing HTML generated by `bean.markdown.renderHtml(...)` or by an equivalent, explicitly trusted sanitizer pipeline. Treating this component as a general-purpose safe HTML sink is incorrect.

The shared rich-text style covers headings, paragraphs, ordered and unordered lists, nested task-list structure, blockquotes, inline and block code, highlight classes, links, images, horizontal rules, and tables. The style is a presentation layer; it does not change the sanitizer or URL policy.

A public product page uses this boundary:

```text
publicProduct.descriptionHtml
  → product page controller
  → <ZMarkdownHtml html={descriptionHtml} />
```

The public response should not expose the editable Markdown unless that is an intentional access-controlled contract.

## Supported Markdown features

The current frontend and backend extension sets are aligned around these features:

- StarterKit document basics: headings, paragraphs, emphasis, strong text, strike-through, blockquotes, horizontal rules, lists, and code;
- GitHub-flavored Markdown parsing on the backend;
- nested task lists;
- images;
- tables;
- highlight support in the TipTap document/rendering extensions.

The backend Markdown manager is configured with two-space indentation. Treat this as the current parser/serializer convention, not as a reason to reject every inbound document that uses another indentation style.

A representative input is:

````markdown
# Product details

This is **durable** content.

- [ ] Draft the description
  - [x] Review the link

| Field  | Value |
| ------ | ----- |
| Status | Ready |

```ts
const ready = true;
```

[Project home](https://example.com)

![Product image](https://example.com/product.png)
````

The interactive editor and the backend renderer both decorate supported fenced code blocks with Lowlight token spans for syntax highlighting. The backend projection preserves the semantic `<code class="language-*">` element and its sanitized `hljs-*` token spans. `ZMarkdownHtml` displays that trusted projection; it does not syntax-highlight arbitrary HTML itself. Do not infer support for arbitrary raw HTML, iframe embeds, inline styles, `data:` URLs, or custom classes from the presence of a TipTap extension.

## Common mistakes

1. **Storing editor HTML as the form value**
   - Keep the form value as Markdown. The editor uses `getMarkdown()` and `setContent(..., { contentType: 'markdown' })` for that reason.

2. **Trusting a client-supplied HTML field**
   - Ignore or overwrite submitted HTML. Rebuild it on the server from Markdown.

3. **Passing unknown HTML to `ZMarkdownHtml`**
   - The component uses `innerHTML` and has no frontend sanitizer.

4. **Expecting task checkboxes to be interactive**
   - The backend transforms rendered task inputs into disabled checkboxes for display.

5. **Expecting remote image import or unrelated plugin workflows from the toolbar**
   - The toolbar supports configured image-scene uploads and Markdown link editing through a URL prompt, but it does not supply remote image import, a color picker, or a configurable plugin registry.

6. **Treating browser validation or presentation CSS as security**
   - The backend renderer/sanitizer is the relevant content boundary. External image availability, privacy, CSP, and application authorization remain separate concerns.

## Frontend checklist

Before integrating Markdown into a Zova feature, verify:

1. The editable field is a string containing Markdown.
2. The field metadata uses `basic-markdown:formFieldMarkdown`.
3. The form value is updated through the editor's Markdown API, not HTML.
4. Blur and readonly behavior still pass through the standard `ZFormField` contract, and readonly mode omits toolbar controls.
5. Toolbar commands keep the value in Markdown through the editor API rather than creating an HTML submission path.
6. The interactive toolbar and editor are inside the expected `ClientOnly` boundary.
7. Public display uses `ZMarkdownHtml` only with server-derived sanitized HTML.
8. Public DTOs do not expose editable Markdown unless that is intentional.
9. The backend write path regenerates the HTML projection for every create, update, import, or backfill path that can change Markdown.

For the backend API and security details, continue with [Backend Markdown Guide](/backend/markdown-guide).
