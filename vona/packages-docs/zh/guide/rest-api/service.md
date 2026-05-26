# Service

## 创建Service

比如，在模块 demo-student 中创建一个 Service: `student`

### 1. Cli命令

```bash
$ vona :create:bean service student --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Create/Service`
:::

## Service定义

```typescript
@Service()
export class ServiceStudent extends BeanBase {}
```

## 使用Service

关于 Service 的使用可以从不同维度来讲。

- Service 的依赖注入和依赖查找，参见：[依赖注入](../essentials/ioc/dependency-injection.md), [依赖查找](../essentials/ioc/dependency-lookup.md)
- Service 的模块内部与跨模块使用，参见：[模块Scope：Service](../essentials/scope/service.md)

## 1. 依赖注入

在模块 demo-student 的 ControllerStudent 中注入 ServiceStudent，代码如下：

- 基于 Class 类型

```typescript
import { ServiceStudent } from '../service/student.ts';

class ControllerStudent {
  @Use()
  serviceStudent: ServiceStudent;
}
```

- 基于 Bean 标识

```typescript
import type { ServiceStudent } from '../service/student.ts';

export class ControllerStudent {
  @Use('demo-student.service.student')
  serviceStudent: ServiceStudent;
}
```

由于导入的 ServiceStudent 是 type，因此需要指定 Service 的 Bean 标识。

## 2. 依赖查找

- 本模块查找

```typescript
class ControllerStudent {
  findOne() {
    return this.scope.service.student.findOne();
  }
}
```

- 跨模块查找

```typescript
class ControllerStudent {
  findOne() {
    return this.$scope.demoStudent.service.student.findOne();
  }
}
```

## 3. 依赖查找(API)

### \_getBean

1. 基于 Bean class 查找

```typescript
import { ServiceStudent } from '../service/student.ts';

class ControllerStudent {
  findOne() {
    const serviceStudent = this.bean._getBean(ServiceStudent);
  }
}
```

this.bean === this.app.bean，就是 app 容器。

2. 基于 Bean 标识查找

```typescript
class ControllerStudent {
  findOne() {
    const serviceStudent = this.bean._getBean('demo-student.service.student');
  }
}
```

### 请求级别

如果要创建请求级别的 Bean 实例，那么，只需要调用 ctx 容器的`_getBean`方法。

```typescript
class ControllerStudent {
  findOne() {
    const serviceStudent1 = this.ctx.bean._getBean(ServiceStudent);
    const serviceStudent2 = this.ctx.bean._getBean('demo-student.service.student');
    // serviceStudent1 === serviceStudent2
  }
}
```

### \_newBean

1. 基于 Bean class 创建新实例

```typescript
class ControllerStudent {
  findOne() {
    const serviceStudent = this.bean._newBean(ServiceStudent);
  }
}
```

2. 基于 Bean 标识创建新实例

```typescript
class ControllerStudent {
  findOne() {
    const serviceStudent = this.bean._newBean('demo-student.service.student');
  }
}
```
