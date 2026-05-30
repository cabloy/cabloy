import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

const tableNameFail = '__tempTransactionFail';
const tableNameSuccess = '__tempTransactionSuccess';
export interface IControllerOptionsTransaction extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsTransaction>({ path: 'transaction', meta: { mode: 'test' } })
@Api.exclude()
export class ControllerTransaction extends BeanBase {
  @Web.post('fail')
  @Core.transaction()
  @Passport.public()
  async fail(@Arg.body() item: object) {
    await this.bean.model.update(`${tableNameFail}` as any, item);
    await this.bean.model.update(`${tableNameFail}error` as any, item);
  }

  @Web.post('success')
  @Core.transaction()
  @Passport.public()
  async success(@Arg.body() item: object) {
    await this.bean.model.update(tableNameSuccess as any, item);
  }
}
