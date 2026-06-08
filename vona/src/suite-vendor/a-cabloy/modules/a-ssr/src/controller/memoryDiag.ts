import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import inspector from 'node:inspector';
import v8 from 'node:v8';
import { BeanBase } from 'vona';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

const HEADER_MEMORY_DIAG_TOKEN = 'x-ssr-memory-diag-token';
const ENV_MEMORY_DIAG_TOKEN = 'SSR_MEMORY_DIAG_TOKEN';

export interface IControllerOptionsMemoryDiag extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsMemoryDiag>('memoryDiag', {
  exclude: true,
})
export class ControllerMemoryDiag extends BeanBase {
  @Web.get('stats')
  @Passport.public()
  async stats() {
    this._checkAccess();
    const mem = process.memoryUsage();
    const heap = v8.getHeapStatistics();
    return {
      pid: process.pid,
      timestamp: Date.now(),
      memoryUsage: {
        rss: mem.rss,
        heapTotal: mem.heapTotal,
        heapUsed: mem.heapUsed,
        external: mem.external,
        arrayBuffers: mem.arrayBuffers,
      },
      heapStatistics: {
        used_heap_size: heap.used_heap_size,
        total_heap_size: heap.total_heap_size,
        total_available_size: heap.total_available_size,
        heap_size_limit: heap.heap_size_limit,
        malloced_memory: heap.malloced_memory,
        number_of_native_contexts: heap.number_of_native_contexts,
        number_of_detached_contexts: heap.number_of_detached_contexts,
      },
    };
  }

  @Web.post('gc')
  @Passport.public()
  async forceGc() {
    this._checkAccess();
    const session = new inspector.Session();
    session.connect();
    try {
      await this._postHeapProfiler(session, 'HeapProfiler.enable');
      await this._postHeapProfiler(session, 'HeapProfiler.collectGarbage');
    } finally {
      session.disconnect();
    }
    return await this.stats();
  }

  @Web.post('heapSnapshot')
  @Passport.public()
  async heapSnapshot() {
    this._checkAccess();
    const fileName = v8.writeHeapSnapshot(
      `/tmp/heapdump-${process.pid}-${Date.now()}.heapsnapshot`,
    );
    return { pid: process.pid, file: fileName };
  }

  private _postHeapProfiler(session: inspector.Session, method: string): Promise<void> {
    return new Promise<void>(function postHeapProfiler(resolve, reject) {
      session.post(method, function onPost(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  private _checkAccess() {
    const token = process.env[ENV_MEMORY_DIAG_TOKEN];
    if (!token) {
      if (!this.app.meta.isDev && !this.app.meta.isTest) {
        this.app.throw(403);
      }
      return;
    }

    const tokenHeader = this.ctx.get(HEADER_MEMORY_DIAG_TOKEN);
    if (tokenHeader !== token) {
      this.app.throw(403);
    }
  }
}
