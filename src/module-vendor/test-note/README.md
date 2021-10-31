## English

Module `test-note` is the core test module of CableyJS, including the following contents:

1. Demonstrate the development of `simple atom class`
   > The general `atom class` has a `draft, formal and history` life cycle, while the `simple atom class` can have no `draft` or `history`
2. How to use markdown rich text editor
3. How to render HTML content output by markdown
4. The note list page supports `list layout`, `card layout` and `table layout`, and supports dynamic switching between the layouts
5. The note item page supports `content layout` and `info layout`, and supports dynamic switching between the layouts
6. Provides a `dashboard widget`, which can edit and view notes directly in the dashboard on the home page

> How to obtain the complete source codes of the module `test-note`, please go to: [Cabloy Store：test-note](https://store.cabloy.com/articles/test-note.html)

## 简体中文

模块`test-note`是 CabloyJS 框架的核心测试模块，包含以下内容：

1. 演示`简单原子类型`的开发
   > 一般的`原子类型`有`草稿、正式、历史`生命周期，而`简单原子类型`可以没有`草稿和历史`
2. 如何使用 Markdown 富文本编辑器
3. 如何渲染 Markdown 输出的 HTML 内容
   > 这并不是一个容易的事情。因为 CabloyJS 提供了`Markdown Block`机制，允许开发自定义区块嵌入 Markdown 内容中。由于这些自定义区块可以是动态的，因此如何在不同的宿主环境中完成渲染显示，是一个需要精心设计的架构特性
   >
   > CabloyJS 封装了`Markdown Block`的复杂性，提供了非常简便易用的接口
4. 便签列表页面，支持`列表布局`、`卡片布局`、`表格布局`，并支持布局之间的动态切换
5. 便签条目页面，支持`正文布局`和`信息布局`，并支持布局之间的动态切换
6. 实现了一个`仪表板部件`，可以在`首页仪表板`直接进行便签的编辑与查看

> 如何获取模块`test-note`的完整源码，请转至：[Cabloy 商店：test-note](https://store.cabloy.com/zh-cn/articles/test-note.html)
