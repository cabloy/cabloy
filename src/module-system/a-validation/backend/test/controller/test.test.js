const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test.test.js', () => {

  it('action:validate1', async () => {
    // schema: root
    const result = await app.httpRequest().post(mockUrl('test/validate1')).send({
      data: {
        info: {
          username: 'zhennann',
          password: '123456',
          sex: 1,
        },
        extra: {
          extra: {
            info: {
              language: 'en-us',
            },
          },
        },
      },
    });
    assert(result.body.code === 0);
  });

  it('action:validate2', async () => {
    const result = await app.httpRequest().post(mockUrl('test/validate2?locale=zh-cn')).send({
      data: {
        info: {
          username: 'zhennann',
          password: '123456',
          sex: 1,
        },
        extra: {
          extra: {
            info: {
              language: 'en', // 'en-us',
            },
          },
        },
      },
    });
    assert(result.body.code !== 0);
  });

  it('action:validate3', async () => {
    // schema: extra
    const result = await app.httpRequest().post(mockUrl('test/validate3')).send({
      data: {
        extra: {
          info: {
            language: 'en-us',
          },
        },
      },
    });
    assert(result.body.code === 0);
  });

});
