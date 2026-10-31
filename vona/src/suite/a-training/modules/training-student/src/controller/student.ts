import type { TableIdentity } from 'table-identity';
import type {
  IQueryParams,
  TypeAnalysisAggregateParams,
  TypeAnalysisGroupParams,
} from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, Mcp, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { studentAnalysis } from '../lib/studentAnalysis.ts';
import type { ModelStudent } from '../model/student.ts';

import { $locale } from '../.metadata/locales.ts';
import { DtoStudentAggregateRes } from '../dto/studentAggregateRes.tsx';
import { DtoStudentCreate } from '../dto/studentCreate.tsx';
import { DtoStudentDeleteBulk } from '../dto/studentDeleteBulk.tsx';
import { DtoStudentGroupResItem } from '../dto/studentGroupResItem.tsx';
import { DtoStudentLookupReq } from '../dto/studentLookupReq.tsx';
import { DtoStudentLookupRes } from '../dto/studentLookupRes.tsx';
import { DtoStudentSelectReq } from '../dto/studentSelectReq.tsx';
import { DtoStudentSelectRes } from '../dto/studentSelectRes.tsx';
import { DtoStudentSummary } from '../dto/studentSummary.tsx';
import { DtoStudentUpdate } from '../dto/studentUpdate.tsx';
import { DtoStudentView } from '../dto/studentView.tsx';

export interface IControllerOptionsStudent extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsStudent>('student', {
  summary: $locale('StudentController'),
})
@Resource()
export class ControllerStudent extends BeanBase {
  @Mcp.tool({
    name: 'training_student_create',
    description:
      'Create a student using your current student-create permission and instance. Uses the existing create contract, including optional content and training records with subjects. Non-idempotent; repeating a call can create additional data.',
    readOnly: false,
  })
  @Web.post('', { summary: $locale('StudentCreate') })
  @Api.body(v.tableIdentity())
  @Passport.rbac()
  async create(@Arg.body() student: DtoStudentCreate): Promise<TableIdentity> {
    return (await this.scope.service.student.create(student)).id;
  }

  @Mcp.tool({
    name: 'training_student_select',
    description:
      'Select students using your current student-select permission and instance. Returns the complete existing paginated select response with serialized row fields, including masked mobile.',
    readOnly: true,
  })
  @Web.get('', { summary: $locale('StudentSelect') })
  @Api.body(DtoStudentSelectRes)
  @Core.serializer()
  @Passport.rbac()
  async select(
    @Arg.filter(DtoStudentSelectReq) params: IQueryParams<ModelStudent>,
  ): Promise<DtoStudentSelectRes> {
    return await this.scope.service.student.select(params);
  }

  @Mcp.tool({
    name: 'training_student_lookup',
    description:
      'Find students by a literal name substring using your current student-select permission and instance. Returns only ID, name and level; summary access requires student-view permission separately.',
    readOnly: true,
  })
  @Web.get('lookup', { summary: $locale('StudentLookup') })
  @Api.body(DtoStudentLookupRes)
  @Core.serializer()
  @Passport.rbac({ actionInherit: 'select' })
  async lookup(
    @Arg.query(v.object(DtoStudentLookupReq, { strict: true })) query: DtoStudentLookupReq,
  ): Promise<DtoStudentLookupRes> {
    return await this.scope.service.student.lookup(query);
  }

  @Mcp.tool({
    name: 'training_student_group',
    description:
      'Group students using your current student-select permission and instance. Supports grouping by level and counting all students or students with an imageId. Defaults to counting all students by level. Uses the existing filters; counts are strings and results are wrapped in result.',
    readOnly: true,
  })
  @Web.get('group', { summary: $locale('StudentGroup') })
  @Api.body(v.array(DtoStudentGroupResItem))
  @Passport.rbac({ actionInherit: 'select' })
  async group(
    @Arg.filter(DtoStudentSelectReq, { mode: 'group' })
    params: TypeAnalysisGroupParams<typeof studentAnalysis>,
  ): Promise<DtoStudentGroupResItem[]> {
    return await this.scope.service.student.group(params);
  }

  @Mcp.tool({
    name: 'training_student_aggregate',
    description:
      'Count students using your current student-select permission and instance. Supports counting all students or students with an imageId. Defaults to both count_all and count_imageId. Uses the existing filters and returns string counts without grouping.',
    readOnly: true,
  })
  @Web.get('aggregate', { summary: $locale('StudentAggregate') })
  @Api.body(DtoStudentAggregateRes)
  @Passport.rbac({ actionInherit: 'select' })
  async aggregate(
    @Arg.filter(DtoStudentSelectReq, { mode: 'aggregate' })
    params: TypeAnalysisAggregateParams<typeof studentAnalysis>,
  ): Promise<DtoStudentAggregateRes> {
    return await this.scope.service.student.aggregate(params);
  }

  @Mcp.tool({
    name: 'training_student_view',
    description:
      'Read complete student details by ID using your current student-view permission and instance. Returns the existing serialized detail response, including masked mobile, Markdown content, nested training records and subjects, and optional image URL metadata.',
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
    name: 'training_student_update',
    description:
      'Update a student using your current student-update permission and instance. Requires params.id and body.name, body.mobile, body.level. Uses the complete existing aggregate contract, including content and existing/new training records and subjects; declared nested id/deleted controls can delete children. Returns null completion, not existence or read-back proof. Partial writes are possible; do not automatically replay after errors or uncertain responses.',
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
    name: 'training_student_summary',
    description:
      'Read a student summary by ID using your current student-view permission and instance. Excludes mobile and full notes.',
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
    name: 'training_student_delete',
    description:
      'Soft-delete a student by ID using your independent current student-delete permission and instance. Destructively includes content, training records and nested subjects. Returns null completion, not existence or read-back proof. Partial deletion is possible; do not automatically replay after errors or uncertain responses.',
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
