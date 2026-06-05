# SSR SEO Meta

This page migrates the highest-value ideas from the legacy Zova SEO-meta SSR documentation.

## What SEO meta covers

SEO meta is not only about the page title.

It can also control:

- `<meta>` tags
- `<html>` attributes
- `<body>` attributes
- `<style>` and `<script>` tags in the document head
- `<noscript>` tags

## `$useMeta`

Zova provides `$useMeta` on `BeanBase` so SSR-aware metadata can be declared in application code.

Representative shape:

```typescript
this.$useMeta({
  title: 'Index Page',
  titleTemplate: title => `${title} - My Website`,
  meta: {
    description: { name: 'description', content: 'Page 1' },
  },
});
```

## Static and reactive metadata

The legacy docs highlighted two useful modes:

- **static meta** for values known at initialization time
- **reactive meta** for values that should update when bound state changes

That makes SEO metadata part of the reactive application model, not just a one-time page constant.

## Overwrite behavior

Calling `$useMeta` multiple times can overwrite earlier values for the same keys, so SSR metadata should be designed deliberately when multiple layers participate.

## Why this matters for AI workflows

When AI adds or edits SEO behavior, it should:

1. use `$useMeta` rather than inventing a parallel metadata system
2. decide whether the metadata is static or reactive
3. remember that SSR is what makes many SEO-related tags meaningful to crawlers and downstream consumers
