const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('flow.set02_behaviorOvertime', () => {
  it('behaviorOvertime', async () => {
    app.mockSession({});

    // atomClass info
    const atomClassModule = mockInfo().relativeName;
    const atomClassName = 'purchaseOrder';

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
          atomName: 'behaviorOverTime-test',
          _flowDefKey: 'set02_behaviorOvertime',
        },
      });
    assert(result.body.code === 0);
    const flowId = result.body.data.flow.id;

    // sleep first
    await app.bean.util.sleep(5000);

    // activity_1 will be overtime, and transfer to startEvent_1
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
    let flowTask = result.body.data.list[0];
    assert.equal(flowTask.flowNodeDefId, 'startEvent_1');

    // handle task and transfer to activity_1

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
          remark: 'Submit again!',
        },
      });
    assert(result.body.code === 0);

    // handle task immediately

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
    assert.equal(flowTask.flowNodeDefId, 'activity_1');

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
          atomName: 'behaviorOverTime-test!!',
          description: 'modified by userTask',
          _flowDefKey: 'would not been modified',
        },
      });
    assert(result.body.code === 0);

    // // sleep for verifing the overtime job not running
    // await app.bean.util.sleep(5000);

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
