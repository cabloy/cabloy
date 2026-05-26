# Quick Start

Here, we create a Vona project and a Zova project and combine them to create a complete fullstack development environment.

## Create a Vona project

Create a Vona project using the `cabloy-basic` template.

```bash
$ vona :create:project projectName --template=cabloy-basic
$ cd projectName
```

The `cabloy-basic` template has a built-in suite `vona-suite-cabloy-basic`, which contains the following modules:

| name            | description               |
| --------------- | ------------------------- |
| basic-siteadmin | Used to implement `Admin` |

## Create a Zova project

### 1. Clone the Zova source code

```bash
$ git clone --depth 1 https://github.com/zovajs/zova.git
$ cd zova
```

### 2. Initialize and install dependencies

```bash
$ npm run init
```

### 3. Enter the zova-dev directory

```bash
$ cd zova-dev
```

### 4. Modify the .env file

`env/.env.ssr.cabloyBasicAdmin`:

```bash
BUILD_COPY_RELEASE = /path-to-vona/src/suite/cabloy-basic/modules/basic-siteadmin/assets/site
BUILD_REST_COPY_DIST = /path-to-vona/src/suite/cabloy-basic/modules/basic-siteadmin/zovaRest
```

| Name                 | Description                                     |
| -------------------- | ----------------------------------------------- |
| BUILD_COPY_RELEASE   | Automatically copy the built JS bundle to Vona  |
| BUILD_REST_COPY_DIST | Automatically copy the built type files to Vona |

### 5. Build the Zova project

- Build JS bundle

```bash
$ npm run build:ssr:cabloyBasicAdmin
```

- Build type files

```bash
$ npm run build:rest:cabloyBasicAdmin
```

## Run the project

### 1. Start Vona development server

```bash
$ npm run dev
```

| URL                   | Description |
| --------------------- | ----------- |
| http://localhost:7102 | Admin       |

### 2. Start Zova development server

You can directly start Zova development server to debug the frontend code. At this point, Vona can be accessed by the frontend as an API service.

```bash
$ npm run dev:ssr:cabloyBasicAdmin
```

| URL                   | Description |
| --------------------- | ----------- |
| http://localhost:9000 | Admin       |
