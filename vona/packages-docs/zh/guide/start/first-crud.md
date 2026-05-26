# 创建第一个CRUD

下面来创建第一个 CRUD，用于管理 Student 数据。

## 新建模块

首先，创建一个模块，名称为`demo-student`。有两种创建模块的方式：

### 1. Cli 命令

```bash
$ vona :create:module demo-student --suite=
```

### 2. 菜单命令

::: tip
右键菜单 - [项目路径/src/module]: `Vona Create/Module`
:::

依据提示输入模块的名称`demo-student`，VSCode 插件会自动创建模块的代码骨架。

::: warning
请确认已经安装了 Vscode 插件：[Vona - Official](https://marketplace.visualstudio.com/items?itemName=cabloy.vona-vscode)
:::

## 新建CRUD

然后，使用 Vona 内置的代码生成器来创建 CRUD 的代码骨架。同样有两种方式：

### 1. Cli命令

```bash
$ vona :tools:crud student --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Tools/Generate Crud`
:::

依据提示输入资源名称`student`，VSCode 插件会自动创建 CRUD 的代码骨架。

## CRUD管理页面

重启开发服务，然后打开http://localhost:7102，可以直接进行 Student 的 CRUD 管理操作。

```bash
$ npm run dev
```

## Swagger/Rapidoc

可以使用 [Swagger](https://swagger.io)/[Rapidoc](https://rapidocweb.com) 来查看和运行 Student 的 CRUD API。

当启动开发服务后，系统自动在终端输出 Swagger/Rapidoc 的 URL 路径：

```bash
[a-swagger] swagger: http://localhost:7102/swagger
[a-swagger] rapidoc: http://localhost:7102/rapidoc
```
