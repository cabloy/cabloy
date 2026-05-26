# 单元测试

Vona 强烈建议基于测试驱动开发。测试驱动开发，可以有效沉淀开发成果，当代码出现变更时也能尽快锁定潜在问题，从而显著提升代码的鲁棒性。

Vona 采用`并行机制`运行测试文件，从而显著提升测试效率。

::: warning
`Sqlite3`只支持一个写连接，因此不支持`并行机制`
:::

## 创建测试文件

### 1. Cli命令

```bash
$ vona :create:test student --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Create/Test`
:::

## 执行单元测试

```bash
$ npm run test
```

当执行此命名时，系统会执行以下步骤：

1. 创建全局 App 对象
2. 清理 Redis 数据
3. 删除旧数据库，重建一个新的数据库
4. 执行迁移代码
5. `并行`执行单元测试文件

```bash
$ npm run db:reset
```

与`test`命令不同的是，`db:reset`只执行前`4`个步骤，不执行单元测试文件。

## 测试覆盖率

```bash
$ npm run cov
```

## 测试举例

### 1. 模拟请求上下文对象

```typescript
describe('student.test.ts', () => {
  it('action:student', async () => {
    await app.bean.executor.mockCtx(async () => {
      // do something
    });
  });
});
```

- 为 ctx 指定当前语言

```typescript
describe('student.test.ts', () => {
  it('action:student', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        // do something
      },
      { locale: 'zh-cn' },
    );
  });
});
```

### 2. 获取模块Scope对象

```typescript
await app.bean.executor.mockCtx(async () => {
  const scopeStudent = app.scope('demo-student');
});
```

### 3. 使用Service

```typescript
const scopeStudent = app.scope('demo-student');
const students = await scopeStudent.service.student.findMany();
```

### 4. 使用Model

```typescript
const scopeStudent = app.scope('demo-student');
const students = await scopeStudent.model.student.select();
```

### 5. 使用Entity

```typescript
const scopeStudent = app.scope('demo-student');
const tableName = scopeStudent.entity.student.$table;
const fieldName = scopeStudent.entity.student.name;
```

### 6. 调用Api，从而测试Controller

```typescript
await app.bean.executor.mockCtx(async () => {
  const students = await app.bean.executor.performAction('get', '/demo/student');
});
```

### 7. 模拟认证

- 模拟登录

```typescript
await app.bean.executor.mockCtx(async () => {
  await app.bean.passport.signinMock();
});
```

可以指定登录的用户名，默认为`admin`

```typescript
await app.bean.passport.signinMock('admin');
```

- 获取当前用户信息

```typescript
await app.bean.passport.signinMock();

const passport = app.ctx.passport;
const user = app.ctx.user;

const passport = app.bean.passport.current;
const user = app.bean.passport.currentUser;
const auth = app.bean.passport.currentAuth;
const roles = app.bean.passport.currentRoles;
```

- 模拟退出登录

```typescript
await app.bean.passport.signout();
```

### 8. 工具：assert

Vona 使用 Node 内置的断言库。

```typescript
import assert from 'node:assert';

await app.bean.executor.mockCtx(async () => {
  assert.equal(app.config.server.listen.port, 7102);
});
```

### 9. 工具：catchError

`catchError`可以更优雅的捕获错误异常。

- 一般的写法

```typescript
await app.bean.executor.mockCtx(async () => {
  const scopeStudent = app.scope('demo-student');
  try {
    const students = await scopeStudent.service.student.findMany();
  } catch (err) {
    // do something
  }
});
```

- 使用 catchError

```typescript
import { catchError } from '@cabloy/utils';

await app.bean.executor.mockCtx(async () => {
  const scopeStudent = app.scope('demo-student');
  const [students, err] = await catchError(() => {
    return scopeStudent.service.student.findMany();
  });
  if (err) {
    // do somthing on err
  }
});
```

### 10. 完整的Crud测试

```typescript
describe('student.test.ts', () => {
  it('action:student', async () => {
    await app.bean.executor.mockCtx(async () => {
      // data
      const data: DtoStudentCreate = {
        name: '__Tom__',
        description: 'This is a test',
      };
      const dataUpdate: DtoStudentUpdate = {
        name: '__TomNew__',
        description: 'This is a test',
      };
      // login
      await app.bean.passport.signinMock();
      // create
      const studentId = await app.bean.executor.performAction('post', '/demo/student', {
        body: data,
      });
      assert.equal(!!studentId, true);
      // findMany
      const queryRes: DtoStudentQueryRes = await app.bean.executor.performAction(
        'get',
        '/demo/student',
      );
      assert.equal(queryRes.list.findIndex(item => item.name === data.name) > -1, true);
      // update
      await app.bean.executor.performAction('patch', '/demo/student/:id', {
        params: { id: studentId },
        body: dataUpdate,
      });
      // findOne
      let student: EntityStudent = await app.bean.executor.performAction(
        'get',
        '/demo/student/:id',
        { params: { id: studentId } },
      );
      assert.equal(student.name, dataUpdate.name);
      // delete
      await app.bean.executor.performAction('delete', '/demo/student/:id', {
        params: { id: student.id },
      });
      // findOne
      student = await app.bean.executor.performAction('get', '/demo/student/:id', {
        params: { id: student.id },
      });
      assert.equal(student, undefined);
      // logout
      await app.bean.passport.signout();
    });
  });
});
```
