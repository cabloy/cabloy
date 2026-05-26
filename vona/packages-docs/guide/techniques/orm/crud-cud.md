# CRUD(Insert/Update/Delete)

The following uses the `test-vona` module as an example to explain the usage of `Insert/Update/Delete` in CRUD.

In addition, Vona ORM provides `Mutate` operations, which can perform corresponding `Insert/Update/Delete` operations based on the characteristics of the input data.

## insert

```typescript
class ServicePost {
  async create() {
    const post = await this.scope.model.post.insert({
      title: 'Post001',
    });
    console.log(post.id);
    return post;
  }
}
```

## insertBulk

```typescript
class ServicePost {
  async createBulk() {
    const posts = await this.scope.model.post.insertBulk([
      { title: 'Post001' },
      { title: 'Post002' },
    ]);
    console.log(posts[0].id, posts[1].id);
    return posts;
  }
}
```

## update

```typescript
class ServicePost {
  async update() {
    const post = await this.scope.model.post.update({
      id: 1,
      title: 'Post001-Update',
    });
    return post;
  }
}
```

```typescript
class ServicePost {
  async update2() {
    const post = await this.scope.model.post.update(
      {
        title: 'Post001-Update',
      },
      {
        where: {
          title: { _startsWith_: 'Post001' },
        },
      },
    );
    return post;
  }
}
```

## updateBulk

```typescript
class ServicePost {
  async updateBulk() {
    const posts = await this.scope.model.post.updateBulk([
      { id: 1, title: 'Post001-Update' },
      { id: 2, title: 'Post002-Update' },
    ]);
    return posts;
  }
}
```

## delete

```typescript
class ServicePost {
  async delete() {
    await this.scope.model.post.delete({
      id: 1,
    });
  }
}
```

```typescript
class ServicePost {
  async delete2() {
    await this.scope.model.post.delete({
      title: {
        _startsWith_: 'Post',
      },
    });
  }
}
```

## deleteBulk

```typescript
class ServicePost {
  async deleteBulk() {
    await this.scope.model.post.deleteBulk([1, 2]);
  }
}
```

## mutate

`mutate` is a hybrid operation of `insert/update/delete`. The system will perform corresponding change operations based on the characteristics of the input data.

| Data characteristics                                          | Change operations |
| ------------------------------------------------------------- | ----------------- |
| The `id` field does not exist                                 | insert            |
| The `id` field exists                                         | update            |
| The `id` field exists and the `deleted` field value is `true` | delete            |

```typescript
class ServicePost {
  async mutate() {
    // insert
    const post = await this.scope.model.post.mutate({
      title: 'Post001',
    });
    // update
    await this.scope.model.post.mutate({
      id: post.id,
      title: 'Post001-Update',
    });
    // delete
    await this.scope.model.post.mutate({
      id: post.id,
      deleted: true,
    });
  }
}
```

## mutateBulk

```typescript
class ServicePost {
  async mutateBulk() {
    await this.scope.model.post.mutateBulk([
      // insert
      { title: 'Post003' },
      // update
      { id: 1, title: 'Post001-Update' },
      // delete
      { id: 2, deleted: true },
    ]);
  }
}
```
