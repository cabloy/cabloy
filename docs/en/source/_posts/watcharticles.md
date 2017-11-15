---
title: EggBorn.js Showcase - Watch Articles
caption: watcharticles
date: 2017-11-13 18:05:20
category: showcase
showIndex: 2
---

# EggBorn.js Showcase: Watch Articles

This is a showcase for EggBorn.js, and also is a powerful tool to watch articles's statistics automatically, such as visits, stars, replies, etc. 

> Vue.js + Framework7 + Koa.js + Egg.js + MySQL + GitHub Passport

## Try The Showcase

### Website

- Website: [http://wa.egg-born.org](http://wa.egg-born.org)
- QRCode: 

<p>
    <img width="200" src="/en/images/wa/qrcode.png"></img>
</p>

### Screenshots

<p>
    <img width="200" src="/en/images/wa/1.jpg"></img>
</p>
<p>
    <img width="200" src="/en/images/wa/2.jpg"></img>
</p>

### How To Use

Append your article's url to the system, which will fetch the article's statistics automatically with the corresponding pattern. If has not the corresponding pattern for the article, you can create one.

### Pattern Library

Welcome to fork the repo [watch-articles](https://github.com/zhennann/watch-articles), and create your own patterns, then submit [PR](https://github.com/zhennann/watch-articles/pulls), and then post them here!

| Pattern  | Author           |
| :------- | :---------------- |
| github-repo  | <img width="20" height="20" src="https://avatars2.githubusercontent.com/u/24246985?s=40&v=4"></img> [zhennann](https://github.com/zhennann) |
| cnode-topic | <img width="20" height="20" src="https://avatars2.githubusercontent.com/u/24246985?s=40&v=4"></img> [zhennann](https://github.com/zhennann) |
| juejin-im-post | <img width="20" height="20" src="https://avatars2.githubusercontent.com/u/24246985?s=40&v=4"></img> [zhennann](https://github.com/zhennann) |

## Getting Started

### Installation

```bash
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
        database: 'watch-articles',
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
