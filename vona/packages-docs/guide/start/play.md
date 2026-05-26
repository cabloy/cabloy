# Playground

Vona provides a Playground, which allows us to test the code and verify the ideas very conveniently and quickly.

## Steps

### 1. Create a new play file

We need to create a new source code file: `src/backend/play/index.ts`. However, we do not need to create this file manually, but execute the following command to automatically create the file:

```bash
$ vona play
```

### 2. Write test code

In the file `play/index.ts`, we write the test code:

```diff
export async function main(app: VonaApplication, _argv: IArgv) {
+ console.log('server listen: ', app.config.server.listen);
}
```

### 3. Execute play file

```bash
$ vona play
```

## Attach Mode

To improve performance, VonaJS also provides an Attach mode.

If the dev server is already running, you can use Attach mode to execute the play file directly within the dev server.

```bash
$ vona play --attach
$ vona play -a
```

## Example

### 1. Simulate the context object of the request

```diff
export async function main(app: VonaApplication, _argv: IArgv) {
+ await app.bean.executor.mockCtx(async () => {
+   // do something in ctx
+ });
}
```

### 2. Access the API

For example, we access the home API:

```diff
export async function main(app: VonaApplication, _argv: IArgv) {
  await app.bean.executor.mockCtx(async () => {
+   const homeBody = await app.bean.executor.performAction('get', '//');
+   console.log(homeBody); // Hello Vona!
  });
}
```

We can also simulate Chinese ctx and then access the home API:

```diff
export async function main(app: VonaApplication, _argv: IArgv) {
  await app.bean.executor.mockCtx(async () => {
+   const homeBody = await app.bean.executor.performAction('get', '//');
+   console.log(homeBody); // 您好, Vona!
+ }, { locale: 'zh-cn' });
}
```

### 3. Simulate signin and signout

```diff
export async function main(app: VonaApplication, _argv: IArgv) {
  await app.bean.executor.mockCtx(async () => {
    // signin as user: admin
+   await app.bean.passport.signinMock();
    // do something
    // signout
+   await app.bean.passport.signout();
  });
}
```
