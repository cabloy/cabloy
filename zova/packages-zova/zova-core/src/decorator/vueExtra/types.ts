import type { WatchOptions } from '@cabloy/vue-reactivity';
import type { WatchEffectOptions } from '@cabloy/vue-runtime-core';

export const SymbolDecoratorVueElements = Symbol('SymbolDecoratorVueElements');

export type TypeDecoratorVue =
  | 'computed'
  | 'emit'
  | 'watch'
  | 'watchEffect'
  | 'raw'
  | 'shallow'
  | 'readonly'
  | 'shallowReadonly'
  | 'model'
  | 'controllerCreated'
  | 'controllerMounted';

export interface IDecoratorVueElement<OPTIONS = any> {
  type: TypeDecoratorVue;
  descriptor: PropertyDescriptor;
  options?: OPTIONS;
}

export interface IDecoratorVueEmitOptions {
  eventName?: string;
}

export interface IDecoratorVueWatchOptions {
  path?: string;
  watchOptions?: WatchOptions;
}

export interface IDecoratorVueWatchEffectOptions {
  watchEffectOptions?: WatchEffectOptions;
}

export interface IDecoratorVueModelOptions {
  modelName?: string;
}
