# Integration with Zova

When creating a Vona project using the `cabloy-basic` template, the latest version of the Zova JS bundle is already included. Therefore, you can directly render CRUD admin pages. We can also create a Zova frontend project and integrate it with the Vona backend to develop a more advanced fullstack system.

## 1. Clone the Zova source code

```bash
$ git clone --depth 1 https://github.com/zovajs/zova.git
$ cd zova
```

## 2. Initialize and install dependencies

```bash
$ cp package.original.json package.json
$ npm run init
```

## 3. Modify the .env file

`env/.env.ssr.cabloyBasicAdmin`:

```bash
BUILD_COPY_RELEASE = /path-to-vona/src/suite/cabloy-basic/modules/basic-siteadmin/assets/site
BUILD_REST_COPY_DIST = /path-to-vona/src/suite/cabloy-basic/modules/basic-siteadmin/zovaRest
```

| Name                 | Description                                     |
| -------------------- | ----------------------------------------------- |
| BUILD_COPY_RELEASE   | Automatically copy the built JS bundle to Vona  |
| BUILD_REST_COPY_DIST | Automatically copy the built type files to Vona |

## 4. Build

- Build JS bundle

```bash
$ npm run build:ssr:cabloyBasicAdmin
```

- Build type files

```bash
$ npm run build:rest:cabloyBasicAdmin
```

## 5. Start the development server

You can directly start the Zova development server and perform joint debugging with the Vona backend.

```bash
$ npm run dev:ssr:cabloyBasicAdmin
```

| URL                   | Description   |
| --------------------- | ------------- |
| http://localhost:9000 | Zova Frontend |
| http://localhost:7102 | Vona Backend  |
