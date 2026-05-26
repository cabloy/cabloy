# Page Query

Zova enhances page `Query` and provides Typescript typing support.

## Add Query code skeleton

Add Query code skeleton for page `counter`

### 1. CLI command

```bash
$ zova :refactor:pageQuery counter --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path/src/page/pageName]: `Zova Refactor/Add Page Query`
:::

## Add Zod Schema

Add fields schema.

```diff
export const ControllerPageCounterSchemaQuery = z.object({
+ name: z.string().optional(),
+ age: z.number().optional(),
});
```

## Use Query

Zova injects a `$query` object into the base class of the `controller` bean so that the `Query` parameter can be obtained through `this.$query`, and type hints are supported.

```diff
class ControllerPageCounter {
  render() {
    return (
      <div>
+       <div>{this.$query.name}</div>
+       <div>{this.$query.age}</div>
      </div>
    );
  }
}
```

## Pass in Query

When invoking the page navigation method, you can also pass Query parameters, and type hints are supported.

```diff
class ControllerPageCounter {
  render() {
    return (
      <div>
        <button
          onClick={() => {
            const url = this.$router.getPagePath('/demo/student/counter', {
              query: {
+               name: 'tom',
+               age: 18,
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
