# Scripts

Zova 可在同一个代码库中实现`SSR/SPA/Web网站/Admin中后台`，而且`Web网站/Admin中后台`都可以支持 SSR。所以，Zova 基于多维变量加载环境文件，从而提供更加灵活的配置机制，支持更复杂的业务场景。与多维变量相对应，命令行运行脚本也相应地分为三个部分，比如：

```bash
$ npm run dev:ssr:admin
```

- 参见: [多维变量](../env-config/mode-flavor/introduction.md)

## ssr + admin

| appMode | flavor | 说明        |
| ------- | ------ | ----------- |
| ssr     | admin  | Admin中后台 |

```bash
$ npm run dev:ssr:admin
$ npm run build:ssr:admin
$ npm run preview:ssr:admin
```

由于`ssr + admin`是默认脚本，所以可以简化为：

```bash
$ npm run dev
$ npm run build
$ npm run preview
```

## ssr + web

| appMode | flavor | 说明    |
| ------- | ------ | ------- |
| ssr     | web    | Web网站 |

```bash
$ npm run dev:ssr:web
$ npm run build:ssr:web
$ npm run preview:ssr:web
```

## spa

| appMode | flavor | 说明                           |
| ------- | ------ | ------------------------------ |
| spa     | admin  | 在spa模式中，flavor默认为admin |

```bash
$ npm run dev:spa
$ npm run build:spa
$ npm run preview:spa
```

## Cabloy Basic

`Cabloy Basic`套件采用 Daisyui + Tailwindcss，提供了一组开箱即用的前端模块，加速开发`Admin中后台`全栈系统。

- 参见：[Cabloy Basic](../../cabloy-basic/introduction.md)

```bash
$ npm run dev:ssr:cabloyBasicAdmin
$ npm run build:ssr:cabloyBasicAdmin
$ npm run preview:ssr:cabloyBasicAdmin
```

- Zova 可以生成路由和组件的类型，从而在 Vona 中提供类型提示

```bash
npm run build:rest:cabloyBasicAdmin
```

## Cabloy Start

`Cabloy Start`套件采用 VuetifyJS UI 库，提供了一组开箱即用的前端模块，加速开发`Web网站`和`Admin中后台`等全栈系统。

- 参见：[Cabloy Start](../../cabloy-start/introduction.md)

### 1. Admin中后台

```bash
$ npm run dev:ssr:cabloyStartAdmin
$ npm run build:ssr:cabloyStartAdmin
$ npm run preview:ssr:cabloyStartAdmin
```

- 构建 Zova 类型文件

```bash
npm run build:rest:cabloyStartAdmin
```

### 2. Web网站

```bash
$ npm run dev:ssr:cabloyStartWeb
$ npm run build:ssr:cabloyStartWeb
$ npm run preview:ssr:cabloyStartWeb
```

- 构建 Zova 类型文件

```bash
npm run build:rest:cabloyStartWeb
```
