import fns from '../base/fns.js';
import App from './pages/app.vue';
import routes from './routes.js';
import patch from './patch.js';

export default function(Vue, options, cb) {
  // clear router history
  Vue.prototype.$meta.util.clearRouterHistory();
  // patch
  patch(Vue);
  // load sync modules
  Vue.prototype.$meta.module.requireAll();
  // prepare parameters
  return cb(prepareParameters(options));

  // prepare parameters
  function prepareParameters(options) {
    // f7 parameters
    const f7Parameters = {
      el: '#app',
      render: c => c('app', { ref: 'app' }),
      store: Vue.prototype.$meta.store,
      routes,
      framework7: {
        theme: 'md',
      },
      components: {
        App,
      },
      methods: {
        onF7Ready() {
          // load waiting modules
          Vue.prototype.$meta.module.loadWaitings();
          // remove app loading
          Vue.prototype.$meta.util.removeAppLoading();
        },
      },
    };

    // extend parameters
    const parametersNew = {};
    Vue.prototype.$utils.extend(parametersNew, options.parameters);
    Vue.prototype.$utils.extend(parametersNew, f7Parameters);

    if (options.parameters.methods && options.parameters.methods.onF7Ready) {
      parametersNew.methods.onF7Ready = fns([ options.parameters.methods.onF7Ready, f7Parameters.methods.onF7Ready ]);
    }

    return parametersNew;
  }

}

