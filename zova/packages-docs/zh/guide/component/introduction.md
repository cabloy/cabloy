# 组件

## 代码风格

Zova 提供更直观、更优雅、更强大的代码风格，融合 Vue3、React、Angular 的核心设计：

- `Vue3`: 直观响应式
- `React`: 灵活 TSX 渲染
- `Angular`: 强大 IOC 容器

## 创建组件

以模块`demo-student`为例，创建一个组件`card`

### 1. Cli命令

```bash
$ zova :create:component card --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Create/Component`
:::

依据提示输入组件名称`card`，VSCode 插件会自动创建组件的代码骨架。

## Controller定义

```typescript
@Controller()
class ControllerCard extends BeanControllerBase {
  protected render() {
    return null;
  }
}
```

## 组件Wrapper

Zova 为每个组件自动生成了一个组件 Wrapper。比如，组件`card`对应的组件 Wrapper 就是`ZCard`

::: info
所有组件 Wrapper 都使用`Z`前缀，从而方便在 JSX 中快速查找组件
:::

## 使用组件

```typescript
import { ZCard } from 'zova-module-demo-student';

class RenderPageCounter {
  render() {
    return (
      <ZCard></ZCard>
    );
  }
}
```

::: info
基于编译器的加持， ZCard 会自动转为异步加载模式，具体而言就是：系统会异步加载模块`demo-student`，然后取得组件`card`，再进行组件渲染
:::

## 如何引用组件实例

在 Zova 中，不使用`Template Ref`引用组件实例，而是直接引用组件对应的`controller`，这样可以支持更直观并且更强大的类型提示。

```typescript
import type { ControllerCard } from 'zova-module-demo-student';
import { ZCard } from 'zova-module-demo-student';

class RenderPageCounter {
  cardRef: ControllerCard;

  render() {
    return (
      <ZCard
        controllerRef={ref => {
          this.cardRef = ref;
        }}
      ></ZCard>
    );
  }
}
```
