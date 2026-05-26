# Runtime Environments and Flavors

Vona uses multi-dimensional variables to load environment variables and Config configurations, providing a more flexible configuration mechanism and supporting more complex business scenarios.

The `multi-dimensional variables` in Vona contain two dimensions: `Runtime Environment` and `Flavor`

## Runtime Environment

Vona provides three runtime environments:

| Name | Description             |
| ---- | ----------------------- |
| test | Testing environment     |
| dev  | Development environment |
| prod | Production environment  |

### 1. Enabling the Runtime Environment

Enabling the corresponding runtime environment by executing different commands.

```bash
# test
$ npm run test
$ npm run cov
$ npm run db:reset
# dev
$ npm run dev
$ npm run dev:one
# prod
$ npm run start
$ npm run start:one
$ npm run start:docker
```

### 2. How to Determine the Current Runtime Environment

- Determine via `Env`

Using Env to determine the current runtime environment supports `tree-shaking` during builds.

```typescript
process.env.META_MODE === 'test';
process.env.META_MODE === 'dev';
process.env.META_MODE === 'prod';
```

- Determine via `Config`

```typescript
app.config.meta.mode === 'test';
app.config.meta.mode === 'dev';
app.config.meta.mode === 'prod';
```

- Simplified Notation

```typescript
app.meta.isTest;
app.meta.isDev;
app.meta.isProd;
```

## Flavor

For more complex business scenarios, we often need to provide configuration capabilities for more scenarios. Vona specifically provides a `Flavor` mechanism. The combination of `runtime environments` and `flavors` allows us to conveniently define configuration information for various scenarios.

### 1. Built-in Flavors

For out-of-the-box, Vona provides several built-in flavors:

| Name   | Description                                        |
| ------ | -------------------------------------------------- |
| normal | The default flavor                                 |
| play   | For use in [Playground](../../start/play.md)       |
| docker | For use in Docker environments                     |
| ci     | For use in CI environments, such as GitHub Actions |

### 2. Enabling a Flavor

Enabling the corresponding flavor by passing the command parameter: `--flavor`

```bash
# normal
$ npm run dev
# docker
$ npm run dev -- --flavor=docker
$ npm run build -- --flavor=docker
# ci
$ npm run build -- --flavor=ci
```

### 3. How to Determine the Current Flavor

- Determine via `Env`

Using Env to determine the current flavor supports tree-shaking during builds.

```typescript
process.env.META_FLAVOR === 'normal';
process.env.META_FLAVOR === 'docker';
process.env.META_FLAVOR === 'ci';
```

- Determine via `Config`

```typescript
app.config.meta.flavor === 'normal';
app.config.meta.flavor === 'docker';
app.config.meta.flavor === 'ci';
```

### 4. Creating a Flavor

You can create a flavor based on any business need, such as customer, project, organization, etc.

For example, let's assign a flavor named `customA` to customer A, providing a separate env/config configuration for customer A.

- Enabling the Flavor

```bash
$ npm run dev -- --flavor=customA
```

- How to determine the flavor

```typescript
process.env.META_FLAVOR === 'customA';
app.config.meta.flavor === 'customA';
```

### 5. Add Flavor Type Definition

You can add a Flavor type definition to provide type hints.

In the VSCode editor, enter the code snippet `recordflavor` to automatically generate a code skeleton, and then add a custom Flavor type definition.

```diff
declare module '@cabloy/module-info' {
  export interface VonaMetaFlavorExtend {
+   customA: never;
  }
}
```
