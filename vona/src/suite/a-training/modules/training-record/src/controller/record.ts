import type { TableIdentity } from 'table-identity';
import type { TypeQueryInput } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, Mcp, Resource, v } from 'vona-module-a-openapiutils';
import { $compileQuery } from 'vona-module-a-orm';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';
import { DtoHighestScoresBySubjectResItem } from '../dto/highestScoresBySubjectResItem.tsx';
import { DtoRecordCreate } from '../dto/recordCreate.tsx';
import { recordQuery, DtoRecordSelectReq } from '../dto/recordSelectReq.tsx';
import { DtoRecordSelectRes } from '../dto/recordSelectRes.tsx';
import { DtoRecordUpdate } from '../dto/recordUpdate.tsx';
import { DtoRecordView } from '../dto/recordView.tsx';

export interface IControllerOptionsRecord extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsRecord>('record')
@Resource()
export class ControllerRecord extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  @Passport.rbac()
  async create(@Arg.body() record: DtoRecordCreate): Promise<TableIdentity> {
    return (await this.scope.service.record.create(record)).id;
  }

  @Mcp.tool({
    ssrSites: ['basic-siteadmin:admin'],
    description: $locale('RecordSelectDescription'),
    readOnly: true,
    discovery: { output: [['list', 'items']] },
  })
  @Web.get('', { summary: $locale('RecordSelect') })
  @Api.body(DtoRecordSelectRes)
  @Core.serializer()
  @Passport.rbac()
  async select(
    @Arg.filter(DtoRecordSelectReq) params: TypeQueryInput<typeof recordQuery>,
  ): Promise<DtoRecordSelectRes> {
    return await this.scope.service.record.select(
      $compileQuery(this.scope.model.record, recordQuery, params),
    );
  }

  @Mcp.tool({
    ssrSites: ['basic-siteadmin:admin'],
    description: $locale('HighestScoresBySubjectDescription'),
    readOnly: true,
  })
  @Web.get('highestScoresBySubject', { summary: $locale('HighestScoresBySubject') })
  @Api.body(v.array(DtoHighestScoresBySubjectResItem))
  @Core.serializer()
  @Passport.rbac({ actionInherit: 'select' })
  async highestScoresBySubject(): Promise<DtoHighestScoresBySubjectResItem[]> {
    return await this.scope.service.record.highestScoresBySubject();
  }

  @Mcp.tool({
    ssrSites: ['basic-siteadmin:admin'],
    description: $locale('RecordViewDescription'),
    readOnly: true,
  })
  @Web.get(':id', { summary: $locale('RecordView') })
  @Api.body(v.optional(), v.object(DtoRecordView))
  @Core.serializer()
  @Passport.rbac()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoRecordView | undefined> {
    return await this.scope.service.record.view(id);
  }

  @Web.patch(':id')
  @Api.body(z.null())
  @Passport.rbac()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() record: DtoRecordUpdate,
  ): Promise<void> {
    await this.scope.service.record.update(id, record);
  }

  @Web.delete(':id')
  @Api.body(z.null())
  @Passport.rbac()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.record.delete(id);
  }
}
