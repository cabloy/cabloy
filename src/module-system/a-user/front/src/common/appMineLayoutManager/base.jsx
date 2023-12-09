export default {
  data() {
    return {
      base: {
        configAppMineBase: null,
        configAppMine: null,
        //
        appInfoCurrent: {},
        appInfos: [],
        appMineDefaultChecked: false,
        appMineInited: false,
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
    base_appCurrent() {
      const useStoreApp = this.$store.useSync('a/app/app');
      return useStoreApp.current;
    },
  },
  watch: {
    base_appCurrent(current) {
      if (!this.base.appMineInited) return;
      if (!current.appKey) return;
      if (!this.$meta.vueLayout.started) return;
      this.base_app_switch({ appKey: current.appKey });
    },
  },
  beforeDestroy() {
    this.base.appMineInited = false;
  },
  methods: {
    async base_onInit() {
      const current = this.base_appCurrent;
      await this.base_app_prepareAppCurrent({ appKey: current.appKey, force: true });
      this.base.appMineInited = true;
    },
    async base_app_switch({ appKey }) {
      if (!appKey) return;
      // prepareAppCurrent
      const res = await this.base_app_prepareAppCurrent({ appKey, force: false });
      if (!res) return;
      // prepareConfigLayout
      this.layout.configFull = null;
      await this.layout_prepareConfigLayout(this.layout.current);
    },
    async base_app_prepareAppCurrent({ appKey, force }) {
      const useStoreApp = await this.$store.use('a/app/app');
      const appInfo = await useStoreApp.getAppMineInfo({ appKey, force });
      if (!appInfo) return false;
      if (this.base_app_isCurrentSameFull(this.base.appInfoCurrent, appInfo)) return false;
      // current
      this.base.appInfoCurrent = appInfo;
      // configAppMine
      if (typeof appInfo.appMineLayout === 'string') {
        // mine.layout=layoutKey
        const useStoreLayout = await this.$store.use('a/baselayout/layout');
        const layoutItem = await useStoreLayout.getLayoutItem({ layoutKey: appInfo.appMineLayout });
        this.base.configAppMine = layoutItem.content;
      } else {
        // mine.layout=true
        this.base.configAppMine = null;
      }
      // add
      await this.base_app_add(appInfo);
      // ok
      return true;
    },
    async base_app_add(appInfo) {
      // app default
      await this.base_checkAppMineDefault({ appInfo });
      // exists
      const index = this.base.appInfos.findIndex(item => {
        return this.base_app_isCurrentSame(item, appInfo);
      });
      if (index > -1) {
        // replace
        this.base.appInfos.splice(index, 1, appInfo);
      } else {
        // append
        this.base.appInfos.push(appInfo);
      }
    },
    async base_checkAppMineDefault({ appInfo }) {
      if (this.base.appMineDefaultChecked) return;
      // app default
      const useStoreApp = await this.$store.use('a/app/app');
      if (!this.base_isAppDefault(appInfo.appKey) && !appInfo.appItem.appIsolate) {
        const appDefault = await useStoreApp.getAppMineInfo({
          appKey: this.base.appKeyDefault,
          force: false,
        });
        this.base.appInfos.push(appDefault);
      }
      // checked
      this.base.appMineDefaultChecked = true;
    },
    base_isAppDefault(appKey) {
      return appKey === this.base.appKeyDefault;
    },
    base_app_isCurrentSame(a, b) {
      // only check appKey
      return a.appKey === b.appKey;
    },
    base_app_isCurrentSameFull(a, b) {
      // not check appLanguage
      return a.appKey === b.appKey && a.appMineLayout === b.appMineLayout;
    },
    async base_onPerformResource(event, resource) {
      const navigateOptions = { target: '_self' };
      if (resource.resourceConfig) {
        const resourceConfig = JSON.parse(resource.resourceConfig);
        this.$meta.util.extend(navigateOptions, resourceConfig.navigateOptions);
      }
      const options = { navigateOptions };
      return await this.base_performActionResource(event, resource, options);
    },
  },
};
