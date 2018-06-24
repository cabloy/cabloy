# Cabloy.js

Cabloy.js是一款顶级Javascript全栈开发框架

> Vue.js + Framework7 + Koa.js + Egg.js + MySQL

[![NPM version][npm-image]][npm-url]
[![NPM quality][quality-image]][quality-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/cabloy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cabloy
[quality-image]: http://npm.packagequality.com/shield/cabloy.svg?style=flat-square
[quality-url]: http://packagequality.com/#?package=cabloy
[david-image]: https://img.shields.io/david/zhennann/cabloy.svg?style=flat-square
[david-url]: https://david-dm.org/zhennann/cabloy
[snyk-image]: https://snyk.io/test/npm/cabloy/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/cabloy
[download-image]: https://img.shields.io/npm/dm/cabloy.svg?style=flat-square
[download-url]: https://npmjs.org/package/cabloy

## 文档

- [官网 && 文档](http://cabloy.org)

## 快速开始

### 安装

```bash
$ npm install -g egg-born
```

### 新建项目

```bash
$ egg-born project_name
$ cd project_name
$ npm install
```

### 配置MySQL

修改文件: `src/backend/config/config.unittest.js`

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

修改文件: `src/backend/config/config.local.js`

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

修改文件: `src/backend/config/config.prod.js`

``` javascript
  // mysql
  config.mysql = {
    clients: {
      // donnot change the name
      __ebdb: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root', // 'travis',
        password: '',
        database: '{{name}}',
      },
    },
  };
```

### 运行

启动后端服务
```bash
$ npm run dev:backend
```

启动前端服务
```bash
$ npm run dev:front
```

### 测试

```bash
$ npm run test:backend
```
