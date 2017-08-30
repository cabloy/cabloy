/*
* @Author: zhennann
* @Date:   2017-08-30 13:36:12
* @Last Modified by:   zhennann
* @Last Modified time: 2017-08-30 14:06:57
*/

const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/test.test.js', () => {
  let app;

  before(() => {
    app = mock.app();
    return app.ready();
  });

  afterEach(mock.restore);

  it('Hello world', async () => {
    const result = await app.httpRequest()
      .get('/api/test/index');
    assert(result.text === 'Hello world');
  });

});
