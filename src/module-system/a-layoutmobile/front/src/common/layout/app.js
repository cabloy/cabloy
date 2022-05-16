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
        reloadAll: this.app_isDefault(appKey),
      });
    },
    app_isDefault(appKey) {
      return appKey === this.app.keyDefault;
    },
  },
};
