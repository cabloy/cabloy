## I. Cabloy5.0 internal testing

Cabloy5.0 has undergone a complete restructuring of the entire full-stack framework using TS, and provides a more elegant ts inversion of control strategy, making our business development faster and smoother

### 1. Comparison of old and new technology stacks:

|    | backend | front |
|----|----|----|
| old | js, egg2, mysql | js, vue2, framework7 |
| new | ts, egg3, multi-database compatibility（mysql、postgresql） | ts, vue3, quasar |

### 2. Two major trends in framework development

1. TS: This is an obvious trend, so there is no need to elaborate

2. ESM: From the current trend, front frameworks have been ESM-enabled throughout the entire chain, but most backend frameworks are still Commonjs. Even egg3 is still Commonjs. Because egg's positioning is still a meta-framework, CabolyJS5.0 has developed a fully ESM-enabled business modularization system on the basis of egg (the specific mechanism of ESM on top of Commonjs is described in another article)

## II. A more elegant ts ioc strategy than nestjs

TS-based backend frameworks typically provide dependency containers to achieve inversion of control. There are two strategies for inversion of control: dependency injection and dependency lookup. CabloyJS5.0 supports both of them, and with the help of module scoping, makes the code for dependency lookup more concise and efficient. Here are a few examples of features:

1. Service
2. Config configuration
3. I18n
4. Error exception

## III. Service

### 1. Create a Service

In CabloyJS, local bean is equivalent to the concept of service in NestJS. Here is an example of creating a local bean

``` javascript
import { BeanBase, Local } from '@cabloy/core';
import { ScopeModule } from '../resource/this.js';

@Local()
export class LocalHome extends BeanBase<ScopeModule> {
  async echo({ user: _user }) {
    return `Hello World!`;
  }
}
```

1. LocalHome is declared as a local bean with `@Local`

2. LocalHome inherits from the base class BeanBase

### 2. Dependency injection for Service

Next, in the Controller, use dependency injection to use LocalHome

``` javascript
import { BeanBase, Controller, Use } from '@cabloy/core';
import { ScopeModule } from '../resource/this.js';
import { LocalHome } from '../local/home.js';

@Controller()
export class ControllerHome extends BeanBase<ScopeModule> {
  @Use()
  home: LocalHome;

  async echo() {
    const res = await this.home.echo({
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }
}
```

1. Inject LocalHome using `@Use`

### 3. Dependency lookup for Service

Then, in the Controller, use the dependency lookup method to use LocalHome

``` javascript
import { BeanBase, Controller } from '@cabloy/core';
import { ScopeModule } from '../resource/this.js';

@Controller()
export class ControllerHome extends BeanBase<ScopeModule> {
  async echo() {
    const res = await this.scope.local.home.echo({
      user: this.ctx.state.user.op,
    });
    this.ctx.success(res);
  }
}
```

1. You don't need to import LocalHome, just use `this.scope.local` in the code to access the local bean instance in the container

Take a look at the animation demo, which provides complete type intelligent prompts:

![Dependency lookup - local bean](./images/lookup-localbean.gif)

## IV. Config

### 1. Define Config

You can define some Config configurations for the business module separately, as follows:

``` diff
import { CabloyApplication } from '@cabloy/core';

export const config = (_app: CabloyApplication) => {
  return {
+   prompt: 'hello world',
  };
};
```

### 2. Using Config

You can directly use the configuration just defined in LocalHome

``` diff
import { BeanBase, Local } from '@cabloy/core';
import { ScopeModule } from '../resource/this.js';

@Local()
export class LocalHome extends BeanBase<ScopeModule> {
  async echo({ user: _user }) {
+   return this.scope.config.prompt;
-   return `Hello World!`;
  }
}
```

1. No need to import any type. Simply use `this.scope.config` in the code to access the config configuration in the current business module

Take a look at the animation demo, which provides complete type intelligent prompts:

![Denpendency lookup - config](./images/lookup-config.gif)

## V、I18n

### 1. Define language resources

You can define language resources for business modules, such as defining English and Chinese language resources here

`English`
``` javascript
export default {
  HelloWorld: 'Hello World',
};
```

`Chinese`
``` javascript
export default {
  HelloWorld: '您好世界',
};
```

### 2. Using language resources

You can directly use the language resource just defined in LocalHome

``` diff
import { BeanBase, Local } from '@cabloy/core';
import { ScopeModule } from '../resource/this.js';

@Local()
export class LocalHome extends BeanBase<ScopeModule> {
  async action({ user: _user }) {
+   // automatically determine the current language
+   const message = this.scope.locale.HelloWorld();
+   // force the use of English resources
+   const message1 = this.scope.locale.HelloWorld.locale('en-us');
+   // force the use of Chinese resources
+   const message2 = this.scope.locale.HelloWorld.locale('zh-cn');
+   return `${message}:${message1}:${message2}`;
-   return this.scope.config.prompt;
  }
}
```

1. No need to import any type. Simply use `this.scope.locale` in the code to access the language resources in the current business module

Take a look at the animation demo, which provides complete type intelligent prompts:

![Dependency lookup - I18n](./images/lookup-locale.gif)

## VI. Error exception

### 1. Define error code

You can define error codes for business modules

``` diff
export enum Errors {
+ Error001 = 1001,
}
```
1. Here we define an error enumeration type Error001, with the corresponding error code being 1001

### 2. Define the language resources corresponding to the error code

You can define language resources for error codes, for example, defining English and Chinese language resources here

`English`
``` diff
export default {
+ Error001: 'This is a test',
  HelloWorld: 'Hello World',
};
```

`Chinese`
``` diff
export default {
+ Error001: '这是一个错误',
  HelloWorld: 'Hello World',
};
```

### 3. Throwing error exception

You can directly use the error enumeration value just defined in LocalHome and throw an exception

``` diff
import { ScopeModule } from '../resource/this.js';

@Local()
export class LocalHome extends BeanBase<ScopeModule> {
  async action({ user: _user }) {
+   // directly throw an exception
+   this.scope.error.Error001.throw();
-   return this.scope.config.prompt;
  }
}
```

1. No need to import any type. Simply use `this.scope.error` in the code to access the error enumeration values in the current business module

Take a look at the animation demo, which provides complete type intelligent prompts:

![Dependency lookup - error](./images/lookup-error.gif)

## VII. Postscript

Cabloy4.0 already provides a large number of business capabilities, such as workflow engine, form engine, permission engine, field permission, multi-level cache, modular system, distributed architecture, multi-tenant engine, etc. With the empowerment of Cabloy5.0 Typescript, these business capabilities will also have a new expression

For more information, please goto:
 - [YouTube Channel](https://www.youtube.com/@cabloyjs)
 - [Twitter](twitter.com/zhennann2024)
 - zhen.nann@icloud.com


