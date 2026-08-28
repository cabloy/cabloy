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

type StudentContentInput = {
  descriptionMarkdown?: string;
};

function getStudentRelationsInclude(): {
  content: true;
  trainingRecords: { include: { trainingRecordSubjects: true } };
} {
  return {
    content: true,
    trainingRecords: { include: { trainingRecordSubjects: true } },
  };
}

@Service()
export class ServiceStudent extends BeanBase {
  async create(student: DtoStudentCreate): Promise<EntityStudent> {
    return await this.scope.model.student.insert(
      {
        ...student,
        content: this._prepareContent(student.content),
      },
      { include: getStudentRelationsInclude() },
    );
  }

  async select(params?: IQueryParams<ModelStudent>): Promise<DtoStudentSelectRes> {
    return await this.scope.model.student.selectAndCount(params);
  }

  async view(id: TableIdentity): Promise<DtoStudentView | undefined> {
    return await this.scope.model.student.getById(id, {
      include: getStudentRelationsInclude(),
    });
  }

  async update(id: TableIdentity, student: DtoStudentUpdate) {
    const content = Object.hasOwn(student, 'content')
      ? this._prepareContent(student.content)
      : undefined;
    return await this.scope.model.student.updateById(
      id,
      content === undefined ? student : { ...student, content },
      { include: getStudentRelationsInclude() },
    );
  }

  async summary(id: TableIdentity): Promise<DtoStudentSummary | undefined> {
    const student = await this.scope.model.student.getById(id, {
      include: { content: true, contentHtml: true },
    });
    if (!student) return undefined;
    const descriptionMarkdown = student.content?.descriptionMarkdown;
    const descriptionLength = descriptionMarkdown?.length ?? 0;
    const levelTitle = String(student.level);
    return {
      id: student.id,
      name: student.name,
      mobile: student.mobile,
      level: student.level,
      levelTitle,
      descriptionMarkdown,
      descriptionHtml: student.contentHtml?.descriptionHtml,
      descriptionLength,
      summaryText: `${student.name} is in level ${student.level}. Description length: ${descriptionLength}.`,
    };
  }

  async delete(id: TableIdentity) {
    return await this.scope.model.student.deleteById(id, {
      include: getStudentRelationsInclude(),
    });
  }

  async deleteForce(id: TableIdentity) {
    return await this.scope.model.student.deleteById(id, {
      disableDeleted: true,
      include: getStudentRelationsInclude(),
    });
  }

  private _prepareContent(content: StudentContentInput | undefined) {
    const descriptionMarkdown = content?.descriptionMarkdown ?? '';
    return {
      descriptionMarkdown,
      descriptionHtml: this.bean.markdown.renderHtml(descriptionMarkdown),
    };
  }
}
