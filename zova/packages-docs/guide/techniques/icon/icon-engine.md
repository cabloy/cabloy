# Icon

For a large system, no matter how many icons are built into the framework, it is not enough. For this purpose, Zova provides an `icon engine`

## Advantages

1. `Easy to maintain`: icons can be added very conveniently
2. `Excellent performance`: Taking into account both `file size` and `download speed` performance considerations. No matter how many icons are used in the system, the best balance is always maintained
3. `Asynchronous loading`: All icons are loaded asynchronously on demand, using grouped files as the loading unit
4. `UI library independent`: no matter which UI library is used, the same icon engine is used

## Basic principles

1. `Icon group`: Combine several SVG icons into one group. Each group represents an `asynchronously loaded` icon file
2. `Icon module`: An icon module can contain multiple groups, and a system can create multiple icon modules

## Icon naming convention

For ease of use, it is necessary to develop a unified icon naming convention:

```bash
{moduleName}:{groupName}:{iconName}
```

For example, Zova provides an icon module `home-icon`, which has a group `default` and an icon `add` in the group. Then, the full name of this icon is: `home-icon:default:add`

### Special conventions

In order to further simplify the use of icons, the following conventions have been made:

1. Can be omitted if module name is `home-icon`
2. Can be omitted if group name is `default`

Examples are as follows:

| Full name                   | Short name           |
| --------------------------- | -------------------- |
| home-icon:default:add       | ::add                |
| home-icon:auth:github       | :auth:github         |
| test-othericon:default:icon | test-othericon::icon |

## icon function

The typed icon name can be obtained through `icon` function in any bean instance, thus supporting auto-completion.

## iconh function

The `vnode` object of icon can be directly generated in any bean instance through `iconh` function.

## Use Icon

The icon engine provides a unified interface that can be used directly in any UI library.

### 1. antdv

```typescript
import { Button } from 'ant-design-vue';
<Button icon={$icon('::add', 24)}></Button>
```

### 2. element-plus

```typescript
import { ElButton } from 'element-plus';
<ElButton icon={$iconName('::add')}></ElButton>
```

### 3. quasar

```typescript
import { QBtn } from 'quasar';
<QBtn icon={$iconName('::add')}></QBtn>;
```

### 4. vuetify

```typescript
import { VBtn } from 'vuetify/components';
<VBtn icon={$iconName('::add')}></VBtn>;
```

## Create Icon

We can either add icons to the existing module `home-icon` or create a new module.

### 1. Initialize code skeleton

::: tip
Context Menu - [Module Path]: `Zova Init/Icon`
:::

### 2. Prepare icon

Place the SVG icon into the icon module's group directory. For example, the `default` group of module `home-icon` has the group directory path:
`src/suite/a-home/modules/home-icon/icons`

### 3. Build icon

::: tip
Context Menu - [Module Path]: `Zova Tools/Generate .metadata`
:::
