import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoAddressCreate } from '../dto/addressCreate.tsx';
import type { DtoAddressSelectRes } from '../dto/addressSelectRes.tsx';
import type { DtoAddressUpdate } from '../dto/addressUpdate.tsx';
import type { DtoAddressView } from '../dto/addressView.tsx';
import type { ModelAddress } from '../model/address.ts';

@Service()
export class ServiceAddress extends BeanBase {
  async create(address: DtoAddressCreate) {
    return await this.scope.model.address.insert({
      ...address,
      userId: this._getCurrentUserId(),
    });
  }

  async select(params?: IQueryParams<ModelAddress>): Promise<DtoAddressSelectRes> {
    return await this.scope.model.address.selectAndCount({
      columns: [
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
      ],
      where: { ...params?.where, userId: this._getCurrentUserId() },
      orders: [['id', 'asc']],
      limit: params?.limit ?? 20,
      offset: params?.offset ?? 0,
    });
  }

  async view(id: TableIdentity): Promise<DtoAddressView | undefined> {
    return await this._getOwnedAddress(id);
  }

  async update(id: TableIdentity, address: DtoAddressUpdate) {
    const ownedAddress = await this._getOwnedAddress(id);
    if (!ownedAddress) return;
    await this.scope.model.address.updateById(ownedAddress.id, address);
  }

  async delete(id: TableIdentity) {
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
      {
        columns: [
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
        ],
      },
    );
  }
}
