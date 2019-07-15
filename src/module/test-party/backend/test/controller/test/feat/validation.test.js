const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/validation.test.js', () => {

  it('action:validation:success', async () => {
    const data = {
      groupInfo: {
        username: 'zhennann',
      },
      groupExtra: {
        panelExtra: {
          groupInfo: {
            mobile: '123',
            sex: 1,
            language: 'en-us',
          },
        },
      },
    };

    const result = await app.httpRequest().post(mockUrl('test/feat/validation/success'))
      .send({ data });
    assert.equal(result.body.code, 0);
  });

  it('action:validation:fail', async () => {
    const data = {
      groupInfo: {
        username: '', // Not empty
      },
      groupExtra: {
        panelExtra: {
          groupInfo: {
            mobile: '', // Not empty
            sex: 1,
            language: 'en-us',
          },
        },
      },
    };

    const result = await app.httpRequest().post(mockUrl('test/feat/validation/fail'))
      .send({ data });
    assert.equal(result.status, 500);
  });

  it('action:validation:schema', async () => {
    const data = {
      panelExtra: {
        groupInfo: {
          mobile: '123',
          sex: 1,
          language: 'en-us',
        },
      },
    };

    const result = await app.httpRequest().post(mockUrl('test/feat/validation/schema'))
      .send({ data });
    assert.equal(result.body.code, 0);
  });

});
