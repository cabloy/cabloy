# BeanBase

`BeanBase` 是所有 bean 的基类。通过继承自`BeanBase`，可以在书写代码时便利的访问到常用的工具和能力。

## Vona 的 IOC 容器为何代码更简洁？

原因就是优先使用`依赖查找`策略，从而使用更少的装饰器函数，使用更少的类型标注。向`BeanBase`注入系统能力对象，就是践行`依赖查找策略`的机制之一。

## 内置成员

| 名称         | 说明                                  |
| ------------ | ------------------------------------- |
| app          | 全局 App 对象                         |
| ctx          | 当前 request 的 Context 对象          |
| ctx.bean     | ctx 容器                              |
| bean         | app 容器                              |
| scope        | 当前 bean 实例所归属模块的 Scope 对象 |
| $scope       | 获取指定模块的 Scope 对象             |
| $logger      | 获取Logger对象                        |
| $loggerChild | 获取Logger Child对象                  |

## BeanBaseSimple

`BeanBase`继承自`BeanBaseSimple`

### 内置成员

| 名称          | 说明          |
| ------------- | ------------- |
| $beanFullName | Bean标识      |
| $beanOptions  | Bean Options  |
| $onionName    | Onion名称     |
| $onionOptions | Onion Options |
