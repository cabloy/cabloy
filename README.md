# EggBorn.js

EggBorn.js -- The Ultimate Javascript Full Stack Framework

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
[gitter-image]: https://badges.gitter.im/zhennann/egg-born.svg?style=flat-square
[gitter-url]: https://gitter.im/zhennann/egg-born?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge

## Docs

- [Website && Documentations](http://eb.cabloy.org)

## Showcase

- [Watch Articles](https://github.com/zhennann/egg-born-showcase-watch-articles)

> Watch articles's statistics, such as visits, stars, replies, etc.

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

Edit file: `src/backend/config/config.default.js`

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

Edit file: `src/backend/config/config.unittest.js`

``` javascript
  // mysql
  config.mysql = {
    clients: {
      // donot change the name  
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
$ npm run cov:backend
```
