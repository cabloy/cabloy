import type { Logger } from '@cabloy/logger';
import type { CustomRefFactory, ReactiveMarker, Ref, UnwrapRef } from '@vue/reactivity';
import type {
  ComputedGetter,
  DebuggerOptions,
  MultiWatchSources,
  RendererNode,
  WatchCallback,
  WatchEffect,
  WatchEffectOptions,
  WatchHandle,
  WatchOptions,
  WatchSource,
  WritableComputedOptions,
} from 'vue';

import {
  computed,
  customRef,
  toRef,
  watch,
  watchEffect,
  watchPostEffect,
  watchSyncEffect,
} from 'vue';

import type { AppEvent } from '../core/component/event.ts';
import type { ILoggerChildRecord, ILoggerClientRecord } from '../core/logger/types.ts';
import type { FunctionAsync } from '../decorator/type/functionable.ts';
import type { MapSources, MaybeUndefined } from '../vueExtra/watch.ts';
import type {
  IErrorHandlerEventResult,
  IModuleLocaleText,
  IZovaComponentRecord,
} from './resource/index.ts';

import { cast } from '../types/utils/cast.ts';
import { BeanBaseSimple, SymbolModuleBelong } from './beanBaseSimple.ts';
import { SymbolErrorInstanceInfo } from './resource/index.ts';

const SymbolText = Symbol('SymbolText');
const SymbolLogger = Symbol('SymbolLogger');
const SymbolLoggerChildren = Symbol('SymbolLoggerChildren');

export class BeanBase extends BeanBaseSimple {
  private [SymbolText]: IModuleLocaleText;
  private [SymbolLogger]: Record<keyof ILoggerClientRecord, Logger> = {} as any;
  private [SymbolLoggerChildren]: Record<keyof ILoggerClientRecord, Record<string, Logger>> =
    {} as any;

  protected get $el(): RendererNode {
    if (!this.ctx) {
      throw new Error('$el can not be used inside global bean.');
    }
    return this.ctx.meta.el;
  }

  protected get $text(): IModuleLocaleText {
    if (!this[SymbolText]) {
      this[SymbolText] = this.app.meta.locale.createLocaleText(this[SymbolModuleBelong]);
    }
    return this[SymbolText];
  }

  protected get $logger() {
    return this.$loggerClient('default');
  }

  protected $loggerClient(clientName: keyof ILoggerClientRecord) {
    if (!this[SymbolLogger][clientName]) {
      this[SymbolLogger][clientName] = this.sys.meta.logger
        .get(clientName)
        .child({ beanFullName: this.$beanFullName });
    }
    return this[SymbolLogger][clientName];
  }

  protected $loggerChild(
    childName: keyof ILoggerChildRecord,
    clientName: keyof ILoggerClientRecord = 'default',
  ) {
    if (!this[SymbolLoggerChildren][clientName])
      this[SymbolLoggerChildren][clientName] = {} as never;
    if (!this[SymbolLoggerChildren][clientName][childName]) {
      this[SymbolLoggerChildren][clientName][childName] = this.sys.meta.logger
        .get(clientName)
        .child({
          beanFullName: this.$beanFullName,
          name: childName,
        });
    }
    return this[SymbolLoggerChildren][clientName][childName];
  }

  protected get $event(): AppEvent {
    return this.app.meta.event;
  }

  // need not
  // protected async __init__() {}
  // protected __dispose__() {}

  public get scope(): unknown {
    return this.bean.scope(this[SymbolModuleBelong] as never);
  }

  protected $renderFreeze(freeze: boolean) {
    return cast(this.ctx.instance).ctx.renderFreeze(freeze);
  }

  protected async $renderFreezeScope<RESULT>(
    fn: FunctionAsync<RESULT>,
  ): Promise<RESULT | undefined> {
    if (this.ctx.disposed) return;
    return await cast(this.ctx.instance).ctx.renderFreezeScope(fn);
  }

  protected $errorHandler(err: unknown, info?: string): IErrorHandlerEventResult {
    if (err instanceof Error && err[SymbolErrorInstanceInfo]) {
      delete err[SymbolErrorInstanceInfo];
    }
    return this.app?.vue.config.errorHandler!(
      err,
      this.ctx.instance as any,
      info!,
    ) as unknown as IErrorHandlerEventResult;
  }

  protected $computed<T>(getter: ComputedGetter<T>, debugOptions?: DebuggerOptions): T;
  protected $computed<T>(options: WritableComputedOptions<T>, debugOptions?: DebuggerOptions): T;
  protected $computed(options, debugOptions) {
    return this.ctx.util.instanceScope(() => {
      return computed(options, debugOptions);
    });
  }

  protected $composable(fn: Function): any {
    return this.ctx.util.instanceScope(() => {
      return fn();
    });
  }

  protected $watchEffect(effect: WatchEffect, options?: WatchEffectOptions): WatchHandle {
    return this.ctx.util.instanceScope(() => {
      return watchEffect(effect, options);
    });
  }

  protected $watchPostEffect(effect: WatchEffect, options?: DebuggerOptions): WatchHandle {
    return this.ctx.util.instanceScope(() => {
      return watchPostEffect(effect, options);
    });
  }

  protected $watchSyncEffect(effect: WatchEffect, options?: DebuggerOptions): WatchHandle {
    return this.ctx.util.instanceScope(() => {
      return watchSyncEffect(effect, options);
    });
  }

  protected $watch<T, Immediate extends Readonly<boolean> = false>(
    source: WatchSource<T>,
    cb: WatchCallback<T, MaybeUndefined<T, Immediate>>,
    options?: WatchOptions<Immediate>,
  ): WatchHandle;
  protected $watch<
    T extends Readonly<MultiWatchSources>,
    Immediate extends Readonly<boolean> = false,
  >(
    sources: readonly [...T] | T,
    cb: [T] extends [ReactiveMarker]
      ? WatchCallback<T, MaybeUndefined<T, Immediate>>
      : WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
    options?: WatchOptions<Immediate>,
  ): WatchHandle;
  protected $watch<T extends MultiWatchSources, Immediate extends Readonly<boolean> = false>(
    sources: [...T],
    cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
    options?: WatchOptions<Immediate>,
  ): WatchHandle;
  protected $watch<T extends object, Immediate extends Readonly<boolean> = false>(
    source: T,
    cb: WatchCallback<T, MaybeUndefined<T, Immediate>>,
    options?: WatchOptions<Immediate>,
  ): WatchHandle {
    return this.ctx.util.instanceScope(() => {
      return watch(source, cb, options);
    });
  }

  protected $controllerCreated(fn: any) {
    return this.ctx.util.instanceScope(() => {
      return this.ctx.meta.hooks.onCreated(fn);
    });
  }

  protected $controllerMounted(fn: any) {
    return this.ctx.util.instanceScope(() => {
      return this.ctx.meta.hooks.onMounted(fn);
    });
  }

  protected $customRef<T>(factory: CustomRefFactory<T>): T {
    return customRef(factory) as T;
  }

  protected $toRef<T>(
    value: T,
  ): T extends () => infer R ? R : T extends Ref ? UnwrapRef<T> : UnwrapRef<T>;
  protected $toRef<T extends object, K extends keyof T>(object: T, key: K): T[K];
  protected $toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue: T[K],
  ): Exclude<T[K], undefined>;
  protected $toRef(object, key?, defaultValue?) {
    return toRef(object, key, defaultValue);
  }

  protected $zovaComponent<K extends keyof IZovaComponentRecord>(
    componentName: K,
  ): IZovaComponentRecord[K];
  protected $zovaComponent(module: string, name: string);
  protected $zovaComponent(module: string, name?: string) {
    return this.sys.meta.component.getZovaComponent(module, name!);
  }

  // need not
  // public dispose() {
  //   const self = cast(this);
  //   if (self.__dispose__) {
  //     self.__dispose__();
  //   }
  // }
}
