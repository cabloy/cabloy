let _ddInstance = null;

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ ctx, action }) {
      if (action.name === 'config') return this._createConfig({ ctx });
    },
    _createConfig(/* { ctx } */) {
      if (!this.$device.dingtalk) return Promise.resolve(null);
      if (_ddInstance) return Promise.resolve(_ddInstance);
      return new Promise((resolve, reject) => {
        // load jweixin-1.6.0.js
        this.$meta.util.loadScript(this.$config.jssdk.url.dingtalk, () => {
          const url = location.href.split('#')[0];
          this._jsconfig(url).then(config => {
            _ddInstance = { dd: window.dd, config };
            resolve(_ddInstance);
          }).catch(e => reject(e));
        });
      });
    },
    _jsconfig(url) {
      return new Promise((resolve, reject) => {
        this.$api.post('jssdk/jsconfig', { url }).then(config => {
          window.dd.config(config);
          window.dd.error(e => {
            reject(e.errMsg);
          });
          window.dd.ready(() => {
            resolve(config);
          });
        }).catch(e => {
          reject(e);
        });
      });
    },
  },
};
