# Quick Start

## Prerequisites

| Name       | Version   |
| ---------- | --------- |
| pnpm       | >=10.19.0 |
| Nodejs     | >=24.8.0  |
| Redis      | >=7.2.6   |
| Sqlite3    | Built-in  |
| MySQL      | >=8       |
| Postgresql | >=16      |

- `Redis`: VonaJS provides the following capabilities based on Redis:
  - `Queue, Schedule, Startup, Broadcast, Caching, Two-layer cache, and Redlock`
- `Sqlite3`: You need to set up the node-gyp environment in advance to ensure that `better_sqlite3.node` can be compiled properly when installing dependencies

## Preparation

1. Install command-line tools

```bash
$ pnpm add -g vona-cli@latest
```

2. Install Vscode extension: [Vona - Official](https://marketplace.visualstudio.com/items?itemName=cabloy.vona-vscode)

This extension provides a large number of menus for quickly creating code skeletons for various resources.

## Quick Start

1. Create Project

```bash
$ vona :create:project projectName --template=cabloy-basic
$ cd projectName
```

Vona provides two project templates:

| Name         | UI                    | Description                                   |
| ------------ | --------------------- | --------------------------------------------- |
| cabloy-basic | Daisyui + Tailwindcss | Provides out-of-the-box `Admin`               |
| cabloy-start | VuetifyJS             | Provides out-of-the-box `Website` and `Admin` |

> See: [Cabloy: Project Templates](../../cabloy/introduction.md#templates)

2. Modify .env file

`env/.env`:

```bash
# database
DATABASE_DEFAULT_CLIENT = 'sqlite3' # sqlite3/pg/mysql
DATABASE_CLIENT_PG_PASSWORD =
DATABASE_CLIENT_MYSQL_PASSWORD =

# redis
REDIS_DEFAULT_PASSWORD =
```

3. Start Dev Server

```bash
$ npm run dev
```

- http://localhost:7102

4. Unit test

```bash
$ npm run test
```

5. Build

```bash
$ npm run build
```

6. Start Production Server

```bash
$ npm run start
```

- http://localhost:7102

## Docker Compose

```bash
$ npm run build:docker
$ sudo docker-compose build
$ sudo docker-compose up
```
