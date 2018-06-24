# Cabloy.js

Cabloy.js -- The Ultimate Javascript Full Stack Framework

> Vue.js + Framework7 + Koa.js + Egg.js + EggBorn.js + MySQL

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/cabloy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cabloy
[david-image]: https://img.shields.io/david/zhennann/cabloy.svg?style=flat-square
[david-url]: https://david-dm.org/zhennann/cabloy
[snyk-image]: https://snyk.io/test/npm/cabloy/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/cabloy
[download-image]: https://img.shields.io/npm/dm/cabloy.svg?style=flat-square
[download-url]: https://npmjs.org/package/cabloy

## Docs

- [Website && Documentations](http://cabloy.org)

## Getting Started

### Installation

```bash
$ npm install -g egg-born
```

### Create a project

```bash
$ egg-born project_name
$ cd project_name
$ npm install
```

### Setup MySQL 

Edit file: `src/backend/config/config.unittest.js`

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

Edit file: `src/backend/config/config.local.js`

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

Edit file: `src/backend/config/config.prod.js`

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

### Run

Start backend service
```bash
$ npm run dev:backend
```

Start front service
```bash
$ npm run dev:front
```

### Test

```bash
$ npm run test:backend
```
