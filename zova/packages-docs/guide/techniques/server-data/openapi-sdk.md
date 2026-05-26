# Openapi SDK

Zova uses [openapi-typescript](https://github.com/openapi-ts/openapi-typescript) based on `Swagger/Openapi` metadata to automatically generate frontend client SDKs to provide a smooth Typescript development experience.

Zova adopts a modular system, so the Swagger/Openapi metadata provided by the backend can be split into multiple parts according to business needs and managed independently in different modules.

## Initialize the Openapi config

First, initialize the Openapi config in the module demo-student.

### 1. CLI command

```bash
$ zova :openapi:config demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Zova Tools/Generate Openapi Config`
:::

## OpenAPI config

### 1. Module config

`src/module/demo-student/cli/openapi.config.ts`

```diff
export default function (): ZovaOpenapiConfigModule {
  return {
+   operations: {
+     match: [/^HomeBaseMenu_*/],
+   },
  };
}
```

By specifying the APIs that need to be managed in the current module in `operations.match`, you can specify a set of APIs using regexp.

### 2. Project config

The system automatically creates the file `openapi.config.ts` in the project directory, which can specify the download source for Swagger/OpenAPI.

`openapi.config.ts`

```diff
export default function (): ZovaOpenapiConfig {
  return {
    default: {
+     source: 'http://localhost:7102/swagger/json?version=V31',
    },
    modules: {},
  };
}
```

## Generate Openapi SDK

Now you can automatically download Swagger/Openapi and then generate the specified API services in the module demo-student.

### 1. CLI command

```bash
$ zova :openapi:generate demo-student
```

### 2. Menu commands

::: tip
Context Menu - [Module Path]: `Zova Tools/Generate Openapi SDK`
:::

API services are now available. See also: [$api](./api.md)

> Convention: To standardize the code, a module either automatically creates API services using the Openapi SDK or creates API services manually. Choose one of the two ways
