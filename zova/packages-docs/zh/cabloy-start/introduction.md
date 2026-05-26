# Cabloy Start

套件 zova-suite-cabloy-start 采用`VuetifyJS` UI 库，提供了一组开箱即用的前端模块，加速开发`Web网站`和`Admin中后台`等全栈系统。

## 模块清单

### 1. 核心模块

| 名称              | 说明                                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| start-layoutadmin | 用于`Admin中后台`的布局组件，支持双层页签导航                                                                   |
| start-layoutfront | 用于`Web网站`的布局组件                                                                                         |
| start-adapter     | UI组件适配器：为`Table/Form`渲染定义常用的UI组件                                                                |
| start-restpage    | 可动态渲染CRUD的列表页、条目页、搜索表单，并且提供了`Tanstack Table`/`Tanstack Form`/`Tanstack Query`的最佳实践 |
| start-paypal      | 与后端Paypal API进行对接的前端渲染组件                                                                          |
| start-theme       | 基于Token机制实现的一款橘色主题                                                                                 |

### 2. 其他模块

| 名称           | 说明                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| start-actions  | 提供可以在ZovaJsx中使用的常用Actions：`Alert`/`Confirm`/`Prompt`，方便在后端通过声明式语法来实现事件监听逻辑 |
| start-app      | 提供应用级别的行为组件，实现多种弹窗能力：`$appModal.alert`/`$appModal.confirm`/`$appModal.prompt`           |
| start-button   | 增强版本的 Button 组件：1. 自动显示 loading 图标，2. 点击事件如果执行失败，会自动弹出错误提示                |
| start-captcha  | 开箱即用的验证码组件                                                                                         |
| start-date     | 日期范围组件，自动处理`Timezone`                                                                             |
| start-demo     | 一些演示代码                                                                                                 |
| start-form     | 表单行为组件，基于`Behavior`机制控制表单渲染行为                                                             |
| start-table    | 基于`Tanstack Table`实现的表格组件                                                                           |
| start-select   | 用于`Table/Form`渲染的 Select 组件                                                                           |
| start-textarea | 用于`Table/Form`渲染的 Textarea 组件                                                                         |
| start-toggle   | 用于`Table/Form`渲染的 Toggle 组件                                                                           |
| start-resource | 用于`Table/Form`渲染的`资源选择`组件                                                                         |
