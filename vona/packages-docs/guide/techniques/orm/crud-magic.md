# CRUD(Magic Methods)

Vona ORM uses magic methods to further simplify data manipulation code.

## What are Magic Methods?

The system automatically parses the parameters from the method name and then invokes the actual CRUD method.

- Example 1

```typescript
this.scope.model.student.getByName('Tom');
```

The system detects the `getBy` prefix and automatically parses the parameter name `name` and the parameter value `Tom`, then invokes the following method:

```typescript
this.scope.model.student.get({ name: 'Tom' });
```

- Example 2

```typescript
this.scope.model.student.getByNameEqI('Tom');
```

The system detects the `getBy` prefix and automatically parses the parameter name `name`, the parameter value `'Tom'`, the operator `eqI`, and then invokes the following method:

```typescript
this.scope.model.student.get({ name: { _eqI_: 'Tom' } });
```

## Common Magic Methods

The system automatically detects the following commonly used fields. If a field is declared in an `Entity`, the type definition of the magic method of the field will be automatically generated for the corresponding `Model`:

- `id/name/enabled/disabled/closed/active`

Thus, we can enjoy the convenience of magic methods without any additional code.

For example, the field `id` provides the following magic methods:

```typescript
this.scope.model.student.getById(id);
this.scope.model.student.updateById(id, student);
this.scope.model.student.deleteById(id);
```

For the `name` field, for example, the following magic methods are provided:

```typescript
this.scope.model.student.getByName(name);
this.scope.model.student.getByNameEqI(name);
this.scope.model.student.selectByName(name);
this.scope.model.student.selectByNameEqI(name);
```

## Custom Methods

If you need to implement a magic method-like style for other fields, you can define the corresponding methods directly in the model.

For example, for the `title` field, provide the `getByTitle`/`selectByTitle` methods:

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
This defines a general method, not a magic method. We can implement custom logic based on business needs
:::

So, you can use it like this:

```typescript
this.scope.model.post.getByTitle(title);
this.scope.model.post.selectByTitle(title);
```

## Custom methods take precedence

If a custom method is provided in the model, the corresponding magic method will be invalid.

For example, for the field `name`, provide the method `getByName`:

```typescript
@Model()
class ModelStudent {
  getByName(name: string) {
    return this.get({ name: { _eqI_: name } });
  }
}
```
