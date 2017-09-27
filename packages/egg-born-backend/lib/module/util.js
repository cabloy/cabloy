/*
* @Author: zhennann
* @Date:   2017-09-24 21:49:55
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-27 23:24:18
*/

const mparse = require('egg-born-mparse');

module.exports = {
  getModuleInfo(context) {
    if (context.__ebModuleInfo === undefined) {
      context.__ebModuleInfo = mparse.parseInfo(mparse.parseName(context.req.mockUrl || context.req.url));
    }
    return context.__ebModuleInfo;
  },
};
