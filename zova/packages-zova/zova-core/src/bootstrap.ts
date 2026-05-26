import type { App } from 'vue';

import { PluginFreeze } from 'vue-plugin-render-freeze';

import type { PluginZovaOptions } from './types/interface/pluginZova.ts';

import { sys } from './core/sys/sys.ts';
import { PluginBean } from './plugins/bean.ts';

export async function bootstrap(app: App, options: PluginZovaOptions) {
  await sys.initialize(options);
  app.use(PluginBean);
  app.use(PluginFreeze);
}
