# package.json

可以在模块的`package.json`中设置一些元配置。

## zovaModule.bundle

如果模块依赖了某些第三方模块，可以指定在构建时的分包策略。比如，模块 a-model 的分包配置如下：

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

| 名称   | 说明                   |
| ------ | ---------------------- |
| match  | 指定需要分包的文件路径 |
| output | 分包名称               |

## zovaModule.dependencies

如果模块需要依赖其他模块，那么，需要配置`zovaModule.dependencies`，比如：模块 demo-student 的配置：

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

如果模块需要提供全局的依赖项，那么，需要配置`zovaModule.globalDependencies`，比如：模块 a-zova 的配置：

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

由于模块 a-zova 将`luxon`和`zova-jsx`声明为全局依赖，那么系统就会将这些依赖项放入项目的 packages.json 当中，从而所有其他模块都可以直接导入并使用这些模块。

## zovaModule.globalDependenciesDev

如果模块需要提供全局的开发依赖项，那么，需要配置`zovaModule.globalDependenciesDev`，比如：模块 a-zova 的配置：

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

由于模块 a-zova 将`@types/luxon`声明为全局开发依赖，那么系统就会将这些依赖项放入项目的 packages.json 当中，从而所有其他模块都可以直接导入并使用这些模块。
