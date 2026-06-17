import type {
  DtoStudentCreate,
  DtoStudentSelectRes,
  DtoStudentSummary,
  DtoStudentUpdate,
  EntityStudent,
} from 'vona-module-demo-student';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('student.test.ts', () => {
  it('action:student', async () => {
    await app.bean.executor.mockCtx(async () => {
      // data
      const data: DtoStudentCreate = {
        name: '__Tom__',
        mobile: '13812345678',
        description: 'This is a test',
        level: 1,
      };
      const dataUpdate: DtoStudentUpdate = {
        name: '__TomNew__',
        mobile: '13987654321',
        description: 'This is a test',
        level: 3,
      };
      // login
      await app.bean.passport.signinMock();
      // create: invalid missing mobile
      const [_, errorMissingMobile] = await catchError(() => {
        return app.bean.executor.performAction('post', '/demo/student', {
          body: {
            name: data.name,
            description: data.description,
            level: data.level,
          },
        });
      });
      assert.equal(!!errorMissingMobile, true);
      assert.equal(JSON.stringify(errorMissingMobile?.message).includes('mobile'), true);
      // create: invalid short mobile
      const [_2, errorShortMobile] = await catchError(() => {
        return app.bean.executor.performAction('post', '/demo/student', {
          body: {
            ...data,
            mobile: '1234567890',
          },
        });
      });
      assert.equal(!!errorShortMobile, true);
      assert.equal(JSON.stringify(errorShortMobile?.message).includes('mobile'), true);
      // create
      const studentId = await app.bean.executor.performAction('post', '/demo/student', {
        body: data,
      });
      assert.equal(!!studentId, true);
      // findMany
      const selectRes: DtoStudentSelectRes = await app.bean.executor.performAction(
        'get',
        '/demo/student',
      );
      const selectItem = selectRes.list.find(item => item.name === data.name);
      assert.equal(!!selectItem, true);
      assert.equal(selectItem?.mobile, '138****5678');
      // update
      await app.bean.executor.performAction('patch', '/demo/student/:id', {
        params: { id: studentId },
        body: dataUpdate,
      });
      // findOne
      let student: EntityStudent = await app.bean.executor.performAction(
        'get',
        '/demo/student/:id',
        { params: { id: studentId } },
      );
      assert.equal(student.name, dataUpdate.name);
      assert.equal(student.mobile, '139****4321');
      assert.equal(student.level, dataUpdate.level);
      // summary
      const studentSummary: DtoStudentSummary = await app.bean.executor.performAction(
        'get',
        '/demo/student/summary/:id',
        { params: { id: studentId } },
      );
      assert.equal(studentSummary.mobile, '139****4321');
      // delete
      await app.bean.executor.performAction('delete', '/demo/student/:id', {
        params: { id: student.id },
      });
      // findOne
      student = await app.bean.executor.performAction('get', '/demo/student/:id', {
        params: { id: student.id },
      });
      assert.equal(student, undefined);
      // logout
      await app.bean.passport.signout();
    });
  });
});
