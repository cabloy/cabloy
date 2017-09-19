/*
* @Author: zhennann
* @Date:   2017-09-19 18:36:54
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-19 22:11:26
*/

const PREFIX_A = '/api/';
const PREFIX_B = 'egg-born-module-';

module.exports = {
  // aa-hello aa/hello
  parseInfo(moduleName) {
    if (!moduleName) return null;
    let parts = moduleName.split('-');
    if (parts.length < 2) {
      if (moduleName.charAt(0) === '/') moduleName = moduleName.substr(1);
      parts = moduleName.split('/');
      if (parts.length < 2) return null;
    }
    return {
      pid: parts[0],
      name: parts[1],
      fullName: `egg-born-module-${parts[0]}-${parts[1]}`,
      relativeName: `${parts[0]}-${parts[1]}`,
      url: `${parts[0]}/${parts[1]}`,
    };
  },
  // /api/aa/hello/home/index
  // egg-born-module-aa-hello
  parseName(moduleUrl) {
    if (!moduleUrl) return null;
    if (moduleUrl.indexOf(PREFIX_A) === 0) {
      const posA = PREFIX_A.length;
      const posB = moduleUrl.indexOf('/', posA) + 1;
      const posC = moduleUrl.indexOf('/', posB);
      return moduleUrl.substring(posA, posC);
    } else if (moduleUrl.indexOf(PREFIX_B) === 0) {
      return moduleUrl.substr(PREFIX_B.length);
    }
    return null;
  },
};
