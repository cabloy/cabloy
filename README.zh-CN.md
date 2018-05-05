# EggBorn.js

EggBorn.js是一款顶级Javascript全栈开发框架

> Vue.js + Framework7 / Vue Router + Koa.js + Egg.js + MySQL

[![NPM version][npm-image]][npm-url]
[![NPM quality][quality-image]][quality-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![NPM download][download-image]][download-url]
[![Gitter][gitter-image]][gitter-url]

[npm-image]: https://img.shields.io/npm/v/egg-born.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-born
[quality-image]: http://npm.packagequality.com/shield/egg-born.svg?style=flat-square
[quality-url]: http://packagequality.com/#?package=egg-born
[travis-image]: https://img.shields.io/travis/zhennann/egg-born.svg?style=flat-square
[travis-url]: https://travis-ci.org/zhennann/egg-born
[codecov-image]: https://img.shields.io/codecov/c/github/zhennann/egg-born.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/zhennann/egg-born
[david-image]: https://img.shields.io/david/zhennann/egg-born.svg?style=flat-square
[david-url]: https://david-dm.org/zhennann/egg-born
[snyk-image]: https://snyk.io/test/npm/egg-born/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-born
[download-image]: https://img.shields.io/npm/dm/egg-born.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-born
[gitter-image]: https://img.shields.io/gitter/room/zhennann/egg-born.svg?style=flat-square
[gitter-url]: https://gitter.im/zhennann/egg-born

## 文档

- [官网 && 文档](http://eb.cabloy.org)

## 案例

- [Watch Articles](https://github.com/zhennann/egg-born-showcase-watch-articles)

> 自动抓取文章的统计数字，诸如visits、 stars、 replies，等等。

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

修改文件: `src/backend/config/config.default.js`

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
$ npm run cov:backend
```
