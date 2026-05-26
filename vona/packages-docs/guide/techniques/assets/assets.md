# Assets

In VonaJS, each module can provide Assets for server-side use.

- `Multi-scenario`: Different types of Assets can be provided for different scenarios and purposes

## Initializing the Code Skeleton

For example, creating a new scenario `templates` containing multiple template files.

### 1. Cli Command

```bash
$ vona :init:asset templates --module=demo-student
```

### 2. Menu Command

::: tip
Context menu - [Module Path]: `Vona Init/Assets`
:::

### 3. Adding Assets

Executing the above command will automatically create the directory: `assets/templates`

Add Assets according to business needs, such as adding two template files:

```bash
src/module/demo-student/assets/templates/item.ejs
src/module/demo-student/assets/templates/list.ejs
```

### 4. File Paths

In test and development environments, Assets can be accessed via the following file paths:

```bash
/path/to/project/src/module/demo-student/assets/templates/item.ejs
/path/to/project/src/module/demo-student/assets/templates/list.ejs
```

In production environments, the file paths are as follows:

```bash
/path/to/project/dist/normal/assets/templates/demo-student/item.ejs
/path/to/project/dist/normal/assets/templates/demo-student/list.ejs
```

You can use `meta.asset` to get the file path of Assets in a typed way.

## Create meta.asset

For example, create `meta.asset` in the module demo-student.

### 1. Cli Command

```bash
$ vona :create:bean meta asset --module=demo-student
```

### 2. Menu Command

::: tip
Context menu - [Module Path]: `Vona Meta/Asset`
:::

## meta.asset Definition

```typescript
export interface IAssetGetPath {
  templates: 'item.ejs' | 'list.ejs';
}

@Meta()
export class MetaAsset extends BeanAssetBase<IAssetGetPath> {}
```

- `IAssetGetPath`: Defines the type of Assets, supporting multiple scenarios

## Get File Path

```typescript
class ControllerStudent {
  test() {
    const path = this.scope.asset.get('templates', 'item.ejs');
  }
}
```

- `asset.get`: Takes the scenario name and file name as input, generates the file path
