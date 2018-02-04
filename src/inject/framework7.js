import fns from '../base/fns.js';
import App from './pages/app.vue';
import routes from './routes.js';
import util from '../base/util.js';
import patch from './patch.js';

export default function(Vue, options, cb) {
  // patch
  patch(Vue);
  // load sync modules
  Vue.prototype.$meta.module.requireAll();
  // load module layout
  Vue.prototype.$meta.module.use(options.meta.layout, module => {
    return cb(prepareParameters(options, module));
  });

  // prepare parameters
  function prepareParameters(options, moduleLayout) {
    // layout component
    App.components.ebLayout = moduleLayout.options.components.layout;
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
          util.removeAppLoading();
          // invoke layout.start
          Vue.prototype.$meta.vueLayout.start({
            login: options.meta.login,
            loginOnStart: options.meta.loginOnStart,
          });
        },
      },
    };

    const parametersNew = {};
    Vue.prototype.$utils.extend(parametersNew, options.parameters);
    Vue.prototype.$utils.extend(parametersNew, f7Parameters);

    if (options.parameters.methods && options.parameters.methods.onF7Ready) {
      parametersNew.methods.onF7Ready = fns([ options.parameters.methods.onF7Ready, f7Parameters.methods.onF7Ready ]);
    }

    return parametersNew;
  }

}

