# $token

`Token` is the most basic unit for building styles. Zova provides a token definition and usage mechanism that is independent of UI libraries.

## Define token interface type

First, you need to define a token interface type, which is the basis for all subsequent work and only needs to be defined once. Different UI libraries have their own style implementations, so different token interface types need to be customized for each UI library.

The following is the token interface type definition used by Zova when developing and testing:

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

- The internal member structure defined by the `ThemeToken` interface has no restrictions and is completely defined based on the characteristics of the UI library and business needs

The token interface type definition files of several other UI libraries are as follows:

- element: `zova-ui-element/src/suite/a-home/modules/home-base/src/themeToken.ts`
- quasar: `zova-ui-quasar/src/suite/a-home/modules/home-base/src/themeToken.ts`
- vuetify: `zova-ui-vuetify/src/suite/a-home/modules/home-base/src/themeToken.ts`

## Provide token value

In Zova, specific token values ​​are provided by different themes, see: [$theme](./theme.md)

## Use token

Zova injects a `$token` object into the `BeanBase` base class so that token data can be directly accessed through `this.$token` in any bean instance.

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
