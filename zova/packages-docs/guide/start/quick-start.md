# Quick Start

## Prerequisites

| Name   | Version   |
| ------ | --------- |
| pnpm   | >=10.19.0 |
| Nodejs | >=24.8.0  |

## Preparation

1. Install command-line tools

```bash
$ pnpm add -g zova-cli@latest
```

2. Install Vscode extension: [Zova - Official](https://marketplace.visualstudio.com/items?itemName=cabloy.zova-vscode)

This extension provides a large number of menus for quickly creating code skeletons for various resources.

## Quick Start

### 1. Create Project

```bash
$ zova :create:project projectName --template=vuetify
$ cd projectName
```

Zova provides three project templates:

| Name    | UI      | Description                                                 |
| ------- | ------- | ----------------------------------------------------------- |
| quasar  | Quasar  | >=2.18.1                                                    |
| vuetify | Vuetify | >=4.0.1                                                     |
| empty   |         | Other UI libraries can be used based on this empty template |

### 2. Start Dev Server

```bash
$ npm run dev
```

- http://localhost:9000

### 3. Build

```bash
$ npm run build
```

### 4. Preview

```bash
$ npm run preview
```

- http://localhost:3000
