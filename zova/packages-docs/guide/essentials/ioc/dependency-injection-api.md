# Dependency Injection (API)

## @Use

Inject Bean instance through `@Use` decorator function.

```typescript
export declare function Use(options?: IDecoratorUseOptions): PropertyDecorator;
export declare function Use<T extends keyof IBeanRecord>(beanFullName?: T): PropertyDecorator;
```

- arguments

| Name                          | Description                    |
| ----------------------------- | ------------------------------ |
| No parameters                 | Inject through Bean Class type |
| beanFullName                  | Inject through Bean identifier |
| options: IDecoratorUseOptions | Injection parameters           |

- options: IDecoratorUseOptions

```typescript
export interface IDecoratorUseOptions {
  beanFullName?: keyof IBeanRecord;
  name?: string;
  injectionScope?: InjectionScope;
}
```

| Name           | Description                      |
| -------------- | -------------------------------- |
| beanFullName   | Inject through Bean identifier   |
| name           | Inject through registration name |
| injectionScope | `sys/app/ctx/new/host/skipSelf`  |

- `Variable name`: If no injection parameters are specified and the type of the bean class is not specified, then the `variable name` is used directly to find the existing bean instance in the bean container

## @UseScope

Inject the module's Scope object through the `@UseScope` decorator function.

- see: [Module Scope](../scope/introduction.md)
