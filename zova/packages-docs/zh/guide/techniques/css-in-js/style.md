# $style

Zova 提供了一个核心模块 a-style，该模块基于[TypeStyle](https://github.com/typestyle/typestyle)提供了 css-in-js 能力。

Zova 在 BeanBase 基类中注入了`$style`方法，从而可以在任何 bean 实例中通过`this.$style`访问 css-in-js 的能力。

## Scope样式

- 基本原理：`this.$style`采用 hash 算法，通过传入的样式参数生成唯一的 className，从而避免命名冲突。为了方便排查问题，在开发阶段为生成的 className 自动添加模块名称前缀

```typescript
export class RenderTest extends BeanRenderBase {
  cTextCenter: string;

  protected async __init__() {
    this.cTextCenter = this.$style({ textAlign: 'center' });
  }

  render() {
    return (
      <div class={this.cTextCenter}>Hello Zova</div>
    );
  }
}
```

- 通过`this.$style`生成 className，并赋值给`this.cTextCenter`
- 在渲染代码中直接使用`this.cTextCenter`

## 动态样式

可以采用计算属性来创建动态样式。

```typescript
export class RenderTest extends BeanRenderBase {
  active: boolean;
  cTextColor: string;

  protected async __init__() {
    this.cTextColor = this.$computed(() => {
      return this.$style({ color: this.active ? 'orange' : '' });
    });
  }

  render() {
    return (
      <div class={this.cTextColor}>Hello Zova</div>
    );
  }
}
```

- 使用`this.$computed`创建计算属性
- 根据`this.active`的变化生成不同的 className
