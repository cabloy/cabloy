# package.json

You can set some meta configuration in the module's `package.json`

## vonaModule.dependencies

If a module needs to depend on other modules, you need to configure `vonaModule.dependencies`, for example: the configuration of module `demo-student`:

```typescript
{
  "name": "vona-module-demo-student",
  "vonaModule": {
    "dependencies": {
      "a-vona": "5.0.0"
    },
  },
}
```

## vonaModule.globalDependencies

If the module needs to provide global dependencies, you need to configure `vonaModule.globalDependencies`, for example: the configuration of module `a-core`:

```typescript
{
  "name": "vona-module-a-core",
  "vonaModule": {
    "globalDependencies": {
      "chalk": true,
      "luxon": true,
    },
  },
}
```

Since the module a-core declares `chalk` and `luxon` as global dependencies, the system will put these dependencies into the project's `packages.json`, so that all other modules can directly import and use these modules.

## vonaModule.globalDependenciesDev

If the module needs to provide global dev dependencies, you need to configure `vonaModule.globalDependenciesDev`, for example: the configuration of module `a-core`:

```typescript
{
  "name": "vona-module-a-core",
  "vonaModule": {
    "globalDependenciesDev": {
      "@types/koa": true,
      "@types/luxon": true,
    },
  },
}
```

Since the module a-core declares `@types/koa` and `@types/luxon` as global dev dependencies, the system will put these dependencies into the project's `packages.json`, so that all other modules can directly import and use these modules.
