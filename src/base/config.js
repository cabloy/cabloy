/*
* @Author: zhennann
* @Date:   2017-09-27 12:03:44
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-27 14:09:28
*/

import util from './util.js';

export default function(Vue, _config) {

  // config
  const config = _config || {};
  config.module = config.module || {};

  // mixin
  Vue.mixin({ beforeCreate() {

    const self = this;

    Object.defineProperty(this, '$config', {
      get() {
        const moduleInfo = util.getModuleInfo(self);
        return config.module[moduleInfo.relativeName];
      },
    });

  } });

  return config;
}
