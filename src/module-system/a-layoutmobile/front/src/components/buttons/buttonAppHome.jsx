// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutmobile').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ebLayoutButtonBase],
    data() {
      return {
        appInfoCurrent: {},
        appHomeInited: false,
      };
    },
    computed: {
      base_appCurrent() {
        const useStoreApp = this.$store.useSync('a/app/app');
        return useStoreApp.current;
      },
    },
    watch: {
      base_appCurrent(current) {
        if (!this.appHomeInited) return;
        if (!current.appKey) return;
        if (!this.$meta.vueLayout.started) return;
        this.app_switch({ current, force: false });
      },
    },
    created() {
      this.$meta.eventHub.$on('appHome:open', this.onAppHomeOpen);
    },
    beforeDestroy() {
      this.appHomeInited = false;
      this.$meta.eventHub.$off('appHome:open', this.onAppHomeOpen);
    },
    methods: {
      // eventHub
      onAppHomeOpen() {
        this.onPerformClick();
      },
      // viewInit
      async onViewInit() {
        await this.app_switch({ force: true });
        this.appHomeInited = true;
      },
      // app_switch
      async app_switch({ current, force }) {
        if (!current) current = this.base_appCurrent;
        const appKey = current.appKey;
        if (!appKey) return;
        // app home Info
        const useStoreApp = await this.$store.use('a/app/app');
        const appInfo = await useStoreApp.getAppHomeInfo({ appKey, force });
        if (!appInfo) return false;
        if (this.app_isCurrentSameFull(this.appInfoCurrent, appInfo)) return false;
        // current
        this.appInfoCurrent = appInfo;
        // open appHome
        const view = this.getViewInstance();
        await this.$meta.vueLayout.app_openAppHome({ view, current, force });
        // ok
        return true;
      },
      app_isCurrentSameFull(a, b) {
        // not check appLanguage
        return a.appKey === b.appKey && a.url === b.url;
      },
    },
  };
}
