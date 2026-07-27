import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

export type TypeHealthStatus = 'ok' | 'starting' | 'database_unavailable' | 'redis_unavailable';

@Service()
export class ServiceHealth extends BeanBase {
  async status(path: string): Promise<{ status: TypeHealthStatus; code: number }> {
    if (path === '/health/live') {
      return this.app.meta.appClose
        ? { status: 'starting', code: 503 }
        : { status: 'ok', code: 200 };
    }
    if (path === '/health/startup') {
      return this.app.meta.appStarted
        ? { status: 'ok', code: 200 }
        : { status: 'starting', code: 503 };
    }
    if (!this.app.meta.appStarted || this.app.meta.appClose) {
      return { status: 'starting', code: 503 };
    }
    if (!(await this._databaseReady())) return { status: 'database_unavailable', code: 503 };
    if (!(await this._redisReady())) return { status: 'redis_unavailable', code: 503 };
    return { status: 'ok', code: 200 };
  }

  private async _databaseReady() {
    try {
      await withTimeout(this.bean.database.getDb().connection.raw('select 1'), 1000);
      return true;
    } catch {
      return false;
    }
  }

  private async _redisReady() {
    try {
      await withTimeout(this.bean.redis.get().ping(), 1000);
      return true;
    } catch {
      return false;
    }
  }
}

async function withTimeout<RESULT>(promise: Promise<RESULT>, timeoutMillis: number) {
  return await Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('health check timed out')), timeoutMillis).unref();
    }),
  ]);
}
