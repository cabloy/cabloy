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
      const routeStudent = '/demo/student';
      const routeStudentId = '/demo/student/:id';
      const data: DtoStudentCreate = {
        name: '__Tom__',
        description: 'This is a test',
        level: 1,
      };
      const dataUpdate: DtoStudentUpdate = {
        name: '__TomNew__',
        description: 'This is a test',
        level: 2,
      };

      await app.bean.passport.signinMock();

      const studentId = await app.bean.executor.performAction('post', routeStudent, {
        body: data,
      });
      assert.ok(studentId);

      const selectRes: DtoStudentSelectRes = await app.bean.executor.performAction('get', routeStudent);
      assert.ok(selectRes.list.some(item => item.name === data.name));

      await app.bean.executor.performAction('patch', routeStudentId, {
        params: { id: studentId },
        body: dataUpdate,
      });

      const updatedStudent: EntityStudent = await app.bean.executor.performAction('get', routeStudentId, {
        params: { id: studentId },
      });
      assert.equal(updatedStudent.name, dataUpdate.name);
      assert.equal(updatedStudent.level, dataUpdate.level);

      await app.bean.executor.performAction('delete', routeStudentId, {
        params: { id: studentId },
      });

      const deletedStudent = await app.bean.executor.performAction('get', routeStudentId, {
        params: { id: studentId },
      });
      assert.equal(deletedStudent, undefined);

      await app.bean.passport.signout();
    });
  });
});
