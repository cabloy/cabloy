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

function getStudentRecordSubjectsInclude(): {
  trainingRecords: { include: { trainingRecordSubjects: true } };
} {
  return { trainingRecords: { include: { trainingRecordSubjects: true } } };
}

function getStudentContentFormInclude() {
  return { studentContentForm: true };
}

@Service()
export class ServiceStudent extends BeanBase {
  async create(student: DtoStudentCreate): Promise<EntityStudent> {
    const { studentContentForm, ...studentFields } = student as DtoStudentCreate & {
      studentContentForm?: { descriptionMarkdown?: string };
    };
    const created = await this.scope.model.student.insert(studentFields, {
      include: getStudentRecordSubjectsInclude(),
    });
    if (studentContentForm !== undefined) {
      await this._updateStudentContent(created.id, studentContentForm.descriptionMarkdown);
    }
    return created;
  }

  async select(params?: IQueryParams<ModelStudent>): Promise<DtoStudentSelectRes> {
    return await this.scope.model.student.selectAndCount(params);
  }

  async view(id: TableIdentity): Promise<DtoStudentView | undefined> {
    return await this.scope.model.student.getById(id, {
      include: {
        ...getStudentRecordSubjectsInclude(),
        ...getStudentContentFormInclude(),
      },
    });
  }

  async update(id: TableIdentity, student: DtoStudentUpdate) {
    const { studentContentForm, ...studentFields } = student as DtoStudentUpdate & {
      studentContentForm?: { descriptionMarkdown?: string };
    };
    const updateResult = await this.scope.model.student.updateById(id, studentFields, {
      include: getStudentRecordSubjectsInclude(),
    });
    if (studentContentForm !== undefined) {
      await this._updateStudentContent(id, studentContentForm.descriptionMarkdown);
    }
    return updateResult;
  }

  async summary(id: TableIdentity): Promise<DtoStudentSummary | undefined> {
    const student = await this.scope.model.student.getById(id, {
      include: getStudentContentFormInclude(),
    });
    if (!student) return undefined;
    const description = student.studentContentForm?.descriptionMarkdown;
    const descriptionLength = description?.length ?? 0;
    const levelTitle = String(student.level);
    return {
      id: student.id,
      name: student.name,
      mobile: student.mobile,
      level: student.level,
      levelTitle,
      description,
      descriptionLength,
      summaryText: `${student.name} is in level ${student.level}. Description length: ${descriptionLength}.`,
    };
  }

  async delete(id: TableIdentity) {
    await this.scope.model.studentContent.delete({ studentId: id });
    return await this.scope.model.student.deleteById(id, {
      include: getStudentRecordSubjectsInclude(),
    });
  }

  async deleteForce(id: TableIdentity) {
    await this.scope.model.studentContent.delete({ studentId: id }, { disableDeleted: true });
    return await this.scope.model.student.deleteById(id, {
      disableDeleted: true,
      include: getStudentRecordSubjectsInclude(),
    });
  }

  private async _updateStudentContent(
    studentId: TableIdentity,
    descriptionMarkdown?: string,
  ): Promise<void> {
    const markdown = descriptionMarkdown?.trim();
    const studentContent = await this.scope.model.studentContent.get({ studentId });
    if (!markdown) {
      if (studentContent) await this.scope.model.studentContent.deleteById(studentContent.id);
      return;
    }
    const descriptionHtml = this.bean.markdown.renderHtml(markdown);
    if (studentContent) {
      await this.scope.model.studentContent.updateById(studentContent.id, {
        descriptionMarkdown: markdown,
        descriptionHtml,
      });
    } else {
      await this.scope.model.studentContent.insert({
        studentId,
        descriptionMarkdown: markdown,
        descriptionHtml,
      });
    }
  }
}
