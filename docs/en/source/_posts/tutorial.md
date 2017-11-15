---
title: EggBorn.js Development Guide
caption: tutorial
date: 2017-10-17 18:18:14
category: docs
showIndex: 1
---

## What is EggBorn.js?
> EggBorn.js is the Ultimate Javascript Full Stack Framework.

EggBorn.js is the best practice for implementing full stack with Javascript.
EggBorn.js does not 'Reinvent the Wheel', but uses the latest open source technology, so as to achieve the best combination of the full stack development technology.
The frontend of EggBorn.js uses Vue.js + Framework 7 / Vue Router + Webpck, while the backend uses Koa.js + Egg.js, and the database uses mysql.
EggBorn.js keeps track of the latest achievements in open source technology, and continues to optimize to keep the entire framework in the best status.

## EggBorn.js Focus on: Business Modularization

With the developing of the javascript technology, the experience of the frontend and backend development becomes smoother, and the development efficiency enhance significantly. However, some friends still doubt whether it can be competent for the development of large-scale web applications. Large-scale web applications are characterized by the need to develop a large number of page components as business grows. Faced with this situation, generally there are two solutions:

> 1 Build as a single page application: The disadvantage is that the deployment package is very large.
> 2 All page components are loaded asynchronously: The disadvantage is that the pages are too scattered, so the frontend should interact with the backend frequently.

EggBorn.js implements the third solution:
> 3 The page components are classified by business requirements, which is business modularization, and implements the business module’s asynchronous loading mechanism. Thus it makes up the shortcomings of the first two solutions and satisfies the needs of the large-scale web application.


## EggBorn.js Technical Features

- **Business Modularization**: The page components are arranged as modules.
- **Loading Flexibility**: Modules can be loaded asynchronously or synchronously.
- **Highly Modular Cohesion**: The module includes frontend page components and backend business logics.
- **Parameter Configuration Flexibility**: Both frontend and backend of the module can be configured separately.
- **I18N**: Both frontend and backend of the module support i18n separately.
- **Module Isolation**: Module’s pages, data, logic, routing, configuration and other elements have been through namespace isolation processing, which avoids the variable pollutions and conflicts.
- **Easy Transaction Processing**: Just configuring a parameter on the routing record can process the database transaction perfectly.
- **Progressive Development**: Due to the high degree of cohesion of the module, EggBorn.js can deposit the business in the form of module, which can be reused in multiple projects. Business modules can be contributed to the npm Open Source Community, and can also be deployed to the company’s internal private npm registry.

>With EggBorn.js, not only the components can be reused, but also the business modules do in the future.

## Getting Started

### Installation

``` bash
$ npm install -g egg-born
```

### Create a project

``` bash
$ egg-born project_name
$ cd project_name
$ npm install
```

> Currently, EggBorn.js offers two project scaffolds:
> - `front-backend-mysql`  -- full stack project template
> - `front`                -- frontend-only project template

### Configure MySQL

If choose the template `front-backend-mysql`, please configure mysql connection parameters. (empty database just does well)

Edit the file: `src/backend/config/config.default.js`
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

### Run

Start Backend Service
``` bash
$ npm run dev:backend
```

Start Frontend Service
``` bash
$ npm run dev:front
```

## EggBorn.js Structure Diagram

### System Structure
![](/en/images/EggBornJS.png)

### Project Files Structure
![](/en/images/structure.png)

### Module Files Structure
![](/en/images/privatemodule.png)
![](/en/images/publicmodule.png)

## Module Development

### Naming Convention

In order to increase the business modules continuously and achieve a highly reusable effect, the namespace of all modules must be fully isolated, to avoid mutual pollution and conflict. Thus the naming convention is as follows:
> egg-born-module-{providerId}-{moduleName}

Such as the module `egg-born-module-a-version`, the naming information is as follows:
> - `providerId`: a
> - `moduleName`: version
> - `fullName`: egg-born-module-a-version
> - `relativeName`: a-version
> - frontend page route url: /a/version/{page}
> - backend api route url: /a/version/{controller}/{action}

### Loading Mechanism

The module supports both asynchronous loading and synchronous loading. Generally, the default is asynchronous loading. If you want to change it into synchronous loading, just add `-sync` suffix behind the module name, such as the module `egg-born-module-aa-login-sync`.

### Create a module
Goto path`src/module`, run the scaffolding to create the module files skeleton.
``` bash
$ egg-born module_relative_name
```

> At present, EggBorn.js offers two module scaffolds:
> - `module`               -- full stack module template
> - `module-front`         -- frontend-only module template

### Module Frontend Development

#### Frontend Page Route
In the file `front/src/routes.js`, add the page route:
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

> - `path`: supports parameters. If the path starts with `/`, represent the root page component. `login` page component is usually configured with `/`
> - `component`: page component
> - `meta`: route metadata
> - `meta.requiresAuth`: If the page component needs to be logged in, it should be set to `true`

If you reference the page component in the page, please use the absolute path:
``` html
<f7-list-item link="/aa/hello/welcome/You" title="Welcome"></f7-list-item>
<f7-list-item link="/aa/hello/profile" title="Profile"></f7-list-item>
```

#### Frontend State Management

Vuex is a state management library, which is developed specifically for Vue.js applications. EggBorn.js uses Vuex to implement a fully isolated module state management mechanism.

In the file `front/src/store.js`, add the state:
``` javascript
export default function(Vue) {

  return {
    state: {
      message: 'hello world',
    },
  };

}
```

Access the state of the same module in the page component:
``` javascript
const message = this.$local.state.message;
```

Access the state of the other module in the page component:
``` javascript
const message = this.$store.state[providerId][moduleName].message;
```

> For more information, see [Vuex](https://vuex.vuejs.org/)

#### Frontend Parameters Configuration

In the file `front/src/config/config.js`, add the configuration information:
``` javascript
export default {
  mode: 1,
};
```

Access the config of the same module in the page component:
``` javascript
const mode = this.$config.mode;
```

#### Frontend I18N

In the directory `front/src/config/locale`, add the i18n file, such as `zh-cn.js`:
``` javascript
export default {
  mode: '模式',
  "Hello world! I'm %s.": '您好，世界！我是%s。',  
};
```

I18N resources can be merged globally, so as to share i18n resources through all the modules.

Access the i18n resources in the page component:
``` javascript
const mode = this.$text('mode');
const message = this.$text("Hello world! I'm %s.",'zhennann');
```

### Module Backend Development 

#### Backend API Route

In the file `backend/src/routes.js`, add the api route:
``` javascript
const home = require('./controller/home.js');

module.exports = [
  { method: 'get', path: 'home/index', controller: home, action: 'index', transaction: true },
];
```

> - `method`: get/post etc.
> - `path`: Supports parameters
> - `component`: Controller Component
> - `action`: Controller Action. If not set, will use the last word of `path` automatically.
> - `transaction`: Default is false. If set to true, the database transaction will be enabled.

Access the api route of the same module in the frontend page component:
``` javascript
this.$api.get('home/index').then(data => {
}).catch(err => {
});
```

Access the api route of the other module in the frontend page component:
``` javascript
this.$api.get('/providerId/moduleName/home/index').then(data => {
}).catch(err => {
});
```

#### Backend Controller

The backend controller is consistent with Egg.js
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

> For more information，see [Egg.js Controller](https://eggjs.org/en/basics/controller.html)

#### Backend Service

Service is used to encapsulate the business logics. It is consistent with Egg.js
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

> Different from Service of Egg.js, Service of EggBorn.js uses `ctx.db` to manipulate the database, which automatically supports database transaction.

> For more information，see [Egg.js Service](https://eggjs.org/en/basics/service.html)

#### Backend Controller Interoperability
For the development of large-scale web application, EggBorn.js supports interoperability between the backend controllers, such as
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

> - `method`: get/post etc.
> - `url`: If access backend controller of the same module, please use the relative path. If access backend contrller of the other module, please use the absolute path with the beginning of `/`
> - `query`、`params`、`body`: Same as Egg.js Controller

#### Backend Database Operation

The backend database operation is consistent with Egg.js
> For more information，see [Egg.js MySQL](https://eggjs.org/en/tutorials/mysql.html)

#### Backend Database Transaction

EggBorn.js offers a more convenient database transaction processing. You just need to configure the transaction parameter in the backend api route. Service uses `ctx.db` to operate database.
If the `controller caller` calls the `controller callee` through `ctx.performAction`, the database transaction status is as follow:

| Controller Caller Config | Controller Callee Config | Controller Callee Status |
|:----------------|:----------------|:-------------------- |
| true            | true            | true                 |
| true            | false           | true                 |
| false           | true            | true                 |
| false           | false           | false                |

#### Backend Parameters Configuration

In the file `backend/src/config/config.js`, add the configuration information:
``` javascript
module.exports = appInfo => {
  const config = {};

  config.message = "Hello world! I'm %s.";

  return config;
};
```

Access the config of the same module:
``` javascript
const message = this.ctx.config.message;
```

#### Backend I18N

In the directory `backend/src/config/locale`, add the i18n file, such as `zh-cn.js`:
``` javascript
module.exports = {
  "Hello world! I'm %s.": '您好，世界！我是%s。',
  'not found': '未发现',
};
```

I18N resources can be merged globally, so as to share i18n resources through all the modules.

Access the i18n resources:
``` javascript
const notFound = this.ctx.text('not found');
const message = this.ctx.text("Hello world! I'm %s.", 'zhennann');
```

#### Backend Error Handing

In the file `backend/src/config/errors.js`, add the error code:
``` javascript
// error code should start from 1001
module.exports = {
  1001: 'not found',
};
```

Return error object:
``` javascript
this.ctx.fail(1001);
```

Throw error exception:
``` javascript
this.ctx.throw(1001);
```

## Module Management

### Module Dependencies

EggBorn.js manages module dependencies through `package.json`.

For example, module `aa-module1` depends on `aa-module2`, and the following configuration is needed in the file `package.json` of the module `aa-module1`:
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

> Add `"egg-born-module-aa-module2": "^0.0.1"` so as to install the module `aa-module2` automatically when installing module `aa-module1`


### Module Data Version

Generally Modules should operate the database. The database structure is also possible to change when the module version upgrade. EggBorn.js manage the module data version so as to facilitate the accumulation of business modules.

In the file `package.json` of the module, configure `fileVersion` as the current data version of the module:
``` json
{
  "name": "egg-born-module-aa-module1",
  "version": "0.0.1",
  "eggBornModule": {
    "fileVersion": 1
  }
}
```

Add backend api route:
``` javascript
{ method: 'post', path: 'version/update', controller: version }
```

Add backend controller:
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

Add backend service:
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

> When the project started, EggBorn.js detects the change of the module data version automatically, and executes the corresponding api route to upgrade the data version.

### Module Publish

When the module in the project is stable, you can publish and contribute the module to the Open Source Community. You can also create private npm registry in your company, and then publish the module there, so as to form company assets for easy reuse.

``` bash
$ cd path/to/module      -- Goto the module directory
$ npm install            -- Install module dependencies
$ npm run build:front    -- Build frontend
$ npm run build:backend  -- Build backend
$ npm publish            -- Publish to npm registry
```

## Test Driven Development
Only backend test driven development is supported currently.

### Backend Controller Test

In the directory `backend/test/controller`, add controller test file:
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

### Backend Service Test

In the directory `backend/test/service`, add service test file:
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

### Run Test

Run test in the project root directory:
``` bash
$ npm run test:backend
$ npm run cov:backend
```

## Frontend Framework Configuration

### Frontend Bootstrap

Frontend provides two bootstraps

> 1. Vue.js + Framework7
> 2. Vue.js + Vue Router

Framework7 is a mobile UI liabrary with built-in routing mechanism.
Vue Router is the official routing library for Vue.js. Vue Router can be used with other various UI libraries.

Switch in the file `src/front/main.js`:
``` javascript
// choose one

//   framework7
import main from './framework7/main.js';

//   vuerouter
// import main from './vuerouter/main.js';

// export
export default main;
```

### Frontend Parameters Configuration

The parameters of the file `src/front/config/config.js` can override the parameters of the modules
``` javascript
export default{
  modules: {
    'aa-hello': {
      mode: 2,
    },
  },
};
```

### Frontend I18N

Framework i18n resources can override the modules's ones.

In the directory `src/front/config/locale`, add the i18n file, such as `zh-cn.js`:
``` javascript
export default {
  mode: '模式',
};
```

## Backend Framework Configuration

### Backend Framework
EggBorn.js backend framework is based on Egg.js，so supports all of the features provided by Egg.js
> For more information，see [Egg.js](https://eggjs.org/)

### Backend Parameters Configuration

The parameters of the file `src/backend/config/config.default.js` can override the parameters of the modules.
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

### Backend I18N

Framework i18n resources can override the modules's ones.

In the directory `src/backend/config/locale`, add the i18n file, such as `zh-cn.js`:
``` javascript
module.exports = {
  mode: '模式',
};
```

## Project Deployment

### Build Frontend
``` bash
$ npm run build:front
```

### Start Backend
``` bash
$ npm run start:backend
```

### Stop Backend
``` bash
$ npm run stop:backend
```

### Backend Start Parameters
Edit the file `build/config.js`:
``` javascript
// backend
const backend = {
  port: 7002,
  hostname: '127.0.0.1',
};
```

### Nginx Configuration

Suggest to use Nginx hosting frontend static resources and reverse proxy backend service
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

## GitHub Contribution
> Any questions, welcome to submit [issue](https://github.com/zhennann/egg-born/issues), or fork and submit [PR](https://github.com/zhennann/egg-born/pulls)!

