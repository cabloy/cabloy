import assert from 'node:assert/strict';
import test from 'node:test';
import { isReactive, reactive, toRaw } from 'vue';

import { BeanContainer } from '../src/bean/beanContainer.ts';
import { appResource } from '../src/core/sys/resource.ts';

const beanFullName = 'test-reactive-boundary.model.resource';

class DemoResource {
  private _value = 1;

  get value() {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
  }

  compute(increment: number) {
    return this._value + increment;
  }
}

const aop = {
  __get_value__(next: () => number) {
    return next() + 10;
  },
  __set_value__(value: number, next: (value: number) => unknown) {
    next(value + 1);
    return true;
  },
  compute(args: [number], next: (args: [number]) => number) {
    return next(args) + 100;
  },
};

function createSys() {
  return {
    bean: {
      async _getBean(name: string) {
        if (name === 'a-bean.service.aop') {
          return {
            async findAopsMatched() {
              return [{ beanFullName: 'test-reactive-boundary.aop.demo' }];
            },
            async findAopMethodsMatched() {
              return undefined;
            },
          };
        }
        if (name === 'test-reactive-boundary.aop.demo') return aop;
        throw new Error(`Unexpected bean lookup: ${name}`);
      },
    },
    meta: {
      module: {
        async use() {},
        async _monkeyModule() {},
      },
    },
  } as any;
}

function createSelectorFixture() {
  const previous = appResource.beans[beanFullName];
  appResource.beans[beanFullName] = {
    beanFullName,
    beanClass: DemoResource,
    module: 'test-reactive-boundary',
    scene: 'model',
    name: 'resource',
    markReactive: true,
  } as any;
  const sys = createSys();
  const container = BeanContainer.create(sys, null!, null);
  return {
    container,
    dispose() {
      if (previous) appResource.beans[beanFullName] = previous;
      else delete appResource.beans[beanFullName];
    },
  };
}

async function selector() {
  const fixture = createSelectorFixture();
  try {
    return await fixture.container._getBeanSelector<any>(beanFullName, true, 'student');
  } finally {
    fixture.dispose();
  }
}

test('selector identity is stable and its reactive Bean retains method/getter/setter interception', async () => {
  const fixture = createSelectorFixture();
  try {
    const first: any = await fixture.container._getBeanSelector<any>(beanFullName, true, 'student');
    const second: any = await fixture.container._getBeanSelector<any>(
      beanFullName,
      true,
      'student',
    );

    assert.equal(first, second);
    assert.equal(isReactive(first), true);
    assert.equal(first.compute(2), 103);
    assert.equal(first.value, 11);
    first.value = 4;
    assert.equal(first.value, 15);
  } finally {
    fixture.dispose();
  }
});

test('a getter-owned injection retains the selector proxy through a deep reactive owner', async () => {
  const resource: any = await selector();
  const rawOwner: { nested: { resource?: unknown } } = { nested: {} };
  Object.defineProperty(rawOwner.nested, 'resource', {
    configurable: true,
    enumerable: false,
    get: () => resource,
  });
  const owner = reactive(rawOwner);

  assert.equal(owner.nested.resource, resource);
  assert.equal((owner.nested.resource as any).compute(2), 103);
  assert.equal(toRaw(owner.nested.resource), toRaw(resource));
});

test('ordinary deep reactive assignment preserves the AOP proxy', async () => {
  const resource: any = await selector();
  const owner = reactive({ nested: {} as { resource?: unknown } });
  owner.nested.resource = resource;

  assert.equal(owner.nested.resource, resource);
  assert.equal(isReactive(owner.nested.resource), true);
  assert.equal((owner.nested.resource as any).compute(2), 103);
  assert.equal((owner.nested.resource as any).value, 11);
  owner.nested.resource.value = 4;
  assert.equal((owner.nested.resource as any).value, 15);
  assert.equal(toRaw(owner.nested.resource), toRaw(resource));
});
