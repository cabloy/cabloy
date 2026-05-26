import type { Next, NextSync } from 'vona';
import type { IAopMethodExecute, IDecoratorAopMethodOptions } from 'vona-module-a-aspect';

import { BeanAopMethodBase } from 'vona';
import { AopMethod } from 'vona-module-a-aspect';

import type { ITransactionOptions } from '../types/transaction.ts';

export interface IAopMethodOptionsTransaction
  extends IDecoratorAopMethodOptions, ITransactionOptions {}

@AopMethod<IAopMethodOptionsTransaction>()
export class AopMethodTransaction extends BeanAopMethodBase implements IAopMethodExecute {
  execute(
    options: IAopMethodOptionsTransaction,
    _args: [],
    next: Next | NextSync,
    _receiver: any,
    _prop: string,
  ): Promise<any> | any {
    return this.bean.database.current.transaction.begin(() => {
      return next();
    }, options);
  }
}
