import type { EntityDatasource } from 'vona-module-a-datasource';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

@Bean()
export class BeanDatasource extends BeanBase {
  async getDb(datasource: Partial<Pick<EntityDatasource, 'id' | 'name'>>) {
    const where: Partial<EntityDatasource> = {};
    if (datasource.id) where.id = datasource.id;
    if (datasource.name) where.name = datasource.name;
    const entityDatasource = await this.scope.model.datasource.get(where);
    if (!entityDatasource)
      throw new Error(`datasource not found: ${datasource.name || datasource.id}`);
    // client
    const clientName = this._getDynamicClientName(entityDatasource.id) as any;
    return this.bean.database.getDb(clientName, entityDatasource.config);
  }

  async create(datasource: Partial<EntityDatasource>): Promise<EntityDatasource> {
    return await this.scope.model.datasource.insert(datasource);
  }

  async update(datasource: Partial<EntityDatasource>) {
    // update
    await this.scope.model.datasource.update(datasource);
    // reload clients
    if (datasource.id && datasource.config) {
      const clientName = this._getDynamicClientName(datasource.id) as any;
      await this.$scope.orm.service.database.reloadClients(clientName, datasource.config);
    }
  }

  async remove(id: number) {
    // delete
    await this.scope.model.datasource.delete({ id });
    // dispose clients
    const clientName = this._getDynamicClientName(id) as any;
    await this.$scope.orm.service.database.disposeClients(clientName);
  }

  private _getDynamicClientName(id: number) {
    return `dynamic_${id}`;
  }
}
