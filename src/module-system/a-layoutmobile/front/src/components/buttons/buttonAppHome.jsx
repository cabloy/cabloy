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
        appHomeInited: false,
      };
    },
    computed: {
      base_appCurrent() {
        return this.$store.getters['a/app/current'];
      },
    },
    watch: {
      base_appCurrent(current) {
        if (!this.appHomeInited) return;
        if (!current.appKey) return;
        if (!this.$meta.vueLayout.started) return;
        this.openAppHome();
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
      onAppHomeOpen() {
        this.onPerformClick();
      },
      async openAppHome() {
        const view = this.getView();
        await this.$meta.vueLayout.app_openAppHome({ view, force: true });
        this.appHomeInited = true;
      },
      onViewInit() {
        this.openAppHome();
      },
    },
  };
}
