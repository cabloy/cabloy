# Locale

Modules can individually provide their own `Locale` language resources.

## Initialize code skeleton

### 1. Cli command

```bash
$ vona :init:locale demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Init/Locale`
:::

## Define language resources

Taking the module `demo-student` as an example, define the module's language resources:

- English

`src/module/demo-student/src/config/locale/en-us.ts`

```diff
export default {
+ StudentName: 'Student Name',
};

```

- Chinese

`src/module/demo-student/src/config/locale/zh-cn.ts`

```diff
export default {
+ StudentName: '学生名称',
};
```

## Use language resources

The `I18n` language resources of the module can be obtained through the `locale` object of the `Scope` instance.

```typescript
class ControllerStudent {
  @Web.get('test')
  test() {
    // use current locale
    const message1 = this.scope.locale.StudentName();
    // use locale en-us
    const message2 = this.scope.locale.StudentName.locale('en-us');
    // use locale zh-cn
    const message3 = this.scope.locale.StudentName.locale('zh-cn');
    console.log(message1, message2, message3);
  }
}
```

## Use language resources cross-module

```typescript
class ControllerStudent {
  @Web.get('test')
  test() {
    // use current locale
    const message1 = this.$scope.demoStudent.locale.StudentName();
    // use locale en-us
    const message2 = this.$scope.demoStudent.locale.StudentName.locale('en-us');
    // use locale zh-cn
    const message3 = this.$scope.demoStudent.locale.StudentName.locale('zh-cn');
    console.log(message1, message2, message3);
  }
}
```

## Override language resources

You can use `project-level` language resources to override `module-level` language resources.

- English

`src/backend/config/locale/en-us.ts`

```diff
locale.modules = {
+ 'demo-student': {
+   StudentName: 'Student Name!',
+ },
};
```

- Chinese

`src/backend/config/locale/zh-cn.ts`

```diff
locale.modules = {
+ 'demo-student': {
+   StudentName: '学生名称!',
+ },
};
```

## Current Locale

### 1. Get Current Locale

```typescript
const locale = this.ctx.locale;
```

### 2. Set Current Locale

```typescript
this.ctx.locale = 'en-us';
```

### 3. Get Default Locale

```typescript
const localeDefault = this.$scope.locale.config.locale.defaultLocale;
```

## Rules for Getting the Current Locale

When a user accesses the backend API, the backend will automatically obtain the current locale according to the rules.

### 1. Module Configuration

I18n is the core capability provided by the module `a-locale`. The module configuration can be modified in the App Config:

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'a-locale': {
    locale: {
      defaultLocale: 'en-us',
      queryField: 'x-vona-locale',
      headerField: 'x-vona-locale',
      cookieField: 'locale',
    },
  },
};
```

| Name          | Description                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------ |
| defaultLocale | Default locale                                                                                   |
| queryField    | Retrieves the current locale from the request query. The query key defaults to `x-vona-locale`   |
| headerField   | Retrieves the current locale from the request header. The header key defaults to `x-vona-locale` |
| cookieField   | Retrieves the current locale from the request cookie. The cookie key defaults to `locale`        |

### 2. Rule Order

The system determines the current locale in the following order:

`queryField` > `headerField` > `cookieField` > `user locale` > `Header: Accept-Language` > `defaultLocale`

## Adding a New Language

VonaJS provides two default languages: `en-us` and `zh-cn`. The following demonstrates how to add a new language `zh-tw`

### 1. Adding Type Definition

Adding a new language type definition using the interface merging mechanism.

In the VSCode editor, enter the code snippet `recordlocale`, which will automatically generate a code skeleton:

```typescript
declare module 'vona' {
  export interface ILocaleRecord {
    : never;
  }
}
```

Adjust the code, and then add `zh-tw`

```diff
declare module 'vona' {
  export interface ILocaleRecord {
+   'zh-tw': never;
  }
}
```

### 2. Adding Language Resources

Create a new language file `zh-tw.ts`, and then add language resources.

`src/module/demo-student/src/config/locale/zh-tw.ts`

```typescript
export default {
  StudentName: '學生名稱',
};
```

## Plurals

### 1. Define Language Resources

`src/module/demo-student/src/config/locale/en-us.ts`

```diff
export default {
+ TestApples_: '%d apples',
+ TestApples_0: 'no apples',
+ TestApples_1: 'one apple',
};
```

`src/module/demo-student/src/config/locale/zh-cn.ts`

```diff
export default {
+ TestApples_: '%d个苹果',
+ TestApples_0: '没有苹果',
};
```

### 2. Use Language Resources

```typescript
this.ctx.locale = 'en-us';
const apple0 = this.scope.locale.TestApples_(0);
const apple1 = this.scope.locale.TestApples_(1);
const apple2 = this.scope.locale.TestApples_(2);
console.log(`${apple0}, ${apple1}, ${apple2}`);
```

The console output is as follows:

```bash
no apples, one apple, 2 apples
```

- `TestApples_`: Default language resource. Adding the suffix `_` to a language resource prompts the developer that the language resource requires parameters

- `TestApples_{n}`: Can provide a separate language resource for any specific `n`. When translating languages, if the system cannot find a specific language resource `n`, it uses the default language resource `TestApples_`

## Plurals: Multiple Parameters

If the language resource supports multiple parameters, then you can explicitly specify which parameter supports plurals.

### 1. Defining Language Resources

`src/module/demo-student/src/config/locale/en-us.ts`

```diff
export default {
+ TestNameApples_: '%s has %d apples',
+ TestNameApples_0_1: '%s has no apples',
+ TestNameApples_1_1: '%s has one apple',
};
```

`src/module/demo-student/src/config/locale/zh-cn.ts`

```diff
export default {
+ TestNameApples_: '%s有%d个苹果',
+ TestNameApples_0_1: '%s没有苹果',
};
```

### 2. Using Language Resources

```typescript
this.ctx.locale = 'en-us';
const apple0 = this.scope.locale.TestNameApples_('Tom', 0);
const apple1 = this.scope.locale.TestNameApples_('Tom', 1);
const apple2 = this.scope.locale.TestNameApples_('Tom', 2);
console.log(`${apple0}, ${apple1}, ${apple2}`);
```

Console output is as follows:

```bash
Tom has no apples, Tom has one apple, Tom has 2 apples
```

- `TestNameApples_`: Default language resource. Adding an underscore (`_`) to language resources prompts developers that the resource requires parameters

- `TestNameApples_{n}_{ordinal}`: `ordinal` represents the parameter ordinal number

## Swagger/Openapi

VonaJS provides a set of utility functions for implementing I18n for Swagger/Openapi.

For example, providing I18n `title` information for the `name` field of `EntityStudent`

### 1. $localeScope

When setting the field title information, use `Language Resource FullKey`. When actually generating Swagger/Openapi metadata, the system automatically translates the `Language Resource FullKey` into the specified language.

```diff
+ import { $localeScope } from 'vona';

class EntityStudent {
+ @Api.field(v.title($localeScope('demo-student', 'Name')))
  name: string;
}
```

- `v.title`: Sets the title information
- `$localeScope`: Takes the `module name` and `language resource key` as input, generating the `language resource FullKey`: `demo-student::Name`

### 2. $locale

VonaJS also provides a simplified utility function `$locale`

```diff
+ import { $locale } from '../.metadata/locales.ts';

class EntityStudent {
+ @Api.field(v.title($locale('Name')))
  name: string;
}
```

- `$locale`: Takes a `language resource key` as input, generating a `language resource FullKey`: `demo-student::Name`
  - Each module provides a `$locale` function, therefore, you can use the `$locale` function of this module to get the module name
