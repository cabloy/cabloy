let _wxInstance = null;

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ ctx, action }) {
      if (action.name === 'config') return this._createConfig({ ctx });
    },
    _createConfig(/* { ctx } */) {
      if (!this.$device.wxwork) return Promise.resolve(null);
      if (_wxInstance) return Promise.resolve({ wx: _wxInstance });
      return new Promise((resolve, reject) => {
        // load jweixin-1.0.0.js
        this.$meta.util.loadScript(this.$config.jssdk.url.jweixin, () => {
          const url = location.href.split('#')[0];
          this._jsconfig(url).then(() => {
            this._jsconfigAgent(url).then(() => {
              _wxInstance = window.wx;
              resolve({ wx: window.wx });
            }).catch(e => reject(e));
          }).catch(e => reject(e));
        });
      });
    },
    _jsconfig(url) {
      return new Promise((resolve, reject) => {
        this.$api.post('jssdk/jsconfig', { url }).then(params => {
          window.wx.config(params);
          window.wx.error(e => {
            reject(e.errMsg);
          });
          window.wx.ready(() => {
            resolve();
          });
        }).catch(e => {
          reject(e);
        });
      });
    },
    _jsconfigAgent(url) {
      return new Promise((resolve, reject) => {
        this.$api.post('jssdk/jsconfigAgent', { url }).then(params => {
          params.success = () => {
            resolve();
          };
          params.fail = res => {
            if (res.errMsg.indexOf('function not exist') > -1) {
              console.log('企业微信版本过低，请升级');
            }
            reject(res.errMsg);
          };
          window.wx.agentConfig(params);
        }).catch(e => {
          reject(e);
        });
      });
    },
  },
};
