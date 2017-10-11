/*
* @Author: zhennann
* @Date:   2017-09-24 17:13:11
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-11 14:07:15
*/

import util from './util.js';

export default function(Vue, axios) {

  // add a response interceptor
  if (!axios.__ebDefaultDisable) {
    axios.interceptors.response.use(function(response) {
      if (response.data.code !== 0) {
        const error = new Error();
        error.code = response.data.code;
        error.message = response.data.message;
        return Promise.reject(error);
      }
      return response.data.data;
    }, function(error) {
      error.code = error.response.data.code || error.response.status;
      error.message = error.response.data.message || error.response.statusText;
      return Promise.reject(error);
    });
  }

  // mixin
  Vue.mixin({ beforeCreate() {

    this.$api = {};

    [ 'delete', 'get', 'head', 'options', 'post', 'put', 'patch' ].forEach(key => {
      util.overrideProperty({
        obj: this.$api,
        key,
        objBase: axios,
        vueComponent: this,
        combilePath: (moduleInfo, arg) => {
          return (arg.charAt(0) === '/') ? arg : `/api/${moduleInfo.pid}/${moduleInfo.name}/${arg}`;
        },
      });
    });

  } });

  return axios;

}
