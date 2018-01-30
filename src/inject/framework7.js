import util from '../base/util.js';
import fns from '../base/fns.js';

export default function(Vue, meta, options) {
  const f7Options = {
    el: '#app',
    render: c => c('app'),
    store: meta.store,
    routes: [],
    framework7: {
      theme: 'md',
    },
    methods: {
      onF7Ready(f7) {
        // routes
        meta.f7Routes = f7.routes;

        // load sync modules
        util.requireModules((m, moduleInfo) => {
          this.__installJS(m, null, moduleInfo, null);
        });
        // remove app loading
        util.removeAppLoading();
      },
    },
  };

  const optionsNew = {};
  Vue.prototype.$utils.extend(optionsNew, options);
  Vue.prototype.$utils.extend(optionsNew, f7Options);

  if (options.methods && options.methods.onF7Ready) {
    optionsNew.methods.onF7Ready = fns([ options.methods.onF7Ready, f7Options.methods.onF7Ready ]);
  }

  return optionsNew;
}

