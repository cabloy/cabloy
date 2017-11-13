import util from './util.js';

export default function(Vue, axios) {

  // indicator
  let indicatorCounter = 0;

  // add a response interceptor
  if (!axios.__ebDefaultResponseDisable) {

    // request
    axios.interceptors.request.use(function(config) {
      (!config.silent) && (++indicatorCounter > 0) && axios.onShowIndicator && axios.onShowIndicator();
      return config;
    }, function(error) {
      return Promise.reject(error);
    });

    // response
    axios.interceptors.response.use(function(response) {
      (!response.config.silent) && (--indicatorCounter === 0) && axios.onHideIndicator && axios.onHideIndicator();
      return response;
    }, function(error) {
      (!error.config.silent) && (--indicatorCounter === 0) && axios.onHideIndicator && axios.onHideIndicator();
      return Promise.reject(error);
    });

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
        // emit event: login
        Vue.prototype.$meta.eventHub.$emit(Vue.prototype.$meta.constant.event.login, null);
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

  // mixin
  Vue.mixin({ beforeCreate() {

    // cache route path
    if (this.$parent && this.$parent.__ebRoutePath) { this.__ebRoutePath = this.$parent.__ebRoutePath; } else if (this.$route) { this.__ebRoutePath = this.$route.path; }

    // api
    this.$api = {};

    [ 'delete', 'get', 'head', 'options', 'post', 'put', 'patch' ].forEach(key => {
      util.overrideProperty({
        obj: this.$api,
        key,
        objBase: axios,
        vueComponent: this,
        combilePath: (moduleInfo, arg) => {
          if (arg.substr(0, 2) === '//') return arg.substr(1);
          if (arg.charAt(0) === '/') return `/api${arg}`;
          return `/api/${moduleInfo.url}/${arg}`;
        },
      });
    });

  } });

  return axios;

}
