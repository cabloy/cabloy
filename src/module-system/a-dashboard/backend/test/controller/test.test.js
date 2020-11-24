const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.only('[your tests start from here]', () => {
  it('[atom]', async () => {
    app.mockSession({});

    // atomClass info
    const atomClassModule = mockInfo().relativeName;
    const atomClassName = 'dashboard';

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      data: {
        auth: 'root',
        password: '123456',
      },
    });

    // create
    let result = await app.httpRequest().post(mockUrl('/a/base/atom/create')).send({
      atomClass: { module: atomClassModule, atomClassName, atomClassIdParent: 0 },
    });
    assert(result.body.code === 0);
    const keyDraft = result.body.data;

    // submit
    result = await app.httpRequest().post(mockUrl('/a/base/atom/writeSubmit')).send({
      key: keyDraft,
      item: {
        atomName: 'test',
        description: 'this is a test',
      },
    });
    assert(result.body.code === 0);
    const keyArchive = result.body.data.archive.key;

    // read
    result = await app.httpRequest().post(mockUrl('/a/base/atom/read')).send({
      key: keyArchive,
    });
    assert(result.body.code === 0);

    // delete
    result = await app.httpRequest().post(mockUrl('/a/base/atom/delete')).send({
      key: keyArchive,
    });
    assert(result.body.code === 0);

  });
});
