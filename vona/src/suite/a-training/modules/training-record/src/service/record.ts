import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoHighestScoresBySubjectResItem } from '../dto/highestScoresBySubjectResItem.tsx';
import type { DtoRecordCreate } from '../dto/recordCreate.tsx';
import type { DtoRecordSelectRes } from '../dto/recordSelectRes.tsx';
import type { DtoRecordUpdate } from '../dto/recordUpdate.tsx';
import type { DtoRecordView } from '../dto/recordView.tsx';
import type { EntityRecord } from '../entity/record.tsx';
import type { ModelRecord } from '../model/record.ts';

function getRecordSubjectsInclude(): { trainingRecordSubjects: true; student: true } {
  return { trainingRecordSubjects: true, student: true };
}

function compareTableIdentity(left: TableIdentity, right: TableIdentity): number {
  const leftValue = String(left);
  const rightValue = String(right);
  if (leftValue < rightValue) return -1;
  if (leftValue > rightValue) return 1;
  return 0;
}

@Service()
export class ServiceRecord extends BeanBase {
  async create(record: DtoRecordCreate): Promise<EntityRecord> {
    return await this.scope.model.record.insert(record, {
      include: getRecordSubjectsInclude(),
    });
  }

  async select(params?: IQueryParams<ModelRecord>): Promise<DtoRecordSelectRes> {
    return await this.scope.model.record.selectAndCount({
      ...params,
      include: { student: true },
    });
  }

  async highestScoresBySubject(): Promise<DtoHighestScoresBySubjectResItem[]> {
    const records = await this.scope.model.record.select({
      columns: ['id', 'name', 'studentId', 'trainingTime'],
      orders: [['id', 'asc']],
      include: {
        student: { columns: ['id', 'name'] },
        trainingRecordSubjects: {
          columns: ['id', 'name', 'score'],
          orders: [['id', 'asc']],
        },
      },
    });
    const winnersBySubject = new Map<string, DtoHighestScoresBySubjectResItem[]>();

    for (const record of records) {
      const student = record.student;
      if (!student) continue;
      for (const subject of record.trainingRecordSubjects ?? []) {
        const winner: DtoHighestScoresBySubjectResItem = {
          subjectRecordId: subject.id,
          subjectName: subject.name,
          score: subject.score,
          trainingRecordId: record.id,
          trainingRecordName: record.name,
          trainingTime: record.trainingTime,
          studentId: student.id,
          studentName: student.name,
        };
        const winners = winnersBySubject.get(subject.name);
        if (!winners || subject.score > winners[0].score) {
          winnersBySubject.set(subject.name, [winner]);
        } else if (subject.score === winners[0].score) {
          winners.push(winner);
        }
      }
    }

    return [...winnersBySubject.values()].flat().sort((left, right) => {
      if (left.subjectName < right.subjectName) return -1;
      if (left.subjectName > right.subjectName) return 1;
      const recordOrder = compareTableIdentity(left.trainingRecordId, right.trainingRecordId);
      if (recordOrder !== 0) return recordOrder;
      return compareTableIdentity(left.subjectRecordId, right.subjectRecordId);
    });
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
