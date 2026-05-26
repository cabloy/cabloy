# 快速上手

## 前置条件

| 名称   | 版本      |
| ------ | --------- |
| pnpm   | >=10.19.0 |
| Nodejs | >=24.8.0  |

## 准备工作

1. 安装命令行工具

```bash
$ pnpm add -g zova-cli@latest
```

2. 安装 Vscode 插件：[Zova - Official](https://marketplace.visualstudio.com/items?itemName=cabloy.zova-vscode)

该插件提供了大量菜单，用于快速创建各类资源的代码骨架。

## 快速开始

### 1. 创建项目

```bash
$ zova :create:project projectName --template=vuetify
$ cd projectName
```

Zova 提供了三个项目模版:

| 名称    | UI      | 说明                         |
| ------- | ------- | ---------------------------- |
| quasar  | Quasar  | >=2.18.1                     |
| vuetify | Vuetify | >=4.0.1                      |
| empty   |         | 可以在此基础上使用其他 UI 库 |

### 2. 启动开发服务

```bash
$ npm run dev
```

- http://localhost:9000

### 3. 构建

```bash
$ npm run build
```

### 4. 预览

```bash
$ npm run preview
```

- http://localhost:3000
