# Worker

VonaJS 采用的是分布式体系，允许多个工作进程同时提供服务。也支持在 Docker 环境中单进程执行。

## bean.worker

模块`a-worker`提供了全局 Bean `bean.worker`，用于管理工作进程。

- 属性

| 名称 | 说明              |
| ---- | ----------------- |
| id   | 获取当前Worker Id |

- 方法

| 名称      | 说明                     |
| --------- | ------------------------ |
| exit      | 结束当前Worker           |
| exitAll   | 结束所有Workers          |
| reload    | 重启当前Worker           |
| reloadAll | 重启所有Workers          |
| setAlive  | 设置指定Worker的存活状态 |
| delAlive  | 删除指定Worker的存活状态 |
| getAlive  | 获取指定Worker的存活状态 |

## 举例

```typescript
const workerId = this.bean.worker.id;
// reload current worker
this.bean.worker.reload();
// reload all workers
this.bean.worker.reloadAll();
```

## SERVER_WORKERS

可以通过.env 文件修改`SERVER_WORKERS`

`env/.env`

```typescript
# server
SERVER_WORKERS = 3
```

也可以在命令行中设置，比如：

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

- 在执行`npm run dev`时，将启动 2 个 Workers。这样可以在开发过程中，及时排查分布式情况下可能出现的问题
