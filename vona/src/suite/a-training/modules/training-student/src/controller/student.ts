import type { TableIdentity } from 'table-identity';
import type {
  TypeQueryInput,
  TypeQueryAggregateInput,
  TypeQueryGroupInput,
} from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, Mcp, Resource, v } from 'vona-module-a-openapiutils';
import { $compileQuery } from 'vona-module-a-orm';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';
import { DtoStudentAggregateRes } from '../dto/studentAggregateRes.tsx';
import { DtoStudentCreate } from '../dto/studentCreate.tsx';
import { DtoStudentDeleteBulk } from '../dto/studentDeleteBulk.tsx';
import { DtoStudentGroupResItem } from '../dto/studentGroupResItem.tsx';
import { DtoStudentSelectReq, studentQuery } from '../dto/studentSelectReq.tsx';
import { DtoStudentSelectRes } from '../dto/studentSelectRes.tsx';
import { DtoStudentSummary } from '../dto/studentSummary.tsx';
import { DtoStudentUpdate } from '../dto/studentUpdate.tsx';
import { DtoStudentView } from '../dto/studentView.tsx';
import { studentAnalysis } from '../lib/studentAnalysis.ts';

export interface IControllerOptionsStudent extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsStudent>('student', {
  summary: $locale('StudentController'),
})
@Resource()
export class ControllerStudent extends BeanBase {
  @Mcp.tool({
    ssrSites: ['basic-siteadmin:admin'],
    description: $locale('StudentCreateDescription'),
    readOnly: false,
  })
  @Web.post('', { summary: $locale('StudentCreate') })
  @Api.body(v.tableIdentity())
  @Passport.rbac()
  async create(@Arg.body() student: DtoStudentCreate): Promise<TableIdentity> {
    return (await this.scope.service.student.create(student)).id;
  }

  @Mcp.tool({
    ssrSites: ['basic-siteadmin:admin'],
    description: $locale('StudentSelectDescription'),
    readOnly: true,
    discovery: { output: [['list', 'items']] },
  })
  @Web.get('', { summary: $locale('StudentSelect') })
  @Api.body(DtoStudentSelectRes)
  @Core.serializer()
  @Passport.rbac()
  async select(
    @Arg.filter(DtoStudentSelectReq) params: TypeQueryInput<typeof studentQuery>,
  ): Promise<DtoStudentSelectRes> {
    return await this.scope.service.student.select(
      $compileQuery(this.scope.model.student, studentQuery, params),
    );
  }

  @Mcp.tool({
    ssrSites: ['basic-siteadmin:admin'],
    description: $locale('StudentGroupDescription'),
    readOnly: true,
  })
  @Web.get('group', { summary: $locale('StudentGroup') })
  @Api.body(v.array(DtoStudentGroupResItem))
  @Passport.rbac({ actionInherit: 'select' })
  async group(
    @Arg.filter(DtoStudentSelectReq, { mode: 'group' })
    params: TypeQueryGroupInput<typeof studentQuery, typeof studentAnalysis>,
  ): Promise<DtoStudentGroupResItem[]> {
    return await this.scope.service.student.group(
      $compileQuery(this.scope.model.student, studentQuery, params, {
        mode: 'group',
        analysis: studentAnalysis,
      }),
    );
  }

  @Mcp.tool({
    ssrSites: ['basic-siteadmin:admin'],
    description: $locale('StudentAggregateDescription'),
    readOnly: true,
  })
  @Web.get('aggregate', { summary: $locale('StudentAggregate') })
  @Api.body(DtoStudentAggregateRes)
  @Passport.rbac({ actionInherit: 'select' })
  async aggregate(
    @Arg.filter(DtoStudentSelectReq, { mode: 'aggregate' })
    params: TypeQueryAggregateInput<typeof studentQuery, typeof studentAnalysis>,
  ): Promise<DtoStudentAggregateRes> {
    return await this.scope.service.student.aggregate(
      $compileQuery(this.scope.model.student, studentQuery, params, {
        mode: 'aggregate',
        analysis: studentAnalysis,
      }),
    );
  }

  @Mcp.tool({
    ssrSites: ['basic-siteadmin:admin'],
    description: $locale('StudentViewDescription'),
    readOnly: true,
  })
  @Web.get(':id', { summary: $locale('StudentView') })
  @Api.body(v.optional(), v.object(DtoStudentView))
  @Core.serializer()
  @Passport.rbac()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoStudentView | undefined> {
    return await this.scope.service.student.view(id);
  }

  @Mcp.tool({
    ssrSites: ['basic-siteadmin:admin'],
    description: $locale('StudentUpdateDescription'),
    readOnly: false,
  })
  @Web.patch(':id', { summary: $locale('StudentUpdate') })
  @Api.body(z.null())
  @Passport.rbac()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() student: DtoStudentUpdate,
  ): Promise<void> {
    await this.scope.service.student.update(id, student);
  }

  @Mcp.tool({
    ssrSites: ['basic-siteadmin:admin'],
    description: $locale('StudentSummaryDescription'),
    output: {
      pick: ['id', 'name', 'level', 'levelTitle', 'descriptionLength', 'summaryText'],
    },
  })
  @Web.get('summary/:id', { summary: $locale('StudentSummary') })
  @Api.body(v.optional(), v.object(DtoStudentSummary))
  @Core.serializer()
  @Passport.rbac({ actionInherit: 'view' })
  async summary(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoStudentSummary | undefined> {
    return await this.scope.service.student.summary(id);
  }

  @Web.post('bulk/delete', { summary: $locale('StudentDeleteBulk') })
  @Api.body(z.null())
  @Passport.rbac({ actionInherit: 'delete' })
  async deleteBulk(@Arg.body() command: DtoStudentDeleteBulk): Promise<void> {
    await this.scope.service.student.deleteBulk(command.ids);
  }

  @Mcp.tool({
    ssrSites: ['basic-siteadmin:admin'],
    description: $locale('StudentDeleteDescription'),
    readOnly: false,
  })
  @Web.delete(':id', { summary: $locale('StudentDelete') })
  @Api.body(z.null())
  @Passport.rbac()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.student.delete(id);
  }

  @Web.delete('deleteForce/:id', { summary: $locale('StudentDeleteForce') })
  @Api.body(z.null())
  @Passport.rbac({ actionInherit: 'delete' })
  async deleteForce(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.student.deleteForce(id);
  }
}
