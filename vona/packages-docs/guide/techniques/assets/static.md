# Static

In VonaJS, each module can provide static resources, accessible via a URL.

## Initializing the Code Skeleton

### 1. Cli Command

```bash
$ vona :init:static demo-student
```

### 2. Menu Command

::: tip
Context menu - [Module Path]: `Vona Init/Assets Static`
:::

### 3. Adding Static Resources

Executing the above command will automatically create the directory: `assets/static`

Add static resources according to business needs, such as adding two images:

```bash
src/module/demo-student/assets/static/img/vona.png
src/module/demo-student/assets/static/img/vona.svg
```

### 4. URL

Static resources can be accessed via the following URL:

```bash
http://localhost:7102/api/static/demo/student/img/vona.png
http://localhost:7102/api/static/demo/student/img/vona.svg
```

You can use `meta.static` to get the URL of a static resource in a typed way.

## Create meta.static

For example, create `meta.static` in the module demo-student.

### 1. Cli Command

```bash
$ vona :create:bean meta static --module=demo-student
```

### 2. Menu Command

::: tip
Context menu - [Module Path]: `Vona Meta/Static`
:::

## meta.static Definition

```typescript
export type TypeStaticGetPath = 'img/vona.png' | 'img/vona.svg';

@Meta()
export class MetaStatic extends BeanStaticBase<TypeStaticGetPath> {}
```

- `TypeStaticGetPath`: Defines the type of the static resources

## Get the static resource path

```typescript
class ControllerStudent {
  test() {
    const path = this.scope.static.get('img/vona.png');
    assert.equal(path, '/api/static/demo/student/img/vona.png');
  }
}
```

- `static.get`: Takes the static resource `img/vona.png` as input, generates the path `/api/static/demo/student/img/vona.png`

## Get the static resource URL

```typescript
class ControllerStudent {
  test() {
    const url = this.scope.static.getURL('img/vona.png');
    assert.equal(url, 'http://localhost:7102/api/static/demo/student/img/vona.png);
  }
}
```

- `static.getURL`: Takes the static resource `img/vona.png` as input and generates the URL `http://localhost:7102/api/static/demo/student/img/vona.png`

## URL Configuration

`http://localhost:7102` is dynamically inferred by the system based on the current API context. In some application scenarios, the API Server's URL may differ from the domain name used to provide services. At this point, you can modify the URL configuration through `App Config` or `Instance Config`

### 1. App Config

`src/backend/config/config/config.ts`

```typescript
// server
config.server = {
  serve: {
    protocol: 'https',
    host: 'cabloy.com',
  },
};
```

Then, executing the method `static.getURL` will return the URL `https://cabloy.com/api/static/demo/student/img/vona.png`

### 2. Instance Config

VonaJS supports `multi-instance/multi-tenancy`, allowing you to specify different configuration for specific instances.

```typescript
// instance
config.instance = {
  instances: {
    '': {
      password: '',
      title: '',
      config: {
        server: {
          serve: {
            protocol: 'https',
            host: 'cabloy.com',
          },
        },
      },
    },
  },
};
```
