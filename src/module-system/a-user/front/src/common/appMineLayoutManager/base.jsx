export default {
  data() {
    return {
      base: {
        configAppMineBase: null,
        configAppMine: null,
        //
        appCurrent: {},
        apps: [],
        appMineDefaultChecked: false,
        //
        appKeyDefault: 'a-app:appDefault',
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready;
    },
    base_userAgent() {
      return this.$store.state.auth.user.agent;
    },
    base_inAgent() {
      return this.base_user.id !== this.base_userAgent.id;
    },
    base_loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
  },
  methods: {
    async base_onInit() {
      await this.base_app_init({ force: true });
    },
    async base_app_init({ force }) {
      const current = this.$store.getters['a/app/current'];
      const appCurrent = await this.$store.dispatch('a/user/getAppInfo', { appKey: current.appKey, force });
      if (!appCurrent) return;
      if (this.base_app_isCurrentSame(this.base.appCurrent, appCurrent)) return;
      // current
      this.base.appCurrent = appCurrent;
      // configAppMine
      const layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
        layoutKey: appCurrent.appMineLayout,
      });
      this.base.configAppMine = layoutItem.content;
      // prepareConfigLayout when inited
      if (this.base.configAppMineBase) {
        await this.layout_prepareConfigLayout(this.layout.current);
      }
      // add
      await this.base_app_add(appCurrent);
    },
    async base_app_add(appCurrent) {
      // app default
      await this.base_checkAppMineDefault({ appCurrent });
      // exists
      const index = this.base.apps.findIndex(item => {
        return this.base_app_isCurrentSame(item, appCurrent);
      });
      if (index > -1) return;
      this.base.apps.push(appCurrent);
    },
    async base_checkAppMineDefault({ appCurrent }) {
      if (this.base.appMineDefaultChecked) return;
      // app default
      if (!this.base_isAppDefault(appCurrent.appKey) && !appCurrent.appItem.isolate) {
        const appDefault = await this.$store.dispatch('a/user/getAppInfo', {
          appKey: this.base.appKeyDefault,
          force: false,
        });
        this.base.apps.push(appDefault);
      }
      // checked
      this.base.appMineDefaultChecked = true;
    },
    base_isAppDefault(appKey) {
      return appKey === this.base.appKeyDefault;
    },
    base_app_isCurrentSame(a, b) {
      // not check appLanguage
      return a.appKey === b.appKey && a.appMineLayout === b.appMineLayout;
    },
  },
};
