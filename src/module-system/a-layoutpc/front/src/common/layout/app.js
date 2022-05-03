export default {
  data() {
    return {
      appKeyDefault: 'a-app:appDefault',
    };
  },
  methods: {
    async app_openHome() {
      await this.app_openAppMenu();
      await this.app_openAppHome();
      // await this.app_openAppUser();
    },
    async app_openAppMenu() {
      // current
      const current = this.$store.getters['a/app/current'];
      const appItemCurrent = this.$store.getters['a/app/appItemCurrent'];
      // app default
      if (!this.app_isDefault(current.appKey) && !appItemCurrent.isolate) {
        const appItemDefault = await this.$store.dispatch('a/app/getAppItem', { appKey: this.appKeyDefault });
        this.navigate('/a/app/appMenu', {
          scene: 'sidebar',
          sceneOptions: {
            side: 'left',
            name: this.appKeyDefault,
            title: this.app_openAppMenu_panelTitle(this.appKeyDefault, appItemDefault),
          },
        });
      }
      // app current
      this.navigate('/a/app/appMenu?1', {
        scene: 'sidebar',
        sceneOptions: {
          side: 'left',
          name: current.appKey,
          title: this.app_openAppMenu_panelTitle(current.appKey, appItemCurrent),
        },
      });
    },
    app_isDefault(appKey) {
      return appKey === this.appKeyDefault;
    },
    app_openAppMenu_panelTitle(appKey, appItem) {
      if (this.app_isDefault(appKey)) return null; // this.$text('Apps');
      return appItem.atomNameLocale;
    },
    async app_openAppHome() {},
  },
};
