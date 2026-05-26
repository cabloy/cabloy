# Bean标识

系统会为每一个 bean class 自动分配一个标识，格式如下：

```bash
{moduleName}.{sceneName}.{beanName}
```

比如，模块 demo-student 提供了一个 Service bean：ServiceStudent。那么该 bean 对应的标识为：`demo-student.service.student`

## 全局Service Bean

为了进一步简化 Bean 的使用，Vona 提供了全局 Service Bean 的概念。如果一个 Bean class 的 sceneName 值是`bean`，那么这个 bean class 就是全局 Service Bean。

全局 Service Bean 的 Bean 标识就是`beanName`

例如，模块 a-jwt 提供了一个全局 Service Bean：`jwt`。那么，这个全局 Service Bean 的标识就是`jwt`

## 基于Bean标识注入的优点

在跨模块注入 bean 时，不建议直接`基于Class类型`注入，而是`基于Bean标识`注入。基于 Bean 标识注入有以下优点：

1. `支持循环引用`：在复杂的业务场景中，经常会出现多个 Bean 之间相互引用的情况。基于 Bean 标识注入可以非常直观的支持循环引用的场景，不会出现错误提示，没有任何心智负担
