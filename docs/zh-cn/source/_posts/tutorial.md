---
title: EggBorn.js开发指南
caption: tutorial
date: 2017-10-17 18:18:14
category: docs
showIndex: 1
---

## EggBorn.js是什么
> EggBorn.js是一款顶级Javascript全栈开发框架。

EggBorn.js是采用Javascript进行全栈开发的最佳实践。
EggBorn.js不重复造轮子，而是采用业界最新的开源技术，进行全栈开发的最佳组合。
EggBorn.js前端采用Vue.js + Framework7 / Vue Router + Webpack，后端采用Koa.js + Egg.js，数据库采用mysql。
EggBorn.js时刻跟踪开源技术的最新成果，并持续优化，使整个框架时刻保持最佳状态。

## EggBorn.js重点解决什么问题：业务模块化
Javascript技术的蓬勃发展，为前后端开发带来了更顺畅的体验，显著提升了开发效率。但仍有网友质疑Javascript能否胜任大型Web应用的开发。大型Web应用的特点是随着业务的增长，需要开发大量的页面组件。面对这种场景，一般有两种解决方案：

> 1 采用单页面的构建方式，缺点是产生的部署包很大。
> 2 采用页面异步加载方式，缺点是页面过于零散，需要频繁与后端交互。

EggBorn.js实现了第三种解决方案：
> 3 页面组件按业务需求归类，进行模块化，并且实现了模块的异步加载机制，从而弥合了前两种解决方案的缺点，完美满足大型Web应用业务持续增长的需求。

## EggBorn.js的技术特点
- **业务模块化**：页面组件按模块组织
- **加载方式灵活**：模块既可异步加载，也可同步加载
- **模块高度内聚**：模块包括前端页面组件和后端业务逻辑
- **参数配置灵活**：模块中的前后端可以单独进行参数配置
- **国际化**：模块中的前后端均支持独立的国际化
- **模块隔离**：模块的页面、数据、逻辑、路由、配置等元素均进行了命名空间隔离处理，避免模块之间的变量污染与冲突
- **超级易用的事务处理**：只需在路由记录上配置一个参数，即可完美实现数据库的事务处理。
- **渐进式开发**：由于模块的高度内聚，可以将业务以模块的形式沉淀，在多个项目中重复使用，既可贡献到npm开源社区，也可部署到公司内部私有npm仓库。

> 有了EggBorn.js，从此可复用的不仅仅是组件，还有业务模块。

## 快速上手

### 安装EggBorn.js脚手架

``` bash
$ npm install -g egg-born
```

### 新建项目

``` bash
$ egg-born project_name
$ cd project_name
$ npm install
```

> EggBorn.js目前提供了2个项目脚手架，分别是
> - `front-backend-mysql`  -- 前后端全栈项目模板
> - `front`                -- 前端项目模板，后端可采用其他方案

### 配置mysql连接参数

如果采用了`front-backend-mysql`模板，请配置mysql连接参数（空数据库即可）

编辑`src/backend/config/config.default.js`文件
``` javascript
  // mysql
  config.mysql = {
    clients: {
      // donot change the name  
      __ebdb: {
        host: '127.0.0.1',
        port: '3306',
        user: 'travis',
        password: '',
        database: 'egg-born',
      },
    },
  };
```

编辑`src/backend/config/config.unittest.js`文件
``` javascript
  // mysql
  config.mysql = {
    clients: {
      // donnot change the name
      __ebdb: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: '',
        database: 'sys',
      },
    },
  };
```

### 运行项目

启动后端服务
``` bash
$ npm run dev:backend
```

启动前端服务
``` bash
$ npm run dev:front
```

## EggBorn.js架构图

### 系统架构
![](/zh-cn/images/EggBornJS.png)

### 项目文件结构
![](/zh-cn/images/structure.png)

### 模块文件结构
![](/zh-cn/images/privatemodule.png)
![](/zh-cn/images/publicmodule.png)

## 模块开发

### 命名约定
为了不断沉淀业务模块，达到高度可复用的效果，所有模块的命名空间必须充分隔离，避免相互污染与冲突，故采用如下命名方式：
> egg-born-module-{providerId}-{moduleName}

如模块`egg-born-module-a-version`，各环节命名信息如下：
> - `providerId`: a
> - `moduleName`: version
> - `fullName`: egg-born-module-a-version
> - `relativeName`: a-version
> - 前端页面路由地址: /a/version/{page}
> - 后端API路由地址: /a/version/{controller}/{action}

### 加载机制
模块既支持异步加载，也支持同步加载。默认是异步加载，如果要同步加载，只需在模块名称后面加上`-sync`后缀，如模块`egg-born-module-aa-login-sync`。

### 新建模块
进入`src/module`目录执行脚手架，创建模块文件骨架
``` bash
$ egg-born module_relative_name
```

> EggBorn.js目前提供了2个模块脚手架，分别是
> - `module`               -- 全栈模块模板
> - `module-front`         -- 前端模块模板

### 模块前端开发

#### 前端页面路由
在`front/src/routes.js`中添加页面路由，如
``` javascript
function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'welcome/:who', component: load('welcome') },
  { path: 'profile', component: load('profile'), meta: { requiresAuth: true } },
  { path: '/login', component: load('login') },
];
```

> - `path`: 路径，支持参数。以`/`开头，代表根页面组件。`login`页面组件通常这样配置
> - `component`: 页面组件对象
> - `meta`: 路由元数据
> - `meta.requiresAuth`: 如果页面组件需要登录，须设为`true`

在页面中引用页面组件，请使用绝对路径，如
``` html
<f7-list-item link="/aa/hello/welcome/You" title="Welcome"></f7-list-item>
<f7-list-item link="/aa/hello/profile" title="Profile"></f7-list-item>
```

#### 前端状态管理
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。EggBorn.js采用Vuex实现了完全隔离的模块状态管理机制。
在`front/src/store.js`中添加状态，如
``` javascript
export default function(Vue) {

  return {
    state: {
      message: 'hello world',
    },
  };

}
```

在页面组件中访问本模块状态
``` javascript
const message = this.$local.state.message;
```

在页面组件中访问其他模块状态
``` javascript
const message = this.$store.state[providerId][moduleName].message;
```

> 更多信息，请参阅: [Vuex](https://vuex.vuejs.org/)

#### 前端参数配置
在`front/src/config/config.js`中添加配置信息，如
``` javascript
export default {
  mode: 1,
};
```

只支持在页面组件中访问本模块内部的参数配置
``` javascript
const mode = this.$config.mode;
```

#### 前端国际化
在`front/src/config/locale`目录添加国际化文件
`zh-cn.js`文件中的语言定义示例如下
``` javascript
export default {
  mode: '模式',
  "Hello world! I'm %s.": '您好，世界！我是%s。',  
};
```

国际化语言采取全局合并的方式，有利于语言资源的共享，在页面组件中访问方式如下
``` javascript
const mode = this.$text('mode');
const message = this.$text("Hello world! I'm %s.",'zhennann');
```

### 模块后端开发

#### 后端api路由
在`backend/src/routes.js`中添加api路由，如
``` javascript
const home = require('./controller/home.js');

module.exports = [
  { method: 'get', path: 'home/index', controller: home, action: 'index', middlewares:'transaction' },
];
```

> - `method`: get/post等方法
> - `path`: 路径，支持参数
> - `component`: Controller对象
> - `action`: Controller方法，如果不设置，则自动采用path尾部单词
> - `middlewares`: 可指定一组中间件，如`transaction`是启用数据库事务

在前端页面组件中访问本模块api路由
``` javascript
this.$api.get('home/index').then(data => {
}).catch(err => {
});
```

在前端页面组件中访问其他模块api路由
``` javascript
this.$api.get('/providerId/moduleName/home/index').then(data => {
}).catch(err => {
});
```

#### 后端Controller
后端Controller的实现方式与Egg.js保持一致
``` javascript
module.exports = app => {
  class HomeController extends app.Controller {

    async index() {
      const message = await this.service.home.index();
      this.ctx.success(message);
    }

  }
  return HomeController;
};
```

> 更多信息，请参阅: [Egg.js Controller](https://eggjs.org/zh-cn/basics/controller.html)

#### 后端Service
Service用于封装业务逻辑，供Controller调用，实现方式与Egg.js保持一致。
``` javascript
module.exports = app => {
  class Home extends app.Service {

    async index() {
      const res = await this.ctx.db.queryOne('show tables');
      return res;
    }

  }

  return Home;
};
```

> 与Egg.js不同之处在于，Service使用`ctx.db`操作数据库，从而自动支持数据库事务。

> 更多信息，请参阅: [Egg.js Service](https://eggjs.org/zh-cn/basics/service.html)

#### 后端Controller调用
为了支持大型Web系统的开发，EggBorn.js支持模块后端Controller之间的调用，如
``` javascript
const message = await this.ctx.performAction({
  method: 'get',
  url: 'home/index',
  query: {
    username: 'kevin',
  },
  params: {
    mode: 1,
  },
  body: {
    content: 'ready',
  },
});
```

> - `method`: get/post等方法
> - `url`: 访问本模块的Controller使用相对路径，访问其他模块的Controller使用以`/`开头的绝对路径。
> - `query`、`params`、`body`: 与常规的Controller参数保持一致

#### 后端数据库操作
后端数据库操作与Egg.js保持一致
> 更多信息，请参阅: [Egg.js MySQL](https://eggjs.org/zh-cn/tutorials/mysql.html)

#### 后端数据库事务
EggBorn.js提供了更为便利的数据库事务实现方式，只需在后端api路由记录中添加`transaction`中间件，Service使用`ctx.db`操作数据库。
如果是主Controller通过`ctx.performAction`调用子Controller，数据库事务开启规则如下：

| 主Controller配置 | 子Controller配置 | 子Controller实际启用 |
|:----------------|:----------------|:-------------------- |
| true            | true            | true                 |
| true            | false           | true                 |
| false           | true            | true                 |
| false           | false           | false                |

#### 后端参数配置
在`backend/src/config/config.js`中添加配置信息，如
``` javascript
module.exports = appInfo => {
  const config = {};

  config.message = "Hello world! I'm %s.";

  return config;
};
```

访问本模块内部的参数配置示例如下
``` javascript
const message = this.ctx.config.message;
```

#### 后端国际化
在`backend/src/config/locale`目录添加国际化文件
`zh-cn.js`文件中的语言定义示例如下
``` javascript
module.exports = {
  "Hello world! I'm %s.": '您好，世界！我是%s。',
  'not found': '未发现',
};
```

国际化语言采取全局合并的方式，有利于语言资源的共享，访问方式如下
``` javascript
const notFound = this.ctx.text('not found');
const message = this.ctx.text("Hello world! I'm %s.", 'zhennann');
```

#### 后端错误处理
在`backend/src/config/errors.js`文件中添加错误代码
``` javascript
// error code should start from 1001
module.exports = {
  1001: 'not found',
};
```

返回错误信息示例如下
``` javascript
this.ctx.fail(1001);
```

也可抛出异常示例如下
``` javascript
this.ctx.throw(1001);
```

## 模块管理

### 模块依赖
EggBorn.js通过`package.json`文件管理模块依赖关系。
比如，模块`aa-module1`依赖`aa-module2`，需要在模块`aa-module1`的`package.json`文件中作如下配置
``` json
{
  "name": "egg-born-module-aa-module1",
  "version": "0.0.1",
  "eggBornModule": {
    "dependencies": {
      "aa-module2": "0.0.1"
    }
  },
  "dependencies": {
    "egg-born-module-aa-module2": "^0.0.1"
  }
}
```

> 设置`"egg-born-module-aa-module2": "^0.0.1"`，是为了在安装模块`aa-module1`时自动安装模块`aa-module2`。如果模块没有公开发布，就不必设置。

### 模块数据版本
模块一般都要操作数据库，当模块版本升级时，数据库结构也有可能变动。EggBorn.js实现了模块数据版本的管理，便于业务模块的积累沉淀。

在模块的`package.json`文件中配置`fileVersion`为当前数据版本
``` json
{
  "name": "egg-born-module-aa-module1",
  "version": "0.0.1",
  "eggBornModule": {
    "fileVersion": 1
  }
}
```

在模块后端添加Api路由
``` javascript
{ method: 'post', path: 'version/update', controller: version, middlewares: 'safeAccess' }
```

添加version Controller
``` javascript
module.exports = app => {
  class VersionController extends app.Controller {

    async update() {
      await this.service.version.update(this.ctx.getInt('version'));
      this.ctx.success();
    }

  }
  return VersionController;
};
```

添加version Service
``` javascript
module.exports = app => {

  class Version extends app.Service {

    async update(version) {
      if (version === 1) {
        // do something
      }
    }

  }

  return Version;
};
```

> 当启动后端服务时，EggBorn.js自动检测模块数据版本的变化，并执行相应的路由，完成数据的版本升级。

### 模块发布
当项目中的模块代码稳定后，可以将模块公开发布，贡献到开源社区。也可以在公司内部建立npm私有仓库，然后把模块发布到私有仓库，形成公司资产，便于重复使用。
模块发布步骤如下
``` bash
$ cd path/to/module      -- 进入模块目录
$ npm install            -- 安装模块依赖
$ npm run build:front    -- 构建前端代码
$ npm run build:backend  -- 构建后端代码
$ npm publish            -- 发布至npm仓库
```

## 测试驱动
目前只支持后端测试驱动

### 后端Controller测试
在`backend/test/controller`目录添加Controller测试文件
``` javascript
// controller/home.test.js
const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/home.test.js', () => {

  it('action:index', async () => {
    const result = await app.httpRequest().get(mockUrl('home/index'));
    assert(result.body.code === 0);
  });

});
```

### 后端Service测试
在`backend/test/service`目录添加Service测试文件
``` javascript
// service/home.test.js
const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('test/service/home.test.js', () => {

  it('index', async () => {
    const ctx = app.mockContext({ mockUrl: mockUrl() });
    const message = await ctx.service.home.index();
    assert(message);
  });

});
```

### 执行测试
在项目根目录执行测试
``` bash
$ npm run test:backend
$ npm run cov:backend
```

## 前端架构配置

### 前端启动文件
前端架构提供两种方案

> 1. Vue.js + Framework7
> 2. Vue.js + Vue Router

Framework7是移动开发专属UI界面库，内置路由机制。
Vue Router是Vue.js官方路由库，使用Vue Router可搭配其他各种UI界面库。

在`src/front/main.js`文件中进行切换
``` javascript
// choose one

//   framework7
import main from './framework7/main.js';

//   vuerouter
// import main from './vuerouter/main.js';

// export
export default main;
```

### 前端参数配置
`src/front/config/config.js`文件中的参数配置可以覆盖模块的参数
``` javascript
export default{
  modules: {
    'aa-hello': {
      mode: 2,
    },
  },
};
```

### 前端国际化
在`src/front/config/locale`目录添加国际化文件，可以覆盖模块的国际化语言
`zh-cn.js`文件中的语言定义示例如下
``` javascript
export default {
  mode: '模式',
};
```

## 后端架构配置

### 后端架构
后端架构基于Egg.js，完整支持Egg.js提供的所有功能与特性
> 更多信息，请参阅: [Egg.js](https://eggjs.org/)

### 后端参数配置
`src/backend/config/config.default.js`文件中的参数配置可以覆盖模块的参数
``` javascript
module.exports = appInfo => {
  const config = {};

  // module config
  config.modules = {
    'aa-hello': {
      mode: 2,
    },
  };

  return config;
};
```

### 后端国际化
在`src/backend/config/locale`目录添加国际化文件，可以覆盖模块的国际化语言
`zh-cn.js`文件中的语言定义示例如下
``` javascript
module.exports = {
  mode: '模式',
};
```

## 项目部署

### 构建前端代码
``` bash
$ npm run build:front
```

### 启动后端服务
``` bash
$ npm run start:backend
```

### 停止后端服务
``` bash
$ npm run stop:backend
```

### 后端服务启动参数配置
编辑`build/config.js`文件
``` javascript
// backend
const backend = {
  port: 7002,
  hostname: '127.0.0.1',
};
```

### nginx配置
强烈建议使用nginx托管前端静态资源，并反向代理后端服务，配置如下
``` javascript
server {
  listen 80;
  server_name example.com www.example.com;
  set $node_port 7002;

  root /path/to/www;

  location  /api/ {
    proxy_http_version 1.1;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_pass http://127.0.0.1:$node_port$request_uri;
    proxy_redirect off;
  }

}
```

## GitHub贡献
> 有任何疑问，欢迎提交 [issue](https://github.com/zhennann/egg-born/issues)， 或者直接修改提交 [PR](https://github.com/zhennann/egg-born/pulls)！
