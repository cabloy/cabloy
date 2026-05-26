# v-model

It is very convenient to add `v-model` to a component.

## Basic Usage

### Initialize the code skeleton

Add `modelValue` to component `card`

- Cli command

```bash
$ zova :refactor:componentModel card modelValue --module=demo-student
```

- Menu command

::: tip
Context Menu - [Module Path/src/component/componentName]: `Zova Refactor/Add v-model`
:::

Enter the name of the v-model as prompted, the default is `modelValue`, and the VSCode plugin will automatically add the code skeleton of `v-model`

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

### Using v-model

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

`this.modelValue` enables bidirectional binding to the parent component. Modifying the value of `this.modelValue` triggers the synchronization update of the values bound by the parent component.

### Pass in v-model

Type hints are also supported when passing v-model into child components.

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

## v-model parameter

`modelValue` is the default model parameter, and other model parameters can also be specified.

### Initialize the code skeleton

Add v-model `title` to component card.

- Cli command

```bash
$ zova :refactor:componentModel card title --module=demo-student
```

- Menu command

::: tip
Context Menu - [Module Path/src/component/componentName]: `Zova Refactor/Add v-model`
:::

Enter the name of the v-model `title` when prompted, and the VSCode plugin will automatically add the code skeleton of `v-model`

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

### Using v-model

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

### Pass in v-model

Type hints are also supported when passing v-model into child components.

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

## v-model modifier

v-model supports modifiers. Let's create a custom modifier capitalize, which automatically converts the first letter of the v-model binding value to uppercase:

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

- Add Prop `titleModifiers` and define a modifier `capitalize`
- Pass in the set option when calling the `$useModel` method

### Pass in v-model

Type hints are also supported when passing v-model into child components.

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
