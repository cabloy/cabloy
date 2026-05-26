import type { IBeanSceneRecord } from '../interface/beanOptions.ts';
import type { Constructable } from '../type/constructable.ts';

import { appHmrDeps } from '../../core/hmrDeps.ts';
import { appResource } from '../../core/resource.ts';
import { parseModuleFile, parseModuleName } from './util.ts';

export function createBeanDecorator<T>(
  scene: keyof IBeanSceneRecord,
  options?: T,
  optionsPrimitive?: boolean,
  fn?: (target: Constructable) => void,
): ClassDecorator {
  return function (target) {
    const beanClass = target as unknown as Constructable;
    // module
    const module = parseModuleName(beanClass);
    const file = process.env.META_MODE !== 'prod' ? parseModuleFile() : undefined;
    // name
    const name = scene === 'scope' ? 'module' : undefined;
    // add
    const beanOptions = appResource.addBean({
      module,
      scene,
      name,
      beanClass,
      options,
      optionsPrimitive,
      file,
    });
    // fn
    fn?.(beanClass);
    appHmrDeps.end(beanOptions.beanFullName);
  };
}
