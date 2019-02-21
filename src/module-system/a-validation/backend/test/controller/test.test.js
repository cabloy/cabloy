const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test.test.js', () => {

  it('action:validate1', async () => {
    // schema: root
    let result = await app.httpRequest().post(mockUrl('test/validate1')).send({
      validation: {
        validator: 'test',
      },
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
    // schema: extra
    result = await app.httpRequest().post(mockUrl('test/validate1')).send({
      validation: {
        validator: 'test',
        schema: 'extra',
      },
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

});
