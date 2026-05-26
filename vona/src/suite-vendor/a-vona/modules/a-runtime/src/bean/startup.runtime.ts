import type { IStartupExecute } from 'vona-module-a-startup';

import path from 'node:path';
import { BeanBase, getRuntimePathPhysicalRoot, instanceDesp, saveJSONFile } from 'vona';
import { Startup } from 'vona-module-a-startup';

import type { IMetaRuntimeExecute } from '../types/runtime.ts';

@Startup({
  instance: true,
  debounce: true,
  after: true,
})
export class StartupRuntime extends BeanBase implements IStartupExecute {
  async execute() {
    const runtime = await this._collectRuntime();
    const runtimeDir = getRuntimePathPhysicalRoot(this.app);
    const runtimeFile = path.join(runtimeDir, `${instanceDesp(this.ctx.instanceName)}.json`);
    await saveJSONFile(runtimeFile, runtime);
  }

  async _collectRuntime() {
    //
    const runtime = {};
    const onions = this.bean.onion.meta.getOnionsEnabledOfMeta(true, 'runtime');
    for (const onion of onions) {
      const beanInstance = this.bean._getBean<IMetaRuntimeExecute>(
        onion.beanOptions.beanFullName as any,
      );
      const res = await beanInstance.execute();
      if (!res) continue;
      const moduleName = onion.beanOptions.module;
      runtime[moduleName] = res;
    }
    return runtime;
  }
}
