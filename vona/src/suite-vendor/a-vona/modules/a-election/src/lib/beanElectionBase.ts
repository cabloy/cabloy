import { BeanBase, SymbolModuleBelong } from 'vona';

import type {
  IElectionElectOptions,
  TypeFunctionObtain,
  TypeFunctionRelease,
} from '../types/election.ts';

export class BeanElectionBase<TypeElectionObtainResource extends string> extends BeanBase {
  obtain(
    resource: TypeElectionObtainResource,
    fnObtain: TypeFunctionObtain,
    fnRelease: TypeFunctionRelease,
    options?: IElectionElectOptions,
  ): void {
    return this.$scope.election.service.election.obtain(
      this._prepareResource(resource),
      fnObtain,
      fnRelease,
      options,
    );
  }

  private _prepareResource(resource: string) {
    return `${this[SymbolModuleBelong]}.${resource}`;
  }
}
