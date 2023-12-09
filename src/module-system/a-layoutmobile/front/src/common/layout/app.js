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
      const useStoreApp = await this.$store.use('a/app/app');
      // set current
      await useStoreApp.setCurrent({ appKey, appLanguage });
      // get current
      const current = useStoreApp.current;
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
      const useStoreApp = await this.$store.use('a/app/app');
      if (!current) {
        current = useStoreApp.current;
      }
      const appKey = current.appKey;
      if (!appKey) return;
      // app home Info
      const appHomeInfo = await useStoreApp.getAppHomeInfo({ appKey, force });
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
