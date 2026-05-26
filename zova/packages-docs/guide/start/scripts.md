# Scripts

Zova can build `SSR/SPA/Website/Admin-Dashboard` in one codebase, and both `Website/Admin-Dashboard` can support SSR. Therefore, Zova loads environment files based on multi-dimensional variables, providing a more flexible configuration mechanism and supporting more complex business scenarios. Corresponding to the multi-dimensional variables, the command line script is also divided into three parts, such as:

```bash
$ npm run dev:ssr:admin
```

- See: [Multi-dimensional Variables](../env-config/mode-flavor/introduction.md)

## ssr + admin

| appMode | flavor | Description     |
| ------- | ------ | --------------- |
| ssr     | admin  | Admin-Dashboard |

```bash
$ npm run dev:ssr:admin
$ npm run build:ssr:admin
$ npm run preview:ssr:admin
```

Since `ssr + admin` is the default script, it can be simplified to:

```bash
$ npm run dev
$ npm run build
$ npm run preview
```

## ssr + web

| appMode | flavor | Description |
| ------- | ------ | ----------- |
| ssr     | web    | Website     |

```bash
$ npm run dev:ssr:web
$ npm run build:ssr:web
$ npm run preview:ssr:web
```

## spa

| appMode | flavor | Description                               |
| ------- | ------ | ----------------------------------------- |
| spa     | admin  | In SPA mode, the flavor defaults to admin |

```bash
$ npm run dev:spa
$ npm run build:spa
$ npm run preview:spa
```

## Cabloy Basic

This suite `Cabloy Basic` uses the `Daisyui + Tailwindcss` UI library and provides a set of out-of-the-box frontend modules to accelerate the development of fullstack projects such as `Admin-Dashboards`

- See: [Cabloy Basic](../../cabloy-basic/introduction.md)

```bash
$ npm run dev:ssr:cabloyBasicAdmin
$ npm run build:ssr:cabloyBasicAdmin
$ npm run preview:ssr:cabloyBasicAdmin
```

- Zova can generate types for routes and components to provide type hints in Vona

```bash
npm run build:rest:cabloyBasicAdmin
```

## Cabloy Start

This suite `Cabloy Start` uses the `VuetifyJS` UI library and provides a set of out-of-the-box frontend modules to accelerate the development of fullstack projects such as `Websites` and `Admin-Dashboards`

- See: [Cabloy Start](../../cabloy-start/introduction.md)

### 1. Admin-Dashboard

```bash
$ npm run dev:ssr:cabloyStartAdmin
$ npm run build:ssr:cabloyStartAdmin
$ npm run preview:ssr:cabloyStartAdmin
```

- Build Zova types file

```bash
npm run build:rest:cabloyStartAdmin
```

### 2. Website

```bash
$ npm run dev:ssr:cabloyStartWeb
$ npm run build:ssr:cabloyStartWeb
$ npm run preview:ssr:cabloyStartWeb
```

- Build Zova types file

```bash
npm run build:rest:cabloyStartWeb
```
