const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.only('flow.set00', () => {
  it('simple', async () => {
    app.mockSession({});

    // create
    const result = await app.httpRequest().post(mockUrl('flow/start')).send({
      flowDefinitionKey: {
        module: mockInfo().relativeName,
        name: 'set00_simple',
      },
    });
    assert(result.body.code === 0);

  });
});
