# $cssBase

## 全局样式

可以基于业务需求创建若干个全局样式 Bean，在全局 Bean 中预先生成若干个样式变量，从而可以在任何 bean 实例中注入使用。

### 创建全局样式Bean

::: tip
右键菜单 - [模块路径]: `Zova Create/Bean: Style`
:::

依据提示输入 style bean 的名称，比如`myStyle`，VSCode 插件会自动添加 style bean 的代码骨架。

### 缺省全局样式Bean

Zova 在模块`home-base`中提供了一个全局样式 Bean，我们可以直接在这里提供一些全局样式。

`src/suite/a-home/modules/home-base/src/bean/css.base.ts`

```typescript
@Css()
export class CssBase extends BeanBase {
  cTextCenter: string;
  cButtonPrimary: string;

  protected async __init__() {
    this.cTextCenter = this.$style({ textAlign: 'center' });
    this.cButtonPrimary = this.$computed(() => {
      return this.$style({
        color: this.$token.color.primary,
        borderColor: this.$token.var.borderColor,
      });
    });
  }
}
```

- `this.cTextCenter`是静态样式
- `this.cButtonPrimary`是动态样式

### 使用缺省全局样式

```typescript
export class RenderTest extends BeanRenderBase {
  @Use()
  $$cssBase: CssBase;

  render() {
    return (
      <div class={this.$$cssBase.cTextCenter}>Hello Zova</div>
    );
  }
}
```

- 使用@Use 注入 Bean 实例

## $cssBase

由于缺省全局样式可以在不同的 bean 实例中大量使用。为了简化代码，Zova 在 BeanBase 基类中注入了`$cssBase`对象，从而可以在任何 bean 实例中通过`this.$cssBase`直接访问全局样式。

```typescript
export class RenderTest extends BeanRenderBase {
  render() {
    return (
      <div class={this.$cssBase.cTextCenter}>Hello Zova</div>
    );
  }
}
```
