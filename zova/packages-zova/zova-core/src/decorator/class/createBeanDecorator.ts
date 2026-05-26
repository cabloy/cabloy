import type { IBeanSceneRecord } from '../interface/beanOptions.ts';
import type { Constructable } from '../type/constructable.ts';
import type { ContainerScope } from '../type/containerScope.ts';

import { appResource } from '../../core/sys/resource.ts';

export function createBeanDecorator<T>(
  scene: keyof IBeanSceneRecord,
  containerScope?: ContainerScope,
  markReactive?: boolean,
  options?: T,
  optionsPrimitive?: boolean,
  fn?: (target: Constructable) => void,
): ClassDecorator {
  return function (target) {
    // name
    const name = scene === 'scope' ? 'module' : undefined;
    // add
    appResource.addBean({
      scene,
      name,
      containerScope,
      markReactive,
      beanClass: target as unknown as Constructable,
      options,
      optionsPrimitive,
    });
    // fn
    fn && fn(target as unknown as Constructable);
  };
}
