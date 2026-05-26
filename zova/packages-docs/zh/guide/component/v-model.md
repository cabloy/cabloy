# v-model

可以非常便利的为组件添加`v-model`属性。

## 基本用法

### 初始化代码骨架

为组件`card`添加`modelValue`

- Cli 命令

```bash
$ zova :refactor:componentModel card modelValue --module=demo-student
```

- 菜单命令

::: tip
右键菜单 - [模块路径/src/component/componentName]: `Zova Refactor/Add v-model`
:::

依据提示输入 model 属性的名称，默认是`modelValue`，VSCode 插件会自动添加`v-model`的代码骨架。

```diff
+ export interface ControllerCardModels {
+   vModel?: number;
+ }

@Controller()
export class ControllerCard extends BeanControllerBase {
  static $propsDefault = {
+   modelValue: 0,
  };

+ modelValue: number;

  protected async __init__() {
+   this.modelValue = this.$useModel('modelValue');
  }
}
```

### 使用v-model

```diff
class ControllerCard {
  render() {
    return (
      <div>
+       <div>{this.modelValue}</div>
        <button
          onClick={() => {
+           this.modelValue++;
          }}
        >
          Change
        </button>
      </div>
    );
  }
}
```

`this.modelValue`可实现与父组件的双向绑定。修改`this.modelValue`的值会触发父组件绑定的值同步更新。

### 传入v-model

在向子组件传入 v-model 时，也支持类型提示。

```diff
class ControllerOther {
+ count: number;

  render() {
    return (
      <div>
+       <ZCard vModel={this.count}></ZCard>
      </div>
    );
  }
}
```

## v-model参数

`modelValue`是默认的 model 参数，也可以指定其他 model 参数。

### 初始化代码骨架

为组件 card 添加 v-model `title`

- Cli 命令

```bash
$ zova :refactor:componentModel card title --module=demo-student
```

- 菜单命令

::: tip
右键菜单 - [模块路径/src/component/componentName]: `Zova Refactor/Add v-model`
:::

依据提示输入 model 属性的名称`title`，VSCode 插件会自动添加`v-model`的代码骨架。

```diff
+ export interface ControllerCardModels {
+   'vModel:title'?: number;
+ }

@Controller()
export class ControllerCard extends BeanControllerBase {
  static $propsDefault = {
+   title: 0,
  };

+ modelTitle: number;

  protected async __init__() {
+   this.modelTitle = this.$useModel('title');
  }
}
```

### 使用v-model

```diff
class ControllerCard {
  render() {
    return (
      <div>
+       <div>{this.modelTitle}</div>
        <button
          onClick={() => {
+           this.modelTitle = 'new value';
          }}
        >
          Change
        </button>
      </div>
    );
  }
}
```

### 传入v-model

在向子组件传入 v-model 时，也支持类型提示。

```diff
class ControllerOther {
+ title: string;

  render() {
    return (
      <div>
+       <ZCard vModel:title={this.title}></ZCard>
      </div>
    );
  }
}
```

## v-model修饰符

v-model 支持修饰符。我们来创建一个自定义的修饰符 capitalize，它会自动将 v-model 绑定值的首字母转为大写：

```diff
export interface ControllerCardProps {
+ titleModifiers?: {
+   capitalize: boolean;
+ };
}

export interface ControllerCardModels {
+ 'vModel:title'?: string;
+ 'vModel:title_capitalize'?: string;
}

class ControllerCard {
+ modelTitle: string;

  protected async __init__() {
+   this.modelTitle = this.$useModel('title', {
+     set: value => {
+       if (this.$props.titleModifiers?.capitalize) {
+         if (!value) return value;
+         return value.charAt(0).toUpperCase() + value.slice(1);
+       }
+       return value;
+     },
+   });
  }
}
```

- 添加 Prop `titleModifiers`，并且定义一个修饰符`capitalize`
- 调用`$useModel`方法时传入 set 选项。在 set 选项中判断`capitalize`的值对`value`做相应的处理

### 传入v-model

在向子组件传入 v-model 时，也支持类型提示。

```diff
class ControllerOther {
+ title: string;

  render() {
    return (
      <div>
+       <ZCard vModel:title_capitalize={this.title}></ZCard>
      </div>
    );
  }
}
```
