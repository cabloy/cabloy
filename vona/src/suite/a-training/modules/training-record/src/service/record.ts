import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoRecordCreate } from '../dto/recordCreate.tsx';
import type { DtoRecordSelectRes } from '../dto/recordSelectRes.tsx';
import type { DtoRecordUpdate } from '../dto/recordUpdate.tsx';
import type { DtoRecordView } from '../dto/recordView.tsx';
import type { EntityRecord } from '../entity/record.tsx';
import type { ModelRecord } from '../model/record.ts';

function getRecordSubjectsInclude(): { trainingRecordSubjects: true; student: true } {
  return { trainingRecordSubjects: true, student: true };
}

@Service()
export class ServiceRecord extends BeanBase {
  async create(record: DtoRecordCreate): Promise<EntityRecord> {
    return await this.scope.model.record.insert(record, {
      include: getRecordSubjectsInclude(),
    });
  }

  async select(params?: IQueryParams<ModelRecord>): Promise<DtoRecordSelectRes> {
    return await this.scope.model.record.selectAndCount(params);
  }

  async view(id: TableIdentity): Promise<DtoRecordView | undefined> {
    return await this.scope.model.record.getById(id, {
      include: getRecordSubjectsInclude(),
    });
  }

  async update(id: TableIdentity, record: DtoRecordUpdate) {
    return await this.scope.model.record.updateById(id, record, {
      include: getRecordSubjectsInclude(),
    });
  }

  async delete(id: TableIdentity) {
    return await this.scope.model.record.deleteById(id, {
      include: getRecordSubjectsInclude(),
    });
  }
}
