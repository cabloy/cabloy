# 路由别名

在说明路由别名之前，先解释一下页面导航与加载的基本过程。

## 页面导航与加载

以模块`demo-student`的页面`counter`为例：

1. 导航至页面路径`/demo/student/counter`
2. 系统从路径中解析出模块名称`demo-student`
3. 系统加载模块`demo-student`，将模块提供的路由注入到系统路由表中
4. 从路由表中找到此路径对应的路由记录
5. 从路由记录中取得 component，完成页面渲染

## 首页导航与加载

Zova 采用的是模块化体系，所有业务都在模块中实现。首页也不例外。模块`home-index`提供了一个页面，其路径为`/home/index`。当用户访问`/home/index`时，即可渲染首页。

很显然，用户期望首页的路径为`/`，那么，该如何实现呢？

## 路由别名

可以为路由指定别名。当用户访问`/`时，系统依据路由别名找到真实路径`home/index`，然后加载模块`home-index`，并渲染指定的页面组件。

## 全局Config

很显然，我们不能在模块的路由记录中指定路由别名，而是必须在全局 Config 中指定。

`src/front/config/config/config.ts`

```typescript
// routes
config.routes = {
  path: {
    '/home/index': { alias: '/' },
    '/home/login': { alias: '/login' },
    '/demo/todo/todo': { alias: '/todo' },
  },
  name: {
    'demo-todo:item': { alias: '/todo/:id' },
  },
};
```

| 名称        | 说明                                               |
| ----------- | -------------------------------------------------- |
| routes.path | 一般的页面使用`path`设置别名                       |
| routes.name | 如果页面支持`Params`，那么就需要使用`name`设置别名 |
