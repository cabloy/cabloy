# 魔术方法

可以在 Class 内部通过`__get__`和`__set__`切入动态属性或方法。

## 举例：Module Scope

为了让 IOC 容器的使用更加简洁和直观，VonaJS 推荐优先使用`依赖查找`策略，从而使用更少的装饰器函数，使用更少的类型标注。通过`Module Scope`对象访问模块提供的资源，就是践行`依赖查找策略`的机制之一。

- 参见: [模块Scope](../../essentials/scope/introduction.md)

比如，模块 demo-student 中有一个 model `student`，用于 crud 操作。可以这样使用 model：

```typescript
import { ModelStudent } from '../model/student.ts';

async findMany(params) {
  const model = this.bean._getBean(ModelStudent);
  return await model.selectAndCount(params);
}
```

使用魔术方法：

```typescript
async findMany(params) {
  return await this.scope.model.student.selectAndCount(params);
}
```

- `this.scope.model.xxx`: 通过魔术方法动态获取当前模块中的 model 实例

## 举例：CRUD(魔术方法)

Vona ORM 采用魔术方法的机制进一步简化操作数据的代码。

- 参见: [CRUD(魔术方法)](../../techniques/orm/crud-magic.md)

比如，通过字段`id`查询学生信息，代码如下：

```typescript
async findOne(id) {
  return await this.scope.model.student.get({ id });
}
```

使用魔术方法：

```typescript
async findOne(id) {
  return await this.scope.model.student.getById(id);
}
```

- 系统自动从 method name `getById`中解析出参数`id`，然后调用实际的 CRUD 方法，这里就是: `get({ id })`

## 创建Class

可以在任何 Class 中实现魔术方法。下面，以 Service 为例，在模块 demo-student 中创建一个 Service `color`，代码如下：

- 如何创建 Service，参见: [Service](../../rest-api/service.md)

```typescript
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceColor extends BeanBase {}
```

## `__get__`

然后，通过`__get__`实现颜色值的获取。

### 1. 添加代码骨架

在 VSCode 编辑器中，输入代码片段`aopmagicget`，自动生成代码骨架:

```diff
@Service()
export class ServiceColor extends BeanBase {
+ protected __get__(prop: string) {}
}
```

### 2. 实现自定义逻辑

```diff
@Service()
export class ServiceColor extends BeanBase {
+ private _colors = {
+   red: '#FF0000',
+   green: '#00FF00',
+   blue: '#0000FF',
+ };

  protected __get__(prop: string) {
+   return this._colors[prop];
  }
}
```

### 3. 添加类型合并

通过接口类型合并的机制为颜色提供类型定义。

```typescript
declare module 'vona-module-demo-student' {
  export interface ServiceColor {
    red: string;
    green: string;
    blue: string;
  }
}
```

### 4. 使用魔术方法

```typescript
async test() {
  console.log(this.scope.service.color.red);
  console.log(this.scope.service.color.green);
  console.log(this.scope.service.color.blue);
}
```

## `__set__`

然后，通过`__set__`实现颜色值的设置。

### 1. 添加代码骨架

在 VSCode 编辑器中，输入代码片段`aopmagicset`，自动生成代码骨架:

```diff
@Service()
export class ServiceColor extends BeanBase {
+ protected __set__(prop: string, value: any): boolean {
+   return false;
+ }
}
```

### 2. 实现自定义逻辑

```diff
@Service()
export class ServiceColor extends BeanBase {
  private _colors = {
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
+   black: '',
  };

  protected __set__(prop: string, value: any): boolean {
+   if (this._colors[prop] === undefined) return false;
+   this._colors[prop] = value;
+   return true;
  }
}
```

- 如果为`prop`设置了值，返回`true`，否则返回`false`

### 3. 添加类型合并

通过接口类型合并的机制为颜色提供类型定义。

```diff
declare module 'vona-module-demo-student' {
  export interface ServiceColor {
    red: string;
    green: string;
    blue: string;
+   black: string;
  }
}
```

### 4. 使用魔术方法

```typescript
async test() {
  this.scope.service.color.black = '#000000';
  console.log(this.scope.service.color.black);
}
```
