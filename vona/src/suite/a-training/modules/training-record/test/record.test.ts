import type {
  DtoRecordCreate,
  DtoRecordSelectRes,
  DtoRecordUpdate,
} from 'vona-module-training-record';
import type { DtoStudentCreate } from 'vona-module-training-student';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('record.test.ts', () => {
  it('action:record', async () => {
    await app.bean.executor.mockCtx(async () => {
      const studentData: DtoStudentCreate = {
        name: '__Student__',
        description: 'This is a student for record test',
        mobile: '13812345678',
        level: 1,
        trainingRecords: [],
      };
      const recordData = {
        studentId: 0 as any,
        name: '__Record__',
        score: 88,
        description: 'This is a record',
        trainingRecordSubjects: [
          {
            name: '__Math__',
            score: 95,
            description: 'Math subject',
          },
        ],
      } as any as DtoRecordCreate;
      await app.bean.passport.signinMock();
      const studentId = await app.bean.executor.performAction('post', '/training/student', {
        body: studentData,
      });
      recordData.studentId = studentId;
      const recordId = await app.bean.executor.performAction('post', '/training/record', {
        body: recordData,
      });
      assert.equal(!!recordId, true);

      const selectRes: DtoRecordSelectRes = await app.bean.executor.performAction(
        'get',
        '/training/record',
      );
      const recordItem = selectRes.list.find(item => String(item.id) === String(recordId));
      assert.equal(!!recordItem, true);
      assert.equal(recordItem!.name, recordData.name);
      assert.equal(String(recordItem!.studentId), String(studentId));

      let record: any = await app.bean.executor.performAction('get', '/training/record/:id', {
        params: { id: recordId },
      });
      const recordSubject = record.trainingRecordSubjects?.[0];
      assert.equal(record.name, recordData.name);
      assert.equal(String(record.studentId), String(studentId));
      assert.equal(record.trainingRecordSubjects?.length, 1);
      assert.equal(recordSubject?.name, '__Math__');
      assert.equal(recordSubject?.score, 95);

      let student: any = await app.bean.executor.performAction('get', '/training/student/:id', {
        params: { id: studentId },
      });
      let studentRecord = student.trainingRecords?.find(
        (item: any) => String(item.id) === String(recordId),
      );
      assert.equal(!!studentRecord, true);
      assert.equal(studentRecord?.trainingRecordSubjects?.length, 1);

      const dataUpdate = {
        studentId,
        name: '__RecordNew__',
        score: 89,
        description: 'This is an updated record',
        trainingRecordSubjects: [
          {
            id: recordSubject.id,
            name: '__MathNew__',
            score: 96,
            description: 'Updated math subject',
          },
          {
            name: '__English__',
            score: 87,
            description: 'English subject',
          },
        ],
      } as any as DtoRecordUpdate;
      await app.bean.executor.performAction('patch', '/training/record/:id', {
        params: { id: recordId },
        body: dataUpdate,
      });

      record = await app.bean.executor.performAction('get', '/training/record/:id', {
        params: { id: recordId },
      });
      const [updatedMathSubject, updatedEnglishSubject] = record.trainingRecordSubjects ?? [];
      assert.equal(record.name, dataUpdate.name);
      assert.equal(record.score, dataUpdate.score);
      assert.equal(record.trainingRecordSubjects?.length, 2);
      assert.equal(updatedMathSubject?.name, '__MathNew__');
      assert.equal(updatedMathSubject?.score, 96);
      assert.equal(updatedEnglishSubject?.name, '__English__');
      assert.equal(updatedEnglishSubject?.score, 87);

      student = await app.bean.executor.performAction('get', '/training/student/:id', {
        params: { id: studentId },
      });
      studentRecord = student.trainingRecords?.find(
        (item: any) => String(item.id) === String(recordId),
      );
      assert.equal(studentRecord?.name, dataUpdate.name);
      assert.equal(studentRecord?.trainingRecordSubjects?.length, 2);

      await app.bean.executor.performAction('delete', '/training/record/:id', {
        params: { id: recordId },
      });

      record = await app.bean.executor.performAction('get', '/training/record/:id', {
        params: { id: recordId },
      });
      assert.equal(record, undefined);

      student = await app.bean.executor.performAction('get', '/training/student/:id', {
        params: { id: studentId },
      });
      studentRecord = student.trainingRecords?.find(
        (item: any) => String(item.id) === String(recordId),
      );
      assert.equal(studentRecord, undefined);

      await app.bean.passport.signout();
    });
  });
});
