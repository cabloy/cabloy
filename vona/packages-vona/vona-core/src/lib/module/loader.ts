import { BeanSimple } from '../bean/beanSimple.ts';
import loadConfig from './config.ts';
import loadConstants from './constant.ts';
import loadErrors from './errors.ts';
import loadLocales from './locales.ts';
import { ModuleTools } from './module.ts';

export class ModuleLoader extends BeanSimple {
  async execute() {
    const app = this.app;
    // modules
    const moduleTools = app.bean._newBean(ModuleTools);
    // prepare
    const modules = await moduleTools.prepare();
    // load modules
    await moduleTools.load();
    // monkey modules
    await moduleTools.monkey(true, 'moduleLoading');

    await loadConfig(app, modules);
    await loadLocales(app, modules);
    loadErrors(app, modules);
    loadConstants(app, modules);

    // monkey modules
    await moduleTools.monkey(true, 'moduleLoaded');
  }
}
