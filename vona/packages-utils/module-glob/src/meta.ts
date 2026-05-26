import type { TypeProjectMode } from '@cabloy/module-info';

import type { IModuleGlobPathMetaItem, IModuleGlobPathsMeta } from './interface.ts';

const __pathSuites: IModuleGlobPathMetaItem[] = [
  {
    prefix: 'src/suite/',
    vendor: false,
  },
  {
    prefix: 'src/suite-vendor/',
    vendor: true,
  },
];

const __pathsModules: IModuleGlobPathMetaItem[] = [
  {
    prefix: 'src/module/',
    vendor: false,
  },
  {
    prefix: 'src/suite/*/modules/',
    vendor: false,
  },
  {
    prefix: 'src/module-vendor/',
    vendor: true,
  },
  {
    prefix: 'src/suite-vendor/*/modules/',
    vendor: true,
  },
];

export function getPathsMeta(projectMode: TypeProjectMode): IModuleGlobPathsMeta {
  let brand;
  let mode;
  if (['zova', 'vona'].includes(projectMode)) {
    brand = projectMode;
    mode = '';
  } else {
    brand = 'cabloy';
    mode = `-${projectMode}`;
  }
  const suites = __pathSuites.concat([
    {
      prefix: `node_modules/${brand}-suite${mode}-`,
      vendor: true,
      node_modules: true,
    },
  ]);
  const modules = __pathsModules.concat([
    {
      prefix: `node_modules/${brand}-module${mode}-`,
      vendor: true,
      node_modules: true,
    },
  ]);
  const pathsMeta = {
    suites,
    modules,
  };
  return pathsMeta;
}
