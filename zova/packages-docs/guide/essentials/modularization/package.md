# package.json

You can set some meta configuration in the module's `package.json`

## zovaModule.bundle

If the module depends on some third-party modules, you can specify the bundle strategy at build time. For example, the bundle configuration of module `a-model` is as follows:

```typescript
{
  "name": "zova-module-a-model",
  "zovaModule": {
    "bundle": {
      "vendors": [
        {
          "match": [
            "@tanstack/query-core",
            "@tanstack/query-persist-client-core",
            "@tanstack/vue-query"
          ],
          "output": "tanstack-query"
        },
      ]
    }
  },
}
```

| Name   | Description                                    |
| ------ | ---------------------------------------------- |
| match  | Specify the file paths that need to be chunked |
| output | chunk name                                     |

## zovaModule.dependencies

If a module needs to depend on other modules, you need to configure `zovaModule.dependencies`, for example: the configuration of module `demo-student`:

```typescript
{
  "name": "zova-module-demo-student",
  "zovaModule": {
    "dependencies": {
      "a-zova": "5.0.0"
    },
  },
}
```

## zovaModule.globalDependencies

If the module needs to provide global dependencies, you need to configure `zovaModule.globalDependencies`, for example: the configuration of module `a-zova`:

```typescript
{
  "name": "zova-module-a-zova",
  "zovaModule": {
    "globalDependencies": {
      "luxon": true,
      "zova-jsx": true
    },
  },
}
```

Since the module a-zova declares `luxon` and `zova-jsx` as global dependencies, the system will put these dependencies into the project's `packages.json`, so that all other modules can directly import and use these modules.

## zovaModule.globalDependenciesDev

If the module needs to provide global dev dependencies, you need to configure `zovaModule.globalDependenciesDev`, for example: the configuration of module `a-zova`:

```typescript
{
  "name": "zova-module-a-zova",
  "zovaModule": {
    "globalDependenciesDev": {
      "@types/luxon": true,
    },
  },
}
```

Since the module a-zova declares `@types/luxon` as global dev dependencies, the system will put these dependencies into the project's `packages.json`, so that all other modules can directly import and use these modules.
