---
title: EggBorn.js Showcase - Watch Articles
caption: watcharticles
date: 2017-11-13 18:05:20
category: showcase
showIndex: 2
---

# EggBorn.js Showcase: Watch Articles

这是EggBorn.js的案例，同时也是一个强大的工具，可以自动抓取文章的统计数字，诸如visits、 stars、 replies，等等。 

> Vue.js + Framework7 + Koa.js + Egg.js + MySQL + GitHub Passport

## 主要演示特性

- 模块异步加载
- Framework7 Tabs View布局
- 全局Indicator显示与隐藏
- “上拉刷新”与“下拉加载”
- LoadMore组件设计
- Form Validate
- Login页面跳转逻辑
- GitHub Passport整合

## 体验案例

### 官网

- 网址：[http://wa.egg-born.org](http://wa.egg-born.org)
- 二维码：

<p>
    <img width="200" src="/zh-cn/images/wa/qrcode.png"></img>
</p>

### 截图

<p>
    <img width="200" src="/zh-cn/images/wa/1.jpg"></img>
</p>
<p>
    <img width="200" src="/zh-cn/images/wa/2.jpg"></img>
</p>

### 如何使用

将文章添加进系统，系统会使用相应的模式代码自动抓取文章的统计数字。如果没有相应的模式代码，您也可以创建一个。

### 模式库

欢迎fork仓库[watch-articles](https://github.com/zhennann/watch-articles)，创建您自己的模块代码，提交[PR](https://github.com/zhennann/watch-articles/pulls)，然后发布到这里！

| 模式代码  | 作者           |
| :------- | :---------------- |
| github-repo  | <img width="20" height="20" src="https://avatars2.githubusercontent.com/u/24246985?s=40&v=4"></img> [zhennann](https://github.com/zhennann) |
| cnode-topic | <img width="20" height="20" src="https://avatars2.githubusercontent.com/u/24246985?s=40&v=4"></img> [zhennann](https://github.com/zhennann) |
| juejin-im-post | <img width="20" height="20" src="https://avatars2.githubusercontent.com/u/24246985?s=40&v=4"></img> [zhennann](https://github.com/zhennann) |

## 快速开始

### 安装

```bash
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
        database: 'watch-articles',
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
