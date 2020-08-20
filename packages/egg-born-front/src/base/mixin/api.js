import axios from 'axios';

export default function(Vue) {

  // axios
  Vue.prototype.$meta.axios = axios;

  // api
  Vue.prototype.$meta.api = {};
  wrapApi(Vue, Vue.prototype.$meta.api, axios, null);

  // add a response interceptor
  if (!axios.__ebDefaultResponseDisable) {
    // response
    axios.interceptors.response.use(function(response) {
      if (response.headers['content-type'].indexOf('application/json') === -1) return response;
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

    // add a request interceptor
    axios.interceptors.request.use(function(config) {
      if (Vue.prototype.$meta.config.base.jwt) {
        if (!config.headers) config.headers = {};
        config.headers.Authorization = `Bearer ${window.localStorage['eb-jwt'] || ''}`;
      }
      return config;
    }, function(error) {
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
  const beforeCreate = function(ctx) {
    // api
    ctx.$api = {};
    wrapApi(Vue, ctx.$api, axios, ctx);
  };

  return { beforeCreate };
}

function wrapApi(Vue, obj, objBase, vueComponent) {
  [ 'delete', 'get', 'head', 'options', 'post', 'put', 'patch' ].forEach(key => {
    Vue.prototype.$meta.util.overrideProperty({
      obj,
      key,
      objBase,
      vueComponent,
      combinePath: (moduleInfo, arg) => {
        return Vue.prototype.$meta.util.combineFetchPath(moduleInfo, arg);
      },
    });
  });
}
