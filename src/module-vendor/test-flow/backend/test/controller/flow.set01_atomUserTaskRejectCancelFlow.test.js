const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('flow.set01_atomUserTaskRejectCancelFlow', () => {
  // atomClass info
  const atomClassModule = 'test-flow';
  const atomClassName = 'purchaseOrder';

  let flowId;

  it('atomUserTask_submit', async () => {
    app.mockSession({});

    // login as root
    await app
      .httpRequest()
      .post(mockUrl('/a/auth/passport/a-authsimple/authsimple'))
      .send({
        data: {
          auth: 'root',
          password: '123456',
        },
      });

    // create
    let result = await app
      .httpRequest()
      .post(mockUrl('/a/base/atom/create'))
      .send({
        atomClass: { module: atomClassModule, atomClassName, atomClassIdParent: 0 },
      });
    assert(result.body.code === 0);
    const keyDraft = result.body.data;

    // submit
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/atom/writeSubmit'))
      .send({
        key: keyDraft,
        item: {
          atomName: 'atomUserTask-rejectCancelFlow-test',
          _flowDefKey: 'set01_atomUserTask',
        },
      });
    assert(result.body.code === 0);
    flowId = result.body.data.flow.id;
  });

  it('atomUserTask_reject', async () => {
    app.mockSession({});

    // login as root
    await app
      .httpRequest()
      .post(mockUrl('/a/auth/passport/a-authsimple/authsimple'))
      .send({
        data: {
          auth: 'root',
          password: '123456',
        },
      });

    // select task
    let result = await app
      .httpRequest()
      .post(mockUrl('/a/flowtask/task/select'))
      .send({
        options: {
          where: {
            'a.flowId': flowId,
            'a.flowTaskStatus': 0,
            'a.specificFlag': 0,
          },
          history: 0,
        },
      });
    assert(result.body.code === 0);
    const flowTask = result.body.data.list[0];
    assert(!!flowTask);

    // claim
    result = await app.httpRequest().post(mockUrl('/a/flowtask/task/claim')).send({
      flowTaskId: flowTask.id,
    });
    assert(result.body.code === 0);

    // complete: rejected
    result = await app
      .httpRequest()
      .post(mockUrl('/a/flowtask/task/complete'))
      .send({
        flowTaskId: flowTask.id,
        handle: {
          status: 2,
          remark: 'Rejected',
        },
      });
    assert(result.body.code === 0);
  });

  it('atomUserTask_cancelFlow', async () => {
    app.mockSession({});

    // login as root
    await app
      .httpRequest()
      .post(mockUrl('/a/auth/passport/a-authsimple/authsimple'))
      .send({
        data: {
          auth: 'root',
          password: '123456',
        },
      });

    // select task
    let result = await app
      .httpRequest()
      .post(mockUrl('/a/flowtask/task/select'))
      .send({
        options: {
          where: {
            'a.flowId': flowId,
            'a.flowTaskStatus': 0,
            'a.specificFlag': 0,
          },
          history: 0,
        },
      });
    assert(result.body.code === 0);
    const flowTask = result.body.data.list[0];
    assert(!!flowTask);

    // claim
    result = await app.httpRequest().post(mockUrl('/a/flowtask/task/claim')).send({
      flowTaskId: flowTask.id,
    });
    assert(result.body.code === 0);

    // cancelFlow
    result = await app
      .httpRequest()
      .post(mockUrl('/a/flowtask/task/cancelFlow'))
      .send({
        flowTaskId: flowTask.id,
        handle: {
          // status:3,
          remark: 'Cancelled',
        },
      });
    assert(result.body.code === 0);
  });

  // it('atomUserTask_clear', async () => {
  //   app.mockSession({});

  //   // login as root
  //   await app.httpRequest().post(mockUrl('/a/auth/passport/a-authsimple/authsimple')).send({
  //     data: {
  //       auth: 'root',
  //       password: '123456',
  //     },
  //   });

  //   // select draft
  //   let result = await app.httpRequest().post(mockUrl('/a/base/atom/select')).send({
  //     atomClass: { module: atomClassModule, atomClassName, atomClassIdParent: 0 },
  //     options: {
  //       where: {
  //         atomFlowId: flowId,
  //       },
  //       stage: 'draft',
  //     },
  //   });
  //   assert(result.body.code === 0);
  //   const draft = result.body.data.list[0];
  //   const keyDraft = { atomId: draft.atomId };

  //   // delete
  //   result = await app.httpRequest().post(mockUrl('/a/base/atom/delete')).send({
  //     key: keyDraft,
  //   });
  //   assert(result.body.code === 0);
  // });
});
