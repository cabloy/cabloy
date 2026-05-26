# Quick Start

Here, we create a Vona project and a Zova project and combine them to create a complete fullstack development environment.

## Create a Vona project

Create a Vona project using the `cabloy-start` template.

```bash
$ vona :create:project projectName --template=cabloy-start
$ cd projectName
```

The `cabloy-start` template has a built-in suite `vona-suite-cabloy-start`, which contains two modules:

| name            | description                 |
| --------------- | --------------------------- |
| start-siteadmin | Used to implement `Admin`   |
| start-siteweb   | Used to implement `Website` |

## Create a Zova project

### 1. Create a project

Create a Zova project using the `vuetify` template.

```bash
$ zova :create:project projectName --template=vuetify
$ cd projectName
```

### 2. Clone the zova-suite-cabloy-start source code

Automatically gain access to the GitHub repository after purchase.

```bash
$ git clone git@github.com:cabloy/zova-suite-cabloy-start.git src/suite/cabloy-start
```

### 3. Modify the .env file

Modify the environment parameter configuration of the two flavors of `Website` and `Admin` respectively.

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

| Name                 | Description                                     |
| -------------------- | ----------------------------------------------- |
| BUILD_COPY_RELEASE   | Automatically copy the built JS bundle to Vona  |
| BUILD_REST_COPY_DIST | Automatically copy the built type files to Vona |

### 4. Build the Zova project

- Build JS bundle

```bash
$ npm run build:ssr:cabloyStartAdmin
$ npm run build:ssr:cabloyStartWeb
```

- Build type files

```bash
$ npm run build:rest:cabloyStartAdmin
$ npm run build:rest:cabloyStartWeb
```

## Run the project

### 1. Start Vona development server

```bash
$ npm run dev
```

| URL                         | Description |
| --------------------------- | ----------- |
| http://localhost:7102       | Website     |
| http://localhost:7102/admin | Admin       |

### 2. Start Zova development server

You can directly start Zova development server to debug the frontend code. At this point, Vona can be accessed by the frontend as an API service.

```bash
$ npm run dev:ssr:cabloyStartWeb
$ npm run dev:ssr:cabloyStartAdmin
```

| URL                          | Description |
| ---------------------------- | ----------- |
| http://localhost:9000        | Website     |
| http://localhost:9000/admin/ | Admin       |
