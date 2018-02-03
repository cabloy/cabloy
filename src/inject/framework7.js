import fns from '../base/fns.js';

export default function(Vue, options, cb) {
  // router
  require('./router.js').default(Vue);
  // load sync modules
  Vue.prototype.$meta.module.requireAll();
  // load layout module
  Vue.prototype.$meta.module.use(options.meta.layout, module => {
    return cb(prepareParameters(module));
  });

  // prepare parameters
  function prepareParameters(moduleLayout) {
    // f7 parameters
    const f7Parameters = {
      el: '#app',
      render: c => c('layout'),
      store: Vue.prototype.$meta.store,
      routes: [],
      framework7: {
        theme: 'md',
      },
      methods: {
        onF7Ready() {
          // load waiting modules
          Vue.prototype.$meta.module.loadWaitings();
          // remove app loading
          Vue.prototype.$meta.util.removeAppLoading();
        },
      },
      components: {
        layout: moduleLayout.options.components.layout,
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

