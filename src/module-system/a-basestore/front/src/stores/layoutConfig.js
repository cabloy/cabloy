export default function (Vue) {
  return {
    state() {
      return {
        layoutConfig: {},
        // queueLayoutConfig: null,
      };
    },
    created() {
      // queue
      this.queueLayoutConfig = Vue.prototype.$meta.util.queue((info, cb) => {
        this.__queueTaskHandle({ info })
          .then(() => {
            // donothing
            cb();
          })
          .catch(err => {
            console.error(err);
            cb(err);
          });
      });
      // login
      Vue.prototype.$meta.eventHub.$on('auth:login', data => {
        this.__authLogin(data);
      });
    },
    actions: {
      __authLogin() {
        this.layoutConfig = {};
      },
      async __queueTaskHandle({ info }) {
        const user = Vue.prototype.$meta.store.getState('auth/user');
        if (user.op.id !== info.userId) return;
        await Vue.prototype.$meta.api.post('/a/base/layoutConfig/saveKey', info.data);
      },
      setLayoutConfig({ module, data }) {
        this.layoutConfig[module] = data;
      },
      async setLayoutConfigKey({ module, key, value }) {
        // 新增的属性是否有响应式
        const layoutConfigModule = this.layoutConfig[module] || {};
        layoutConfigModule[key] = value;
        // state.layoutConfig = {
        //   ...state.layoutConfig,
        //   [module]: layoutConfigModule,
        // };
        // try to save
        const user = Vue.prototype.$meta.store.getState('auth/user');
        if (user.op.anonymous) {
          return;
        }
        return new Promise((resolve, reject) => {
          const data = { module, key, value };
          this.queueLayoutConfig.push({ userId: user.op.id, data }, err => {
            if (err) reject(err);
            resolve();
          });
        });
      },
      async getLayoutConfig({ module }) {
        if (this.layoutConfig[module]) return this.layoutConfig[module];
        let data = await Vue.prototype.$meta.api.post('/a/base/layoutConfig/load', { module });
        data = data || {};
        this.setLayoutConfig({ module, data });
        return data;
      },
    },
  };
}
