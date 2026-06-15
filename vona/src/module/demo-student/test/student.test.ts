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
import { cast } from 'vona';
import { app } from 'vona-mock';

import { maskStudentMobile } from '../src/lib/index.ts';

describe('student.test.ts', () => {
  it('action:student', async () => {
    await app.bean.executor.mockCtx(async () => {
      const routeStudent = '/demo/student';
      const routeStudentId = '/demo/student/:id';
      const routeStudentSummary = '/demo/student/summary/:id';
      const data: DtoStudentCreate = {
        name: '__Tom__',
        description: 'This is a test',
        level: 1,
        mobile: '13800138000',
      };
      const dataUpdate: DtoStudentUpdate = {
        name: '__TomNew__',
        description: 'This is a test',
        level: 2,
        mobile: '13900139000',
      };

      await app.bean.passport.signinMock();

      const studentId = await app.bean.executor.performAction('post', routeStudent, {
        body: data,
      });
      assert.ok(studentId);

      const selectRes: DtoStudentSelectRes = await app.bean.executor.performAction(
        'get',
        routeStudent,
      );
      assert.ok(
        selectRes.list.some(
          item =>
            item.name === data.name &&
            item.level === data.level &&
            item.mobile === maskStudentMobile(data.mobile),
        ),
      );

      await app.bean.executor.performAction('patch', routeStudentId, {
        params: { id: studentId },
        body: dataUpdate,
      });

      const updatedStudent: EntityStudent = await app.bean.executor.performAction(
        'get',
        routeStudentId,
        {
          params: { id: studentId },
        },
      );
      assert.equal(updatedStudent.name, dataUpdate.name);
      assert.equal(updatedStudent.level, dataUpdate.level);
      assert.equal(updatedStudent.mobile, maskStudentMobile(dataUpdate.mobile));

      const summary: DtoStudentSummary = await app.bean.executor.performAction(
        'get',
        routeStudentSummary,
        {
          params: { id: studentId },
        },
      );
      assert.equal(summary.mobile, maskStudentMobile(dataUpdate.mobile));

      const [, err] = await catchError(async () => {
        return await app.bean.executor.performAction('post', routeStudent, {
          body: {
            ...data,
            name: '__TomInvalid__',
            level: 4,
          },
        });
      });
      assert.ok(err);
      assert.equal(cast(err.message)[0]?.path?.[0], 'level');

      const [, errMobile] = await catchError(async () => {
        return await app.bean.executor.performAction('post', routeStudent, {
          body: {
            ...data,
            name: '__TomInvalidMobile__',
            mobile: '1380013800',
          },
        });
      });
      assert.ok(errMobile);
      assert.equal(cast(errMobile.message)[0]?.path?.[0], 'mobile');

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
