import type { IModule, ISuite, TypeProjectMode } from '@cabloy/module-info';

export interface IModuleGlobOptions {
  projectMode: TypeProjectMode;
  projectPath: string;
  disabledModules?: string[] | string;
  disabledSuites?: string[] | string;
  log?: boolean;
  check?: boolean;
  meta?: {};
  disableCheckDependencies?: boolean;
}

export interface IModuleGlobContext {
  options: IModuleGlobOptions;
  suites: Record<string, ISuite>;
  modules: Record<string, IModule>;
  modulesArray: IModule[];
  modulesLast: IModule[];
  //
  modulesLocal: Record<string, IModule>;
  modulesGlobal: Record<string, IModule>;
  modulesMonkey: Record<string, IModule>;
  modulesSync: Record<string, IModule>;
  modulesIcon: Record<string, IModule>;
  //
  suitesLocal: Record<string, ISuite>;
  suitesVendor: Record<string, ISuite>;
  //
  disabledModules: Record<string, boolean>;
  disabledSuites: Record<string, boolean>;
  meta?: {};
  //
  pathsMeta: IModuleGlobPathsMeta;
}

export interface IModuleGlobPathMetaItem {
  prefix: string;
  vendor: boolean;
  node_modules?: boolean;
}

export interface IModuleGlobPathsMeta {
  suites: IModuleGlobPathMetaItem[];
  modules: IModuleGlobPathMetaItem[];
}
