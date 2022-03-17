const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('flow.set00', () => {
  it('simple', async () => {
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
    // flow start
    const result = await app
      .httpRequest()
      .post(mockUrl('flow/start'))
      .send({
        flowDefKey: {
          module: mockInfo().relativeName,
          name: 'set00_simple',
        },
        flowVars: {
          a: 1,
          b: 2,
        },
      });
    assert(result.body.code === 0);
  });
  it('edgeSequence', async () => {
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
    // flow start
    let result = await app
      .httpRequest()
      .post(mockUrl('flow/start'))
      .send({
        flowDefKey: {
          module: mockInfo().relativeName,
          name: 'set00_edgeSequence',
        },
        flowVars: {
          x: 1,
        },
      });
    assert(result.body.code === 0);
    result = await app
      .httpRequest()
      .post(mockUrl('flow/start'))
      .send({
        flowDefKey: {
          module: mockInfo().relativeName,
          name: 'set00_edgeSequence',
        },
        flowVars: {
          x: 2,
        },
      });
    assert(result.body.code === 0);
  });
  it('activityNone', async () => {
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
    // flow start
    const result = await app
      .httpRequest()
      .post(mockUrl('flow/start'))
      .send({
        flowDefKey: {
          module: mockInfo().relativeName,
          name: 'set00_activityNone',
        },
      });
    assert(result.body.code === 0);
  });
  it('activityService', async () => {
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
    // flow start
    const result = await app
      .httpRequest()
      .post(mockUrl('flow/start'))
      .send({
        flowDefKey: {
          module: mockInfo().relativeName,
          name: 'set00_activityService',
        },
      });
    assert(result.body.code === 0);
  });
  // it('startEventTimer', async () => {
  //   app.mockSession({});
  //   // login as root
  //   await app.httpRequest().post(mockUrl('/a/auth/passport/a-authsimple/authsimple')).send({
  //     data: {
  //       auth: 'root',
  //       password: '123456',
  //     },
  //   });
  //   // flow start
  //   const result = await app.httpRequest().post(mockUrl('flow/start')).send({
  //     flowDefKey: {
  //       module: mockInfo().relativeName,
  //       name: 'set00_startEventTimer',
  //     },
  //   });
  //   assert(result.body.code === 0);
  // });
});
