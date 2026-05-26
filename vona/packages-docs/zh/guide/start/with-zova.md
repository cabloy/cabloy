# 与Zova整合

当使用`cabloy-basic`模版创建 Vona 项目时，已经内置了最新版的 Zova JS bundle。因此，可以直接渲染 CRUD 管理页面。我们也可以创建 Zova 前端项目，与 Vona 后端整合，从而开发更高级的全栈系统。

## 1. 克隆Zova源码

```bash
$ git clone --depth 1 https://github.com/zovajs/zova.git
$ cd zova
```

## 2. 初始化并安装依赖

```bash
$ cp package.original.json package.json
$ npm run init
```

## 3. 修改.env 文件

`env/.env.ssr.cabloyBasicAdmin`:

```bash
BUILD_COPY_RELEASE = /path-to-vona/src/suite/cabloy-basic/modules/basic-siteadmin/assets/site
BUILD_REST_COPY_DIST = /path-to-vona/src/suite/cabloy-basic/modules/basic-siteadmin/zovaRest
```

| 名称                 | 说明                                  |
| -------------------- | ------------------------------------- |
| BUILD_COPY_RELEASE   | 将构建生成的JS bundle自动拷贝到Vona中 |
| BUILD_REST_COPY_DIST | 将构建生成的类型文件自动拷贝到Vona中  |

## 4. 构建项目

- 构建 JS bundle

```bash
$ npm run build:ssr:cabloyBasicAdmin
```

- 构建类型文件

```bash
$ npm run build:rest:cabloyBasicAdmin
```

## 5. 启动开发服务

可以直接启动 Zova 开发服务，与 Vona 后端进行联调。

```bash
$ npm run dev:ssr:cabloyBasicAdmin
```

| URL                   | 说明     |
| --------------------- | -------- |
| http://localhost:9000 | Zova前端 |
| http://localhost:7102 | Vona后端 |
