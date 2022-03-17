const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('atom:purchaseOrder', () => {
  it('atom', async () => {
    app.mockSession({});

    // atomClass info
    const atomClassModule = mockInfo().relativeName;
    const atomClassName = 'purchaseOrder';

    // detailClass info
    const detailClassModule = mockInfo().relativeName;
    const detailClassName = 'default';

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
        atomClass: {
          module: atomClassModule,
          atomClassName,
          atomClassIdParent: 0,
        },
      });
    assert(result.body.code === 0);
    const keyDraft = result.body.data;

    // detail: create
    result = await app
      .httpRequest()
      .post(mockUrl('/a/detail/detail/create'))
      .send({
        atomKey: keyDraft,
        detailClass: {
          module: detailClassModule,
          detailClassName,
        },
      });
    assert(result.body.code === 0);
    const detailKey = result.body.data;

    // detail: write
    result = await app
      .httpRequest()
      .post(mockUrl('/a/detail/detail/write'))
      .send({
        key: detailKey,
        item: {
          detailCode: 'test:321',
          detailName: 'test',
          price: 321,
          quantity: 2,
        },
      });
    assert(result.body.code === 0);

    // detail: read
    result = await app.httpRequest().post(mockUrl('/a/detail/detail/read')).send({
      key: detailKey,
    });
    assert(result.body.code === 0);

    // detail: select
    result = await app
      .httpRequest()
      .post(mockUrl('/a/detail/detail/select'))
      .send({
        atomKey: keyDraft,
        detailClass: {
          module: detailClassModule,
          detailClassName,
        },
      });
    assert(result.body.code === 0);

    // detail: count
    result = await app.httpRequest().post(mockUrl('/a/detail/detail/count')).send({
      atomKey: keyDraft,
      // detailClass: {
      //   module: detailClassModule,
      //   detailClassName,
      // },
    });
    assert(result.body.code === 0);

    // // detail: delete
    // result = await app.httpRequest().post(mockUrl('/a/detail/detail/delete')).send({
    //   key: detailKey,
    // });
    // assert(result.body.code === 0);

    // submit
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/atom/writeSubmit'))
      .send({
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
