# 模块Scope

在 Vona 中，实际的业务代码开发都是在模块中进行。模块作为一个相对独立的业务单元，包含各种类型的资源：`Config配置`、`Constant常量`、`Locale国际化`、`Error错误异常`、`Service`、`Model`、`Entity`，等等。为了统一管理这些资源，方便资源的定义和使用，Vona 提供了`Scope`对象。

## Vona 的 IOC 容器为何代码更简洁？

原因就是优先使用`依赖查找`策略，从而使用更少的装饰器函数，使用更少的类型标注。通过`Scope`对象访问模块提供的资源，就是践行`依赖查找策略`的机制之一。

## this.scope: 获取本模块Scope实例

所有 bean 都继承自基类`BeanBase`，因此可以直接获取到当前 bean 所属模块的`Scope`实例。

```typescript
class ControllerStudent extends BeanBase {
  async test() {
    console.log(this.scope);
  }
}
```

通过`this.scope`即可访问到当前 bean 所属模块的`Scope`实例。

## this.$scope: 跨模块获取Scope实例

```typescript
class ControllerOther extends BeanBase {
  async test() {
    console.log(this.$scope.demoStudent);
  }
}
```

通过`this.$scope.demoStudent`获取模块 demo-student 的`Scope`实例。

```typescript
class ControllerOther extends BeanBase {
  async test() {
    console.log(this.$scope.user);
  }
}
```

如果模块名称的 providerId 为`a`，比如`a-user`，那么可以简化为`user`

## app.scope: 获取Scope实例的一般方法

如果没有继承自基类`BeanBase`，无法使用`this.scope`和`this.$scope`，则可以使用一般方法：

`src/backend/play/index.ts`

```diff
export async function main(app: VonaApplication, _argv: IArgv) {
  await app.bean.executor.mockCtx(async () => {
+   const scopeDemoStudent = app.scope('demo-student');
+   const scopeUser = app.scope('a-user');
  });
}
```

## Scope对象的成员

| 名称     | 说明             |
| -------- | ---------------- |
| config   | 模块的Config配置 |
| constant | 模块的常量定义   |
| locale   | 模块的I18n国际化 |
| error    | 模块的错误异常   |
| service  | 模块的Services   |
| model    | 模块的Models     |
| entity   | 模块的Entities   |
