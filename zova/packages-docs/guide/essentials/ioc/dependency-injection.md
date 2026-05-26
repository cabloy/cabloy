# Dependency Injection

Zova injects Bean instances through `@Use` decorator function.

## Resolution rules

Zova adopts a modular system, and Bean Classes are provided by different modules. When using the Bean Class inside the same module, you can directly resolve it based on `Class type`. When using cross-module, you can resolve it based on `Bean identifier` instead of `Class type/file path`, which is conducive to achieving loose coupling between modules.

Therefore, Zova provides the following resolution rules:
Zova provides the following resolution rules for lookuping or creating specific Bean instances.

- Bean Class
- Bean identifier
- Registration name
- Variable name

### 1. Bean Class

Use `Bean Class` to lookup and inject bean instance in the ioc container, and automatically create one if not exist.

```typescript
import { ModelTodo } from '../../bean/model.todo.js';

class ControllerTodo {
  @Use()
  $$modelTodo: ModelTodo;
}
```

### 2. Bean identifier

Use `Bean identifier` to lookup and inject bean instance in the ioc container, and automatically create one if not exist.

```typescript
import type { ModelTabs } from 'zova-module-a-routertabs';

class ControllerLayout {
  @Use('a-routertabs.model.tabs')
  $$modelTabs: ModelTabs;
}
```

- Lookup and inject bean instance through `a-routertabs.model.tabs`
- Therefore, only the type of ModelTabs needs to be imported to maintain the loose coupling relationship between modules

To enhance the development experience, you can still use `Class-based` injection. With compiler support, it will automatically be converted to `Bean-Identifier-based` syntax. The code is as follows:

```typescript
import { ModelTabs } from 'zova-module-a-routertabs';

class ControllerLayout {
  @Use()
  $$modelTabs: ModelTabs;
}
```

### 3. Registration name

Lookup and inject bean instance in the ioc container through the `registration name`, and return a null value if not exist. This mechanism is generally used for `hierarchical injection`

```typescript
import { ModelTodo } from '../../bean/model.todo.js';

class ControllerTodo {
  @Use({ name: '$$modelTodo' })
  $$modelTodo: ModelTodo;
}
```

- Lookup and inject the bean instance by the registration name `$$modelTodo`. Generally speaking, you should ensure that the bean instance has been injected in the ioc container in advance, otherwise a null value will be returned

### 4. Variable name

Lookup and inject the bean instance in the ioc container by the `variable name`, and return a null value if not exist. This mechanism is generally used for `hierarchical injection`

```typescript
import type { ModelTodo } from '../../bean/model.todo.js';

class ControllerTodo {
  @Use()
  $$modelTodo: ModelTodo;
}
```

- Lookup and inject the bean instance by the variable name `$$modelTodo`. Generally speaking, you should ensure that the Bean instance has been injected in the ioc container in advance, otherwise a null value will be returned

## Injection scope

Different scenes have different default injection scopes. In addition, when injecting, you can also specify the injection scope through `injectionScope` option in `@Use`

Zova provides the following injection scopes: `sys/app/ctx/new/host/skipSelf`

### 1. sys

If the injection scope is `sys`, then inject the bean instance in the global ioc container to achieve the singleton effect.

```typescript
// in module: test-module1
@Sys()
class SysTest {}
```

```typescript
// in module: test-module2
import { SysTest } from 'zova-module-test-module1';

class Test {
  @Use()
  $$sysTest: SysTest;
}
```

- The injection scope of `@Sys` is `sys` by default, so the bean instance will be lookuped and injected in the sys ioc container

### 2. app

If the injection scope is `app`, then inject the bean instance in the app ioc container.

```typescript
// in module: test-module1
@Tool()
class ToolTest {}
```

```typescript
// in module: test-module2
import { ToolTest } from 'zova-module-test-module1';

class Test {
  @Use()
  $$toolTest: ToolTest;
}
```

- The injection scope of `@Tool` is `app` by default, so the bean instance will be lookuped and injected in the app ioc container

### 3. ctx

If the injection scope is `ctx`, then inject the bean instance into the ioc container of the current component instance.

```typescript
// in module: a-routertabs
@Model()
class ModelTabs {}
```

```typescript
// in module: test-module2
import { ModelTabs } from 'zova-module-a-routertabs';

class ControllerLayout {
  @Use()
  $$modelTabs: ModelTabs;
}
```

- The injection scope of `@Model` is `ctx` by default, so the bean instance will be lookuped and injected in the ctx ioc container of the current component instance

### 4. new

If the injection scope is `new`, then directly create a new bean instance.

```typescript
// in module: a-routertabs
@Model()
class ModelTabs {}
```

```typescript
// in module: test-module2
import { ModelTabs } from 'zova-module-a-routertabs';

class ControllerLayout {
  @Use({ injectionScope: 'new' })
  $$modelTabs: ModelTabs;
}
```

- Since the `injectionScope` option is specified as `new`, a new bean instance will be directly created

## Injection scope: Hierarchical injection {#hierarchical-injection}

The injection scope also supports hierarchical injection, replacing the capabilities of Vue3 Provide/Inject:

### 5. host

If the injection scope is `host`, the bean instance will be lookuped in the ioc container of the current component instance and all parent containers in turn. If it does not exist, a null value is returned.

```typescript
// in parent component
import { ModelTabs } from 'zova-module-a-routertabs';

class Parent {
  @Use()
  $$modelTabs: ModelTabs;
}
```

```typescript
// in child component
import type { ModelTabs } from 'zova-module-a-routertabs';

class Child {
  @Use({ injectionScope: 'host' })
  $$modelTabs: ModelTabs;
}
```

- Since the parent component has already injected the `ModelTabs` bean instance, the child component can directly lookup and inject it
- `Hierarchical injection` also supports all resolution rules

### 6. skipSelf

If the injection scope is `skipSelf`, then lookup the bean instance in all parent containers in turn. If it does not exist, a null value is returned.
