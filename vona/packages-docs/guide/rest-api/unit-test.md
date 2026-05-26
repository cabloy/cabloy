# Unit Test

Vona strongly recommends test-driven development. Test-driven development can effectively accumulate development results and identify potential problems as soon as possible when code changes occur, thereby significantly improving the robustness of the code.

Vona uses a `parallel mechanism` to run test files, thereby significantly improving test efficiency.

::: warning
`Sqlite3` only supports one write connection, so `parallel mechanism` is not supported
:::

## Create test file

### 1. Cli command

```bash
$ vona :create:test student --module=demo-student
```

### 2. Menu command

::: tip
Context menu - [Module Path]: `Vona Create/Test`
:::

## Execute unit tests

```bash
$ npm run test
```

When this command is executed, the system will perform the following steps:

1. Create a global `app` object
2. Clean up `Redis` data
3. Delete the old database and recreate a new database
4. Execute migration code
5. `Parallel` execute unit test files

```bash
$ npm run db:reset
```

Unlike the `test` command, `db:reset` only executes the first `four` steps and does not execute the unit test files.

## Test coverage

```bash
$ npm run cov
```

## Example

### 1. Simulate the request context object

```typescript
describe('student.test.ts', () => {
  it('action:student', async () => {
    await app.bean.executor.mockCtx(async () => {
      // do something
    });
  });
});
```

- Specify the current language for ctx

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

### 2. Get the module Scope object

```typescript
await app.bean.executor.mockCtx(async () => {
  const scopeStudent = app.scope('demo-student');
});
```

### 3. Use Service

```typescript
const scopeStudent = app.scope('demo-student');
const students = await scopeStudent.service.student.findMany();
```

### 4. Use Model

```typescript
const scopeStudent = app.scope('demo-student');
const students = await scopeStudent.model.student.select();
```

### 5. Using Entity

```typescript
const scopeStudent = app.scope('demo-student');
const tableName = scopeStudent.entity.student.$table;
const fieldName = scopeStudent.entity.student.name;
```

### 6. Access API to test Controller

```typescript
await app.bean.executor.mockCtx(async () => {
  const students = await app.bean.executor.performAction('get', '/demo/student');
});
```

### 7. Simulate authentication

- Simulate login

```typescript
await app.bean.executor.mockCtx(async () => {
  await app.bean.passport.signinMock();
});
```

You can specify the login username, the default is `admin`

```typescript
await app.bean.passport.signinMock('admin');
```

- Get current user information

```typescript
await app.bean.passport.signinMock();

const passport = app.ctx.passport;
const user = app.ctx.user;

const passport = app.bean.passport.current;
const user = app.bean.passport.currentUser;
const auth = app.bean.passport.currentAuth;
const roles = app.bean.passport.currentRoles;
```

- Simulate logout

```typescript
await app.bean.passport.signout();
```

### 8. Tools: assert

Vona uses Node's built-in assertion library.

```typescript
import assert from 'node:assert';

await app.bean.executor.mockCtx(async () => {
  assert.equal(app.config.server.listen.port, 7102);
});
```

### 9. Tool: catchError

`catchError` can capture error exception more elegantly.

- General writing

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

- Use catchError

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

### 10. Complete Crud test

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
