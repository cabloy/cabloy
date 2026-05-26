# Multi-dimensional Variables

Zova uses multi-dimensional variables to load environment variables and Config configurations, providing a more flexible configuration mechanism and supporting more complex business scenarios.

The `multi-dimensional variables` in Zova contain three dimensions: `Runtime Environment`, `App Mode` and `Flavor`

## Runtime Environment

Zova provides two runtime environments:

| Name        | Description             |
| ----------- | ----------------------- |
| development | Development environment |
| production  | Production environment  |

### 1. Enabling the Runtime Environment

Enabling the corresponding runtime environment by executing different commands.

```bash
# development
$ npm run dev
# production
$ npm run build
$ npm run preview
```

### 2. How to Determine the Current Runtime Environment

- Determine via `Env`

Using Env to determine the current runtime environment supports `tree-shaking` during builds.

```typescript
process.env.META_MODE === 'development';
process.env.META_MODE === 'production';
```

- Simplified Notation

```typescript
process.env.DEV; // boolean
process.env.PROD; // boolean
```

- Determine via `Config`

```typescript
sys.config.meta.mode === 'development';
sys.config.meta.mode === 'production';
```

## App Mode

Zova currently offers two app modes, and more will be gradually added in the future:

| Name | Description             |
| ---- | ----------------------- |
| ssr  | Server-Side Rendering   |
| spa  | Single‑Page Application |

### 1. Enabling the App Mode

Enabling the corresponding app mode by executing different commands.

```bash
# ssr
$ npm run dev:ssr:admin
# spa
$ npm run dev:spa
```

### 2. How to Determine the Current App Mode

- Determine via `Env`

Using Env to determine the current app mode supports `tree-shaking` during builds.

```typescript
process.env.META_APP_MODE === 'ssr';
process.env.META_APP_MODE === 'spa';
```

- Simplified Notation

```typescript
process.env.SSR; // boolean
```

- Determine via `Config`

```typescript
sys.config.meta.appMode === 'ssr';
sys.config.meta.appMode === 'spa';
```

## Flavor

For more complex business scenarios, we often need to provide configuration capabilities for more scenarios. Zova specifically provides a `Flavor` mechanism. The combination of `runtime environments`, `app modes` and `flavors` allows us to conveniently define configuration information for various scenarios.

### 1. Built-in Flavors

For out-of-the-box, Zova provides several built-in flavors:

| Name             | Description                         |
| ---------------- | ----------------------------------- |
| admin            | For Admin-Dashboard                 |
| web              | For Website                         |
| cabloyBasicAdmin | For Admin-Dashboard of Cabloy Basic |
| cabloyStartAdmin | For Admin-Dashboard of Cabloy Start |
| cabloyStartWeb   | For Website of Cabloy Start         |

### 2. Enabling a Flavor

Enabling the corresponding flavor by passing the command parameter.

```json
"scripts": {
  "dev": "npm run dev:ssr:admin",
  "dev:ssr:admin": "npm run prerun && quasar dev --mode ssr --flavor admin",
},
```

### 3. How to Determine the Current Flavor

- Determine via `Env`

Using Env to determine the current flavor supports tree-shaking during builds.

```typescript
process.env.META_FLAVOR === 'admin';
process.env.META_FLAVOR === 'web';
```

- Determine via `Config`

```typescript
sys.config.meta.flavor === 'admin';
sys.config.meta.flavor === 'web';
```

### 4. Creating a Flavor

You can create a flavor based on any business need, such as customer, project, organization, etc.

For example, let's assign a flavor named `customA` to customer A, providing a separate env/config configuration for customer A.

- Add npm scripts

```json
"scripts": {
  "dev:ssr:customA": "npm run prerun && quasar dev --mode ssr --flavor customA",
  "build:ssr:customA": "npm run prerun && quasar build --mode ssr --flavor customA",
  "preview:ssr:customA": "concurrently \"node ./dist-mock/index.js\" \"node ./dist/ssr-customA/index.js\"",
  "dev:spa:customA": "npm run prerun && quasar dev --mode spa --flavor customA",
}
```

- How to determine the flavor

```typescript
process.env.META_FLAVOR === 'customA';
sys.config.meta.flavor === 'customA';
```

### 5. Add Flavor Type Definition

You can add a Flavor type definition to provide type hints.

In the VSCode editor, enter the code snippet `recordflavor` to automatically generate a code skeleton, and then add a custom Flavor type definition.

```diff
declare module '@cabloy/module-info' {
  export interface ZovaMetaFlavorExtend {
+   customA: never;
  }
}
```
