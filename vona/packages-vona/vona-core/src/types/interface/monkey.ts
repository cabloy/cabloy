import type { IModule } from '@cabloy/module-info';

import type { Constructable } from '../../lib/decorator/type/constructable.ts';

export type TypeMonkeyName = keyof IMonkeyModule | keyof IMonkeySystem;

export interface IModuleMain {
  moduleLoading: () => Promise<void>;
  moduleLoaded: () => Promise<void>;
  configLoaded: (config: any) => Promise<void>;
}

export interface IMonkeyModule {
  moduleLoading: (module: IModule) => Promise<void>;
  moduleLoaded: (module: IModule) => Promise<void>;
  configLoaded: (module: IModule, config: any) => Promise<void>;
}

export interface IMonkeySystem
  extends IMonkeyAppStart, IMonkeyAppReady, IMonkeyAppStarted, IMonkeyAppClose, IMonkeyAppClosed {}

export interface IMonkeyAppStart {
  appStart: () => Promise<void>;
}

export interface IMonkeyAppReady {
  appReady: () => Promise<void>;
}

export interface IMonkeyAppStarted {
  appStarted: () => Promise<void>;
}

export interface IMonkeyAppClose {
  appClose: () => Promise<void>;
}

export interface IMonkeyAppClosed {
  appClosed: () => Promise<void>;
}

export type IAppMonkey = IMonkeyModule & IMonkeySystem;
export type AppMonkeyConstructable = Constructable<IAppMonkey>;
