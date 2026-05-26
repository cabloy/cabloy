# Env

Vona loads environment files based on multi-dimensional variables, providing a more flexible configuration mechanism and supporting more complex business scenarios.

## meta & .env files

Vona uses [dotenv](https://github.com/motdotla/dotenv) to load environment variables from the following files in the directory `env`:

```txt
.env                # loaded in all cases
.env.[meta]         # only loaded in specified condition
.env.local           # loaded in all cases, ignored by git
.env.[meta].local    # only loaded in specified condition, ignored by git
```

- `[meta]` can be `any combination` of the following two variables

| Name   | Description                                                        |
| ------ | ------------------------------------------------------------------ |
| mode   | 'test' \|'dev' \| 'prod'                                           |
| flavor | 'normal' \|'play' \|'docker' \| 'ci' \| keyof VonaMetaFlavorExtend |

## npm scripts

Corresponding to the multidimensional variables, the correspondence between the commands and the scripts are as follows:

```bash
$ npm run test
$ npm run dev
$ npm run build
$ npm run build:docker
```

```json
"scripts": {
  "test": "vona :bin:test --flavor=normal",
  "dev": "vona :bin:dev --flavor=normal",
  "build": "vona :bin:build --flavor=normal",
  "build:docker": "vona :bin:build --flavor=docker",
}
```

### For example

Execute `npm run dev` on the command line, then the corresponding meta variable values are:

| Name   | Value    |
| ------ | -------- |
| mode   | 'dev'    |
| flavor | 'normal' |

The system will automatically load the environment variables in the following files and merge them:

```txt
.env
.env.normal
.env.normal.dev
.env.local
.env.normal.local
.env.normal.dev.local
```

## Tree-shaking

VonaJS only supports tree-shaking during builds for the following environment variables: `META_MODE`, `META_FLAVOR`, and `NODE_ENV`

For example:

```typescript
if (process.env.META_MODE === 'dev') {
  console.log('for development');
}
```

During builds, this is automatically converted to:

```typescript
if ('build' === 'dev') {
  console.log('for development');
}
```

Since the condition is false, tree-shaking is performed.

## Obtaining Environment Variables

### 1. process.env

For environment variables that support tree-shaking, use `process.env`

```typescript
process.env.META_MODE;
process.env.META_FLAVOR;
process.env.NODE_ENV;
```

- `process.env.NODE_ENV`: For compatibility with the Node.js ecosystem only; `process.env.META_MODE` is preferred

### 2. app.meta.env

For environment variables that don't support tree-shaking, use `app.meta.env` to obtain them.

```typescript
this.app.meta.env.APP_NAME;
this.app.meta.env.APP_TITLE;
this.app.meta.env.SERVER_LISTEN_PORT;
```

## Built-in env variables

VonaJS provides several built-in env variables:

### meta

| Name        | Description |
| ----------- | ----------- |
| META_MODE   | mode        |
| META_FLAVOR | flavor      |

### app

| Name        | Description |
| ----------- | ----------- |
| APP_NAME    | App Name    |
| APP_TITLE   | App Title   |
| APP_VERSION | App Version |

### server

| Name                   | Description |
| ---------------------- | ----------- |
| SERVER_KEYS            |             |
| SERVER_GLOBALPREFIX    |             |
| SERVER_PUBLICDIR       |             |
| SERVER_SUBDOMAINOFFSET |             |
| SERVER_WORKERS         |             |
| SERVER_LISTEN_HOSTNAME |             |
| SERVER_LISTEN_PORT     |             |
| SERVER_LISTEN_DISABLE  |             |

### project

| Name                     | Description              |
| ------------------------ | ------------------------ |
| PROJECT_DISABLED_MODULES | List of disabled modules |
| PROJECT_DISABLED_SUITES  | List of disabled suites  |

### logger

| Name                      | Description |
| ------------------------- | ----------- |
| LOGGER_DIR                |             |
| LOGGER_CLIENT_DEFAULT     |             |
| LOGGER_DUMMY              |             |
| LOGGER_ROTATE_ENABLE      |             |
| LOGGER_ROTATE_FILENAME    |             |
| LOGGER_ROTATE_DATEPATTERN |             |
| LOGGER_ROTATE_MAXSIZE     |             |
| LOGGER_ROTATE_MAXFILES    |             |

### build

| Name                          | Description                                   |
| ----------------------------- | --------------------------------------------- |
| BUILD_OUTDIR                  | Specify the output directory                  |
| BUILD_SOURCEMAP               | Sourcemap                                     |
| BUILD_MINIFY                  | Whether to enable minify                      |
| BUILD_LOG_CIRCULAR_DEPENDENCY |                                               |
| BUILD_COPY_DIST               | Copy dist to the specified directory          |
| BUILD_COPY_RELEASE            | Copy dist-releases to the specified directory |
| BUILD_DIALECT_DRIVERS         |                                               |

### test

| Name                  | Description |
| --------------------- | ----------- |
| TEST_CONCURRENCY      |             |
| TEST_ONLY             |             |
| TEST_WHYISNODERUNNING |             |
| TEST_PATTERNS_IGNORE  |             |

### database

Vona supports multiple databases. In order to use it out of the box, two datasource definitions are provided: `pg`/`mysql`, and the default datasource is `pg`

| Name                    | Description            |
| ----------------------- | ---------------------- |
| DATABASE_DEFAULT_CLIENT | the default datasource |

- pg

| Name                        | Description |
| --------------------------- | ----------- |
| DATABASE_CLIENT_PG_HOST     |             |
| DATABASE_CLIENT_PG_PORT     |             |
| DATABASE_CLIENT_PG_USER     |             |
| DATABASE_CLIENT_PG_PASSWORD |             |
| DATABASE_CLIENT_PG_DATABASE |             |

- mysql

| Name                           | Description |
| ------------------------------ | ----------- |
| DATABASE_CLIENT_MYSQL_HOST     |             |
| DATABASE_CLIENT_MYSQL_PORT     |             |
| DATABASE_CLIENT_MYSQL_USER     |             |
| DATABASE_CLIENT_MYSQL_PASSWORD |             |
| DATABASE_CLIENT_MYSQL_DATABASE |             |

### redis

| Name                   | Description |
| ---------------------- | ----------- |
| REDIS_DEFAULT_HOST     |             |
| REDIS_DEFAULT_PORT     |             |
| REDIS_DEFAULT_PASSWORD |             |
| REDIS_DEFAULT_DB       |             |
