import type { Ref } from '@vue/reactivity';

import { isNil } from '@cabloy/utils';
import { customRef } from '@vue/reactivity';
import { camelize, EMPTY_OBJ, hasChanged, hyphenate } from '@vue/shared';
import { getCurrentInstance, watchSyncEffect } from 'vue';

import type { BeanBase } from '../bean/beanBase.ts';
import type { DefineModelOptions, ModelRef } from '../bean/type.ts';

export function useModel<
  M extends PropertyKey,
  T extends Record<string, any>,
  K extends keyof T,
  G = T[K],
  S = T[K],
>(
  this: BeanBase,
  props: T,
  name: K,
  options?: DefineModelOptions<T[K], G, S>,
): ModelRef<T[K], M, G, S>;
export function useModel(
  this: BeanBase,
  props: Record<string, any>,
  name: string,
  options: DefineModelOptions = EMPTY_OBJ,
): Ref {
  const i = getCurrentInstance();
  if (!i) {
    throw new Error('useModel() called without active instance.');
  }

  const propsDefault = Object.getPrototypeOf(this).constructor.$propsDefault;
  const propType = typeof propsDefault[name];

  const camelizedName = camelize(name);

  const modifiers = getModelModifiers(props, camelizedName);

  const res = customRef((track, trigger) => {
    let localValue: any;
    let prevSetValue: any = EMPTY_OBJ;
    let prevEmittedValue: any;

    watchSyncEffect(() => {
      const propValue = props[camelizedName];
      if (hasChanged(localValue, propValue)) {
        localValue = propValue;
        trigger();
      }
    });

    return {
      get() {
        track();
        return coerceValueType(propType, options.get ? options.get(localValue) : localValue);
      },

      set(value) {
        const emittedValue = coerceValueType(propType, options.set ? options.set(value) : value);
        if (
          !hasChanged(emittedValue, localValue) &&
          !(prevSetValue !== EMPTY_OBJ && hasChanged(value, prevSetValue))
        ) {
          return;
        }
        // local update
        localValue = value;
        trigger();
        // update
        const rawProps = i.vnode!.props;
        rawProps?.[`onUpdate:${name}`]?.(emittedValue);
        // #10279: if the local value is converted via a setter but the value
        // emitted to parent was the same, the parent will not trigger any
        // updates and there will be no prop sync. However the local input state
        // may be out of sync, so we need to force an update here.
        if (
          hasChanged(value, emittedValue) &&
          hasChanged(value, prevSetValue) &&
          !hasChanged(emittedValue, prevEmittedValue)
        ) {
          trigger();
        }
        prevSetValue = value;
        prevEmittedValue = emittedValue;
      },
    };
  });

  res[Symbol.iterator] = () => {
    let i = 0;
    return {
      next() {
        if (i < 2) {
          return { value: i++ ? modifiers || EMPTY_OBJ : res, done: false };
        } else {
          return { done: true };
        }
      },
    };
  };

  return res;
}

export function getModelModifiers(
  props: Record<string, any>,
  modelName: string,
): Record<string, boolean> | undefined {
  return modelName === 'modelValue' || modelName === 'model-value'
    ? props.modelModifiers
    : props[`${modelName}Modifiers`] ||
        props[`${camelize(modelName)}Modifiers`] ||
        props[`${hyphenate(modelName)}Modifiers`];
}

export function coerceValueType(type: string, value: any) {
  if (['undefined', 'null'].includes(type)) return value;
  if (isNil(value)) return value;
  if ((typeof value as any) === type) return value;
  let _value;
  if (type === 'number') {
    if (Number.isNaN(Number(value))) {
      _value = value;
    } else {
      _value = Number(value);
    }
  } else if (type === 'boolean') {
    _value = value === 'false' || value === '0' ? false : Boolean(value);
  } else if (type === 'string') {
    _value = String(value);
  } else {
    _value = value;
  }
  // ok
  return _value;
}
