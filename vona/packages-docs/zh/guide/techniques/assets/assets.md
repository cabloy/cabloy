# Assets

在 VonaJS 框架中，每个模块都可以提供 Assets，供服务端使用。

- `多场景`：可以针对不同的场景、不同的用途提供不同类型的 Assets

## 初始化代码骨架

比如，创建一个新的场景`templates`，其中包含多个模版文件。

### 1. Cli命令

```bash
$ vona :init:asset templates --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Init/Assets`
:::

### 3. 添加Assets

执行上述命令会自动创建目录: `assets/templates`

根据业务需求添加 Assets，比如添加两个模版文件：

```bash
src/module/demo-student/assets/templates/item.ejs
src/module/demo-student/assets/templates/list.ejs
```

### 4. 文件路径

在测试和开发环境，可以通过如下文件路径访问 Assets：

```bash
/path/to/project/src/module/demo-student/assets/templates/item.ejs
/path/to/project/src/module/demo-student/assets/templates/list.ejs
```

在生产环境，文件路径如下：

```bash
/path/to/project/dist/normal/assets/templates/demo-student/item.ejs
/path/to/project/dist/normal/assets/templates/demo-student/list.ejs
```

可以使用`meta.asset`通过类型化的方式获取 Assets 的文件路径。

## 创建meta.asset

比如，在模块 demo-student 中创建`meta.asset`

### 1. Cli命令

```bash
$ vona :create:bean meta asset --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Meta/Asset`
:::

## meta.asset定义

```typescript
export interface IAssetGetPath {
  templates: 'item.ejs' | 'list.ejs';
}

@Meta()
export class MetaAsset extends BeanAssetBase<IAssetGetPath> {}
```

- `IAssetGetPath`: 定义 Assets 的类型，支持多场景

## 获取文件路径

```typescript
class ControllerStudent {
  test() {
    const path = this.scope.asset.get('templates', 'item.ejs');
  }
}
```

- `asset.get`：传入场景名和文件名，生成文件路径
