import type { IModule } from '@cabloy/module-info';
import type { BeanBase, BeanContainer } from 'zova';

import assert from 'node:assert/strict';
import test from 'node:test';

import type { IRoutedDialogContext } from '../../src/types/appModal.js';

import { Monkey } from '../../src/monkey.js';
import { routedDialogContextKey } from '../../src/types/appModal.js';

function createBean() {
  const lookups: string[] = [];
  let context: IRoutedDialogContext | undefined;
  const beanContainer = {
    defineProperty<T>(beanInstance: T, prop: string, attributes: PropertyDescriptor) {
      return Object.defineProperty(beanInstance, prop, attributes);
    },
    _getBeanFromHost<T>({ name }: { name: string }) {
      lookups.push(name);
      return context as T | undefined;
    },
  } as unknown as BeanContainer;
  const beanInstance = {} as BeanBase;
  const monkey = new Monkey({} as IModule);

  return {
    beanInstance,
    beanContainer,
    lookups,
    monkey,
    setContext(value: IRoutedDialogContext | undefined) {
      context = value;
    },
  };
}

test('routed dialog bean property always reads the current host context', async () => {
  const { beanInstance, beanContainer, lookups, monkey, setContext } = createBean();
  await monkey.beanInit(beanContainer, beanInstance);

  assert.equal(beanInstance.$routedDialog, undefined);

  const firstContext = {} as IRoutedDialogContext;
  setContext(firstContext);
  assert.equal(beanInstance.$routedDialog, firstContext);

  const secondContext = {} as IRoutedDialogContext;
  setContext(secondContext);
  assert.equal(beanInstance.$routedDialog, secondContext);

  setContext(undefined);
  assert.equal(beanInstance.$routedDialog, undefined);
  assert.deepEqual(lookups, [
    routedDialogContextKey,
    routedDialogContextKey,
    routedDialogContextKey,
    routedDialogContextKey,
  ]);
});
