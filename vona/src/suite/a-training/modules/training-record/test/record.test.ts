import type {
  DtoRecordCreate,
  DtoRecordSelectRes,
  DtoRecordUpdate,
  EntityRecord,
} from 'vona-module-training-record';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('record.test.ts', () => {
  it('action:record', async () => {
    await app.bean.executor.mockCtx(async () => {
      // data
      const data: DtoRecordCreate = {
        name: '__Tom__',
        description: 'This is a test',
      };
      const dataUpdate: DtoRecordUpdate = {
        name: '__TomNew__',
        description: 'This is a test',
      };
      // login
      await app.bean.passport.signinMock();
      // create
      const recordId = await app.bean.executor.performAction('post', '/training/record', {
        body: data,
      });
      assert.equal(!!recordId, true);
      // findMany
      const selectRes: DtoRecordSelectRes = await app.bean.executor.performAction(
        'get',
        '/training/record',
      );
      assert.equal(selectRes.list.findIndex(item => item.name === data.name) > -1, true);
      // update
      await app.bean.executor.performAction('patch', '/training/record/:id', {
        params: { id: recordId },
        body: dataUpdate,
      });
      // findOne
      let record: EntityRecord = await app.bean.executor.performAction(
        'get',
        '/training/record/:id',
        { params: { id: recordId } },
      );
      assert.equal(record.name, dataUpdate.name);
      // delete
      await app.bean.executor.performAction('delete', '/training/record/:id', {
        params: { id: record.id },
      });
      // findOne
      record = await app.bean.executor.performAction('get', '/training/record/:id', {
        params: { id: record.id },
      });
      assert.equal(record, undefined);
      // logout
      await app.bean.passport.signout();
    });
  });
});
