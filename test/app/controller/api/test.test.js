/*
* @Author: zhennann
* @Date:   2017-08-30 13:36:12
* @Last Modified by:   zhennann
* @Last Modified time: 2017-08-31 18:29:30
*/

// eslint-disable-next-line
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/test.test.js', () => {

  it('Hello world', async () => {
    const result = await app.httpRequest()
      .get('/api/test/index');
    assert(result.text === 'Hello world');
  });

});
