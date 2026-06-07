# SSR SEO Meta

This guide explains how SSR SEO metadata works in Zova within the Cabloy monorepo.

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

Two useful modes are supported:

- **static meta** for values known at initialization time
- **reactive meta** for values that should update when bound state changes

That makes SEO metadata part of the reactive application model, not just a one-time page constant.

## Overwrite behavior

Calling `$useMeta` multiple times can overwrite earlier values for the same keys, so SSR metadata should be designed deliberately when multiple layers participate.

## Implementation checks for SSR SEO metadata changes

When adding or editing SEO behavior:

1. use `$useMeta` rather than inventing a parallel metadata system
2. decide whether the metadata is static or reactive
3. remember that SSR is what makes many SEO-related tags meaningful to crawlers and downstream consumers
