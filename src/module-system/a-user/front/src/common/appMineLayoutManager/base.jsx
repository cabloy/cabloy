export default {
  data() {
    return {
      base: {
        configAppMineBase: null,
        configAppMine: null,
        //
        appCurrent: {
          appKey: null,
          appLanguage: null,
          appMineLayout: null,
          appItem: null,
        },
        apps: [],
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
      const current = await this.base_app_calcCurrent({ force });
      if (!current) return;
      if (this.base_app_isCurrentSame(this.base.appCurrent, current)) return;
      // current
      this.base.appCurrent = current;
      // configAppMine
      const layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
        layoutKey: current.appMineLayout,
      });
      this.base.configAppMine = layoutItem.content;
      // add
      this.base_app_add(current);
    },
    base_app_add(appCurrent) {
      const index = this.base.apps.findIndex(item => {
        return this.base_app_isCurrentSame(item, appCurrent);
      });
      if (index > -1) return;
      if (appCurrent.appKey === this.base.appKeyDefault) {
        this.base.apps.unshift(appCurrent);
      } else {
        this.base.apps.push(appCurrent);
      }
    },
    base_app_isCurrentSame(a, b) {
      // not check appLanguage
      return a.appKey === b.appKey && a.appMineLayout === b.appMineLayout;
    },
    async base_app_calcCurrent({ force }) {
      let configMine;
      // get current
      const current = this.$store.getters['a/app/current'];
      let appItem = await this.$store.dispatch('a/app/getAppItemCurrent');
      let appKey = current.appKey;
      const appLanguage = current.appLanguage;
      // current
      const presetConfigCurrent = await this.$store.dispatch('a/app/getPresetConfigCurrent');
      configMine = presetConfigCurrent.mine;
      if (!configMine.layout && force) {
        appKey = this.appKeyDefault;
        const presetConfigDefault = await this.$store.dispatch('a/app/getPresetConfigDefault');
        configMine = presetConfigDefault.mine;
        appItem = await this.$store.dispatch('a/app/getAppItemDefault');
      }
      if (!configMine.layout) return null;
      // ok
      return {
        appKey,
        appLanguage,
        appMineLayout: configMine.layout,
        appItem,
      };
    },
  },
};
