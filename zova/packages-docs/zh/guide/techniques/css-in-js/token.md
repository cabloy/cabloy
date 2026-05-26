# $token

`Token`是用于构建样式的最基本单元，Zova 提供了与 UI 库无关的 token 定义与使用机制。

## 定义token接口类型

首先，需要定义一个 token 接口类型，该类型是后续所有工作的基础，也只需要定义一次。不同的 UI 库都有自己的样式实现方式，因此需要为每一个 UI 库定制不同的 token 接口类型。

下面是 Zova 开发测试时所使用的 token 接口类型定义：

`zova-dev/src/suite/a-home/modules/home-base/src/themeToken.ts`

```typescript
export interface ThemeToken {
  color: {
    primary: string;
  };
  var: {
    borderColor: string;
  };
  component: {
    page: {
      background: string;
      color: string;
    };
  };
}
```

- `ThemeToken`接口定义的内部成员结构没有任何限制，完全根据 UI 库的特点和业务需求而定义

其他几个 UI 库的 token 接口类型定义文件如下：

- element: `zova-ui-element/src/suite/a-home/modules/home-base/src/themeToken.ts`
- quasar: `zova-ui-quasar/src/suite/a-home/modules/home-base/src/themeToken.ts`
- vuetify: `zova-ui-vuetify/src/suite/a-home/modules/home-base/src/themeToken.ts`

## 提供token值

在 Zova 中，具体的 token 值都是由不同的 theme 来提供，参见：[$theme](./theme.md)

## 使用token

Zova 在 BeanBase 基类中注入了`$token`对象，从而可以在任何 bean 实例中通过`this.$token`直接访问 token 数据。

```typescript
export class RenderTest extends BeanRenderBase {
  cButtonPrimary: string;

  protected async __init__() {
    this.cButtonPrimary = this.$computed(() => {
      return this.$style({
        color: this.$token.color.primary,
        borderColor: this.$token.var.borderColor,
      });
    });
  }

  render() {
    return (
      <div>
        <div>{this.$token.color.primary}</div>
        <button class={this.cButtonPrimary}>Button</button>
      </div>
    );
  }
}
```
