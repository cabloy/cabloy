/*
* @Author: zhennann
* @Date:   2017-09-24 21:49:55
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-24 21:53:56
*/

const moduleUtil = require('./module-util.js');

module.exports = {
  getModuleInfo(context) {
    if (context.__ebModuleInfo === undefined) {
      context.__ebModuleInfo = moduleUtil.parseInfo(moduleUtil.parseName(context.request.url));
    }
    return context.__ebModuleInfo;
  },
};
