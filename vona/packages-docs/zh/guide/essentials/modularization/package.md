# package.json

可以在模块的`package.json`中设置一些元配置。

## vonaModule.dependencies

如果模块需要依赖其他模块，那么，需要配置`vonaModule.dependencies`，比如：模块 demo-student 的配置：

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

如果模块需要提供全局的依赖项，那么，需要配置`vonaModule.globalDependencies`，比如：模块 a-core 的配置：

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

由于模块 a-core 将`chalk`和`luxon`声明为全局依赖，那么系统就会将这些依赖项放入项目的 packages.json 当中，从而所有其他模块都可以直接导入并使用这些模块。

## vonaModule.globalDependenciesDev

如果模块需要提供全局的开发依赖项，那么，需要配置`vonaModule.globalDependenciesDev`，比如：模块 a-core 的配置：

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

由于模块 a-core 将`@types/koa`和`@types/luxon`声明为全局开发依赖，那么系统就会将这些依赖项放入项目的 packages.json 当中，从而所有其他模块都可以直接导入并使用这些模块。
