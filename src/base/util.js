/*
* @Author: zhennann
* @Date:   2017-09-12 21:18:27
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-14 22:42:58
*/

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
        import('../../../../module/' + moduleInfo.relativeName + '/front/src/main.js').then(m => {
          return cb(null, m);
        }).catch(e => {
          return cb(e);
        });
      });
  },

  parseModuleInfo(url) {
    const parts = url.split('/');
    if (parts.length < 3) return null;
    return {
      pid: parts[1],
      name: parts[2],
      fullName: `egg-born-module-${parts[1]}-${parts[2]}`,
      relativeName: `${parts[1]}-${parts[2]}`,
    };
  },

};
