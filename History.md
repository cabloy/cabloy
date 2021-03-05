# History

## 2020-03-05, Version 4.5.0

* **特性**
  * message: 统一消息中心
  * 工作流消息: 当有新任务或者流程结束时，给相关人员发送消息
  * 评论消息：当有新评论时，给文章的相关人员发送消息

## 2020-02-23, Version 4.4.13

* **杂项**
  * vscode: 调整launch.json配置
  * cli: 提示升级测试模块

## 2020-02-22, Version 4.4.12

* **特性**
  * 工作流: 增加`撤回`功能

* **重构**
  * 工作流: 重写流程时间线页面，更清晰、更分明
  * socketio: 将`工作流消息`从模块`a-flowtask`移至`a-flow`
  * 验证器: 验证失败的错误提示不再打印到控制台
  * 星标原子: 统计值颜色由`orange`改为`gray`

## 2020-02-09, Version 4.4.11

* **重构**
  * socketio: 将uniform初始化移入buttonMine

## 2020-02-08, Version 4.4.10

* **特性**
  * socketio: add field uniform for messageClass

## 2020-02-08, Version 4.4.9

* **增强**
  * egg-born-backend: redlock.lockTTL=8*1000 for local

## 2020-02-07, Version 4.4.8

* **修复**
  * socketIO: message.onProcess变更
  * socketIO: 增加x-clientid支持

## 2020-02-07, Version 4.4.7

* **重构**
  * 主题themebrilliant：调整颜色

## 2020-02-06, Version 4.4.6

* **特性**
  * socketIO：支持visibilitychange事件，从而节约资源占用：当页面隐藏时断开socket，当页面显示时自动恢复socket

## 2020-02-03, Version 4.4.5

* **特性**
  * clientId：每个页面分配唯一clientId
  * socketIO：clientId机制，支持多个页面同时接收socket消息

## 2020-02-01, Version 4.4.4

* **优化**
  * 构建系统：进一步增强`模块后端编译`的丑化参数

## 2020-01-31, Version 4.4.3

* **特性**
  * 文件上传：支持固定上传尺寸
  * 文件上传：schema ebType=file，支持固定上传尺寸
  * 文件上传：支持拖拽上传
  * 文件上传：默认不显示上传文件名
  * cms：语言与目录不能为空

## 2020-01-30, Version 4.4.1

* **特性**
  * 主题：新增主题`brilliant灿烂`

## 2020-01-29, Version 4.4.0

* **重构**
  * 术语变更：为了避免与`Tag标签`混淆，将`Label`改为`User Label`，即`标签`->`用户标签`

* **特性**
  * 验证码：可以在开发环境指定`禁止验证码`
  * 验证码：当验证失败时，控制台不再打印相关信息
  * 原子批量指令：支持stage属性
  * 前端scene：在http headers中增加x-scene自定义头部
  * 后端configFront：后端config可以设置configFront，configFront将被返回前端，覆盖前端config
  * 页面布局：增加布局原子类型，通过原子来管理布局，从而进一步增强布局的可配置性和灵活性
  * 页面布局：用户可以`重置`，恢复布局的初始配置
  * mobile布局：Tabbar按钮也支持动态配置：增、减、拖拽
  * mobile布局：修改`微信/企业微信/钉钉`用于演示的mobile布局

* **修复**
  * 工作流：当完成`确认参与人`时，更新任务统计值

## 2020-01-25, Version 4.3.1

* **特性**
  * CMS：支持设置`备案号`
  * 仪表板：仪表板中的链接，默认在新Tab中打开

## 2020-01-25, Version 4.3.0

* **重构**
  * 术语变更：将`归档`改为`正式`，即`Archive`->`Formal`

## 2020-01-19, Version 4.2.0

* **重构**
  * 我的页面：将`任务`和`流程`按钮进行合并显示，使布局更紧凑
  * 我的页面：将`外观`按钮移入二级页面
  * 项目的`name`和`title`直接在根目录的`package.json`中设置

* **特性**
  * 统计值：支持在`eb-link`中使用
  * 字段索引：补全新数据表的字段索引
  * 历史Atom：显示`修订`badget
  * 测试与开发环境，database默认设置为`mysql`，从而兼容`mysql`和`mariadb`
  * 静态原子：当`atomRevision`设置为`-1`时，自动删除数据库中的数据

* **修复**
  * 当服务中断重启时，前端socketio可以自动重连

## 2020-01-09, Version 4.1.0

  * Some fixes and enhances

## 2020-12-19, Version 4.0.0-alpha.0

* **features**
  * Bean & AOP
    1. Almost everything is Bean
    2. Bean supports AOP
    3. AOP is also Bean
  * [NodeJS Workflow Engine](https://cabloy.com/articles/flow-introduce.html)
  * [Atom Stages: Draft, Archive, History](https://cabloy.com/articles/atom-stage.html)
  * Stats Value Update and Push Automatically

## 2020-08-08

* **feature**
  * lerna: managing multiple packages with lerna

## 2020-06-21, Version 3.3.0-beta.0

* feature: support wechat work

## 2020-06-05, Version 3.2.0-beta.4

* chore: change to MIT License

## 2020-06-04, Version 3.2.0-beta.2

* **features**
  * [Socket IO](https://community.cabloy.com/articles/91a8d0a883d248c29538cac9f7e7bb0e.html)

## 2020-04-15, Version 3.0.1-beta.1

* **features - backend core **
  * [Cluster](https://cabloy.com/articles/guide-quick-start.html#Configure_Redis_24): Cluster now becomes the first class citizen of CabloyJS
    * Redis: Cluster is based on Redis
    * [Queue](https://cabloy.com/articles/queue.html): Reconstructed based on [bottleneck](https://github.com/SGrondin/bottleneck/) & [bullmq](https://github.com/taskforcesh/bullmq)
    * [Schedule](https://cabloy.com/articles/schedule.html): Reconstructed based on Queue
    * [Broadcast](https://cabloy.com/articles/broadcast.html): Reconstructed based on Redis
    * [Cache](https://cabloy.com/articles/cache.html): Reconstructed based on Redis
    * [Startup](https://cabloy.com/articles/startup.html): Reconstructed
    * [Docker Compose](https://cabloy.com/articles/guide-quick-start.html#Docker_Compose_189): There is a `docker-compose.yml` configuration file in the root directory of the project. If you have installed the docker compose environment, you can start all services of CabloyJS with only one command, including Redis, MySQL, Nginx and CabloyJS backend service
  * [Module Monkey](https://cabloy.com/articles/module-monkey.html): Easy to replace some functionalities of modules just like a monkey🐒

* **features - frontend core **
  * [Theme](https://cabloy.com/articles/theme.html)
  * [Adaptive Layout](https://cabloy.com/articles/013d5e01ae5a40ae90a536d2cafd50cd.html)
  * [Scene Config & Scene Build](https://cabloy.com/articles/config-front.html)
  * [Dragdrop: Move](https://cabloy.com/articles/dragdrop-move.html)
  * [Dragdrop: Resize](https://cabloy.com/articles/dragdrop-resize.html)

* **features - modules **
  * [CMS Block](https://cabloy.com/articles/a676865a6f9b4658a3f7f2319b4193dd.html)
  * [Dashboard](https://cabloy.com/articles/e6848b3c477b4807b78986e1e0342717.html)
  * [Layout PC](https://cabloy.com/articles/8635ddb9fba041778ef3621f257e1da4.html)

## 2020-02-14, Version 3.0.0-beta.4

> [Migration to CabloyJS v3 🎉](https://community.cabloy.com/articles/v2-to-v3.html)

* **features**
  * updated to Framework7 V5 🎉

## 2019-05-29, Version 2.1.0

* **features**
  * support module prebuild, so as to reduce project build time 🎉

## 2019-05-16, Version 2.0.0

* **features**
  * updated to Framework7 V4 🎉

## 2018-09-11, Version 1.2.5

* **features**
  * support f7 color-theme


## 2018-09-07, Version 1.2.4

* **features**
  * a-components: eb-box


## 2018-09-06, Version 1.2.3

* **features**
  * enhance schema&validate


## 2018-09-05, Version 1.2.2

* **features**
  * enhance schema&validate


## 2018-09-03, Version 1.2.0

* **refactor**
  * a-base: changed to sync module


## 2018-08-16, Version 1.1.5

* **fix**
  * a-components: eb-context-menu


## 2018-08-16, Version 1.1.4

* **fix**
  * a-components: eb-toggle


## 2018-08-16, Version 1.1.3

* **features**
  * a-baseadmin support locale


## 2018-08-15, Version 1.1.2

* **features**
  * Moudle's css can be overwrited


## 2018-08-09, Version 1.1.1

* **features**
  * Updated to Framework7 3.0
  * Mobile first, and adapted to PC layout


## 2018-06-24, Version 1.0.7

* **features**
  * First Publish
