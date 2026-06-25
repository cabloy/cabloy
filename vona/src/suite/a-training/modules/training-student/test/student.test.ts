import type {
  DtoStudentCreate,
  DtoStudentSelectRes,
  DtoStudentSummary,
  DtoStudentUpdate,
  EntityStudent,
} from 'vona-module-training-student';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('student.test.ts', () => {
  it('action:student', async () => {
    await app.bean.executor.mockCtx(async () => {
      // data
      const mobile = '13812345678';
      const maskedMobile = '138****5678';
      const mobileUpdate = '13987654321';
      const maskedMobileUpdate = '139****4321';
      const data: DtoStudentCreate = {
        name: '__Tom__',
        description: 'This is a test',
        mobile,
        level: 1,
        trainingRecords: [
          {
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
          },
        ],
      };
      // login
      await app.bean.passport.signinMock();
      // create
      const studentId = await app.bean.executor.performAction('post', '/training/student', {
        body: data,
      });
      assert.equal(!!studentId, true);
      // findMany
      const selectRes: DtoStudentSelectRes = await app.bean.executor.performAction(
        'get',
        '/training/student',
      );
      const studentItem = selectRes.list.find(item => item.name === data.name);
      assert.equal(!!studentItem, true);
      assert.equal(studentItem!.level, data.level);
      assert.equal(studentItem!.mobile, maskedMobile);
      // findMany: level filter
      const selectResByLevel: DtoStudentSelectRes = await app.bean.executor.performAction(
        'get',
        '/training/student',
        {
          query: {
            level: data.level,
          },
        },
      );
      assert.equal(
        selectResByLevel.list.some(item => item.name === data.name),
        true,
      );
      assert.equal(
        selectResByLevel.list.every(item => item.level === data.level),
        true,
      );
      // findOne and nested create check
      let student: any = await app.bean.executor.performAction('get', '/training/student/:id', {
        params: { id: studentId },
      });
      const record = student.trainingRecords?.[0];
      const recordSubject = record?.trainingRecordSubjects?.[0];
      assert.equal(student.trainingRecords?.length, 1);
      assert.equal(record?.name, '__Record__');
      assert.equal(record?.trainingRecordSubjects?.length, 1);
      assert.equal(recordSubject?.name, '__Math__');
      assert.equal(recordSubject?.score, 95);
      // update
      const dataUpdate: DtoStudentUpdate = {
        name: '__TomNew__',
        description: 'This is a test',
        mobile: mobileUpdate,
        level: 2,
        trainingRecords: [
          {
            id: record.id,
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
          },
        ],
      };
      await app.bean.executor.performAction('patch', '/training/student/:id', {
        params: { id: studentId },
        body: dataUpdate,
      });
      // findOne after nested update
      student = await app.bean.executor.performAction('get', '/training/student/:id', {
        params: { id: studentId },
      });
      const updatedRecord = student.trainingRecords?.[0];
      const [updatedMathSubject, updatedEnglishSubject] =
        updatedRecord?.trainingRecordSubjects ?? [];
      assert.equal(student.name, dataUpdate.name);
      assert.equal(student.level, dataUpdate.level);
      assert.equal(student.mobile, maskedMobileUpdate);
      assert.equal(student.trainingRecords?.length, 1);
      assert.equal(updatedRecord?.name, '__RecordNew__');
      assert.equal(updatedRecord?.trainingRecordSubjects?.length, 2);
      assert.equal(updatedMathSubject?.name, '__MathNew__');
      assert.equal(updatedMathSubject?.score, 96);
      assert.equal(updatedEnglishSubject?.name, '__English__');
      assert.equal(updatedEnglishSubject?.score, 87);
      const studentRaw = await app.bean.scope('training-student').model.student.getById(studentId, {
        disableDeleted: true,
      });
      assert.equal(studentRaw!.mobile, mobileUpdate);
      // summary
      const summary: DtoStudentSummary = await app.bean.executor.performAction(
        'get',
        '/training/student/summary/:id',
        { params: { id: studentId } },
      );
      assert.equal(summary.name, dataUpdate.name);
      assert.equal(summary.mobile, maskedMobileUpdate);
      assert.equal(summary.level, dataUpdate.level);
      assert.equal(summary.descriptionLength, dataUpdate.description?.length);
      assert.equal(typeof summary.levelTitle, 'string');
      assert.equal(typeof summary.summaryText, 'string');
      // delete
      await app.bean.executor.performAction('delete', '/training/student/:id', {
        params: { id: student.id },
      });
      // findOne
      student = await app.bean.executor.performAction('get', '/training/student/:id', {
        params: { id: student.id },
      });
      assert.equal(student, undefined);
      // create again for force delete
      const studentIdForce = await app.bean.executor.performAction('post', '/training/student', {
        body: data,
      });
      await app.bean.executor.performAction('delete', '/training/student/deleteForce/:id', {
        params: { id: studentIdForce },
      });
      const studentForce: EntityStudent | undefined = await app.bean
        .scope('training-student')
        .model.student.getById(studentIdForce, {
          disableDeleted: true,
        });
      assert.equal(studentForce, undefined);
      // logout
      await app.bean.passport.signout();
    });
  });

  it('action:student:level invalid', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      await assert.rejects(async () => {
        await app.bean.executor.performAction('post', '/training/student', {
          body: {
            name: '__Tom__',
            description: 'This is a test',
            mobile: '13812345678',
            level: 4,
          },
        });
      });
      await app.bean.passport.signout();
    });
  });

  it('action:student:mobile required', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      await assert.rejects(async () => {
        await app.bean.executor.performAction('post', '/training/student', {
          body: {
            name: '__Tom__',
            description: 'This is a test',
            level: 1,
          },
        });
      });
      await app.bean.passport.signout();
    });
  });

  it('action:student:mobile too short', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      await assert.rejects(async () => {
        await app.bean.executor.performAction('post', '/training/student', {
          body: {
            name: '__Tom__',
            description: 'This is a test',
            mobile: '1381234567',
            level: 1,
          },
        });
      });
      await app.bean.passport.signout();
    });
  });
});
