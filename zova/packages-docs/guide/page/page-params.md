# Page Params

Zova enhances page `Params` and provides Typescript typing support.

## Add Params code skeleton

Add Params code skeleton for page `counter`

### 1. CLI command

```bash
$ zova :refactor:pageParams counter --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path/src/page/pageName]: `Zova Refactor/Add Page Params`
:::

## Add Zod Schema

Add fields schema.

```diff
export const ControllerPageCounterSchemaParams = z.object({
+ id: z.number().optional().default(0),
});
```

## Route name

In order to support `Params`, the `name` field needs to be used on the route record and regenerate the module's .metadata.

### 1. Route record

`src/module/demo-student/src/routes.ts`

```diff
export const routes: IModuleRoute[] = [
  {
+   name: 'counter',
-   path: 'counter',
+   path: 'counter/:id?',
    component: ZPageCounter,
  },
];
```

### 2. Regenerate the module's .metadata

The module's .metadata needs to be regenerated so that changes to the routing records take effect.

- CLI command

```bash
$ zova :tools:metadata demo-student
```

- Menu command

::: tip
Context Menu - [Module Path]: `Zova Tools/Generate .metadata`
:::

## Use Params

Zova injects a `$params` object into the base class of the `controller` bean so that the `Params` parameter can be obtained through `this.$params`, and type hints are supported.

```diff
class ControllerPageCounter {
  render() {
    return (
      <div>
+       <div>{this.$params.id}</div>
      </div>
    );
  }
}
```

## Pass in Params

When invoking the page navigation method, you can also pass Params parameters, and type hints are supported.

```diff
class ControllerPageCounter {
  render() {
    return (
      <div>
        <button
          onClick={() => {
            const url = this.$router.getPagePath('/demo/student/counter/:id?', {
              params: {
+               id: 1,
              },
            });
            this.$router.push(url);
          }}
        >
          Go To
        </button>
      </div>
    );
  }
}
```
