# Runtime

VonaJS outputs runtime data to the `Runtime` file during system startup for troubleshooting or developing other management tools.

## Runtime Directory

Different Runtime directories are used for different runtime environments:

- `Test/Dev Environment`: `{project path}/.app/runtime`

- `Production Environment`: `{home}/vona/{project name}/runtime`

## Create meta.runtime

Custom runtime data can be added through `Runtime`

For example, create `meta.runtime` in the module demo-student. Output `accessToken` to the `Runtime` file during system startup.

### 1. Cli Command

```bash
$ vona :create:bean meta runtime --module=demo-student
```

### 2. Menu Command

::: tip
Context menu - [Module Path]: `Vona Meta/Runtime`
:::

## meta.runtime Definition

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

- `TypeMetaRuntimeResult`: Defines the type of runtime data
- `execute`: Returns the runtime data to be output
