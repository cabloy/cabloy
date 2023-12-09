export default {
  data() {
    return {
      base: {
        configAppMenuBase: null,
        configAppMenuCmsBase: null,
        configAppMenu: null,
        //
        appInfoCurrent: {},
        appMenuInited: false,
      },
    };
  },
  computed: {
    base_atomClassApp() {
      return {
        module: 'a-app',
        atomClassName: 'app',
      };
    },
    base_appCurrent() {
      const useStoreApp = this.$store.useSync('a/app/app');
      return useStoreApp.current;
    },
    base_appLanguageCurrent() {
      return this.base_appCurrent.appLanguage;
    },
  },
  watch: {
    base_appLanguageCurrent() {
      if (!this.base.appMenuInited) return;
      if (!this.$meta.vueLayout.started) return;
      this.base_app_switch();
    },
  },
  beforeDestroy() {
    this.base.appMenuInited = false;
  },
  methods: {
    async base_onInit() {
      await this.base_app_prepareAppCurrent();
      this.base.appMenuInited = true;
    },
    async base_app_switch() {
      // prepareAppCurrent
      const res = await this.base_app_prepareAppCurrent();
      if (!res) return;
      // prepareConfigLayout
      this.layout.configFull = null;
      await this.layout_prepareConfigLayout(this.layout.current);
    },
    async base_app_prepareAppCurrent() {
      const useStoreApp = await this.$store.use('a/app/app');
      const appKey = this.container.appKey;
      const appInfo = await useStoreApp.getAppMenuInfo({ appKey });
      if (!appInfo) return false;
      if (this.base_app_isCurrentSameFull(this.base.appInfoCurrent, appInfo)) return false;
      // current
      this.base.appInfoCurrent = appInfo;
      // configAppMenu
      if (appInfo.appMenuLayout) {
        const useStoreLayout = await this.$store.use('a/baselayout/layout');
        const layoutItem = await useStoreLayout.getLayoutItem({ layoutKey: appInfo.appMenuLayout });
        this.base.configAppMenu = layoutItem.content;
      } else {
        this.base.configAppMenu = null;
      }
      // ok
      return true;
    },
    base_app_isCurrentSame(a, b) {
      // only check appKey
      return a.appKey === b.appKey;
    },
    base_app_isCurrentSameFull(a, b) {
      // not check appLanguage
      return a.appKey === b.appKey && a.appMenuLayout === b.appMenuLayout;
    },
    async base_onPerformResource(event, resource) {
      return await this.base_performActionResource(event, resource);
    },
    base_isChildMode() {
      const __appKeyDefault = this.$config.appKey.default;
      if (this.container.appKey === __appKeyDefault) return false;
      if (!this.base.appInfoCurrent.appItem) return false;
      if (this.base.appInfoCurrent.appItem.appIsolate) return false;
      return true;
    },
  },
};
