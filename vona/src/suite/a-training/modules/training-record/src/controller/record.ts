import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import type { ModelRecord } from '../model/record.ts';

import { DtoRecordCreate } from '../dto/recordCreate.tsx';
import { DtoRecordSelectReq } from '../dto/recordSelectReq.tsx';
import { DtoRecordSelectRes } from '../dto/recordSelectRes.tsx';
import { DtoRecordUpdate } from '../dto/recordUpdate.tsx';
import { DtoRecordView } from '../dto/recordView.tsx';

export interface IControllerOptionsRecord extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsRecord>('record')
@Resource()
export class ControllerRecord extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  @Passport.systemAdmin()
  async create(@Arg.body() record: DtoRecordCreate): Promise<TableIdentity> {
    return (await this.scope.service.record.create(record)).id;
  }

  @Web.get()
  @Api.body(DtoRecordSelectRes)
  @Core.serializer()
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoRecordSelectReq) params: IQueryParams<ModelRecord>,
  ): Promise<DtoRecordSelectRes> {
    return await this.scope.service.record.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoRecordView))
  @Core.serializer()
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoRecordView | undefined> {
    return await this.scope.service.record.view(id);
  }

  @Web.patch(':id')
  @Passport.systemAdmin()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() record: DtoRecordUpdate,
  ) {
    return await this.scope.service.record.update(id, record);
  }

  @Web.delete(':id')
  @Passport.systemAdmin()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity) {
    return await this.scope.service.record.delete(id);
  }
}
