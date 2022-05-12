export default {
  data() {
    return {
      app: {
        keyDefault: 'a-app:appDefault',
        appMenuDefaultChecked: false, // only once
      },
    };
  },
  methods: {
    async app_openHome({ appKey, appLanguage, force = false }) {
      // set current
      this.$meta.store.commit('a/app/setCurrent', { appKey, appLanguage });
      // get current
      const current = this.$store.getters['a/app/current'];
      await this.app_openAppMenu({ current });
      await this.app_openAppHome();
      // await this.app_openAppUser();
    },
    async app_openAppMenu({ current }) {
      // current
      const appItemCurrent = await this.$store.dispatch('a/app/getAppItem', { appKey: current.appKey });
      // app default
      await this.app_checkAppMenuDefault({ current, appItemCurrent });
      // app current
      this.navigate(`/a/app/appMenu?appKey=${current.appKey}`, {
        scene: 'sidebar',
        sceneOptions: this.app_openAppMenu_panelSceneOptions(current.appKey, appItemCurrent),
        imActive: false,
      });
    },
    app_isDefault(appKey) {
      return appKey === this.app.keyDefault;
    },
    app_openAppMenu_panelSceneOptions(appKey, appItem) {
      let title;
      let titleLocale;
      let showLabel;
      if (this.app_isDefault(appKey)) {
        title = 'Apps';
        titleLocale = this.$text('Apps');
        showLabel = false;
      } else {
        title = appItem.atomName;
        titleLocale = appItem.atomNameLocale;
        showLabel = true;
      }
      // ok
      return {
        side: 'left',
        name: appKey,
        title,
        titleLocale,
        resourceConfig: {
          showLabel,
          icon: { f7: appItem.appIcon },
        },
      };
    },
    async app_checkAppMenuDefault({ current, appItemCurrent }) {
      if (this.app.appMenuDefaultChecked) return;
      // app default
      if (!this.app_isDefault(current.appKey) && !appItemCurrent.isolate) {
        const appItemDefault = await this.$store.dispatch('a/app/getAppItem', { appKey: this.app.keyDefault });
        this.navigate(`/a/app/appMenu?appKey=${this.app.keyDefault}`, {
          scene: 'sidebar',
          sceneOptions: this.app_openAppMenu_panelSceneOptions(this.app.keyDefault, appItemDefault),
          imActive: true,
        });
      }
      // checked
      this.app.appMenuDefaultChecked = true;
    },
    async app_openAppHome() {},
  },
};
