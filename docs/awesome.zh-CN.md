# CabloyJS Awesome

## 解决方案

CabloyJS 内置了大量核心模块，从而便于支持各类业务的快速开发。同时，CabloyJS 在此基础上还提供了一系列`开箱即用`的解决方案

### Cabloy-CMS

Cabloy-CMS 是基于 CabloyJS 全栈业务开发框架开发的`动静结合`的 CMS，可以快速构建`企业网站`、`博客`、`社区`、`商城`等 Web 应用

- 演示：[博客 - 暮风洗月](https://zhennann.com)
- 官方文档：[https://cabloy.com/zh-cn/articles/cms-introduce.html](https://cabloy.com/zh-cn/articles/cms-introduce.html)

### Cabloy-社区

Cabloy-Community 是基于 Cabloy-CMS 开发的社区（论坛）Web 应用

- 演示：[CabloyJS 官方社区](https://community.cabloy.com)
- 官方文档：[https://cabloy.com/zh-cn/articles/community-introduce.html](https://cabloy.com/zh-cn/articles/community-introduce.html)

## 核心模块一览表

### 测试模块

[egg-born-module-test-party](https://github.com/zhennann/egg-born-module-test-party)

> 当新建项目时，自动下载到项目所在目录中。包含大量`测试用例`和`Kitchen-sink`，并且持续添加更多内容。既便于快速学习 CabloyJS 方方面面的知识点，又便于快速启动实际的业务开发

### 内置模块

| 名称                                                                                               | 说明                                               |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [egg-born-front](https://github.com/zhennann/egg-born-front)                                       | 前端核心                                           |
| [egg-born-backend](https://github.com/zhennann/egg-born-backend)                                   | 后端核心                                           |
| [egg-born-bin](https://github.com/zhennann/egg-born-bin)                                           | 项目命令行工具                                     |
| [egg-born-scripts](https://github.com/zhennann/egg-born-scripts)                                   | 项目命令行启动工具                                 |
| [egg-born-module-a-version](https://github.com/zhennann/egg-born-module-a-version)                 | 数据版本                                           |
| [egg-born-module-a-authgithub](https://github.com/zhennann/egg-born-module-a-authgithub)           | Github 登录                                        |
| [egg-born-module-a-authsimple](https://github.com/zhennann/egg-born-module-a-authsimple)           | 用户名/密码登录                                    |
| [egg-born-module-a-base-sync](https://github.com/zhennann/egg-born-module-a-base-sync)             | 业务核心：用户、角色、权限、原子数据、简单流程等等 |
| [egg-born-module-a-baseadmin](https://github.com/zhennann/egg-born-module-a-baseadmin)             | 业务核心的管理页面                                 |
| [egg-born-module-a-cache](https://github.com/zhennann/egg-born-module-a-cache)                     | 缓存                                               |
| [egg-born-module-a-captcha](https://github.com/zhennann/egg-born-module-a-captcha)                 | 验证码抽象框架                                     |
| [egg-born-module-a-captchasimple](https://github.com/zhennann/egg-born-module-a-captchasimple)     | 一个验证码实现                                     |
| [egg-born-module-a-components-sync](https://github.com/zhennann/egg-born-module-a-components-sync) | 前端 UI 组件                                       |
| [egg-born-module-a-event](https://github.com/zhennann/egg-born-module-a-event)                     | 后端事件机制                                       |
| [egg-born-module-a-file](https://github.com/zhennann/egg-born-module-a-file)                       | 文件上传                                           |
| [egg-born-module-a-hook](https://github.com/zhennann/egg-born-module-a-hook)                       | 后端 Hook 机制                                     |
| [egg-born-module-a-index](https://github.com/zhennann/egg-born-module-a-index)                     | 数据库索引                                         |
| [egg-born-module-a-instance](https://github.com/zhennann/egg-born-module-a-instance)               | 多域名与多实例                                     |
| [egg-born-module-a-layoutmobile](https://github.com/zhennann/egg-born-module-a-layoutmobile)       | Mobile 布局                                        |
| [egg-born-module-a-layoutpc](https://github.com/zhennann/egg-born-module-a-layoutpc)               | PC 布局                                            |
| [egg-born-module-a-login](https://github.com/zhennann/egg-born-module-a-login)                     | 用户登录                                           |
| [egg-born-module-a-mail](https://github.com/zhennann/egg-born-module-a-mail)                       | 发送邮件                                           |
| [egg-born-module-a-markdownstyle](https://github.com/zhennann/egg-born-module-a-markdownstyle)     | 一款基于 Github 的 Markdown 样式                   |
| [egg-born-module-a-progress](https://github.com/zhennann/egg-born-module-a-progress)               | 高级进度条，支持多级进度显示                       |
| [egg-born-module-a-sequence](https://github.com/zhennann/egg-born-module-a-sequence)               | 数据序列                                           |
| [egg-born-module-a-settings](https://github.com/zhennann/egg-born-module-a-settings)               | 设置管理                                           |
| [egg-born-module-a-status](https://github.com/zhennann/egg-born-module-a-status)                   | 状态管理                                           |
| [egg-born-module-a-user](https://github.com/zhennann/egg-born-module-a-user)                       | 与个人用户相关的功能                               |
| [egg-born-module-a-validation](https://github.com/zhennann/egg-born-module-a-validation)           | 数据验证                                           |

### 可选模块

| 名称                                                                                                                 | 说明                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [egg-born-module-a-cms](https://github.com/zhennann/egg-born-module-a-cms)                                           | CMS 模块，可快速创建博客、技术文档、社区（论坛）、公司官网等静态站点，并提供必要的动态功能，如评论等等 |
| [egg-born-module-cms-sitecommunity](https://github.com/zhennann/egg-born-module-cms-sitecommunity)                   | 论坛模块                                                                                               |
| [egg-born-module-cms-themeaws](https://github.com/zhennann/egg-born-module-cms-themeaws)                             | 主题：AWS 风格的博客                                                                                   |
| [egg-born-module-cms-themeblog](https://github.com/zhennann/egg-born-module-cms-themeblog)                           | 主题：博客                                                                                             |
| [egg-born-module-cms-themecommunity](https://github.com/zhennann/egg-born-module-cms-themecommunity)                 | 主题：社区                                                                                             |
| [egg-born-module-cms-themedocs](https://github.com/zhennann/egg-born-module-cms-themedocs)                           | 主题：技术文档                                                                                         |
| [egg-born-module-cms-pluginbase](https://github.com/zhennann/egg-born-module-cms-pluginbase)                         | 插件：基础功能                                                                                         |
| [egg-born-module-cms-pluginarticle](https://github.com/zhennann/egg-born-module-cms-pluginarticle)                   | 插件：文章基础功能                                                                                     |
| [egg-born-module-cms-pluginbacktotop](https://github.com/zhennann/egg-born-module-cms-pluginbacktotop)               | 插件：回到页首                                                                                         |
| [egg-born-module-cms-pluginblock](https://github.com/zhennann/egg-born-module-cms-pluginblock)                       | 插件：Markdown 自定义区块框架                                                                          |
| [egg-born-module-cms-pluginfixcontainersite](https://github.com/zhennann/egg-born-module-cms-pluginfixcontainersite) | 插件：调整首页容器的高度                                                                               |
| [egg-born-module-cms-pluginmarkdowngithub](https://github.com/zhennann/egg-born-module-cms-pluginmarkdowngithub)     | 插件：一款基于 Github 的 Markdown 样式                                                                 |
| [egg-born-module-cms-pluginrss](https://github.com/zhennann/egg-born-module-cms-pluginrss)                           | 插件：RSS                                                                                              |
| [egg-born-module-cms-pluginsidebar](https://github.com/zhennann/egg-born-module-cms-pluginsidebar)                   | 插件：侧边栏组件                                                                                       |
| [egg-born-module-cms-pluginsocialshare](https://github.com/zhennann/egg-born-module-cms-pluginsocialshare)           | 插件：社会化分享（一组按钮）                                                                           |
| [egg-born-module-cms-pluginsubmit](https://github.com/zhennann/egg-born-module-cms-pluginsubmit)                     | 插件：自动提交文章到百度搜索引擎，加快文章收录                                                         |
| [egg-born-module-cms-plugintrack](https://github.com/zhennann/egg-born-module-cms-plugintrack)                       | 插件：Google 统计、百度统计、腾讯统计                                                                  |
| [egg-born-module-cms-pluginuser](https://github.com/zhennann/egg-born-module-cms-pluginuser)                         | 插件：在导航栏显示当前用户状态及用户菜单                                                               |
