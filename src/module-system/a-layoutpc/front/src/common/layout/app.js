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
          sceneOptions: this.app_openAppMenu_panelSceneOptions(this.appKeyDefault, appItemDefault),
        });
      }
      // app current
      this.navigate('/a/app/appMenu?1', {
        scene: 'sidebar',
        sceneOptions: this.app_openAppMenu_panelSceneOptions(current.appKey, appItemCurrent),
      });
    },
    app_isDefault(appKey) {
      return appKey === this.appKeyDefault;
    },
    app_openAppMenu_panelSceneOptions(appKey, appItem) {
      let title;
      let showLabel;
      if (this.app_isDefault(appKey)) {
        title = this.$text('Apps');
        showLabel = false;
      } else {
        title = appItem.atomNameLocale;
        showLabel = true;
      }
      // ok
      return {
        side: 'left',
        name: appKey,
        title,
        showLabel,
        icon: { f7: appItem.appIcon },
      };
    },
    async app_openAppHome() {},
  },
};
