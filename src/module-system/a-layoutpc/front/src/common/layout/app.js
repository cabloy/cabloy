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
    async app_openHome_bySlogon() {
      // current
      const current = this.$store.getters['a/app/current'];
      const appItemCurrent = await this.$store.dispatch('a/app/getAppItem', { appKey: current.appKey });
      if (!this.app_isDefault(current.appKey) && !appItemCurrent.appIsolate) {
        this.$meta.store.commit('a/app/setCurrent', { appKey: this.app.keyDefault });
      }
      // open
      await this.app_openHome({ force: true });
    },
    async app_openHome({ appKey, appLanguage, force = false }) {
      // set current
      this.$meta.store.commit('a/app/setCurrent', { appKey, appLanguage });
      // get current
      const current = this.$store.getters['a/app/current'];
      // current
      const appItemCurrent = await this.$store.dispatch('a/app/getAppItem', { appKey: current.appKey });
      // open menu
      await this.app_openAppMenu({ current, appItemCurrent });
      // open home
      await this.app_openAppHome({ current, force });
      // open mine
      await this.app_openAppMine({ current, force });
    },
    async app_openAppMenu({ current, appItemCurrent }) {
      const appKey = current.appKey;
      // app default
      await this.app_checkAppMenuDefault({ current, appItemCurrent });
      // app current
      this.navigate(`/a/app/appMenu?appKey=${appKey}`, {
        scene: 'sidebar',
        sceneOptions: this.app_openAppMenu_panelSceneOptions(appKey, appItemCurrent),
        imActive: false,
        panelIndex: this.app_isDefault(appKey) ? 0 : undefined,
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
        name: `appMenu_${appKey}`,
        title,
        titleLocale,
        resourceConfig: {
          showLabel,
          icon: { f7: appItem.appIcon },
        },
        appHome: true,
        appKey,
      };
    },
    async app_checkAppMenuDefault({ current, appItemCurrent }) {
      if (this.app.appMenuDefaultChecked) return;
      // app default
      if (!this.app_isDefault(current.appKey) && !appItemCurrent.appIsolate) {
        const appItemDefault = await this.$store.dispatch('a/app/getAppItemDefault');
        this.navigate(`/a/app/appMenu?appKey=${this.app.keyDefault}`, {
          scene: 'sidebar',
          sceneOptions: this.app_openAppMenu_panelSceneOptions(this.app.keyDefault, appItemDefault),
          imActive: true,
          panelIndex: 0,
        });
      }
      // checked
      this.app.appMenuDefaultChecked = true;
    },
    async app_openAppHome({ current, force }) {
      if (!current) current = this.$store.getters['a/app/current'];
      const appKey = current.appKey;
      // app home Info
      const appHomeInfo = await this.$store.dispatch('a/app/getAppHomeInfo', { appKey, force });
      if (!appHomeInfo) return;
      // icon
      const icon = { f7: appHomeInfo.appItem.appIcon };
      // badge
      let badge;
      if (appHomeInfo.appItem.appLanguage) {
        const lang = current.appLanguage.split('-')[0];
        badge = { text: lang };
      }
      // navigate
      const navigateOptions = {
        sceneOptions: {
          appHome: true,
          appKey,
          resourceConfig: {
            icon,
            badge,
          },
        },
      };
      this.navigate(appHomeInfo.url, navigateOptions);
    },
    async app_openAppMine({ current, force }) {
      if (!current) current = this.$store.getters['a/app/current'];
      // appInfo
      const appKey = current.appKey;
      const appInfo = await this.$store.dispatch('a/app/getAppMineInfo', { appKey, force });
      if (!appInfo) return;
      // open
      this.navigate('/a/user/user/mine', {
        scene: 'sidebar',
        sceneOptions: this.app_openAppMine_panelSceneOptions(),
        panelIndex: 0,
      });
    },
    app_openAppMine_panelSceneOptions() {
      const title = 'Mine';
      const titleLocale = this.$text('Mine');
      const showLabel = true;
      // ok
      return {
        side: 'right',
        name: 'appMine',
        title,
        titleLocale,
        resourceConfig: {
          showLabel,
        },
        appMine: true,
      };
    },
  },
};
