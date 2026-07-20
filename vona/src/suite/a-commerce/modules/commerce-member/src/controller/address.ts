import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelAddress } from '../model/address.ts';

import { DtoAddressCreate } from '../dto/addressCreate.tsx';
import { DtoAddressSelectReq } from '../dto/addressSelectReq.tsx';
import { DtoAddressSelectRes } from '../dto/addressSelectRes.tsx';
import { DtoAddressUpdate } from '../dto/addressUpdate.tsx';
import { DtoAddressView } from '../dto/addressView.tsx';

export interface IControllerOptionsAddress extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsAddress>('address')
@Resource()
export class ControllerAddress extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  async create(@Arg.body() address: DtoAddressCreate): Promise<TableIdentity> {
    return (await this.scope.service.address.create(address)).id;
  }

  @Web.get()
  @Api.body(DtoAddressSelectRes)
  async select(
    @Arg.filter(DtoAddressSelectReq) params: IQueryParams<ModelAddress>,
  ): Promise<DtoAddressSelectRes> {
    return await this.scope.service.address.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoAddressView))
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoAddressView | undefined> {
    return await this.scope.service.address.view(id);
  }

  @Web.patch(':id')
  @Api.body(z.null())
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() address: DtoAddressUpdate,
  ): Promise<void> {
    await this.scope.service.address.update(id, address);
  }

  @Web.delete(':id')
  @Api.body(z.null())
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.address.delete(id);
  }
}
