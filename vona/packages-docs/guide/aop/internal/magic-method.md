# Magic Method

You can access dynamic properties or methods within a class using `__get__` and `__set__`

## Example: Module Scope

To make using the IOC container more concise and intuitive, VonaJS recommends prioritizing the `dependency lookup` strategy, which reduces the use of decorator functions and type annotations. Accessing module resources through the `Module Scope` object is one mechanism for implementing the `dependency lookup` strategy.

- See: [Module Scope](../../essentials/scope/introduction.md)

For example, the `demo-student` module contains a `student` model for crud operations. You can use the model like this:

```typescript
import { ModelStudent } from '../model/student.ts';

async findMany(params) {
  const model = this.bean._getBean(ModelStudent);
  return await model.selectAndCount(params);
}
```

Using magic method:

```typescript
async findMany(params) {
  return await this.scope.model.student.selectAndCount(params);
}
```

- `this.scope.model.xxx`: Dynamically retrieve the model instance in the current module using magic method

## Example: CRUD (Magic Method)

Vona ORM uses magic method to further simplify data manipulation code.

- See: [CRUD (Magic Methods)](../../techniques/orm/crud-magic.md)

For example, to query student information by the `id` field, the code is as follows:

```typescript
async findOne(id) {
  return await this.scope.model.student.get({ id });
}
```

Using magic method:

```typescript
async findOne(id) {
  return await this.scope.model.student.getById(id);
}
```

- The system automatically parses the `id` parameter from the `getById` method name and then calls the actual CRUD method, which is: `get({ id })`

## Creating a Class

Magic method can be implemented in any class. Taking Service as an example, create a Service `color` in the module demo-student with the following code:

- For information on creating a Service, see: [Service](../../rest-api/service.md)

```typescript
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceColor extends BeanBase {}
```

## `__get__`

Then, use `__get__` to retrieve the color values.

### 1. Add a code skeleton

In the VSCode editor, enter the code snippet `aopmagicget` to automatically generate a code skeleton:

```diff
@Service()
export class ServiceColor extends BeanBase {
+ protected __get__(prop: string) {}
}
```

### 2. Implement custom logic

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

### 3. Adding Type Merging

Providing type definitions for colors using interface type merging.

```typescript
declare module 'vona-module-demo-student' {
  export interface ServiceColor {
    red: string;
    green: string;
    blue: string;
  }
}
```

### 4. Using Magic Method

```typescript
async test() {
  console.log(this.scope.service.color.red);
  console.log(this.scope.service.color.green);
  console.log(this.scope.service.color.blue);
}
```

## `__set__`

Then, use `__set__` to set the color values.

### 1. Add a code skeleton

In the VSCode editor, enter the code snippet `aopmagicset` to automatically generate a code skeleton:

```diff
@Service()
export class ServiceColor extends BeanBase {
+ protected __set__(prop: string, value: any): boolean {
+   return false;
+ }
}
```

### 2. Implement custom logic

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

- If a value is set for `prop`, return `true`; otherwise, return `false`

### 3. Add type merging

Provide type definitions for colors using the interface type merging mechanism.

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

### 4. Using magic method

```typescript
async test() {
  this.scope.service.color.black = '#000000';
  console.log(this.scope.service.color.black);
}
```
