# 如何做到直观、优雅、强大?🔥

基于 Zova 开发的项目，在提供强大能力的同时，可以始终保持代码直观、优雅。下面我们就来看看是如何做到的。

## 直观: 响应式系统

Zova 仍然使用 Vue3 直观的响应式系统，但是定义响应式变量就像原生变量一样，不需要使用`ref/reactive`，自然也不需要`ref.value`

### 举例

```typescript
class ControllerPageCounter {
  count: number = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  protected render() {
    return (
      <div>
        <div>count: {this.count}</div>
        <button onClick={() => this.increment()}>Increment</button>
        <button onClick={() => this.decrement()}>Decrement</button>
      </div>
    );
  }
}
```

## 优雅: 全局状态管理: 4合1

在实际开发当中，会遇到四类全局状态数据：`异步数据（一般来自服务端）`、`同步数据`。同步数据又分为三种：`localstorage`、`cookie`、`内存`。在传统的 Vue3 当中，分别采用不同的机制来处理这些状态数据，而在 Zova 中只需要采用统一的`Model`机制。

| 状态数据     | 传统的Vue3           | Zova  |
| ------------ | -------------------- | ----- |
| 异步数据     | Pinia                | Model |
| localstorage | Pinia + Localstorage | Model |
| cookie       | Pinia + Cookie       | Model |
| 内存         | Pinia                | Model |

采用 Model 机制统一管理这些全局状态数据，可以自动支持 SSR，规范数据使用方式，简化代码结构，提升代码的可维护性。

### 举例：如何定义

```typescript
import { BeanModelBase } from 'zova-module-a-model';

class ModelData extends BeanModelBase {
  data1?: string;
  data2?: string;
  data3?: string;

  protected async __init__() {
    // sync data
    this.data1 = this.$useStateMem({ queryKey: ['data1'] });
    this.data2 = this.$useStateCookie({ queryKey: ['data2'] });
    this.data3 = this.$useStateLocal({ queryKey: ['data3'] });
  }

  // async data
  data4() {
    return this.$useStateData({
      queryKey: ['data4'],
      queryFn: async () => {
        return await getDataFromServer();
      },
    });
  }
}
```

> 可能有人会问，内存状态数据为什么不直接使用`this.data1 = 'some value'`？
>
> > 因为在 SSR 场景中，在服务端定义的内存状态数据需要水合到客户端，这时就需要使用`$useStateMem`

### 举例：如何使用

```typescript
import { ModelData } from '../../model/data.js';

class ControllerPageTest {
  @Use()
  $$modelData: ModelData;

  // sync data
  handleSyncDataGet() {
    console.log(this.$$modelData.data1);
    console.log(this.$$modelData.data2);
    console.log(this.$$modelData.data3);
  }

  // sync data
  handleSyncDataSet() {
    this.$$modelData.data1 = 'new value';
    this.$$modelData.data2 = 'new value';
    this.$$modelData.data3 = 'new value';
  }

  // async data
  protected render() {
    const { data, error } = this.$$modelData.data4();
    if (error) {
      return <div>{error.message}</div>;
    }
    return <div>{data}</div>;
  }
}
```

## 优雅: 状态共享: 4合1

在实际开发当中，会遇到四个范围的状态共享：`组件内部`、`组件之间`、`全局`、`系统`。在传统的 Vue3 当中，分别采用不同的机制来实现，而在 Zova 中只需要采用统一的 IOC 容器机制。

| 状态共享范围 | 传统的Vue3     | Zova |
| ------------ | -------------- | ---- |
| 组件内部     | Composable     | IOC  |
| 组件之间     | Provide/Inject | IOC  |
| 全局         | Pinia          | IOC  |
| 系统         | ES Module      | IOC  |

> 可能有人会问，`全局状态共享`和`系统状态共享`有何区别？
>
> > 因为在 SSR 场景中，`全局状态共享`是针对每一个Request而言的，`系统状态共享`则可以跨越Request

### 举例：创建服务

```typescript
class ServiceData {
  count: number = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}
```

### 举例：依赖注入

```typescript
import { ServiceData } from '../../service/data.js';

class ControllerPageTest {
  // 组件内部状态共享
  @Use()
  $$serviceData: ServiceData;

  // 组件之间状态共享
  @Use({ injectionScope: 'host' })
  $$serviceData2: ServiceData;

  // 全局状态共享
  @Use({ injectionScope: 'app' })
  $$serviceData3: ServiceData;

  // 系统状态共享
  @Use({ injectionScope: 'sys' })
  $$serviceData4: ServiceData;
}
```

## 强大：IOC + AOP

IOC 是进行系统解耦行之有效的架构设计，也是应对大型业务系统开发的支撑工具。Zova 在 IOC 的基础上提供了强大的 AOP 编程能力，让系统具有无与伦比的可扩展性和可维护性。

Zova 的 AOP 编程包括：`内部切面`、`外部切面`、`行为`、`拦截器`。在这里仅举两例：

### 举例：内部切面

以前面的 class `ControllerPageCounter`为例，要在控制台输出 render 方法的执行时间，代码如下：

```diff
import { Log } from 'zova-module-a-logger';

class ControllerPageCounter {
+ @Log()
  protected render() {
    ...
  }
}
```

控制台输出如下：

![](../../assets/img/start/why-001.png)

### 举例：外部切面

也可以不改变 Class `ControllerPageCounter`源码，而是从外部切入 Log 逻辑。

```typescript
@Aop({ match: 'demo-student.controller.pageCounter' })
class AopCounterLog {
  render = (_args, next, _receiver) => {
    const timeBegin = Date.now();
    const res = next();
    const timeEnd = Date.now();
    console.log(`render: ${timeEnd - timeBegin}ms`);
    return res;
  };
}
```

控制台输出如下：

![](../../assets/img/start/why-002.png)
