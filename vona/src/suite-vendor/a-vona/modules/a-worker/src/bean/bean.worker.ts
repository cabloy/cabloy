import { isNil } from '@cabloy/utils';
import cluster from 'node:cluster';
import { BeanBase, uuidv4 } from 'vona';
import { Bean } from 'vona-module-a-bean';

const SymbolWorkerId = Symbol('SymbolWorkerId');

@Bean()
export class BeanWorker extends BeanBase {
  get id(): string {
    if (this.app[SymbolWorkerId] === undefined) {
      this.app[SymbolWorkerId] = uuidv4();
    }
    return this.app[SymbolWorkerId];
  }

  async setAlive(id?: string) {
    const aliveTimeout = this.scope.config.alive.timeout;
    const aliveTimeoutMore = this.scope.config.alive.timeoutMore;
    await this.scope.cacheRedis.workerAlive.set(true, id ?? this.id, {
      ttl: aliveTimeout + aliveTimeoutMore,
    });
  }

  async delAlive(id?: string) {
    await this.scope.cacheRedis.workerAlive.del(id ?? this.id);
  }

  async getAlive(id?: string) {
    if (isNil(id) || id === this.id) return true;
    return await this.scope.cacheRedis.workerAlive.get(id ?? this.id);
  }

  exit(code?: number | string | null | undefined) {
    this.app.close().then(() => {
      process.exit(code);
    });
    this.app.throw(700);
  }

  exitAll(code?: number | string | null | undefined) {
    this.scope.broadcast.exitAll.emit({ code });
  }

  reload() {
    const worker = cluster.worker;
    if (!worker) {
      this.exit(); // docker restart
    } else {
      this.app.close().then(() => {
        worker.send('reload-worker');
      });
      this.app.throw(701);
    }
  }

  reloadAll() {
    this.scope.broadcast.reloadAll.emit();
  }
}
