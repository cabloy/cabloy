import type { IModule } from '@cabloy/module-info';

import type { BeanBase } from '../../bean/beanBase.ts';
import type { BeanContainer } from '../../bean/beanContainer.ts';
import type { IControllerData } from '../../bean/type.ts';
import type { ZovaApplication } from '../../core/app/application.ts';
import type { ZovaContext } from '../../core/context/context.ts';

export type TypeMonkeyName =
  | keyof IMonkeyModuleSys
  | keyof IMonkeySys
  | keyof IMonkeyApp
  | keyof IMonkeyController;

export interface IModuleMain {
  moduleLoading(): Promise<void>;
  moduleLoaded(): Promise<void>;
}

export interface IModuleMainSys {
  moduleLoading(): Promise<void>;
  moduleLoaded(): Promise<void>;
  configLoaded(config: any): Promise<void>;
}

export interface IMonkeyModule {
  moduleLoading(module: IModule): Promise<void>;
  moduleLoaded(module: IModule): Promise<void>;
}

export interface IMonkeyModuleSys {
  moduleLoading(module: IModule): Promise<void>;
  moduleLoaded(module: IModule): Promise<void>;
  configLoaded(module: IModule, config: any): Promise<void>;
}

export interface IMonkeySys
  extends
    IMonkeySysApplicationInitialize,
    IMonkeySysContextInitialize,
    IMonkeySysInitialize,
    IMonkeySysInitialized,
    IMonkeySysReady,
    IMonkeySysClose,
    IMonkeyBeanInit,
    IMonkeyBeanInited,
    IMonkeyBeanDispose,
    IMonkeyBeanDisposed {}

export interface IMonkeyApp
  extends
    IMonkeyAppContextInitialize,
    IMonkeyAppInitialize,
    IMonkeyAppInitialized,
    IMonkeyAppReady,
    IMonkeyAppClose,
    IMonkeyBeanInit,
    IMonkeyBeanInited,
    IMonkeyBeanDispose,
    IMonkeyBeanDisposed {}

export interface IMonkeyController {
  controllerDataPrepare(controllerData: IControllerData, ctx: ZovaContext): void;
  controllerDataInit(controllerData: IControllerData, controller: BeanBase): void;
  controllerDataUpdate(controller: BeanBase): void;
}

export interface IMonkeySysApplicationInitialize {
  sysApplicationInitialize(app: ZovaApplication): void;
}

export interface IMonkeySysContextInitialize {
  sysContextInitialize(ctx: ZovaContext): void;
}

export interface IMonkeySysInitialize {
  sysInitialize(): Promise<void>;
}

export interface IMonkeySysInitialized {
  sysInitialized(): Promise<void>;
}

export interface IMonkeySysReady {
  sysReady(): Promise<void>;
}

export interface IMonkeySysClose {
  sysClose(): void;
}

export interface IMonkeyAppContextInitialize {
  appContextInitialize(ctx: ZovaContext): void;
}

export interface IMonkeyAppInitialize {
  appInitialize(): Promise<void>;
}

export interface IMonkeyAppInitialized {
  appInitialized(): Promise<void>;
}

export interface IMonkeyAppReady {
  appReady(): Promise<void>;
}

export interface IMonkeyAppClose {
  appClose(): void;
}

export interface IMonkeyBeanInit {
  beanInit(bean: BeanContainer, beanInstance: BeanBase): Promise<void>;
}

export interface IMonkeyBeanInited {
  beanInited(bean: BeanContainer, beanInstance: BeanBase): Promise<void>;
}

export interface IMonkeyBeanDispose {
  beanDispose(bean: BeanContainer, beanInstance: BeanBase): void;
}

export interface IMonkeyBeanDisposed {
  beanDisposed(bean: BeanContainer, beanInstance: BeanBase): void;
}
