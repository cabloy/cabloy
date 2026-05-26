# Bean Identifier

The system will automatically assign an identifier to each bean class as the following format:

```bash
{moduleName}.{sceneName}.{beanName}
```

For example, the module demo-student provides a component `test`, whose controller class name is `ControllerTest`. Then the identifier corresponding to this bean is: `demo-student.controller.test`

## Advantages of Bean-identifier-based injection

When using beans cross-module, we do not recommend injecting directly based on `class type`, but rather on `bean identifier`. `Bean-identifier-based` injection has the following advantages:

1. `Loose coupling between modules`: In Zova, a module is a natural bundle boundary, and automatically bundled into an independent asynchronous chunk when building. Therefore, there is a loose coupling relationship between modules
2. `Achieve asynchronous loading on demand`: Modules are loaded asynchronously only when needed, and Bean instances provided by the modules are injected
3. `Avoid circular reference errors`: In complex business scenarios, multiple beans often reference each other. `Bean-identifier-based` injection can intuitively support circular reference scenarios without error prompts and without any mental burden

## Development Experience Improvement

To enhance the development experience, you can still use `Class-based` injection. With compiler support, it will automatically be converted to `Bean-Identifier-based` syntax.

- Example: Class-based

```typescript
import { ModelTabs } from 'zova-module-a-routertabs';

class ControllerLayout {
  @Use()
  $$modelTabs: ModelTabs;
}
```

- Automatically converted to: Bean-Identifier-based

```typescript
import type { ModelTabs } from 'zova-module-a-routertabs';

class ControllerLayout {
  @Use('a-routertabs.model.tabs')
  $$modelTabs: ModelTabs;
}
```
