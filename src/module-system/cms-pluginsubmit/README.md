# egg-born-module-cms-pluginsubmit

## 介绍

使用此插件自动将当前渲染的文章提交到百度搜索引擎，可以缩短百度爬虫发现您站点新链接的时间，使新发布的页面可以在第一时间被百度收录

## 如何使用

### 安装插件

``` bash
$ npm i egg-born-module-cms-pluginsubmit
```

> 如果主题模块已经包含了此插件就会自动安装

### 配置参数

只需在`站点配置`或`语言配置`中提供百度分配的token即可


``` javascript
{
  ...
  "plugins": {
    "cms-pluginsubmit": {
      "submit": {
        "baidu": {
          "token": ""
        }
      }
    }
  }
}
```

> 关于token详情，请参见：[百度-搜索资源平台](https://ziyuan.baidu.com/linksubmit/index)
