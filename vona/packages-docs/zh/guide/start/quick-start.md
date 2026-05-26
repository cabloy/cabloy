# 快速上手

## 前置条件

| 名称       | 版本      |
| ---------- | --------- |
| pnpm       | >=10.19.0 |
| Nodejs     | >=24.8.0  |
| Redis      | >=7.2.6   |
| Sqlite3    | 内置      |
| MySQL      | >=8       |
| Postgresql | >=16      |

- `Redis`: VonaJS 基于 Redis 提供了以下能力:
  - `队列、定时任务、启动项、广播、缓存、二级缓存、分布式锁`
- `Sqlite3`: 需要预先准备 node-gyp 环境，确保在安装依赖时可以正常编译出`better_sqlite3.node`

## 准备工作

1. 安装命令行工具

```bash
$ pnpm add -g vona-cli@latest
```

2. 安装 Vscode 插件：[Vona - Official](https://marketplace.visualstudio.com/items?itemName=cabloy.vona-vscode)

该插件提供了大量菜单，用于快速创建各类资源的代码骨架。

## 快速开始

1. 创建项目

```bash
$ vona :create:project projectName --template=cabloy-basic
$ cd projectName
```

Vona 提供了两个项目模版:

| 名称         | UI                    | 说明                                   |
| ------------ | --------------------- | -------------------------------------- |
| cabloy-basic | Daisyui + Tailwindcss | 提供开箱即用的`Admin中后台`            |
| cabloy-start | VuetifyJS             | 提供开箱即用的`Web网站`和`Admin中后台` |

> 参见: [Cabloy: 项目模版](../../cabloy/introduction.md#templates)

2. 修改.env 文件

`env/.env`:

```bash
# database
DATABASE_DEFAULT_CLIENT = 'sqlite3' # sqlite3/pg/mysql
DATABASE_CLIENT_PG_PASSWORD =
DATABASE_CLIENT_MYSQL_PASSWORD =

# redis
REDIS_DEFAULT_PASSWORD =
```

3. 启动开发服务

```bash
$ npm run dev
```

- http://localhost:7102

4. 单元测试

```bash
$ npm run test
```

5. 构建

```bash
$ npm run build
```

6. 启动生产服务

```bash
$ npm run start
```

- http://localhost:7102

## Docker Compose

```bash
$ npm run build:docker
$ sudo docker-compose build
$ sudo docker-compose up
```
