export default {
  data() {
    return {
      app: {
        keyDefault: 'a-app:appDefault',
      },
    };
  },
  methods: {
    async app_openHome({ view, appKey, appLanguage }) {
      // set current
      this.$meta.store.commit('a/app/setCurrent', { appKey, appLanguage });
      // get current
      const current = this.$store.getters['a/app/current'];
      // open menu
      await this.app_openAppMenu({ view, current });
    },
    async app_openAppMenu({ view, current }) {
      const appKey = current.appKey;
      // url
      const url = `/a/app/appMenu?appKey=${appKey}`;
      // navigate
      view.navigate(url, {
        target: '_self',
        reloadAll: true, // give a chance to select appDefault
        // reloadAll: this.app_isDefault(appKey),
      });
    },
    async app_openAppHome({ view, current, force = false }) {
      if (!current) current = this.$store.getters['a/app/current'];
      // configHome
      let configHome;
      let appKey = current.appKey;
      const presetConfigCurrent = await this.$store.dispatch('a/app/getPresetConfigCurrent');
      configHome = presetConfigCurrent.home;
      if (!configHome.mode && force) {
        appKey = this.app.keyDefault;
        const presetConfigDefault = await this.$store.dispatch('a/app/getPresetConfigDefault');
        configHome = presetConfigDefault.home;
      }
      if (!configHome.mode) return;
      // navigate
      let url;
      if (configHome.mode === 'dashboard') {
        url = `/a/dashboard/dashboard?key=${configHome.dashboard}`;
      } else {
        url = configHome.page;
      }
      // for unique
      url = this.$meta.util.combineQueries(url, {
        appKey,
        // appLanguage: current.appLanguage, // not set appLanguage
      });
      view.navigate(url, {
        target: '_self',
        reloadAll: true,
      });
    },
    app_isDefault(appKey) {
      return appKey === this.app.keyDefault;
    },
  },
};
