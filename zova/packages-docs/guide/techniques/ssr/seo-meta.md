# SEO Meta

SEO Meta can dynamically change page title, manage `<meta>` tags, manage `<html>` and `<body>` DOM element attributes, add/remove/change `<style>` and `<script>` tags in the head of your document (useful for CDN stylesheets or for json-ld markup, for example), or manage `<noscript>` tags.

## $useMeta

Zova provides the `$useMeta` method in the `BeanBase` base class, which can provide SEO Meta data.

`zova-dev/packages-zova/zova-core/src/bean/beanBase.ts`

```typescript
export class BeanBase {
  protected $useMeta(options: SSRMetaOptions | (() => SSRMetaOptions)) {}
}
```

`zova-dev/packages-zova/zova-core/src/types/interface/ssr.ts`

```typescript
export interface SSRMetaOptions {
  title?: string;
  titleTemplate?(title: string): string;
  meta?: { [name: string]: SSRMetaTagOptions };
  link?: { [name: string]: Record<string, string> };
  script?: { [name: string]: Record<string, string> };
  htmlAttr?: { [name: string]: string | undefined };
  bodyAttr?: { [name: string]: string | undefined };
  bodyStyle?: { [name: string]: string | undefined };
  bodyClass?: { [name: string]: boolean };
  noscript?: { [name: string]: string };
}
```

## Static meta data

```typescript
class ControllerPageSome extends BeanBase {
  protected async __init__() {
    const metaData = {
      // sets document title
      title: 'Index Page',
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: title => `${title} - My Website`,

      // meta tags
      meta: {
        description: { name: 'description', content: 'Page 1' },
        keywords: { name: 'keywords', content: 'Quasar website' },
        equiv: { 'http-equiv': 'Content-Type', 'content': 'text/html; charset=UTF-8' },
        // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
        ogTitle: {
          property: 'og:title',
          // optional; similar to titleTemplate, but allows templating with other meta properties
          template(ogTitle) {
            return `${ogTitle} - My Website`;
          },
        },
      },

      // CSS tags
      link: {
        material: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
      },

      // JS tags
      script: {
        ldJson: {
          type: 'application/ld+json',
          innerHTML: `{ "@context": "http://schema.org" }`,
        },
      },

      // <html> attributes
      htmlAttr: {
        'xmlns:cc': 'http://creativecommons.org/ns#', // generates <html xmlns:cc="http://creativecommons.org/ns#">
        'empty': undefined, // generates <html empty>
      },

      // <body> attributes
      bodyAttr: {
        'action-scope': 'xyz', // generates <body action-scope="xyz">
        'empty': undefined, // generates <body empty>
      },

      // <noscript> tags
      noscript: {
        default: 'This is content for browsers with no JS (or disabled JS)',
      },
    };
    this.$useMeta(metaData);
  }
}
```

Invoking `$useMeta` multiple times will overwrite the value of the same key in the former:

```typescript
// first loaded
class ControllerPageSome extends BeanBase {
  protected async __init__() {
    this.$useMeta({
      title: 'Index Page',
    });
  }
}

// a subsequent loaded
class ControllerPageAnother extends BeanBase {
  protected async __init__() {
    this.$useMeta({
      title: 'Index Page!!!',
    });
  }
}
```

## Reactive meta data

`$useMeta` also supports passing in reactive data:

```typescript
class ControllerPageSome extends BeanBase {
  title: string;

  protected async __init__() {
    this.$useMeta(() => {
      return {
        title: this.title,
      };
    });
  }

  setAnotherTitle() {
    // will automatically trigger a Meta update due to the binding
    this.title = 'Another title';
  }
}
```
