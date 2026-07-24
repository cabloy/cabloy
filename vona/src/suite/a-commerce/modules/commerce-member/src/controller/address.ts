import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelAddress } from '../model/address.ts';

import { DtoAddressMineCreate } from '../dto/addressMineCreate.tsx';
import { DtoAddressMineReq } from '../dto/addressMineReq.tsx';
import { DtoAddressMineRes } from '../dto/addressMineRes.tsx';
import { DtoAddressMineUpdate } from '../dto/addressMineUpdate.tsx';
import { DtoAddressMineView } from '../dto/addressMineView.tsx';
import { DtoAddressSelectReq } from '../dto/addressSelectReq.tsx';
import { DtoAddressSelectRes } from '../dto/addressSelectRes.tsx';
import { DtoAddressView } from '../dto/addressView.tsx';

export interface IControllerOptionsAddress extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsAddress>('address')
@Resource()
export class ControllerAddress extends BeanBase {
  @Web.get('mine')
  @Api.body(DtoAddressMineRes)
  async mine(
    @Arg.filter(DtoAddressMineReq) params: IQueryParams<ModelAddress>,
  ): Promise<DtoAddressMineRes> {
    return await this.scope.service.address.mine(params);
  }

  @Web.get('viewMine/:id')
  @Api.body(v.optional(), v.object(DtoAddressMineView))
  async viewMine(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoAddressMineView | undefined> {
    return await this.scope.service.address.viewMine(id);
  }

  @Web.post('createMine')
  @Api.body(v.tableIdentity())
  async createMine(@Arg.body() address: DtoAddressMineCreate): Promise<TableIdentity> {
    return (await this.scope.service.address.createMine(address)).id;
  }

  @Web.patch('updateMine/:id')
  @Api.body(z.null())
  async updateMine(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() address: DtoAddressMineUpdate,
  ): Promise<void> {
    await this.scope.service.address.updateMine(id, address);
  }

  @Web.delete('deleteMine/:id')
  @Api.body(z.null())
  async deleteMine(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.address.deleteMine(id);
  }

  @Web.get()
  @Api.body(DtoAddressSelectRes)
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoAddressSelectReq) params: IQueryParams<ModelAddress>,
  ): Promise<DtoAddressSelectRes> {
    return await this.scope.service.address.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoAddressView))
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoAddressView | undefined> {
    return await this.scope.service.address.view(id);
  }
}
