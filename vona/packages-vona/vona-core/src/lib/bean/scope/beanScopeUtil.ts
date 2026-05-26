import { BeanSimple } from '../beanSimple.ts';

const BeanModuleScope = Symbol('BeanScopeScene#ModuleScope');

export class BeanScopeUtil extends BeanSimple {
  private [BeanModuleScope]: string;

  constructor(moduleScope) {
    super();
    this[BeanModuleScope] = moduleScope;
  }

  combineApiPath(path: string | undefined, prefix?: string | boolean, simplify?: boolean) {
    return this.app.util.combineApiPath(path, this[BeanModuleScope], prefix, simplify);
  }

  combineResourceName(
    resourceName: string | undefined,
    simplify?: boolean,
    simplifyProviderId?: boolean,
  ): string {
    return this.app.util.combineResourceName(
      resourceName,
      this[BeanModuleScope],
      simplify,
      simplifyProviderId,
    );
  }

  combineStaticPath(path: string | undefined) {
    return this.app.util.combineStaticPath(path, this[BeanModuleScope]);
  }
}
