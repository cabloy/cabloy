# egg-born-module-cms-pluginwechatsdk

## 介绍

使用此插件自动对接微信接口，自动在网站前端注入微信JS SDK，即`https://res.wx.qq.com/open/js/jweixin-1.4.0.js`，并自动完成wx.config初始化工作。

同时，wx.config准备就绪后，会自动引发一个JQuery事件`wechatsdk-ready`。如果我们想调用JS SDK的接口，如扫描二维码、自定义网页分享等等，只需响应这个JQuery事件，在这个事件里面操作就可以了

## 如何使用

### 安装插件

``` bash
$ npm i egg-born-module-cms-pluginwechatsdk
```

### 响应JQuery事件

比如，这里我们响应JQuery事件，设置自定义的网页分享参数

``` javascript
$(document).on('wechatsdk-ready', function(event, wx) {
  _wechatshareinit(wx);
});

function _wechatshareinit(wx) {
  // 如果不是文章页面就不执行
  if (!env.article) return;
  const _article = env.article;
  // 分享给朋友
  wx.updateAppMessageShareData({
    title: _article.atomName,
    desc: _article.description || _article._meta.summary || '',
    link: util.url(_article.url),
    imgUrl: _article.imageFirst || '',
    success() {
      // 设置成功
    },
  });
  // 分享给朋友圈
  wx.updateTimelineShareData({
    title: _article.atomName,
    link: util.url(_article.url),
    imgUrl: _article.imageFirst || '',
    success() {
      // 设置成功
    },
  });
}
```

> 关于CabloyJS微信开发的更多信息，请参见：[Cabloy-微信](https://cabloy.com/zh-cn/articles/wechat-introduce.html)
