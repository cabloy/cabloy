import type { EnvironmentModuleNode, Plugin } from 'vite';

export function hmrPlugin(_config: any) {
  const plugin: Plugin = {
    name: 'zova:hmr',
    apply: 'serve',
    hotUpdate({ modules, timestamp }) {
      // Invalidate modules manually
      const invalidatedModules = new Set<EnvironmentModuleNode>();
      for (const mod of modules) {
        this.environment.moduleGraph.invalidateModule(mod, invalidatedModules, timestamp, true);
      }
      this.environment.hot.send({ type: 'full-reload' });
      return [];
    },
  };
  return plugin;
}
