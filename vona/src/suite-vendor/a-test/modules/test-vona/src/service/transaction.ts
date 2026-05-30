import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

const tableNameFail = '__tempTransactionFail';
const tableNameSuccess = '__tempTransactionSuccess';

@Service()
export class ServiceTransaction extends BeanBase {
  @Core.transaction()
  async fail(item: object) {
    await this.bean.model.update(`${tableNameFail}` as any, item);
    await this.bean.model.update(`${tableNameFail}error` as any, item);
  }

  @Core.transaction()
  async success(item: object) {
    await this.bean.model.update(tableNameSuccess as any, item);
  }
}
