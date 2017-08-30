/*
* @Author: zhennann
* @Date:   2017-08-30 12:00:08
* @Last Modified by:   zhennann
* @Last Modified time: 2017-08-30 12:01:21
*/

module.exports = app => {
  app.get('/api/test/index', app.controller.api.test.index);
};
