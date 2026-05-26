# CRUD(魔术方法)

Vona ORM 采用魔术方法的机制进一步简化操作数据的代码。

## 什么是魔术方法

系统自动从 method name 中解析出参数，然后调用实际的 CRUD 方法。

- 举例 1

```typescript
this.scope.model.student.getByName('Tom');
```

系统检测到`getBy`前缀，于是自动解析出参数名称`name`，参数值`'Tom'`，然后调用如下方法:

```typescript
this.scope.model.student.get({ name: 'Tom' });
```

- 举例 2

```typescript
this.scope.model.student.getByNameEqI('Tom');
```

系统检测到`getBy`前缀，于是自动解析出参数名称`name`，参数值`'Tom'`，条件操作符`eqI`，然后调用如下方法:

```typescript
this.scope.model.student.get({ name: { _eqI_: 'Tom' } });
```

## 常用魔术方法

系统会自动检测以下常用字段，如果在 Entity 中声明了字段，就会自动为相应 Model 生成该字段的魔术方法的类型定义：

- `id/name/enabled/disabled/closed/active`

因此，不需任何额外代码，即可享受魔术方法带来的便利。

以字段`id`为例，会提供以下魔术方法:

```typescript
this.scope.model.student.getById(id);
this.scope.model.student.updateById(id, student);
this.scope.model.student.deleteById(id);
```

以字段`name`为例，会提供以下魔术方法:

```typescript
this.scope.model.student.getByName(name);
this.scope.model.student.getByNameEqI(name);
this.scope.model.student.selectByName(name);
this.scope.model.student.selectByNameEqI(name);
```

## 自定义方法

如果需要对其他字段实现类似魔术方法的风格，可以直接在 Model 中定义相应的方法。

比如，针对字段`title`，提供方法`getByTitle`/`selectByTitle`:

```typescript
@Model()
class ModelPost {
  getByTitle(title: string) {
    return this.get({ title: { _includesI_: title } });
  }

  selectByTitle(title: string) {
    return this.select({ where: { title: { _includesI_: title } } });
  }
}
```

::: warning
这里定义的就是一般的方法，不是魔术方法，可以按业务需求实现自定义逻辑
:::

于是，可以这样使用:

```typescript
this.scope.model.post.getByTitle(title);
this.scope.model.post.selectByTitle(title);
```

## 自定义方法优先

如果在 Model 中提供了自定义方法，那么相应的魔术方法就会失效。

比如，针对字段`name`，提供方法`getByName`:

```typescript
@Model()
class ModelStudent {
  getByName(name: string) {
    return this.get({ name: { _eqI_: name } });
  }
}
```
