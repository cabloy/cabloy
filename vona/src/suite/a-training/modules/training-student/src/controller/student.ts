import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import type { ModelStudent } from '../model/student.ts';

import { DtoStudentCreate } from '../dto/studentCreate.tsx';
import { DtoStudentSelectReq } from '../dto/studentSelectReq.tsx';
import { DtoStudentSelectRes } from '../dto/studentSelectRes.tsx';
import { DtoStudentSummary } from '../dto/studentSummary.tsx';
import { DtoStudentUpdate } from '../dto/studentUpdate.tsx';
import { DtoStudentView } from '../dto/studentView.tsx';

export interface IControllerOptionsStudent extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsStudent>('student')
@Resource()
export class ControllerStudent extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  @Passport.systemAdmin()
  async create(@Arg.body() student: DtoStudentCreate): Promise<TableIdentity> {
    return (await this.scope.service.student.create(student)).id;
  }

  @Web.get()
  @Api.body(DtoStudentSelectRes)
  @Core.serializer()
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoStudentSelectReq) params: IQueryParams<ModelStudent>,
  ): Promise<DtoStudentSelectRes> {
    return await this.scope.service.student.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoStudentView))
  @Core.serializer()
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoStudentView | undefined> {
    return await this.scope.service.student.view(id);
  }

  @Web.patch(':id')
  @Passport.systemAdmin()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() student: DtoStudentUpdate,
  ) {
    return await this.scope.service.student.update(id, student);
  }

  @Web.get('summary/:id')
  @Api.body(v.optional(), v.object(DtoStudentSummary))
  @Core.serializer()
  @Passport.systemAdmin()
  async summary(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoStudentSummary | undefined> {
    return await this.scope.service.student.summary(id);
  }

  @Web.delete(':id')
  @Passport.systemAdmin()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity) {
    return await this.scope.service.student.delete(id);
  }

  @Web.delete('deleteForce/:id')
  @Passport.systemAdmin()
  async deleteForce(@Arg.param('id', v.tableIdentity()) id: TableIdentity) {
    return await this.scope.service.student.deleteForce(id);
  }
}
