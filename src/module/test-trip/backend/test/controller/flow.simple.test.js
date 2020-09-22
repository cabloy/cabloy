const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.only('flow.simple', () => {
  it('[atom]', async () => {
    app.mockSession({});

    // create
    const result = await app.httpRequest().post(mockUrl('/a/base/atom/create')).send({
      atomClass: { module: atomClassModule, atomClassName, atomClassIdParent: 0 },
    });
    assert(result.body.code === 0);
    const atomKey = result.body.data;


  });
});
