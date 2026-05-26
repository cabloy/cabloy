# 依赖查找(API)

Vona 还提供了一组 API，使我们可以更加灵活的查找 bean 实例。

## \_getBean

### 1. 基于 Bean class 查找

```typescript
import { ServiceStudent } from '../service/student.ts';

class ControllerStudent {
  async test() {
    const serviceStudent = this.bean._getBean(ServiceStudent);
  }
}
```

this.bean === this.app.bean，就是 app 容器。

### 2. 基于 Bean 标识查找

```typescript
class ControllerOther {
  async test() {
    const serviceStudent = this.bean._getBean('demo-student.service.student');
  }
}
```

### 3. 查找全局 service bean

```typescript
import { BeanJwt } from 'vona-module-a-jwt';

class ControllerStudent {
  async test() {
    const beanJwt1 = this.bean._getBean(BeanJwt);
    const beanJwt2 = this.bean._getBean('jwt');
    const beanJwt3 = this.bean.jwt;
    // beanJwt1 === beanJwt2 === beanJwt3
  }
}
```

### 4. 请求级别

如果要创建请求级别的 Bean 实例，那么，只需要调用 ctx 容器的`_getBean`方法。

```typescript
class ControllerStudent {
  async test() {
    const serviceStudent1 = this.ctx.bean._getBean(ServiceStudent);
    const serviceStudent2 = this.ctx.bean._getBean('demo-student.service.student');
    // serviceStudent1 === serviceStudent2
  }
}
```

## \_newBean

### 1. 基于 Bean class 创建新实例

```typescript
import { ServiceStudent } from '../service/student.ts';

class ControllerStudent {
  async test() {
    const serviceStudent = this.bean._newBean(ServiceStudent);
  }
}
```

### 2. 基于 Bean 标识创建新实例

```typescript
class ControllerOther {
  async test() {
    const serviceStudent = this.bean._newBean('demo-student.service.student');
  }
}
```

### 3. 创建全局 Service Bean 的新实例

```typescript
import { BeanJwt } from 'vona-module-a-jwt';

class ControllerStudent {
  async test() {
    const beanJwt1 = this.bean._newBean(BeanJwt);
    const beanJwt2 = this.bean._newBean('jwt');
  }
}
```
