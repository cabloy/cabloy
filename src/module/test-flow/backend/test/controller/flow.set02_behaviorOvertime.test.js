const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.only('flow.set02_behaviorOvertime', () => {
  it('behaviorOvertime', async () => {
    app.mockSession({});

    // atomClass info
    const atomClassModule = mockInfo().relativeName;
    const atomClassName = 'purchaseOrder';

    // login as root
    await app
      .httpRequest()
      .post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple'))
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
          atomName: 'atomUserTask-test',
          _flowDefKey: 'set02_behaviorOvertime',
        },
      });
    assert(result.body.code === 0);
    const flowId = result.body.data.flow.id;

    // sleep first
    await app.bean.util.sleep(5000);

    // sleep second
    await app.bean.util.sleep(5000);

    // select task
    result = await app
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
    flowTask = result.body.data.list[0];
    assert(!!flowTask);

    // claim
    result = await app.httpRequest().post(mockUrl('/a/flowtask/task/claim')).send({
      flowTaskId: flowTask.id,
    });
    assert(result.body.code === 0);

    // complete
    result = await app
      .httpRequest()
      .post(mockUrl('/a/flowtask/task/complete'))
      .send({
        flowTaskId: flowTask.id,
        handle: {
          status: 1,
          remark: 'Nice Work!',
        },
        formAtom: {
          atomName: 'startEventAtom-test!!',
          description: 'modified by userTask',
          _flowDefKey: 'would not been modified',
        },
      });
    assert(result.body.code === 0);

    // select formal
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/atom/select'))
      .send({
        atomClass: { module: atomClassModule, atomClassName, atomClassIdParent: 0 },
        options: {
          where: {
            atomFlowId: flowId,
          },
          stage: 'formal',
        },
      });
    assert(result.body.code === 0);
    const formal = result.body.data.list[0];
    const keyFormal = { atomId: formal.atomId };

    // delete
    result = await app.httpRequest().post(mockUrl('/a/base/atom/delete')).send({
      key: keyFormal,
    });
    assert(result.body.code === 0);
  });
});
