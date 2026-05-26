import type { Constructable } from '../index.ts';
// import { ContainerScope } from '../index.ts';

export interface IBeanSceneRecord {}

export interface IDecoratorBeanOptionsBase<T = unknown, OPTIONS = unknown> {
  /**
   * global: equal to name
   * others: module.scene.name
   */
  beanFullName: string; // not use keyof IBeanRecord;
  module: string;
  scene: keyof IBeanSceneRecord;
  name: string;
  beanClass: Constructable<T>;
  // containerScope?: ContainerScope;
  virtual?: boolean;
  moduleBelong?: string;
  options?: OPTIONS;
  optionsPrimitive?: boolean;
  file?: string;
}

export interface IDecoratorBeanInfoOptions {
  module: string;
}
