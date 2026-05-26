# 图标

对于一个大型系统而言，无论框架内置多少图标都是不够用的。为此，Zova 提供了一个`图标引擎`

## 优点

1. `易于维护`：可以非常方便的添加图标
2. `性能优异`：兼顾`文件体积`与`下载速度`两方面的性能考量。不论系统中使用了多少图标，都始终保持最佳的平衡状态
3. `异步加载`：所有图标都是按需异步加载，以分组文件作为加载单元
4. `UI库无关`：不论采用何种 UI 库，都采用一致的图标引擎

## 基本原则

1. `图标分组`：将若干个 SVG 图标合为一个分组。每个分组代表一个`异步加载`的图标文件
2. `图标模块`：一个图标模块可以包含多个分组，一个系统可以创建多个图标模块

## 图标命名规范

为了方便使用，有必要制定统一的图标命名规范：

```bash
{moduleName}:{groupName}:{iconName}
```

比如，Zova 提供了一个图标模块`home-icon`，其中有一个分组`default`，该分组中有一个图标`add`。那么，此图标的全称就是：`home-icon:default:add`

### 特殊约定

为了进一步简化图标的使用，特别做了如下约定：

1. 如果模块名称是`home-icon`，则可以省略
2. 如果分组名称是`default`，则可以省略

举例如下：

| 全称                        | 简称                 |
| --------------------------- | -------------------- |
| home-icon:default:add       | ::add                |
| home-icon:auth:github       | :auth:github         |
| test-othericon:default:icon | test-othericon::icon |

## icon函数

可以在任何 bean 实例中通过`icon`函数获取到类型化的图标名称，从而支持智能提示。

## iconh函数

可以在任何 bean 实例中通过`iconh`函数直接生成图标的 vnode 对象。

## 使用图标

图标引擎提供了统一的接口，在任何 UI 库都可以直接使用。

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

## 创建图标

我们既可以在现有的模块`home-icon`中添加图标，也可以创建新的模块。

### 1. 初始化代码骨架

::: tip
右键菜单 - [模块路径]: `Zova Init/Icon`
:::

### 2. 准备图标

将 SVG 图标放入图标模块的分组目录中。比如模块`home-icon`的`default`分组，其分组目录路径是：
`src/suite/a-home/modules/home-icon/icons`

### 3. 构建图标

::: tip
右键菜单 - [模块路径]: `Zova Tools/Generate .metadata`
:::
