# Dependency Lookup (API)

Vona also provides a set of APIs that allow us to lookup bean instances more flexibly.

## \_getBean

### 1. Lookup based on Bean class

```typescript
import { ServiceStudent } from '../service/student.ts';

class ControllerStudent {
  async test() {
    const serviceStudent = this.bean._getBean(ServiceStudent);
  }
}
```

this.bean === this.app.bean, which is the app container.

### 2. Lookup based on Bean identifier

```typescript
class ControllerOther {
  async test() {
    const serviceStudent = this.bean._getBean('demo-student.service.student');
  }
}
```

### 3. Lookup global service bean

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

### 4. Request scope

If create a request-scope Bean instance, we only need to invoke the `_getBean` method of the ctx container.

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

### 1. Create new instance based on Bean class

```typescript
import { ServiceStudent } from '../service/student.ts';

class ControllerStudent {
  async test() {
    const serviceStudent = this.bean._newBean(ServiceStudent);
  }
}
```

### 2. Create new instance based on Bean identifier

```typescript
class ControllerOther {
  async test() {
    const serviceStudent = this.bean._newBean('demo-student.service.student');
  }
}
```

### 3. Create new instance of global service beans

```typescript
import { BeanJwt } from 'vona-module-a-jwt';

class ControllerStudent {
  async test() {
    const beanJwt1 = this.bean._newBean(BeanJwt);
    const beanJwt2 = this.bean._newBean('jwt');
  }
}
```
