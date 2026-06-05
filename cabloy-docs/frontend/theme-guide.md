# Theme Guide

This page migrates the highest-value ideas from the legacy Zova `$theme` documentation.

## Why Zova themes matter

Zova provides a theme system that is independent of any one UI library and supports theme switching out of the box.

This matters because Cabloy needs a frontend architecture that can survive across different edition-specific UI stacks.

## Two theme dimensions

The legacy docs highlight two major dimensions of theme switching:

- **light/dark mode** with `light`, `dark`, and `auto`
- **brand style** changes, often centered on brand colors but not limited to them

This is an important design point: theming is not only dark-mode toggling. It is also a broader token and branding system.

## `$theme`

Zova injects `$theme` into `BeanBase`, so any bean instance can access theme state through `this.$theme`.

Important properties include:

- `name`
- `darkMode`
- `dark`
- `token`

Representative method:

- `toggleDark`

## Theme beans

The legacy docs explain that each UI library provides a default theme bean, and theme beans are responsible for returning token values and deeper theme customizations.

Representative pattern:

```typescript
@Theme()
export class ThemeDefault implements IThemeBase {
  async apply({ dark }: IThemeApplyParams) {
    const token: ThemeToken = {
      color: {
        primary: '#1976d2',
      },
      var: {
        borderColor: '#297acc',
      },
      component: {
        page: {
          background: dark ? '#121212' : '#fff',
          color: dark ? '#fff' : '#000',
        },
      },
    };
    return { token };
  }
}
```

## Custom themes

The legacy docs also show that custom theme beans can be created by following the same pattern.

That makes the theme system programmable rather than locked to a small fixed set of predefined skins.

## Runtime theme switching

Representative usage pattern:

```typescript
this.$theme.name =
  this.$theme.name === 'home-theme:default'
    ? 'home-theme:orange'
    : 'home-theme:default';
```

This illustrates that theme switching is an ordinary part of the application model and can be driven directly from code.

## Why this matters for AI workflows

When AI changes theme behavior, it should ask:

1. should this change live in a theme bean instead of inlining colors into components?
2. is the change about dark mode, brand style, or both?
3. should the change be token-driven instead of component-specific?
4. does the active edition change the UI component library while preserving the same theme architecture?

That helps keep theme work scalable and edition-aware.
