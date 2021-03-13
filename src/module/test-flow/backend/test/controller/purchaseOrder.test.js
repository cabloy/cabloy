const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.only('atom:purchaseOrder', () => {
  it('atom', async () => {
    app.mockSession({});

    // atomClass info
    const atomClassModule = mockInfo().relativeName;
    const atomClassName = 'purchaseOrder';

    // detailClass info
    const detailClassModule = mockInfo().relativeName;
    const detailClassName = 'default';

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      data: {
        auth: 'root',
        password: '123456',
      },
    });

    // create
    let result = await app.httpRequest().post(mockUrl('/a/base/atom/create')).send({
      atomClass: {
        module: atomClassModule,
        atomClassName,
        atomClassIdParent: 0,
      },
    });
    assert(result.body.code === 0);
    const keyDraft = result.body.data;

    // detail
    result = await app.httpRequest().post(mockUrl('/a/detail/detail/create')).send({
      key: {
        atomId: keyDraft.atomId,
      },
      detailClass: {
        module: detailClassModule,
        detailClassName,
      },
    });
    assert(result.body.code === 0);
    const keyDetail = result.body.data;

    // submit
    result = await app.httpRequest().post(mockUrl('/a/base/atom/writeSubmit')).send({
      key: keyDraft,
      item: {
        atomName: 'test',
        description: 'this is a test',
      },
    });
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
