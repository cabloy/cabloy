# Scripts

## dev

```bash
# Start two processes by default, used to debug the code logic of distributed scenarios
$ npm run dev
# Start a single process
$ npm run dev:one
```

## build

```bash
# Project build, output directory: dist/dist-releases
$ npm run build
# Build a project for a docker environment
$ npm run build:docker
```

## start

```bash
# Start the service in cluster mode
$ npm run start
# Start the service in single process mode
$ npm run start:one
# Start the service in single process mode in a docker environment
$ npm run start:docker
```

## test/cov

```bash
# Unit test
$ npm run test
# Code coverage
$ npm run cov
```

## tsc

Perform type checking.

```bash
$ npm run tsc
```

## play

Automatically run the Playground source code file and automatically create it if it does not exist.

```bash
$ vona play
$ vona play -a
```

## db:reset

Recreate database.

```bash
$ npm run db:reset
```
