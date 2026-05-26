# 依赖查找

除了`依赖注入`，Vona 还提供了`依赖查找`。在 Vona 中，推荐使用依赖查找，因为依赖查找可以让代码更加简洁、直观。

## 本模块查找

在模块 demo-student 查找本模块提供的 ServiceStudent，代码如下：

```typescript
class ControllerStudent {
  async findMany() {
    return await this.scope.service.student.findMany();
  }
}
```

通过`this.scope`获取本模块的 scope 对象，从而找到本模块提供的 service。

## 跨模块查找

在其他模块查找模块 demo-student 提供的 ServiceStudent，代码如下：

```typescript
class ControllerOther {
  async findMany() {
    return await this.$scope.demoStudent.service.student.findMany();
  }
}
```

通过`this.$scope.demoStudent`获取模块 demo-student 的 scope 对象，从而找到模块 demo-student 提供的 service。

## 查找全局service bean

在模块 demo-student 查找模块 a-jwt 提供的全局 service bean `BeanJwt`，代码如下：

```typescript
class ControllerStudent {
  async test() {
    return await this.bean.jwt.create({});
  }
}
```

通过`this.bean`获取 app 容器，从而找到全局 service bean。
