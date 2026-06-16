import type {
  DtoStudentCreate,
  DtoStudentSelectRes,
  DtoStudentUpdate,
  EntityStudent,
} from 'vona-module-demo-student';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('student.test.ts', () => {
  it('action:student', async () => {
    await app.bean.executor.mockCtx(async () => {
      // data
      const data: DtoStudentCreate = {
        name: '__Tom__',
        description: 'This is a test',
        level: 1,
      };
      const dataUpdate: DtoStudentUpdate = {
        name: '__TomNew__',
        description: 'This is a test',
        level: 3,
      };
      // login
      await app.bean.passport.signinMock();
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
      assert.equal(selectRes.list.findIndex(item => item.name === data.name) > -1, true);
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
      assert.equal(student.level, dataUpdate.level);
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
