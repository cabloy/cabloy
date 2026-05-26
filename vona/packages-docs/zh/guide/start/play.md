# 练习场

Vona 提供了一个练习场的功能，允许我们非常方便、快捷的对代码做测试，对想法做验证。

## 步骤

### 1. 新建play文件

我们需要新建源码文件：`src/backend/play/index.ts`。当然，并不需要手工创建此文件，而是执行以下命令，自动创建该文件：

```bash
$ vona play
```

### 2. 编写测试代码

在文件`play/index.ts`中，写入测试代码：

```diff
export async function main(app: VonaApplication, _argv: IArgv) {
+ console.log('server listen: ', app.config.server.listen);
}
```

### 3. 执行play文件

```bash
$ vona play
```

## Attach模式

为了提升性能，VonaJS 还提供了 Attach 模式。

如果已经启动了开发服务，可以使用 Attach 模式，直接在开发服务中执行 play 文件。

```bash
$ vona play --attach
$ vona play -a
```

## 举例

### 1. 模拟请求的上下文环境ctx

```diff
export async function main(app: VonaApplication, _argv: IArgv) {
+ await app.bean.executor.mockCtx(async () => {
+   // do something in ctx
+ });
}
```

### 2. 访问Api

比如，访问首页 Api：

```diff
export async function main(app: VonaApplication, _argv: IArgv) {
  await app.bean.executor.mockCtx(async () => {
+   const homeBody = await app.bean.executor.performAction('get', '//');
+   console.log(homeBody); // Hello Vona!
  });
}
```

也可以模拟中文的 ctx，然后访问首页 Api：

```diff
export async function main(app: VonaApplication, _argv: IArgv) {
  await app.bean.executor.mockCtx(async () => {
+   const homeBody = await app.bean.executor.performAction('get', '//');
+   console.log(homeBody); // 您好, Vona!
+ }, { locale: 'zh-cn' });
}
```

### 3. 模拟登录和退出登录

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
