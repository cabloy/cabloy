/*
* @Author: zhennann
* @Date:   2017-09-12 21:18:27
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-20 17:30:42
*/
import moduleUtil from './module-util.js';

export default {

  importCSS(moduleInfo, cb) {
      import('../../build/__module/' + moduleInfo.fullName + '/dist/front.css').then(() => {
        return cb(null);
      }).catch(e => {
        return cb(e);
      });
  },

  importJS(moduleInfo, cb) {
      import('../../build/__module/' + moduleInfo.fullName + '/dist/front.js').then(m => {
        return cb(null, m);
      }).catch(() => {
        import('../../../../src/module/' + moduleInfo.relativeName + '/front/src/main.js').then(m => {
          return cb(null, m);
        }).catch(e => {
          return cb(e);
        });
      });
  },

  requireCSS() {
    const r = require.context('../../build/__module/', true, /-sync\/dist\/front\.css$/);
    r.keys().forEach(key => r(key));
  },

  requireJS(cb) {
    const r = require.context('../../build/__module/', true, /-sync\/dist\/front\.js$/);
    r.keys().forEach(key => {
      const m = r(key);
      const moduleInfo = moduleUtil.parseInfo(moduleUtil.parseName(key));
      cb(m, moduleInfo);
    });
  },

  requireJSLocal(cb) {
    const r = require.context('../../../../src/module/', true, /-sync\/front\/src\/main\.js$/);
    r.keys().forEach(key => {
      const m = r(key);
      const moduleInfo = moduleUtil.parseInfo(moduleUtil.parseName(key));
      cb(m, moduleInfo);
    });
  },

};
