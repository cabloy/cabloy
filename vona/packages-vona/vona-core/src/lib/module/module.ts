import type { IModule } from '@cabloy/module-info';

import { BeanSimple } from '../bean/beanSimple.ts';

export class ModuleTools extends BeanSimple {
  async prepare(): Promise<Record<string, IModule>> {
    const app = this.app;
    const modulesMeta = await app.options.modulesMeta();
    const modules = modulesMeta.modulesMeta.modules;
    const modulesArray = modulesMeta.modulesMeta.moduleNames.map(
      relativeName => modules[relativeName],
    );
    app.meta.modules = modules;
    app.meta.modulesArray = modulesArray;
    app.meta.modulesMonkey = [];
    return modules;
  }

  async load() {
    const app = this.app;
    // main / monkey
    for (const module of app.meta.modulesArray) {
      if (module.resource.Main) {
        module.mainInstance = app.bean._newBean(module.resource.Main, module);
      }
      if (module.resource.Monkey) {
        module.monkeyInstance = app.bean._newBean(module.resource.Monkey, module);
        app.meta.modulesMonkey.push(module);
      }
    }
  }

  async monkey(order: boolean, monkeyName) {
    const app = this.app;
    for (const module of app.meta.modulesArray) {
      await app.util.monkeyModule(
        app.meta.appMonkey,
        app.meta.modulesMonkey,
        order,
        monkeyName,
        module,
      );
    }
  }
}
