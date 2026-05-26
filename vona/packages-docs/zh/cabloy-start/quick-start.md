# 快速上手

在这里，我们分别创建一个 Vona 项目和一个 Zova 项目，并整合到一起，搭建一个完整的全栈开发环境。

## 创建Vona项目

使用`cabloy-start`模版创建 Vona 项目。

```bash
$ vona :create:project projectName --template=cabloy-start
$ cd projectName
```

`cabloy-start`模版内置一个套件`vona-suite-cabloy-start`。该套件包含两个模块：

| 名称            | 说明                  |
| --------------- | --------------------- |
| start-siteadmin | 用于实现`Admin中后台` |
| start-siteweb   | 用于实现`Web网站`     |

## 创建Zova项目

### 1. 创建项目

使用`vuetify`模版创建 Zova 项目。

```bash
$ zova :create:project projectName --template=vuetify
$ cd projectName
```

### 2. 克隆zova-suite-cabloy-start源码

购买后自动获取 GitHub 仓库的访问权限。

```bash
$ git clone git@github.com:cabloy/zova-suite-cabloy-start.git src/suite/cabloy-start
```

### 3. 修改.env 文件

分别修改`Web网站`和`Admin中后台`两个 Flavor 的环境参数配置。

- `env/.env.ssr.cabloyStartAdmin`:

```bash
BUILD_COPY_RELEASE = /path-to-vona/src/suite/cabloy-start/modules/start-siteadmin/assets/site
BUILD_REST_COPY_DIST = /path-to-vona/src/suite/cabloy-start/modules/start-siteadmin/zovaRest
```

- `env/.env.ssr.cabloyStartWeb`:

```bash
BUILD_COPY_RELEASE = /path-to-vona/src/suite/cabloy-start/modules/start-siteweb/assets/site
BUILD_REST_COPY_DIST = /path-to-vona/src/suite/cabloy-start/modules/start-siteweb/zovaRest
```

| 名称                 | 说明                                  |
| -------------------- | ------------------------------------- |
| BUILD_COPY_RELEASE   | 将构建生成的JS bundle自动拷贝到Vona中 |
| BUILD_REST_COPY_DIST | 将构建生成的类型文件自动拷贝到Vona中  |

### 4. 构建Zova项目

- 构建 JS bundle

```bash
$ npm run build:ssr:cabloyStartAdmin
$ npm run build:ssr:cabloyStartWeb
```

- 构建类型文件

```bash
$ npm run build:rest:cabloyStartAdmin
$ npm run build:rest:cabloyStartWeb
```

## 运行项目

### 1. 启动Vona开发服务

```bash
$ npm run dev
```

| URL                         | 说明        |
| --------------------------- | ----------- |
| http://localhost:7102       | Web网站     |
| http://localhost:7102/admin | Admin中后台 |

### 2. 启动Zova开发服务

可以直接启动 Zova 开发服务，方便调试前端代码。此时，Vona 可以作为 API 服务供前端访问。

```bash
$ npm run dev:ssr:cabloyStartWeb
$ npm run dev:ssr:cabloyStartAdmin
```

| URL                          | 说明        |
| ---------------------------- | ----------- |
| http://localhost:9000        | Web网站     |
| http://localhost:9000/admin/ | Admin中后台 |
