# Worker

VonaJS uses a distributed architecture, allowing multiple worker processes to provide services simultaneously. It also supports single-process execution in a Docker environment.

## bean.worker

The module `a-worker` provides a global bean `bean.worker` for managing worker processes.

- Properties

| Name | Description                |
| ---- | -------------------------- |
| id   | Gets the current Worker ID |

- Methods

| Name      | Description                                    |
| --------- | ---------------------------------------------- |
| exit      | Terminates the current Worker                  |
| exitAll   | Terminates all Workers                         |
| reload    | Restarts the current Worker                    |
| reloadAll | Restarts all Workers                           |
| setAlive  | Sets the alive status of a specified Worker    |
| delAlive  | Deletes the alive status of a specified Worker |
| getAlive  | Gets the alive status of a specified Worker    |

## Examples

```typescript
const workerId = this.bean.worker.id;
// reload current worker
this.bean.worker.reload();
// reload all workers
this.bean.worker.reloadAll();
```

## SERVER_WORKERS

`SERVER_WORKERS` can be modified through the .env file.

`env/.env`

```typescript
# server
SERVER_WORKERS = 3
```

Alternatively, it can be set in the command line, for example:

`package.json`

```bash
"scripts": {
  "dev": "npm run prerun && npm run vona :bin:dev -- --workers=2 --flavor=normal",
  "dev:one": "npm run prerun && npm run vona :bin:dev -- --workers=1 --flavor=normal",
  "start": "node ./dist/normal/bootstrap.js",
  "start:one": "cross-env SERVER_WORKERS=1 node ./dist/normal/bootstrap.js",
  "start:docker": "cross-env SERVER_WORKERS=1 node ./dist/docker/bootstrap.js",
}
```

- When executing `npm run dev`, two workers will be started. This allows for timely troubleshooting of potential issues in a distributed environment during development
