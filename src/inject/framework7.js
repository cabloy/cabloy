import App from './pages/app.vue';
import routes from './routes.js';
import patchDevice from './patch/device.js';
import patchRouter from './patch/router.js';

export default function(Vue, options, cb) {
  // patch device
  patchDevice(Vue);
  // patch router
  patchRouter(Vue);
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
      framework7: {
        theme: 'md',
        modal: {
          moveToRoot: false,
        },
        calendar: {
          routableModals: false,
        },
        toast: {
          closeTimeout: 3000,
        },
        swipeout: {
          removeElements: false,
        },
        colorPicker: {
          routableModals: false,
          openInPhone: 'sheet',
        },
        picker: {
          routableModals: false,
        },
        smartSelect: {
          routableModals: false,
        },
        router: {
          initEmpty: '/',
        },
        routes,
      },
      components: {
        App,
      },
      mounted() {
        this.$f7ready(() => {
          // load waiting modules
          Vue.prototype.$meta.module.loadWaitings();
          // remove app loading
          Vue.prototype.$meta.util.removeAppLoading();
        });
      },
    };

    // extend parameters
    const parametersNew = {};
    Vue.prototype.$utils.extend(parametersNew, options.parameters);
    Vue.prototype.$utils.extend(parametersNew, f7Parameters);

    return parametersNew;
  }

}

