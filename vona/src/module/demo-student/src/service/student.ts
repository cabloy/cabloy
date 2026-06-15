import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoStudentCreate } from '../dto/studentCreate.tsx';
import type { DtoStudentSelectRes } from '../dto/studentSelectRes.tsx';
import type { DtoStudentSummary } from '../dto/studentSummary.tsx';
import type { DtoStudentUpdate } from '../dto/studentUpdate.tsx';
import type { DtoStudentView } from '../dto/studentView.tsx';
import type { EntityStudent } from '../entity/student.tsx';
import type { ModelStudent } from '../model/student.ts';

@Service()
export class ServiceStudent extends BeanBase {
  async create(student: DtoStudentCreate): Promise<EntityStudent> {
    return await this.scope.model.student.insert(student);
  }

  async select(params?: IQueryParams<ModelStudent>): Promise<DtoStudentSelectRes> {
    return await this.scope.model.student.selectAndCount(params);
  }

  async summary(id: TableIdentity): Promise<DtoStudentSummary | undefined> {
    const student = await this.scope.model.student.getById(id);
    if (!student) return undefined;
    return {
      id: student.id,
      name: student.name,
      description: student.description,
      mobile: student.mobile,
      level: student.level,
    };
  }

  async view(id: TableIdentity): Promise<DtoStudentView | undefined> {
    return await this.scope.model.student.getById(id);
  }

  async update(id: TableIdentity, student: DtoStudentUpdate) {
    return await this.scope.model.student.updateById(id, student);
  }

  async delete(id: TableIdentity) {
    return await this.scope.model.student.deleteById(id);
  }

  async deleteForce(id: TableIdentity) {
    return await this.scope.model.student.deleteById(id, { disableDeleted: true });
  }
}
