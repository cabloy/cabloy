import type { TableIdentity } from 'table-identity';
import type { IQueryParams, TypeModelColumns } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoAddressMineCreate } from '../dto/addressMineCreate.tsx';
import type { DtoAddressMineRes } from '../dto/addressMineRes.tsx';
import type { DtoAddressMineUpdate } from '../dto/addressMineUpdate.tsx';
import type { DtoAddressMineView } from '../dto/addressMineView.tsx';
import type { DtoAddressSelectRes } from '../dto/addressSelectRes.tsx';
import type { DtoAddressView } from '../dto/addressView.tsx';
import type { EntityAddress } from '../entity/address.tsx';
import type { ModelAddress } from '../model/address.ts';

const addressColumns: TypeModelColumns<EntityAddress> = [
  'id',
  'recipientName',
  'phone',
  'countryCode',
  'region',
  'city',
  'postalCode',
  'addressLine1',
  'addressLine2',
  'createdAt',
  'updatedAt',
];

@Service()
export class ServiceAddress extends BeanBase {
  async select(params?: IQueryParams<ModelAddress>): Promise<DtoAddressSelectRes> {
    return await this.scope.model.address.selectAndCount({
      ...params,
      orders: params?.orders ?? [['id', 'asc']],
    });
  }

  async view(id: TableIdentity): Promise<DtoAddressView | undefined> {
    return await this.scope.model.address.getById(id);
  }

  async mine(params?: IQueryParams<ModelAddress>): Promise<DtoAddressMineRes> {
    return await this.scope.model.address.selectAndCount({
      ...params,
      columns: addressColumns,
      where: { ...params?.where, userId: this._getCurrentUserId() },
      orders: params?.orders ?? [['id', 'asc']],
    });
  }

  async viewMine(id: TableIdentity): Promise<DtoAddressMineView | undefined> {
    return await this._getOwnedAddress(id);
  }

  async createMine(address: DtoAddressMineCreate) {
    return await this.scope.model.address.insert({
      ...address,
      userId: this._getCurrentUserId(),
    });
  }

  async updateMine(id: TableIdentity, address: DtoAddressMineUpdate) {
    const ownedAddress = await this._getOwnedAddress(id);
    if (!ownedAddress) return;
    await this.scope.model.address.updateById(ownedAddress.id, address);
  }

  async deleteMine(id: TableIdentity) {
    const ownedAddress = await this._getOwnedAddress(id);
    if (!ownedAddress) return;
    await this.scope.model.address.deleteById(ownedAddress.id);
  }

  private _getCurrentUserId(): TableIdentity {
    return this.bean.passport.currentUser!.id;
  }

  private async _getOwnedAddress(id: TableIdentity) {
    return await this.scope.model.address.get(
      { id, userId: this._getCurrentUserId() },
      { columns: addressColumns },
    );
  }
}
