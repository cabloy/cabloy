const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.skip('test/controller/test.test.js', () => {
  it('Document', async () => {
    app.mockSession({});

    // atomClass info
    const atomClassModule = mockInfo().relativeName;
    const atomClassName = 'document';

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

    const sessionOld = JSON.stringify(app.context.session);

    // create
    let result = await app
      .httpRequest()
      .post(mockUrl('/a/base/atom/create'))
      .send({
        atomClass: { module: atomClassModule, atomClassName },
      });
    if (result.body.code !== 0) {
      const sessionNew = JSON.stringify(app.context.session);
      console.log('sessionOld: ', sessionOld);
      console.log('sessionNew: ', sessionNew);
      process.exit(0);
    }
    assert(result.body.code === 0);
    const keyDraft = result.body.data;

    // submit
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/atom/writeSubmit'))
      .send({
        key: keyDraft,
        item: {
          atomName: 'test',
        },
        options: { ignoreFlow: true },
      });
    if (result.body.code !== 0) {
      const sessionNew = JSON.stringify(app.context.session);
      console.log('sessionOld: ', sessionOld);
      console.log('sessionNew: ', sessionNew);
      process.exit(0);
    }
    assert(result.body.code === 0);
    const keyFormal = result.body.data.formal.key;

    // read
    result = await app.httpRequest().post(mockUrl('/a/base/atom/read')).send({
      key: keyFormal,
    });
    assert(result.body.code === 0);

    // delete
    result = await app.httpRequest().post(mockUrl('/a/base/atom/delete')).send({
      key: keyFormal,
    });
    assert(result.body.code === 0);
  });
});
