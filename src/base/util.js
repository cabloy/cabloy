/*
* @Author: zhennann
* @Date:   2017-09-12 21:18:27
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-21 10:52:01
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

  requireJS(modules, local, cb) {
    const r = local ?
      require.context('../../../../src/module/', true, /-sync\/front\/src\/main\.js$/) :
      require.context('../../build/__module/', true, /-sync\/dist\/front\.js$/);
    r.keys().forEach(key => {
      const moduleInfo = moduleUtil.parseInfo(moduleUtil.parseName(key));
      if (!modules[moduleInfo.fullName]) {
        const m = r(key);
        modules[moduleInfo.fullName] = m;
        cb(m, moduleInfo);
      }
    });
    return modules;
  },

  requireModules(cb) {
    this.requireCSS();
    this.requireJS(this.requireJS({}, false, cb), true, cb);
  },

};
