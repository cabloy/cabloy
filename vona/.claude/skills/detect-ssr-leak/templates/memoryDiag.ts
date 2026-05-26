// ControllerMemoryDiag - Temporary diagnostic controller for SSR memory leak detection
// Add this to an existing module's controller directory (e.g., a-play/src/controller/)
// REMOVE after debugging - this is a diagnostic tool, not production code

import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import inspector from 'node:inspector';
import v8 from 'node:v8';
import { BeanBase } from 'vona';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsMemoryDiag extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsMemoryDiag>('memoryDiag')
export class ControllerMemoryDiag extends BeanBase {
  @Web.get('stats')
  @Passport.public()
  async stats() {
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
    const session = new inspector.Session();
    session.connect();
    await new Promise<void>((resolve, reject) => {
      session.post('HeapProfiler.enable', err => (err ? reject(err) : resolve()));
    });
    await new Promise<void>((resolve, reject) => {
      session.post('HeapProfiler.collectGarbage', err => (err ? reject(err) : resolve()));
    });
    session.disconnect();
    return await this.stats();
  }

  @Web.get('heapSnapshot')
  @Passport.public()
  async heapSnapshot() {
    const fileName = v8.writeHeapSnapshot(
      `/tmp/heapdump-${process.pid}-${Date.now()}.heapsnapshot`,
    );
    return { pid: process.pid, file: fileName };
  }
}
