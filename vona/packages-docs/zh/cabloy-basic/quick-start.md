# 快速上手

在这里，我们分别创建一个 Vona 项目和一个 Zova 项目，并整合到一起，搭建一个完整的全栈开发环境。

## 创建Vona项目

使用`cabloy-basic`模版创建 Vona 项目。

```bash
$ vona :create:project projectName --template=cabloy-basic
$ cd projectName
```

`cabloy-basic`模版内置一个套件`vona-suite-cabloy-basic`。该套件包含如下模块：

| 名称            | 说明                  |
| --------------- | --------------------- |
| basic-siteadmin | 用于实现`Admin中后台` |

## 创建Zova项目

### 1. 克隆Zova源码

```bash
$ git clone --depth 1 https://github.com/zovajs/zova.git
$ cd zova
```

### 2. 初始化并安装依赖

```bash
$ npm run init
```

### 3. 进入zova-dev目录

```bash
$ cd zova-dev
```

### 4. 修改.env 文件

`env/.env.ssr.cabloyBasicAdmin`:

```bash
BUILD_COPY_RELEASE = /path-to-vona/src/suite/cabloy-basic/modules/basic-siteadmin/assets/site
BUILD_REST_COPY_DIST = /path-to-vona/src/suite/cabloy-basic/modules/basic-siteadmin/zovaRest
```

| 名称                 | 说明                                  |
| -------------------- | ------------------------------------- |
| BUILD_COPY_RELEASE   | 将构建生成的JS bundle自动拷贝到Vona中 |
| BUILD_REST_COPY_DIST | 将构建生成的类型文件自动拷贝到Vona中  |

### 5. 构建Zova项目

- 构建 JS bundle

```bash
$ npm run build:ssr:cabloyBasicAdmin
```

- 构建类型文件

```bash
$ npm run build:rest:cabloyBasicAdmin
```

## 运行项目

### 1. 启动Vona开发服务

```bash
$ npm run dev
```

| URL                   | 说明        |
| --------------------- | ----------- |
| http://localhost:7102 | Admin中后台 |

### 2. 启动Zova开发服务

可以直接启动 Zova 开发服务，方便调试前端代码。此时，Vona 可以作为 API 服务供前端访问。

```bash
$ npm run dev:ssr:cabloyBasicAdmin
```

| URL                   | 说明        |
| --------------------- | ----------- |
| http://localhost:9000 | Admin中后台 |
