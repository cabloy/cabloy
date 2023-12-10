const __appKeyDefault = 'a-app:appDefault';
const __appKeyBase = 'a-app:appBase';
const __atomClassApp = {
  module: 'a-app',
  atomClassName: 'app',
};

export default function (Vue) {
  const query = Vue.prototype.$utils.parseUrlQuery();

  return {
    state() {
      return {
        // user
        currentInner: {
          appKey: null,
          appLanguage: null,
        },
        appItemsAll: null,
        // layoutConfig: null, // should not cache, because maybe changed
        // global
        appItems: {},
      };
    },
    created() {
      Vue.prototype.$meta.eventHub.$on('auth:login', () => {
        this.clearUserInfo();
      });
    },
    getters: {
      current() {
        // appKey
        const appKey = this.currentInner.appKey;
        // appLanguage
        const appLanguage = this.currentInner.appLanguage;
        // ok
        return {
          appKey,
          appLanguage,
        };
      },
      appItemCurrent() {
        return this.appItems[this.current.appKey];
      },
      presetConfigCurrent() {
        const appItem = this.appItemCurrent;
        if (!appItem) return null;
        // preset config
        return __getPresetConfig({ Vue, appItem, current: this.current });
      },
    },
    actions: {
      clearUserInfo() {
        // clear
        // // maybe fallback to appDefault from appSystem
        // if (state.currentInner.appKey === __appKeyDefault) {
        //   state.currentInner.appKey = null;
        // }
        // for more general scenes
        this.currentInner.appKey = null;
        this.appItemsAll = null;
        //
        // this.layoutConfig = null;
      },
      async setCurrent({ appKey, appLanguage }) {
        if (!appKey && !appLanguage) return;
        if (appKey) this.currentInner.appKey = appKey;
        if (appLanguage) this.currentInner.appLanguage = appLanguage;
        // save current
        await this.__saveCurrent_inner({ current: this.currentInner });
      },
      setAppItem({ appKey, appItem }) {
        this.appItems[appKey] = appItem;
      },
      setAppItemsAll({ appItems }) {
        this.appItemsAll = appItems;
      },
      // setLayoutConfig(state, { layoutConfig }) {
      //   state.layoutConfig = layoutConfig;
      // },
      async getLayoutConfig(/* { state, commit }*/) {
        // if (state.layoutConfig) return state.layoutConfig;
        const layoutConfig = await Vue.prototype.$meta.store.dispatch('a/base/getLayoutConfig', 'a-basefront');
        // commit('setLayoutConfig', { layoutConfig });
        return layoutConfig;
      },
      async getCurrent() {
        // force exists
        const layoutConfig = await this.getLayoutConfig();
        // current
        if (this.currentInner.appKey) {
          // has inited
          return this.current;
        }
        // layout config
        const layoutConfigKey = __getLayoutConfigKey({ Vue });
        const layoutConfigValue = layoutConfig[layoutConfigKey] || {};
        const layoutConfigValueApp = layoutConfigValue.appKey;
        const layoutConfigValueLanguage = layoutConfigValue.appLanguage;
        // set current
        const appKey = query.appKey || layoutConfigValueApp || __getDefaultAppKeyFromConfig({ Vue }) || __appKeyDefault;
        const appLanguage = query.appLanguage || layoutConfigValueLanguage || Vue.prototype.$meta.util.getLocale();
        await this.setCurrent({ appKey, appLanguage });
        return this.current;
      },
      async getPresetConfigCurrent() {
        // force init current
        await this.getCurrent();
        // force appItem exists
        const appItem = await this.getAppItemCurrent();
        if (!appItem) {
          // fallback to appDefault
          await this.setCurrent({ appKey: __appKeyDefault });
          await this.getAppItemCurrent();
        }
        // current
        return this.presetConfigCurrent;
      },
      async getPresetConfigDefault() {
        return await this.getPresetConfig({ appKey: __appKeyDefault });
      },
      async getPresetConfig({ appKey }) {
        // force appItem exists
        const appItem = await this.getAppItem({ appKey });
        if (!appItem) return null; // maybe no access right
        return __getPresetConfig({ Vue, appItem, current: this.current });
      },
      async getAppItemCurrent() {
        return await this.getAppItem({ appKey: this.current.appKey });
      },
      async getAppItemDefault() {
        return await this.getAppItem({ appKey: __appKeyDefault });
      },
      async getAppItem({ appKey }) {
        let appItem = this.appItems[appKey];
        if (appItem) return appItem;
        appItem = await __fetchAppItem({ Vue, appKey });
        if (!appItem) return null; // maybe no access right
        appItem.content = appItem.content ? JSON.parse(appItem.content) : null;
        // get base app
        if (appKey !== __appKeyBase) {
          const appItemBase = await this.getAppItem({ appKey: __appKeyBase });
          appItem.content = Vue.prototype.$meta.util.extend({}, appItemBase.content, appItem.content);
          // special for appIsolate
          if (query.appIsolate === 'true') {
            appItem.appIsolate = true;
          }
        }
        this.setAppItem({ appKey, appItem });
        return appItem;
      },
      async getAppItemsAll() {
        if (this.appItemsAll) return this.appItemsAll;
        const res = await Vue.prototype.$meta.api.post('/a/base/resource/select', {
          atomClass: __atomClassApp,
          options: {
            where: {
              'f.appHidden': 0,
            },
            orders: [
              ['f.appSorting', 'asc'],
              ['f.createdAt', 'asc'],
            ],
          },
        });
        const appItems = res.list;
        this.setAppItemsAll({ appItems });
        return appItems;
      },
      async getAppMenuInfo({ appKey }) {
        const appItem = await this.getAppItem({ appKey });
        // configMenu
        const presetConfig = await this.getPresetConfig({ appKey });
        const configMenu = presetConfig.menu;
        // ok
        return {
          appKey,
          appItem,
          configMenu,
          appMenuLayout: configMenu.layout,
        };
      },
      async getAppHomeInfo({ appKey, force }) {
        let appItem = await this.getAppItem({ appKey });
        // configHome
        let configHome;
        const presetConfig = await this.getPresetConfig({ appKey });
        configHome = presetConfig.home;
        if (!configHome.mode && force) {
          appKey = __appKeyDefault;
          const presetConfigDefault = await this.getPresetConfigDefault();
          configHome = presetConfigDefault.home;
          appItem = await this.getAppItemDefault();
        }
        if (!configHome.mode) return null;
        // url
        let url;
        if (configHome.mode === 'dashboard') {
          url = `/a/dashboard/dashboard?key=${configHome.dashboard}`;
        } else {
          url = configHome.page;
        }
        // for unique
        const queries = { appKey };
        if (appItem.appLanguage) {
          queries.appLanguage = this.current.appLanguage;
        }
        url = Vue.prototype.$meta.util.combineQueries(url, queries);
        // ok
        return {
          appKey,
          appItem,
          configHome,
          url,
        };
      },
      async getAppMineInfo({ appKey, force }) {
        let appItem = await this.getAppItem({ appKey });
        // current
        let configMine;
        const presetConfig = await this.getPresetConfig({ appKey });
        configMine = presetConfig.mine;
        if (!configMine.layout && force) {
          appKey = __appKeyDefault;
          const presetConfigDefault = await this.getPresetConfigDefault();
          configMine = presetConfigDefault.mine;
          appItem = await this.getAppItemDefault();
        }
        if (!configMine.layout) return null;
        // ok
        return {
          appKey,
          appItem,
          configMine,
          appMineLayout: configMine.layout,
        };
      },
      preloadModules({ appKey }) {
        const parts = appKey.split(':');
        if (parts.length === 2) {
          Vue.prototype.$meta.util.preloadModules(parts[0]);
        }
        if (Vue.prototype.$meta.vueApp.layout === 'pc') {
          Vue.prototype.$meta.util.preloadModules('a-antdv');
        }
      },
      async __saveCurrent_inner({ current }) {
        // load appItem
        const appItem = await this.getAppItem({ appKey: current.appKey });
        if (!appItem) {
          // maybe no access right for anonymous
          return;
        }
        if (current.appKey !== __appKeyDefault && appItem.appIsolate) return;
        // layout config
        const layoutConfig = await this.getLayoutConfig();
        if (!layoutConfig) throw new Error('app current not inited');
        const layoutConfigKey = __getLayoutConfigKey({ Vue });
        const layoutConfigValue = layoutConfig[layoutConfigKey] || {};
        const layoutConfigValueApp = layoutConfigValue.appKey;
        const layoutConfigValueLanguage = layoutConfigValue.appLanguage;
        if (layoutConfigValueApp !== current.appKey || layoutConfigValueLanguage !== current.appLanguage) {
          const useStoreLayoutConfig = await this.$store.use('a/basestore/layoutConfig');
          await useStoreLayoutConfig.setLayoutConfigKey({
            module: 'a-basefront',
            key: layoutConfigKey,
            value: { appKey: current.appKey, appLanguage: current.appLanguage },
          });
        }
      },
    },
  };
}

function __getDefaultAppKeyFromConfig({ Vue }) {
  const configModule = Vue.prototype.$meta.config.modules['a-app'];
  let appKey = configModule.appInit[window.location.host];
  if (!appKey) {
    appKey = configModule.appInit.default;
  }
  return appKey;
}

function __getUserStatusAndLayout({ Vue }) {
  // userStatus
  const user = Vue.prototype.$meta.store.state.auth.user;
  const userOp = user && user.op;
  const userStatus = !userOp || userOp.anonymous ? 'anonymous' : 'authenticated';
  // layout
  const layout = Vue.prototype.$meta.vueApp.layout;
  // ok
  return { userStatus, layout };
}

function __getLayoutConfigKey({ Vue }) {
  const { userStatus, layout } = __getUserStatusAndLayout({ Vue });
  return `apps.current.${userStatus}.${layout}`;
}

function __getPresetConfig({ Vue, appItem, current }) {
  const { userStatus, layout } = __getUserStatusAndLayout({ Vue });
  const presetConfig = appItem.content.presets[userStatus][layout];
  return presetConfig[current.appLanguage] || presetConfig;
}

async function __fetchAppItem({ Vue, appKey }) {
  try {
    const appItem = await Vue.prototype.$meta.api.post('/a/app/resource/read', {
      atomStaticKey: appKey,
      options: {
        //  locale: false, // should return locale info
      },
    });
    return appItem;
  } catch (err) {
    if (err.code === 401 || err.code === 403) {
      return null;
    }
    throw err;
  }
}
