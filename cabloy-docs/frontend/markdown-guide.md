# Markdown Guide

This guide explains how Markdown works across the Cabloy Basic frontend and backend. The practical contract is deliberately split into two values:

- **Markdown** is the editable source value.
- **HTML** is a server-generated presentation projection.

The Zova frontend provides the editor and the trusted-HTML display component. The Vona backend owns Markdown parsing, HTML rendering, and sanitization.

Use this page together with:

- [Form Guide](/frontend/form-guide)
- [Component Guide](/frontend/component-guide)
- [SSR ClientOnly](/frontend/ssr-client-only)
- [Backend Markdown Guide](/backend/markdown-guide)

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

The current resource options type does not add business-specific options. The renderer identifier is the important part of the contract:

```typescript
ZovaRender.field('basic-markdown:formFieldMarkdown');
```

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

| Zova role  | Responsibility in this component                                                            |
| ---------- | ------------------------------------------------------------------------------------------- |
| Controller | Owns the TipTap `Editor`, Markdown `value`, `readonly` state, form callbacks, and lifecycle |
| Render     | Composes the standard `ZFormField`, field shell, `ClientOnly`, and `EditorContent`          |
| Style      | Creates the shared rich-text CSS class used by the editor and HTML display component        |

This is a Markdown editor integrated with `ZFormField`; it is not a generic HTML editor API.

### Editor initialization

The Controller creates the browser-dependent TipTap editor in `$controllerMounted`. Its extension set includes:

- Markdown
- StarterKit
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
- the browser creates the editor after mounting;
- the editor should not be described as an SSR-rendered interactive control.

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

The exact HTML output is governed by the backend renderer and sanitizer. Do not infer support for arbitrary raw HTML, iframe embeds, inline styles, `data:` URLs, or custom classes from the presence of a TipTap extension.

## Common mistakes

1. **Storing editor HTML as the form value**
   - Keep the form value as Markdown. The editor uses `getMarkdown()` and `setContent(..., { contentType: 'markdown' })` for that reason.

2. **Trusting a client-supplied HTML field**
   - Ignore or overwrite submitted HTML. Rebuild it on the server from Markdown.

3. **Passing unknown HTML to `ZMarkdownHtml`**
   - The component uses `innerHTML` and has no frontend sanitizer.

4. **Expecting task checkboxes to be interactive**
   - The backend transforms rendered task inputs into disabled checkboxes for display.

5. **Expecting a toolbar or upload workflow from this module**
   - The module supplies an editor surface, not a toolbar specification, image upload service, remote image importer, or configurable plugin registry.

6. **Treating browser validation or presentation CSS as security**
   - The backend renderer/sanitizer is the relevant content boundary. External image availability, privacy, CSP, and application authorization remain separate concerns.

## Frontend checklist

Before integrating Markdown into a Zova feature, verify:

1. The editable field is a string containing Markdown.
2. The field metadata uses `basic-markdown:formFieldMarkdown`.
3. The form value is updated through the editor's Markdown API, not HTML.
4. Blur and readonly behavior still pass through the standard `ZFormField` contract.
5. The interactive editor is inside the expected `ClientOnly` boundary.
6. Public display uses `ZMarkdownHtml` only with server-derived sanitized HTML.
7. Public DTOs do not expose editable Markdown unless that is intentional.
8. The backend write path regenerates the HTML projection for every create, update, import, or backfill path that can change Markdown.

For the backend API and security details, continue with [Backend Markdown Guide](/backend/markdown-guide).
