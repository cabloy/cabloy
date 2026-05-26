# Scripts

## dev

```bash
# 默认启动两个进程，用于调试分布式场景的代码逻辑
$ npm run dev
# 启动单进程
$ npm run dev:one
```

## build

```bash
# 项目构建，输出目录为：dist/dist-releases
$ npm run build
# 为docker环境构建项目
$ npm run build:docker
```

## start

```bash
# 以集群模式启动服务
$ npm run start
# 以单进程模式启动服务
$ npm run start:one
# 在docker环境中，以单进程模式启动服务
$ npm run start:docker
```

## test/cov

```bash
# 单元测试
$ npm run test
# 代码覆盖率
$ npm run cov
```

## tsc

执行类型校验。

```bash
$ npm run tsc
```

## play

自动运行 Playground 源码文件，如果文件不存在则自动创建。

```bash
$ vona play
$ vona play -a
```

## db:reset

重建数据库。

```bash
$ npm run db:reset
```
