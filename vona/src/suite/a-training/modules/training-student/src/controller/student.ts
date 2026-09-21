import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelStudent } from '../model/student.ts';

import { $locale } from '../.metadata/locales.ts';
import { DtoStudentCreate } from '../dto/studentCreate.tsx';
import { DtoStudentDeleteBulk } from '../dto/studentDeleteBulk.tsx';
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
  @Web.post('', { summary: $locale('StudentCreate') })
  @Api.body(v.tableIdentity())
  @Passport.rbac()
  async create(@Arg.body() student: DtoStudentCreate): Promise<TableIdentity> {
    return (await this.scope.service.student.create(student)).id;
  }

  @Web.get('', { summary: $locale('StudentSelect') })
  @Api.body(DtoStudentSelectRes)
  @Core.serializer()
  @Passport.rbac()
  async select(
    @Arg.filter(DtoStudentSelectReq) params: IQueryParams<ModelStudent>,
  ): Promise<DtoStudentSelectRes> {
    return await this.scope.service.student.select(params);
  }

  @Web.get(':id', { summary: $locale('StudentView') })
  @Api.body(v.optional(), v.object(DtoStudentView))
  @Core.serializer()
  @Passport.rbac()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoStudentView | undefined> {
    return await this.scope.service.student.view(id);
  }

  @Web.patch(':id', { summary: $locale('StudentUpdate') })
  @Api.body(z.null())
  @Passport.rbac()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() student: DtoStudentUpdate,
  ): Promise<void> {
    await this.scope.service.student.update(id, student);
  }

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
