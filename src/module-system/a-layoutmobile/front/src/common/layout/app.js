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
      if (!appKey) return;
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
      const appKey = current.appKey;
      if (!appKey) return;
      // app home Info
      const appHomeInfo = await this.$store.dispatch('a/app/getAppHomeInfo', { appKey, force });
      if (!appHomeInfo) return;
      // navigate
      view.navigate(appHomeInfo.url, {
        target: '_self',
        reloadAll: true,
      });
    },
    app_isDefault(appKey) {
      return appKey === this.app.keyDefault;
    },
  },
};
