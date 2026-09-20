import type { BeanBase, BeanContainer } from 'zova';

import assert from 'node:assert/strict';
import test from 'node:test';

import { pageHostKey } from '../../src/lib/const.js';
import { Monkey } from '../../src/monkey.js';

function createBean() {
  const lookups: string[] = [];
  let pageHost: object | undefined;
  const beanContainer = {
    defineProperty<T>(beanInstance: T, prop: string, attributes: PropertyDescriptor) {
      return Object.defineProperty(beanInstance, prop, attributes);
    },
    _getBeanFromHost<T>({ name }: { name: string }) {
      lookups.push(name);
      return pageHost as T | undefined;
    },
  } as unknown as BeanContainer;
  const beanInstance = {} as BeanBase;
  const monkey = new Monkey();

  return {
    beanInstance,
    beanContainer,
    lookups,
    monkey,
    setPageHost(value: object | undefined) {
      pageHost = value;
    },
  };
}

test('$pageHost reads the current page host from the bean host', async () => {
  const { beanInstance, beanContainer, lookups, monkey, setPageHost } = createBean();
  await monkey.beanInit(beanContainer, beanInstance);

  assert.equal(beanInstance.$pageHost, undefined);

  const firstPageHost = { active: true };
  setPageHost(firstPageHost);
  assert.equal(beanInstance.$pageHost, firstPageHost);

  const secondPageHost = { active: false };
  setPageHost(secondPageHost);
  assert.equal(beanInstance.$pageHost, secondPageHost);

  assert.deepEqual(lookups, [pageHostKey, pageHostKey, pageHostKey]);
  const descriptor = Object.getOwnPropertyDescriptor(beanInstance, '$pageHost');
  assert.equal(descriptor?.enumerable, false);
  assert.equal(descriptor?.configurable, true);
});
