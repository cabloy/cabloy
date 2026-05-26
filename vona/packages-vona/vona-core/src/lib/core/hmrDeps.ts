import type { Constructable } from '../decorator/type/constructable.ts';

import { BeanSimple } from '../bean/beanSimple.ts';
import { appResource } from './resource.ts';

export class AppHmrDeps extends BeanSimple {
  private _deps: Record<string, Set<string>> = {};
  private _depsTemp: Set<string> | undefined;

  get deps() {
    return this._deps;
  }

  addBeans<T extends Constructable[]>(classRefs: T) {
    for (const classRef of classRefs) {
      this.addBean(classRef);
    }
  }

  addBean<T>(classRef: Constructable<T>) {
    const beanOptions = appResource.getBean(classRef);
    if (beanOptions) {
      this.add(beanOptions.beanFullName);
    }
  }

  add(beanFullName: string) {
    if (!this._depsTemp) this._depsTemp = new Set();
    this._depsTemp.add(beanFullName);
  }

  end(beanFullName: string) {
    if (!this._depsTemp || this._depsTemp.size === 0) return;
    const depsTemp = this._depsTemp;
    this._depsTemp = undefined;
    for (const depTemp of depsTemp) {
      if (!this._deps[depTemp]) this._deps[depTemp] = new Set();
      this._deps[depTemp].add(beanFullName);
    }
  }
}

export const appHmrDeps = new AppHmrDeps();
