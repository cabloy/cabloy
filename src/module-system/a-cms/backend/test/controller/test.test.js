const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test.test.js', () => {
  it('action:render article', async () => {
    app.mockSession({});

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'root',
      password: '123456',
    });

    // create
    let result = await app.httpRequest().post(mockUrl('/a/base/atom/create')).send({
      atomClass: { module: mockInfo().relativeName, atomClassName: 'article', atomClassIdParent: 0 },
    });
    assert(result.body.code === 0);
    const atomKey = result.body.data;

    // submit
    result = await app.httpRequest().post(mockUrl('/a/base/atom/submit')).send({
      key: atomKey,
      item: {
        atomName: 'hello world',
        language: 'en-us',
      },
    });
    assert(result.body.code === 0);

    // publish
    result = await app.httpRequest().post(mockUrl('/a/base/atom/action')).send({
      action: 101,
      key: atomKey,
    });
    assert(result.body.code === 0);

  });

  it('action:build language', async () => {
    app.mockSession({});

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'root',
      password: '123456',
    });

    const result = await app.httpRequest().post(mockUrl('site/buildLanguage')).send({
      language: 'en-us',
    });
    assert(result.body.code === 0);
    console.log('time used: ', result.body.data.time);

  });

  it.only('action:build languages', async () => {
    app.mockSession({});

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'root',
      password: '123456',
    });

    const result = await app.httpRequest().post(mockUrl('site/buildLanguages')).send();
    assert(result.body.code === 0);
    console.log('time used: ', result.body.data.time);

  });

});
