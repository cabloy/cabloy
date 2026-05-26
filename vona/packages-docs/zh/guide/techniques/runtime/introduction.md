# Runtime

VonaJS 在系统启动时将一些动态运行数据`统一`输出到`Runtime`文件中，用于排查问题，或开发其他管理工具。

## Runtime目录

针对不同的运行环境使用不同的 Runtime 目录:

- `测试环境/开发环境`: `{project path}/.app/runtime`
- `生产环境`: `{home}/vona/{project name}/runtime`

## 创建meta.runtime

可以通过`Runtime`添加自定义的动态运行数据。

比如，在模块 demo-student 中创建`meta.runtime`。在系统启动时在`Runtime`文件中输出`accessToken`

### 1. Cli命令

```bash
$ vona :create:bean meta runtime --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Meta/Runtime`
:::

## meta.runtime定义

```typescript
export type TypeMetaRuntimeResult = { accessToken?: string } | undefined;

@Meta()
export class MetaRuntime extends BeanBase implements IMetaRuntimeExecute {
  async execute(): Promise<TypeMetaRuntimeResult> {
    if (this.app.meta.isProd) return;
    // signin
    const jwt = await this.bean.passport.signinSystem('dev', '-1');
    const accessToken = jwt.accessToken;
    return {
      accessToken,
    };
  }
}
```

- `TypeMetaRuntimeResult`: 定义 runtime 数据的类型
- `execute`: 返回需要输出的 runtime 数据
