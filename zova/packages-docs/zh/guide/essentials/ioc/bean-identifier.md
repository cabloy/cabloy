# Bean标识

系统会为每一个 bean class 自动分配一个标识，格式如下：

```bash
{moduleName}.{sceneName}.{beanName}
```

比如，模块 demo-student 提供了一个组件`test`，其 controller class 名称为`ControllerTest`。那么该 bean 对应的标识为：`demo-student.controller.test`

## 基于Bean标识注入的优点

在跨模块注入 bean 时，不建议直接`基于Class类型`注入，而是`基于Bean标识`注入。基于 Bean 标识注入有以下优点：

1. `实现模块之间松耦合`：在 Zova 中，一个模块就是一个天然的拆包边界，在 build 构建时，自动打包成一个独立的异步 Chunk。因此模块之间是松耦合关系
2. `实现按需异步加载`：只有在需要时才会异步加载模块，并注入模块提供的 Bean 实例
3. `避免出现循环引用出错的问题`：在复杂的业务场景中，经常会出现多个具名 Bean 之间相互引用的情况。基于 Bean 标识注入可以非常直观的支持循环引用的场景，不会出现错误提示，没有任何心智负担

## 开发体验提升

为了提升开发体验，仍然可以采用`基于Class类型`的注入，基于编译器的加持，会自动转为`基于Bean标识`的写法。

- 举例：基于 Class 类型

```typescript
import { ModelTabs } from 'zova-module-a-routertabs';

class ControllerLayout {
  @Use()
  $$modelTabs: ModelTabs;
}
```

- 自动转化为：基于 Bean 标识

```typescript
import type { ModelTabs } from 'zova-module-a-routertabs';

class ControllerLayout {
  @Use('a-routertabs.model.tabs')
  $$modelTabs: ModelTabs;
}
```
