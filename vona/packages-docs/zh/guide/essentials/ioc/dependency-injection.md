# 依赖注入

Vona 通过`@Use`装饰器函数注入 Bean 实例。

## 注入方式

1. `本模块注入`：可以直接基于`Class类型`注入
2. `跨模块注入`：可以基于`Bean标识`注入，这样有利于实现模块之间的松耦合，支持循环引用

## 基于Class类型

在模块 demo-student 注入本模块提供的 ServiceStudent，代码如下：

```typescript
import { ServiceStudent } from '../service/student.ts';

export class ControllerStudent {
  @Use()
  student: ServiceStudent;
}
```

## 基于Bean标识

在其他模块注入模块 demo-student 提供的 ServiceStudent，代码如下：

```typescript
import type { ServiceStudent } from 'vona-module-demo-student';

export class ControllerOther {
  @Use('demo-student.service.student')
  student: ServiceStudent;
}
```

由于导入的 ServiceStudent 是 type，因此需要指定 Service 的 Bean 标识。
