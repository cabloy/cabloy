import axios from 'axios';
import mparse from 'egg-born-mparse';

export default function(Vue) {

  // add a response interceptor
  if (!axios.__ebDefaultResponseDisable) {
    // response
    axios.interceptors.response.use(function(response) {
      if (response.data.code !== 0) {
        const error = new Error();
        error.code = response.data.code;
        error.message = response.data.message;
        error.config = response.config;
        return Promise.reject(error);
      }
      return response.data.data;
    }, function(error) {
      if (error.response) {
        error.code = (error.response.data && error.response.data.code) || error.response.status;
        error.message = (error.response.data && error.response.data.message) || error.response.statusText;
      }
      return Promise.reject(error);
    });

    // response
    axios.interceptors.response.use(function(response) {
      return response;
    }, function(error) {
      if (error.code === 401) {
        // login
        Vue.prototype.$meta.vueLayout.openLogin();
      }
      return Promise.reject(error);
    });
  }

  // custom interceptor
  axios.__ebCustomInterceptorRequest && axios.interceptors.request.use(
    axios.__ebCustomInterceptorRequest.resolve,
    axios.__ebCustomInterceptorRequest.reject);
  axios.__ebCustomInterceptorResponse && axios.interceptors.response.use(
    axios.__ebCustomInterceptorResponse.resolve,
    axios.__ebCustomInterceptorResponse.reject);

  // beforeCreate
  Object.defineProperty(axios, '__beforeCreate', {
    enumerable: false,
    get() {
      return function(ctx) {
        return __beforeCreate(ctx);
      };
    },
  });

  function __beforeCreate(ctx) {
    // api
    ctx.$api = {};

    [ 'delete', 'get', 'head', 'options', 'post', 'put', 'patch' ].forEach(key => {
      Vue.prototype.$meta.util.overrideProperty({
        obj: ctx.$api,
        key,
        objBase: axios,
        vueComponent: ctx,
        combilePath: (moduleInfo, arg) => {
          if (arg.substr(0, 2) === '//') return arg.substr(1);
          if (arg.charAt(0) === '/') return `/api${arg}`;
          return `/api/${moduleInfo.url}/${arg}`;
        },
      });
    });
  }

  return axios;
}
