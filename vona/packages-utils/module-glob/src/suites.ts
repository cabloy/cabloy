import type { IModule, ISuite } from '@cabloy/module-info';

const __suite_pattern1 = /src\/suite\/([^/]+)\/modules/;
const __suite_pattern2 = /src\/suite-vendor\/([^/]+)\/modules/;

export function bindSuitesModules(
  suites: Record<string, ISuite>,
  modules: Record<string, IModule>,
) {
  for (const moduleName in modules) {
    const module = modules[moduleName];
    // check
    const root = module.root.replace(/\\/g, '/');
    let res = root.match(__suite_pattern1);
    if (!res) {
      res = root.match(__suite_pattern2);
    }
    if (!res) continue;
    // suiteName
    const suiteName = res[1];
    const suite = suites[suiteName];
    if (!suite) {
      // means disabled
      delete modules[moduleName];
    } else {
      // bind
      module.suite = suiteName;
      suite.modules.push(moduleName);
    }
  }
}
